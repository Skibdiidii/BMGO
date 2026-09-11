#!/usr/bin/env bash
set -e

sudo mdutil -i off -a || true

cat << 'EOF' > /tmp/bmgo_daemon.py
from http.server import HTTPServer, BaseHTTPRequestHandler
import json, os, subprocess, time, platform

PORT = 8088

class BMGORequestHandler(BaseHTTPRequestHandler):
    def _send_cors(self, status=200, data=None):
        self.send_response(status)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        if data is not None:
            self.wfile.write(json.dumps(data).encode("utf-8"))

    def do_OPTIONS(self):
        self._send_cors(200, {"status": "ok"})

    def do_GET(self):
        if self.path in ["/api/status", "/", "/ping"]:
            self._send_cors(200, {
                "status": "online",
                "os": f"macOS {platform.mac_ver()[0]} ({platform.machine()})",
                "cpu": "Apple/Intel 3-Core Runner",
                "ram": "14GB Unified",
                "uptime": "Active",
                "tunnel": "bore",
                "daemon": True,
                "adb": True,
                "vnc": True,
                "tmate": True,
                "targetPackage": "com.sandboxol.blockymods"
            })
        else:
            self._send_cors(404, {"error": "Not Found"})

    def do_POST(self):
        content_len = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_len).decode("utf-8")
        payload = json.loads(body) if body else {}

        if self.path == "/api/execute":
            code = payload.get("code", "")
            file_name = payload.get("fileName", "GMHelper.lua")
            tmp_path = f"/tmp/{file_name}"
            with open(tmp_path, "w") as f:
                f.write(code)

            try:
                proc = subprocess.run(["lua", tmp_path], capture_output=True, text=True, timeout=5)
                out = (proc.stdout or "") + (proc.stderr or "")
                self._send_cors(200, {"success": proc.returncode == 0, "output": out or "Script parsed OK"})
            except Exception as e:
                self._send_cors(200, {"success": False, "output": str(e)})

        elif self.path == "/api/bash":
            cmd = payload.get("command", "uname -a")
            try:
                proc = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=10)
                out = (proc.stdout or "") + (proc.stderr or "")
                self._send_cors(200, {"success": proc.returncode == 0, "output": out})
            except Exception as e:
                self._send_cors(500, {"success": False, "output": str(e)})
        else:
            self._send_cors(404, {"error": "Endpoint not found"})

httpd = HTTPServer(("0.0.0.0", PORT), BMGORequestHandler)
httpd.serve_forever()
EOF

python3 /tmp/bmgo_daemon.py &
sleep 2

TUNNEL_MODE="${TUNNEL_TYPE:-bore}"

if [ "$TUNNEL_MODE" = "bore" ] || [ -z "$NGROK_AUTH_TOKEN" ]; then
  if ! command -v bore &> /dev/null; then
    ARCH=$(uname -m)
    if [ "$ARCH" = "arm64" ]; then
      BORE_BIN="bore-v0.5.2-aarch64-apple-darwin"
    else
      BORE_BIN="bore-v0.5.2-x86_64-apple-darwin"
    fi
    curl -sL "https://github.com/ekzhang/bore/releases/download/v0.5.2/${BORE_BIN}.tar.gz" -o /tmp/bore.tar.gz && tar -xzf /tmp/bore.tar.gz -C /tmp/ || brew install bore-cli || true
    if [ -f /tmp/bore ]; then
      sudo cp /tmp/bore /usr/local/bin/bore || cp /tmp/bore /usr/bin/bore || export PATH="/tmp:$PATH"
    fi
  fi

  bore local 8088 --to bore.pub > /tmp/bore.log 2>&1 &
  sleep 4
  cat /tmp/bore.log

  BORE_PORT=$(grep -oE 'remote_port=[0-9]+' /tmp/bore.log | head -n 1 | cut -d'=' -f2 || grep -oE 'bore.pub:[0-9]+' /tmp/bore.log | head -n 1 | cut -d':' -f2 || true)
  if [ -n "$BORE_PORT" ]; then
    echo "=========================================================="
    echo "⚡ BORE ZERO-CONFIG TUNNEL IS READY!"
    echo "PUBLIC DAEMON URL: http://bore.pub:${BORE_PORT}"
    echo "ENTER THIS IN BMGO CLIENT: http://bore.pub:${BORE_PORT}"
    echo "=========================================================="
  else
    echo "Waiting for bore connection..."
    sleep 3
    cat /tmp/bore.log
  fi
elif [ "$TUNNEL_MODE" = "ngrok" ] && [ -n "$NGROK_AUTH_TOKEN" ]; then
  brew install --cask ngrok || true
  ngrok authtoken "$NGROK_AUTH_TOKEN"
  ngrok http 8088 --log=stdout &
  sleep 3
  curl -s http://127.0.0.1:4040/api/tunnels | jq -r '.tunnels[0].public_url' || true
else
  brew install tmate || true
  tmate -S /tmp/tmate.sock new-session -d
  tmate -S /tmp/tmate.sock wait tmate-ready
  tmate -S /tmp/tmate.sock display -p '#{tmate_web}' || true
fi

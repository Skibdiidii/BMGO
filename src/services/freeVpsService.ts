import { LuaBridge } from './luaBridge';
import { ANDROID_PACKAGE } from './runtimePaths';

export interface VpsStatus {
  connected: boolean;
  endpointUrl: string;
  latencyMs: number;
  osName: string;
  runnerInfo?: {
    cpu: string;
    ram: string;
    os: string;
    uptime: string;
  };
  services: {
    daemon: boolean;
    vnc: boolean;
    adb: boolean;
    tmate: boolean;
  };
  lastSeen?: string;
  error?: string;
}

const STORAGE_KEY_VPS_ENDPOINT = 'bmgo_vps_endpoint';

export class FreeVpsService {
  private static vpsEndpoint: string = localStorage.getItem(STORAGE_KEY_VPS_ENDPOINT) || 'http://bore.pub:8088';
  private static cachedStatus: VpsStatus = {
    connected: false,
    endpointUrl: FreeVpsService.vpsEndpoint,
    latencyMs: 0,
    osName: 'macOS Sonoma (GitHub Actions Runner)',
    services: {
      daemon: false,
      vnc: false,
      adb: false,
      tmate: false
    }
  };

  public static normalizeEndpoint(urlOrPort: string): string {
    const raw = urlOrPort.trim();
    if (!raw) return '';
    if (/^\d{3,5}$/.test(raw)) {
      return `http://bore.pub:${raw}`;
    }
    if (raw.startsWith('bore.pub:')) {
      return `http://${raw}`;
    }
    if (!/^https?:\/\//i.test(raw)) {
      return `http://${raw}`;
    }
    return raw.replace(/\/+$/, '');
  }

  public static getEndpoint(): string {
    return this.vpsEndpoint;
  }

  public static setEndpoint(url: string): void {
    const normalized = this.normalizeEndpoint(url);
    this.vpsEndpoint = normalized;
    localStorage.setItem(STORAGE_KEY_VPS_ENDPOINT, this.vpsEndpoint);
  }

  public static async pingVps(customUrl?: string): Promise<VpsStatus> {
    const target = this.normalizeEndpoint(customUrl || this.vpsEndpoint);
    const startTime = performance.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${target}/api/status`, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      }).catch(() => null);

      clearTimeout(timeoutId);

      const latencyMs = Math.round(performance.now() - startTime);

      if (res && res.ok) {
        const data = await res.json().catch(() => ({}));
        this.cachedStatus = {
          connected: true,
          endpointUrl: target,
          latencyMs,
          osName: data.os || 'macOS Runner (FreeVPS)',
          runnerInfo: {
            cpu: data.cpu || '3-Core Apple / Intel x86_64',
            ram: data.ram || '14 GB Unified RAM',
            os: data.os_version || 'macOS 14 Sonoma',
            uptime: data.uptime || 'Active'
          },
          services: {
            daemon: true,
            vnc: !!data.vnc,
            adb: !!data.adb,
            tmate: !!data.tmate
          },
          lastSeen: new Date().toLocaleTimeString()
        };
        this.setEndpoint(target);
        return this.cachedStatus;
      }

      this.cachedStatus = {
        connected: false,
        endpointUrl: target,
        latencyMs: 0,
        osName: 'macOS Runner (FreeVPS)',
        services: {
          daemon: false,
          vnc: false,
          adb: false,
          tmate: false
        },
        error: 'Cannot reach remote macOS endpoint. Make sure Bore tunnel is active.'
      };
      return this.cachedStatus;
    } catch {
      this.cachedStatus = {
        connected: false,
        endpointUrl: target,
        latencyMs: 0,
        osName: 'macOS Runner (FreeVPS)',
        services: {
          daemon: false,
          vnc: false,
          adb: false,
          tmate: false
        },
        error: 'Network timeout or unreachable host'
      };
      return this.cachedStatus;
    }
  }

  public static async executeRemoteLua(code: string, fileName = 'GMHelper.lua'): Promise<{ success: boolean; output: string }> {
    if (!this.cachedStatus.connected) {
      const localRun = await LuaBridge.executeScript(code);
      return {
        success: localRun.success,
        output: localRun.toast || localRun.error || (localRun.result ? JSON.stringify(localRun.result) : '[Client Simulation Mode: Executed successfully]')
      };
    }

    try {
      const res = await fetch(`${this.vpsEndpoint}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          fileName,
          targetPackage: ANDROID_PACKAGE
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      return {
        success: data.success ?? true,
        output: data.output || data.logs || 'Executed successfully on macOS VPS runner via Bore tunnel.'
      };
    } catch (err: any) {
      return {
        success: false,
        output: `Remote Execution Failed: ${err.message || String(err)}`
      };
    }
  }

  public static async executeRemoteBash(command: string): Promise<{ success: boolean; output: string }> {
    if (!this.cachedStatus.connected) {
      return {
        success: false,
        output: 'Cannot execute bash: Remote macOS VPS is not connected. Connect your FreeVPS Bore tunnel first.'
      };
    }

    try {
      const res = await fetch(`${this.vpsEndpoint}/api/bash`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      });

      const data = await res.json();
      return {
        success: res.ok && data.success !== false,
        output: data.output || data.stdout || data.stderr || 'Command sent.'
      };
    } catch (err: any) {
      return {
        success: false,
        output: `Error executing command: ${err.message || String(err)}`
      };
    }
  }

  public static getWorkflowYaml(): string {
    return `name: FreeVPS macOS BMGO Daemon & Cloud Runner
on:
  workflow_dispatch:
    inputs:
      tunnel_type:
        description: 'Tunnel Protocol (bore / ngrok / tmate / cloudflared)'
        required: true
        default: 'bore'
        type: choice
        options:
          - bore
          - ngrok
          - tmate
          - cloudflared

defaults:
  run:
    shell: bash

jobs:
  macos_vps:
    name: macOS Cloud Runner (BMGO Daemon)
    runs-on: macos-latest
    timeout-minutes: 360

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Install System Utilities & Lua Runtime
        run: |
          echo "=== Setting up macOS Runner Environment ==="
          brew install lua luajit jq python3 android-platform-tools
          pip3 install flask flask-cors requests

      - name: Configure and Launch BMGO Daemon Service
        env:
          NGROK_AUTH_TOKEN: \${{ secrets.NGROK_AUTH_TOKEN }}
          MAC_USER_PASSWORD: \${{ secrets.MAC_USER_PASSWORD }}
          VNC_PASSWORD: \${{ secrets.VNC_PASSWORD }}
          TUNNEL_TYPE: \${{ github.event.inputs.tunnel_type }}
        run: |
          chmod +x ./macos-bmgo-daemon.sh
          ./macos-bmgo-daemon.sh

      - name: Keep Runner Alive (6 Hours)
        run: |
          echo "=== FreeVPS macOS Runner is Active and Serving BMGO Daemon ==="
          sleep 21600
`;
  }

  public static getDaemonBootstrapScript(): string {
    return `#!/usr/bin/env bash
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

TUNNEL_MODE="\${TUNNEL_TYPE:-bore}"

if [ "$TUNNEL_MODE" = "bore" ] || [ -z "$NGROK_AUTH_TOKEN" ]; then
  if ! command -v bore &> /dev/null; then
    ARCH=\$(uname -m)
    if [ "$ARCH" = "arm64" ]; then
      BORE_BIN="bore-v0.5.2-aarch64-apple-darwin"
    else
      BORE_BIN="bore-v0.5.2-x86_64-apple-darwin"
    fi
    curl -sL "https://github.com/ekzhang/bore/releases/download/v0.5.2/\${BORE_BIN}.tar.gz" -o /tmp/bore.tar.gz && tar -xzf /tmp/bore.tar.gz -C /tmp/ || brew install bore-cli || true
    if [ -f /tmp/bore ]; then
      sudo cp /tmp/bore /usr/local/bin/bore || cp /tmp/bore /usr/bin/bore || export PATH="/tmp:$PATH"
    fi
  fi

  bore local 8088 --to bore.pub > /tmp/bore.log 2>&1 &
  sleep 4
  cat /tmp/bore.log

  BORE_PORT=\$(grep -oE 'remote_port=[0-9]+' /tmp/bore.log | head -n 1 | cut -d'=' -f2 || grep -oE 'bore.pub:[0-9]+' /tmp/bore.log | head -n 1 | cut -d':' -f2 || true)
  if [ -n "$BORE_PORT" ]; then
    echo "=========================================================="
    echo "⚡ BORE ZERO-CONFIG TUNNEL IS READY!"
    echo "PUBLIC DAEMON URL: http://bore.pub:\${BORE_PORT}"
    echo "ENTER THIS IN BMGO CLIENT: http://bore.pub:\${BORE_PORT}"
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
`;
  }
}

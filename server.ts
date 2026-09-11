import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn, ChildProcess } from 'child_process';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let boreProcess: ChildProcess | null = null;
let boreInfo = {
  status: 'initializing',
  endpoint: '',
  port: 0,
  startedAt: Date.now(),
  lastLog: ''
};

function startBoreTunnel() {
  const binaryPath = 'bore';

  try {
    boreProcess = spawn(binaryPath, ['local', '3000', '--to', 'bore.pub']);

    boreProcess.stdout?.on('data', (data: Buffer) => {
      const text = data.toString();
      boreInfo.lastLog = text.trim();
      const match = text.match(/bore\.pub:(\d+)/) || text.match(/remote_port\s*=\s*(\d+)/);
      if (match) {
        const port = parseInt(match[1], 10);
        boreInfo.status = 'active';
        boreInfo.port = port;
        boreInfo.endpoint = `bore.pub:${port}`;
        console.log(`[Bore Tunnel Active] Public Address -> bore.pub:${port}`);
      }
    });

    boreProcess.stderr?.on('data', (data: Buffer) => {
      const text = data.toString();
      boreInfo.lastLog = text.trim();
      const match = text.match(/bore\.pub:(\d+)/) || text.match(/remote_port\s*=\s*(\d+)/);
      if (match) {
        const port = parseInt(match[1], 10);
        boreInfo.status = 'active';
        boreInfo.port = port;
        boreInfo.endpoint = `bore.pub:${port}`;
        console.log(`[Bore Tunnel Active] Public Address -> bore.pub:${port}`);
      }
    });

    boreProcess.on('error', (err) => {
      boreInfo.status = 'error';
      boreInfo.lastLog = err.message;
      setTimeout(startBoreTunnel, 3000);
    });

    boreProcess.on('close', (code) => {
      boreInfo.status = 'closed';
      setTimeout(startBoreTunnel, 3000);
    });
  } catch (err: any) {
    boreInfo.status = 'error';
    boreInfo.lastLog = err.message;
    setTimeout(startBoreTunnel, 3000);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: Date.now(),
      engine: 'BMGO Client Runtime'
    });
  });

  app.get('/api/tunnel/status', (_req, res) => {
    res.json({
      tunnel: 'bore',
      ...boreInfo,
      uptimeSeconds: Math.floor((Date.now() - boreInfo.startedAt) / 1000)
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BMGO Server running on http://0.0.0.0:${PORT}`);
    startBoreTunnel();
  });

  process.on('SIGTERM', () => {
    if (boreProcess) {
      boreProcess.kill();
    }
  });

  process.on('SIGINT', () => {
    if (boreProcess) {
      boreProcess.kill();
    }
  });
}

startServer();

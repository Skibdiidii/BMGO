import React, { useState, useEffect } from 'react';
import {
  Server,
  Terminal,
  Activity,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Play,
  RefreshCw,
  Cpu,
  Globe,
  Zap,
  Layers,
  Sparkles,
  ShieldCheck,
  Send,
  Radio
} from 'lucide-react';
import { FreeVpsService, VpsStatus } from '../services/freeVpsService';
import { LuaBridge } from '../services/luaBridge';

interface DashboardFreeVPSProps {
  onLoadScriptToOverlay: (code: string) => void;
  onOpenOverlay: () => void;
}

export const DashboardFreeVPS: React.FC<DashboardFreeVPSProps> = ({
  onLoadScriptToOverlay,
  onOpenOverlay
}) => {
  const [activeTab, setActiveTab] = useState<'manager' | 'workflow' | 'terminal' | 'docs'>('manager');
  const [endpointInput, setEndpointInput] = useState<string>(FreeVpsService.getEndpoint());
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [status, setStatus] = useState<VpsStatus>({
    connected: false,
    endpointUrl: FreeVpsService.getEndpoint(),
    latencyMs: 0,
    osName: 'macOS Sonoma (GitHub Actions Runner)',
    services: { daemon: false, vnc: false, adb: false, tmate: false }
  });

  const [bashCmd, setBashCmd] = useState<string>('sw_vers && lua -v');
  const [bashLogs, setBashLogs] = useState<string[]>([]);
  const [isRunningBash, setIsRunningBash] = useState<boolean>(false);

  const [testLua, setTestLua] = useState<string>('print("[FreeVPS macOS via Bore] Hello from remote Lua runtime!")\nprint("Target package: com.sandboxol.blockymods")');
  const [testLuaLogs, setTestLuaLogs] = useState<string>('');
  const [isRunningLua, setIsRunningLua] = useState<boolean>(false);

  useEffect(() => {
    handlePing();
  }, []);

  const handlePing = async (overrideUrl?: string) => {
    setIsPinging(true);
    const target = overrideUrl || endpointInput;
    try {
      FreeVpsService.setEndpoint(target);
      const res = await FreeVpsService.pingVps(target);
      setStatus(res);
      if (res.connected) {
        LuaBridge.setMode('RUNTIME');
      }
    } finally {
      setIsPinging(false);
    }
  };

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunBash = async () => {
    if (!bashCmd.trim()) return;
    setIsRunningBash(true);
    const cmd = bashCmd.trim();
    setBashLogs((prev) => [...prev, `$ ${cmd}`]);
    try {
      const res = await FreeVpsService.executeRemoteBash(cmd);
      setBashLogs((prev) => [...prev, res.output]);
    } finally {
      setIsRunningBash(false);
    }
  };

  const handleRunRemoteLua = async () => {
    setIsRunningLua(true);
    try {
      const res = await FreeVpsService.executeRemoteLua(testLua, 'remote_test.lua');
      setTestLuaLogs(res.output);
    } finally {
      setIsRunningLua(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white tracking-wide">FREEVPS MACOS CLOUD RUNNER</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400 fill-current" />
              Bore Zero-Config Tunnel
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Zero-cost cloud VPS powered by GitHub Actions (<span className="text-cyan-300 font-mono">macos-latest</span>). Uses <span className="text-white font-semibold">Bore</span> for instant automatic tunneling without any tokens or accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/cybershadowvps/FreeVPS"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>FreeVPS Repo</span>
          </a>
          <button
            onClick={onOpenOverlay}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Open Overlay</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            status.connected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
          }`}>
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Runner Connection</span>
            <span className="text-xs font-bold text-white truncate">
              {status.connected ? `Connected (${status.latencyMs}ms)` : 'Offline / Standby'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Runner Specs</span>
            <span className="text-xs font-bold text-cyan-300 truncate">
              3-Core CPU • 14GB Unified RAM
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Tunnel Technology</span>
            <span className="text-xs font-bold text-slate-200 truncate font-mono">
              Bore.pub (Zero Setup)
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 overflow-x-auto">
        {[
          { id: 'manager', label: '1. Bore VPS Connector', icon: Globe },
          { id: 'workflow', label: '2. GitHub Actions YAML', icon: Layers },
          { id: 'terminal', label: '3. Remote Terminal & Lua', icon: Terminal },
          { id: 'docs', label: '4. FreeVPS & Bore Guide', icon: Sparkles }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'manager' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400 fill-current" />
                  <span>Zero-Config Bore Tunnel Connection</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your Bore port (e.g. <span className="font-mono text-cyan-300">38472</span>) or full URL (e.g. <span className="font-mono text-cyan-300">http://bore.pub:38472</span>) printed in the GitHub Actions runner log.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                No Auth Token Needed
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={endpointInput}
                onChange={(e) => setEndpointInput(e.target.value)}
                placeholder="bore.pub:38472 or just 38472"
                className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200 outline-none focus:border-cyan-500/50"
              />
              <button
                onClick={() => handlePing()}
                disabled={isPinging}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                <span>{isPinging ? 'Connecting...' : 'Connect Runner'}</span>
              </button>
            </div>

            {status.connected ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">FreeVPS macOS Runner Connected via Bore!</div>
                  <div className="text-[11px] text-slate-300">
                    Host: <span className="font-mono text-cyan-300">{status.endpointUrl}</span> • Latency: <span className="font-mono text-emerald-400">{status.latencyMs}ms</span> • OS: {status.osName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    BMGO daemon on port 8088 is responding over Bore. All Lua scripts executed in the executor and overlay will run on the macOS cloud runner.
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs space-y-3">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>How to launch your runner in 1 minute:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-cyan-300">Step 1:</span>
                    <p className="text-slate-400">Copy the workflow YAML from Tab 2 into your repository (.github/workflows/macos-vps-daemon.yml).</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-cyan-300">Step 2:</span>
                    <p className="text-slate-400">Run workflow in GitHub Actions. No secret tokens or manual setup required!</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-cyan-300">Step 3:</span>
                    <p className="text-slate-400">Copy the <span className="font-mono text-white">bore.pub:PORT</span> from the log and paste it above.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'workflow' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <span>.github/workflows/macos-vps-daemon.yml</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Zero-config GitHub Actions workflow configured with Bore tunnel on macOS 14/15 runners.
                </p>
              </div>
              <button
                onClick={() => handleCopy('workflow_yaml', FreeVpsService.getWorkflowYaml())}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 hover:brightness-110 cursor-pointer"
              >
                {copiedKey === 'workflow_yaml' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'workflow_yaml' ? 'Copied' : 'Copy Workflow'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-200 max-h-72 overflow-y-auto custom-scrollbar whitespace-pre">
              {FreeVpsService.getWorkflowYaml()}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <span>macos-bmgo-daemon.sh (Bootstrap Script)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Runner startup script that boots the daemon on port 8088 and binds to Bore automatically.
                </p>
              </div>
              <button
                onClick={() => handleCopy('daemon_sh', FreeVpsService.getDaemonBootstrapScript())}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedKey === 'daemon_sh' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'daemon_sh' ? 'Copied' : 'Copy Script'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-200 max-h-72 overflow-y-auto custom-scrollbar whitespace-pre">
              {FreeVpsService.getDaemonBootstrapScript()}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'terminal' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <span>Remote Bash Shell (FreeVPS macOS Runner)</span>
              </h3>
              <button
                onClick={() => setBashLogs([])}
                className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
              >
                Clear Log
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 min-h-40 max-h-56 overflow-y-auto custom-scrollbar whitespace-pre-wrap">
              {bashLogs.length === 0 ? 'Terminal idle. Enter a command below and click Send.' : bashLogs.join('\n')}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={bashCmd}
                onChange={(e) => setBashCmd(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunBash()}
                placeholder="uname -a || lua -v || sw_vers"
                className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200 outline-none focus:border-cyan-500/50"
              />
              <button
                onClick={handleRunBash}
                disabled={isRunningBash}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isRunningBash ? 'Running...' : 'Execute'}</span>
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-cyan-400" />
                <span>Remote Lua 5.1 / LuaJIT Execution Tester</span>
              </h3>
              <button
                onClick={handleRunRemoteLua}
                disabled={isRunningLua}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isRunningLua ? 'Executing...' : 'Run Remote Lua'}</span>
              </button>
            </div>

            <textarea
              value={testLua}
              onChange={(e) => setTestLua(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-200 outline-none focus:border-cyan-500/50 resize-y"
            />

            {testLuaLogs && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 whitespace-pre-wrap">
                {testLuaLogs}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'docs' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>About FreeVPS & Zero-Config Bore Architecture</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-cyan-400">Bore</strong> is a modern TCP tunneling client that forwards traffic from <span className="font-mono text-cyan-300">bore.pub:PORT</span> directly to the runner's local port <span className="font-mono text-cyan-300">8088</span> with zero authentication setup, zero tokens, and zero account requirements.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-xs text-cyan-400 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Why Bore is Preferred</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                  <li><strong className="text-white">Zero Token:</strong> No NGROK_AUTH_TOKEN or account registration.</li>
                  <li><strong className="text-white">Instant Tunnel:</strong> Binds in less than 2 seconds on runner boot.</li>
                  <li><strong className="text-white">Direct Port:</strong> Simply type the 5-digit port into BMGO Client.</li>
                  <li><strong className="text-white">Open-Source:</strong> Rust-based high-throughput networking.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-bold text-xs text-cyan-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Runner Specs & Reliability</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                  <li><strong className="text-white">OS:</strong> macOS 14 Sonoma / macOS 15 Sequoia</li>
                  <li><strong className="text-white">Hardware:</strong> 3-Core CPU & 14 GB RAM</li>
                  <li><strong className="text-white">Keep-Alive:</strong> 6 Hours per dispatch run</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

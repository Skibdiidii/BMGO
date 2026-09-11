import React, { useState, useEffect } from 'react';
import {
  Play,
  Sparkles,
  Zap,
  Terminal,
  Shield,
  Activity,
  Layers,
  ChevronRight,
  ExternalLink,
  Code2,
  Sliders,
  Flame,
  Radio,
  Eye,
  Crosshair,
  ArrowRight
} from 'lucide-react';
import { LuaBridge } from '../services/luaBridge';
import { GM_COMMAND_CATALOG } from '../services/gmHelperCatalog';
import { StorageService } from '../services/storage';
import { ANDROID_PACKAGE } from '../services/runtimePaths';
import { ScriptItem, ConfigItem } from '../types';

interface DashboardHomeProps {
  onOpenExecutor: () => void;
  onNavigateTab: (tab: string) => void;
  onLoadScriptToExecutor: (code: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  onOpenExecutor,
  onNavigateTab,
  onLoadScriptToExecutor
}) => {
  const [runtimeMode, setRuntimeMode] = useState<'MOCK' | 'RUNTIME'>(LuaBridge.getMode());
  const [activeToggles, setActiveToggles] = useState<Record<string, boolean>>(LuaBridge.getActiveToggles());
  const [recentScripts, setRecentScripts] = useState<ScriptItem[]>([]);
  const [activeConfig, setActiveConfig] = useState<ConfigItem | null>(null);

  useEffect(() => {
    const unsubMode = LuaBridge.onModeChange((m) => setRuntimeMode(m));
    const unsubState = LuaBridge.onStateChange((state) => setActiveToggles({ ...state }));
    setRecentScripts(StorageService.getScripts().slice(0, 3));
    setActiveConfig(StorageService.getActiveConfig());
    return () => {
      unsubMode();
      unsubState();
    };
  }, []);

  const handleToggleCommand = (func: string) => {
    LuaBridge.call(func);
  };

  const quickHacks = GM_COMMAND_CATALOG.filter((c) =>
    ['unlimitedJumps', 'Reach', 'BanClickCD', 'quickBreak', 'DevFly', 'BW', 'SpeedManager', 'Tracer', 'AimBot', 'Noclip'].includes(c.id)
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-[#070b14] border border-cyan-500/30 p-5 sm:p-7 shadow-2xl shadow-cyan-950/40">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>BMGO Mobile Engine • Lua 5.1 Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              BLOCKMAN GO <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">EXECUTOR</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Realtime mobile-first Lua 5.1 execution runtime and floating overlay. Powered by GMHelper command catalog and Harumi GPT code synthesis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenExecutor}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-cyan-500/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Floating Executor</span>
            </button>
            <button
              onClick={() => onNavigateTab('harumi')}
              className="px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Harumi GPT</span>
            </button>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/70">
            <div className="text-[11px] text-slate-400">Runtime Mode</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${runtimeMode === 'RUNTIME' ? 'bg-emerald-400' : 'bg-cyan-400'}`}></span>
              <span className="text-sm font-bold font-mono text-white">{runtimeMode}</span>
            </div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/70">
            <div className="text-[11px] text-slate-400">Target Package</div>
            <div className="text-xs font-bold font-mono text-slate-200 mt-1 truncate" title={ANDROID_PACKAGE}>
              {ANDROID_PACKAGE}
            </div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/70">
            <div className="text-[11px] text-slate-400">Active GM Hacks</div>
            <div className="text-sm font-bold font-mono text-cyan-400 mt-1">
              {Object.values(activeToggles).filter(Boolean).length} Active
            </div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/70">
            <div className="text-[11px] text-slate-400">Active Config</div>
            <div className="text-xs font-bold text-slate-200 mt-1 truncate">
              {activeConfig?.name || 'Default Mobile'}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">GMHelper Quick Hack Toggles</h2>
          </div>
          <button
            onClick={() => onNavigateTab('executor')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({GM_COMMAND_CATALOG.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {quickHacks.map((hack) => {
            const isActive = !!activeToggles[hack.func];
            return (
              <button
                key={hack.id}
                onClick={() => handleToggleCommand(hack.func)}
                className={`p-3 rounded-2xl border text-left transition-all active:scale-95 cursor-pointer flex flex-col justify-between min-h-[90px] ${
                  isActive
                    ? 'bg-cyan-500/15 border-cyan-400/60 shadow-lg shadow-cyan-950/50'
                    : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 shadow-sm shadow-cyan-400 animate-pulse' : 'bg-slate-700'}`}></span>
                  <span className="text-[10px] font-mono font-bold text-slate-500">{hack.tab}</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100 truncate">{hack.name}</div>
                  <div className={`text-[10px] font-semibold mt-0.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {isActive ? 'ENABLED' : 'DISABLED'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Scripts</h3>
            </div>
            <button
              onClick={() => onNavigateTab('scripts')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Library</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {recentScripts.map((script) => (
              <div
                key={script.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-bold text-slate-200 truncate">{script.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{script.description}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      onLoadScriptToExecutor(script.code);
                      onOpenExecutor();
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                    title="Load in Executor"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => LuaBridge.executeScript(script.code)}
                    className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs cursor-pointer"
                    title="Execute directly"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">HARUMI GPT CODE MAKER</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generate genuine Lua 5.1 Blockman GO game hooks from simple prompts. No complex coding required.
            </p>
            <div className="mt-3 space-y-2">
              <div className="text-[11px] text-slate-400 font-medium">Quick Prompts:</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-cyan-300">
                  Auto-Bridge placement
                </span>
                <span className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-cyan-300">
                  Hyperspeed glider
                </span>
                <span className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-cyan-300">
                  BedWars anti-delay
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('harumi')}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer mt-4"
          >
            <span>Launch Harumi GPT Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

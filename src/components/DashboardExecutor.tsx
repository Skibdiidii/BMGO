import React, { useState, useEffect } from 'react';
import {
  Play,
  Terminal,
  Layers,
  Sparkles,
  Sliders,
  ExternalLink,
  Shield,
  Zap,
  Info,
  ChevronRight,
  Check
} from 'lucide-react';
import { LuaBridge } from '../services/luaBridge';
import { GM_COMMAND_CATALOG } from '../services/gmHelperCatalog';
import { GMCommandItem } from '../types';

interface DashboardExecutorProps {
  onOpenOverlay: () => void;
  onLoadScriptToOverlay: (code: string) => void;
}

export const DashboardExecutor: React.FC<DashboardExecutorProps> = ({
  onOpenOverlay,
  onLoadScriptToOverlay
}) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'hacks' | 'effects' | 'buggy' | 'game_panel'>('all');
  const [activeToggles, setActiveToggles] = useState<Record<string, boolean>>(LuaBridge.getActiveToggles());
  const [inputModalCmd, setInputModalCmd] = useState<GMCommandItem | null>(null);
  const [paramValue, setParamValue] = useState<string>('');

  useEffect(() => {
    const unsub = LuaBridge.onStateChange((state) => setActiveToggles({ ...state }));
    return unsub;
  }, []);

  const handleCommandClick = (cmd: GMCommandItem) => {
    if (cmd.hasInput) {
      setInputModalCmd(cmd);
      setParamValue('');
    } else {
      LuaBridge.call(cmd.func);
    }
  };

  const handleParamSubmit = () => {
    if (!inputModalCmd) return;
    LuaBridge.call(inputModalCmd.func, paramValue);
    setInputModalCmd(null);
    setParamValue('');
  };

  const filteredCommands = GM_COMMAND_CATALOG.filter((cmd) => {
    if (selectedTab === 'all') return true;
    return cmd.tab === selectedTab;
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white">GMHELPER COMMAND CATALOG</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Source of Truth
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official Blockman GO GMHelper command registry exposed through the LuaBridge.
          </p>
        </div>

        <button
          onClick={onOpenOverlay}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Launch Floating Executor</span>
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: 'all', label: 'All Commands' },
          { id: 'hacks', label: 'Hacks (21)' },
          { id: 'effects', label: 'Effects (6)' },
          { id: 'buggy', label: 'Buggy (1)' },
          { id: 'game_panel', label: 'Game & Panel (4)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedTab === tab.id
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredCommands.map((cmd) => {
          const isActive = !!activeToggles[cmd.func];
          return (
            <div
              key={cmd.id}
              onClick={() => handleCommandClick(cmd)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] flex flex-col justify-between ${
                isActive
                  ? 'bg-cyan-500/10 border-cyan-400/50 shadow-lg shadow-cyan-950/30'
                  : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    {cmd.tab.replace('_', ' ')}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono tracking-tight ${
                      isActive
                        ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isActive ? 'ACTIVE' : 'IDLE'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-2">{cmd.name}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cmd.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-cyan-400 truncate max-w-[170px]">
                  LuaBridge.call("{cmd.func}")
                </span>
                <span className="text-slate-500 font-bold text-[10px] flex items-center gap-1">
                  <span>{cmd.hasInput ? 'Input' : 'Toggle'}</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {inputModalCmd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-cyan-500/40 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {inputModalCmd.name} Parameter
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                {inputModalCmd.func}
              </span>
            </div>

            <p className="text-xs text-slate-400">{inputModalCmd.description}</p>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-300">Enter parameter argument</label>
              <input
                type={inputModalCmd.inputType === 'number' ? 'number' : 'text'}
                value={paramValue}
                onChange={(e) => setParamValue(e.target.value)}
                placeholder={inputModalCmd.inputPlaceholder || 'Value'}
                autoFocus
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setInputModalCmd(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-white bg-slate-800/80 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleParamSubmit}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-cyan-500 text-slate-950 hover:brightness-110 cursor-pointer"
              >
                Dispatch Command
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

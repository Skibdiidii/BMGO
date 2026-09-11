import React from 'react';
import {
  Home,
  Play,
  Code2,
  Sliders,
  Sparkles,
  Users,
  Settings,
  Bell,
  Terminal,
  FolderTree
} from 'lucide-react';
import { LATEST_VERSION } from '../services/patchNotes';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenOverlay: () => void;
  onOpenWhatsNew: () => void;
  runtimeMode: 'MOCK' | 'RUNTIME';
  onToggleRuntimeMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenOverlay,
  onOpenWhatsNew,
  runtimeMode,
  onToggleRuntimeMode
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'executor', label: 'Executor', icon: Terminal },
    { id: 'sandbox', label: 'Android FS', icon: FolderTree },
    { id: 'scripts', label: 'Scripts', icon: Code2 },
    { id: 'configs', label: 'Configs', icon: Sliders },
    { id: 'harumi', label: 'Harumi GPT', icon: Sparkles, badge: 'AI' },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/20 safe-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => onTabChange('home')}
              className="flex items-center gap-2.5 cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center font-black text-sm text-slate-950 shadow-md shadow-cyan-500/30">
                B
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-base tracking-wider text-white flex items-center gap-1.5">
                  BMGO <span className="text-cyan-400 font-bold">CLIENT</span>
                </span>
                <span className="text-[9px] font-mono text-slate-400 leading-none">
                  Blockman GO Engine
                </span>
              </div>
            </button>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-400 text-slate-950 font-black">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleRuntimeMode}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer ${
                runtimeMode === 'RUNTIME'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              }`}
              title="Toggle runtime mode"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${runtimeMode === 'RUNTIME' ? 'bg-emerald-400' : 'bg-cyan-400'}`}></span>
              <span>{runtimeMode}</span>
            </button>

            <button
              onClick={onOpenWhatsNew}
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 transition-colors relative cursor-pointer"
              title="What's New / Patch Notes"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            </button>

            <button
              onClick={onOpenOverlay}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden xs:inline">Overlay</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-cyan-500/20 px-1 py-1.5 safe-bottom flex items-center justify-around overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                isActive ? 'text-cyan-400 font-bold scale-105' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

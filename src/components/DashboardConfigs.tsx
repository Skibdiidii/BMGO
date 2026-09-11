import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Plus,
  Check,
  Trash2,
  Save,
  Palette,
  Layout,
  Maximize,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { ConfigItem } from '../types';

export const DashboardConfigs: React.FC = () => {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [activeConfigId, setActiveConfigId] = useState<string>('');
  const [selectedConfig, setSelectedConfig] = useState<ConfigItem | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [theme, setTheme] = useState<ConfigItem['theme']>('cyber');
  const [uiScale, setUiScale] = useState<ConfigItem['uiScale']>('normal');
  const [overlayX, setOverlayX] = useState<number>(20);
  const [overlayY, setOverlayY] = useState<number>(80);
  const [overlayWidth, setOverlayWidth] = useState<number>(340);
  const [overlayHeight, setOverlayHeight] = useState<number>(460);
  const [buttonSize, setButtonSize] = useState<'normal' | 'large'>('normal');
  const [autoClear, setAutoClear] = useState<boolean>(false);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = () => {
    const list = StorageService.getConfigs();
    setConfigs(list);
    const active = list.find((c) => c.active) || list[0];
    if (active) {
      setActiveConfigId(active.id);
      populateForm(active);
    }
  };

  const populateForm = (cfg: ConfigItem) => {
    setSelectedConfig(cfg);
    setIsNew(false);
    setName(cfg.name);
    setDescription(cfg.description);
    setTheme(cfg.theme);
    setUiScale(cfg.uiScale);
    setOverlayX(cfg.overlay.x);
    setOverlayY(cfg.overlay.y);
    setOverlayWidth(cfg.overlay.width);
    setOverlayHeight(cfg.overlay.height);
    setButtonSize(cfg.preferences.buttonSize);
    setAutoClear(cfg.preferences.autoClearOnExecute);
    setShowLineNumbers(cfg.preferences.showLineNumbers);
  };

  const handleCreateNew = () => {
    setIsNew(true);
    setSelectedConfig(null);
    setName('Custom Preset');
    setDescription('Tailored overlay coordinates and button sizing for mobile');
    setTheme('cyber');
    setUiScale('normal');
    setOverlayX(16);
    setOverlayY(72);
    setOverlayWidth(340);
    setOverlayHeight(460);
    setButtonSize('normal');
    setAutoClear(false);
    setShowLineNumbers(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (isNew || !selectedConfig) {
      const created = StorageService.addConfig(name.trim(), description.trim(), {
        theme,
        uiScale,
        overlay: {
          x: overlayX,
          y: overlayY,
          width: overlayWidth,
          height: overlayHeight,
          minimized: false,
          opacity: 0.95
        },
        preferences: {
          autoClearOnExecute: autoClear,
          showLineNumbers,
          fontSize: 13,
          logLevel: 'all',
          hapticFeedback: true,
          buttonSize
        }
      });
      loadConfigs();
      populateForm(created);
    } else {
      const all = StorageService.getConfigs();
      const updated = all.map((c) => {
        if (c.id === selectedConfig.id) {
          return {
            ...c,
            name: name.trim(),
            description: description.trim(),
            theme,
            uiScale,
            overlay: {
              ...c.overlay,
              x: overlayX,
              y: overlayY,
              width: overlayWidth,
              height: overlayHeight
            },
            preferences: {
              ...c.preferences,
              autoClearOnExecute: autoClear,
              showLineNumbers,
              buttonSize
            }
          };
        }
        return c;
      });
      StorageService.saveConfigs(updated);
      loadConfigs();
    }
  };

  const handleSetActive = (id: string) => {
    StorageService.setActiveConfig(id);
    setActiveConfigId(id);
    loadConfigs();
  };

  const handleDelete = (id: string) => {
    const remaining = configs.filter((c) => c.id !== id);
    if (remaining.length === 0) return;
    StorageService.saveConfigs(remaining);
    loadConfigs();
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
        <div>
          <h2 className="text-xl font-extrabold text-white">CONFIGS & PRESETS</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage floating overlay sizes, positions, themes, and touch sensitivity for Appilix APK packaging.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/25 hover:brightness-110 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Configuration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Available Configurations ({configs.length})
          </div>

          <div className="space-y-2.5">
            {configs.map((cfg) => {
              const isActive = cfg.id === activeConfigId;
              const isSelected = selectedConfig?.id === cfg.id && !isNew;
              return (
                <div
                  key={cfg.id}
                  onClick={() => populateForm(cfg)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400/60 shadow-lg shadow-cyan-950/40'
                      : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white truncate">{cfg.name}</span>
                    <div className="flex items-center gap-1.5">
                      {isActive ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetActive(cfg.id);
                          }}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
                        >
                          Set Active
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{cfg.description}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                    <span>
                      {cfg.overlay.width}x{cfg.overlay.height}px • ({cfg.overlay.x},{cfg.overlay.y})
                    </span>
                    <span className="capitalize">{cfg.theme} theme</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {isNew ? 'New Configuration Preset' : 'Edit Configuration'}
              </h3>
              <span className="text-xs text-slate-400">Customize overlay dimensions & behaviors</span>
            </div>
            {selectedConfig && configs.length > 1 && (
              <button
                onClick={() => handleDelete(selectedConfig.id)}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 cursor-pointer"
                title="Delete preset"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Config Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Color Theme</span>
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 outline-none"
                >
                  <option value="cyber">Cyber Dark (Cyan/Blue)</option>
                  <option value="neon">Neon Violet (Purple)</option>
                  <option value="matrix">Emerald Matrix (Green)</option>
                  <option value="crimson">Crimson Red (Blood)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>UI Scale</span>
                </label>
                <select
                  value={uiScale}
                  onChange={(e) => setUiScale(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 outline-none"
                >
                  <option value="compact">Compact (Small screens)</option>
                  <option value="normal">Normal (Default)</option>
                  <option value="large">Large (Tablet / High DPI)</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="font-bold text-slate-200 flex items-center gap-2">
                <Layout className="w-4 h-4 text-cyan-400" />
                <span>Overlay Geometry (Pixels)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Position X</label>
                  <input
                    type="number"
                    value={overlayX}
                    onChange={(e) => setOverlayX(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Position Y</label>
                  <input
                    type="number"
                    value={overlayY}
                    onChange={(e) => setOverlayY(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Width</label>
                  <input
                    type="number"
                    value={overlayWidth}
                    onChange={(e) => setOverlayWidth(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Height</label>
                  <input
                    type="number"
                    value={overlayHeight}
                    onChange={(e) => setOverlayHeight(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLineNumbers}
                  onChange={(e) => setShowLineNumbers(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Display Editor Line Numbers</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoClear}
                  onChange={(e) => setAutoClear(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span>Auto Clear Editor on Successful Execution</span>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

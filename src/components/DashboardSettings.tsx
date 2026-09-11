import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Smartphone,
  Sparkles,
  FolderTree,
  RotateCcw,
  Info,
  Check,
  Eye,
  Key,
  Database,
  Layers,
  Cpu,
  HelpCircle,
  Code,
  Save,
  CheckCircle2
} from 'lucide-react';
import { LuaBridge } from '../services/luaBridge';
import { HarumiGPT } from '../services/harumiGpt';
import { StorageService } from '../services/storage';
import { ANDROID_RUNTIME_PATHS, ANDROID_PACKAGE } from '../services/runtimePaths';
import { RuntimeMode, AIServiceConfig } from '../types';

export const DashboardSettings: React.FC = () => {
  const [runtimeMode, setRuntimeMode] = useState<RuntimeMode>(LuaBridge.getMode());
  const [nativeAvailable, setNativeAvailable] = useState<boolean>(false);
  const [provider, setProvider] = useState<'mistral' | 'gemini' | 'mock'>('mistral');
  const [mistralKey, setMistralKey] = useState<string>('B4uCaEJo9ZCuZo5Am6BpAwt30lP86WMu');
  const [geminiKey, setGeminiKey] = useState<string>('');
  const [model, setModel] = useState<string>('codestral-latest');
  const [useMockAi, setUseMockAi] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);
  const [testedPath, setTestedPath] = useState<string>('/data/user/0/' + ANDROID_PACKAGE + '/app_resources/Media/Scripts/Engine/lua/engine_client/helper/GMHelper.lua');
  const [pathTestResult, setPathTestResult] = useState<{ verified: boolean; latencyMs: number; message: string } | null>(null);

  useEffect(() => {
    const unsub = LuaBridge.onModeChange((m) => setRuntimeMode(m));
    setNativeAvailable(LuaBridge.getAdapter().isNativeRuntimeAvailable());
    const aiConfig = HarumiGPT.getConfig();
    setProvider(aiConfig.provider || 'mistral');
    setMistralKey(aiConfig.mistralApiKey || 'B4uCaEJo9ZCuZo5Am6BpAwt30lP86WMu');
    setGeminiKey(aiConfig.geminiApiKey || '');
    setModel(aiConfig.model || 'codestral-latest');
    setUseMockAi(aiConfig.useMock);
    return unsub;
  }, []);

  const handleModeToggle = (mode: RuntimeMode) => {
    LuaBridge.setMode(mode);
  };

  const handleSaveAiConfig = () => {
    HarumiGPT.updateConfig({
      provider,
      mistralApiKey: mistralKey.trim(),
      apiKey: mistralKey.trim(),
      geminiApiKey: geminiKey.trim(),
      model,
      useMock: useMockAi || provider === 'mock'
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleTestPath = () => {
    const res = LuaBridge.testPathConnection(testedPath);
    setPathTestResult(res);
  };

  const handleResetAllStorage = () => {
    if (window.confirm('Reset all BMGO local scripts, configs, and history back to factory default?')) {
      StorageService.resetAllStorage();
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
        <div>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white">SYSTEM SETTINGS</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              BMGO Core
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure Mistral AI API, runtime bridges, Android sandbox paths, and storage.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Lua 5.1 Runtime Bridge</h3>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
              runtimeMode === 'RUNTIME' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-300'
            }`}>
              {runtimeMode}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The LuaBridge communicates with either the Virtual Mock Sandbox (in browser) or the native Android WebView bridge adapter (inside Blockman GO / Appilix APK).
          </p>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400">Execution Mode Selection:</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleModeToggle('MOCK')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  runtimeMode === 'MOCK'
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold">Mock Mode</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Emulates Blockman GO Lua environment in browser</div>
              </button>
              <button
                onClick={() => handleModeToggle('RUNTIME')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  runtimeMode === 'RUNTIME'
                    ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold">Runtime Mode</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Native Android / Appilix WebView bridge adapter</div>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
            <div className="flex justify-between text-slate-400">
              <span>Android Bridge Present:</span>
              <span className={nativeAvailable ? 'text-emerald-400 font-bold' : 'text-slate-500 font-mono'}>
                {nativeAvailable ? 'YES (Active)' : 'NO (Using Mock fallback)'}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Target Package:</span>
              <span className="font-mono text-cyan-300">{ANDROID_PACKAGE}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Mistral AI & Harumi Config</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              Active Provider: {provider.toUpperCase()}
            </span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium">Provider Selection</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'mistral', label: 'Mistral AI' },
                  { id: 'gemini', label: 'Gemini' },
                  { id: 'mock', label: 'Mock' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProvider(p.id as any)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      provider === p.id
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {provider === 'mistral' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Mistral API Key</span>
                  </label>
                  <input
                    type="password"
                    value={mistralKey}
                    onChange={(e) => setMistralKey(e.target.value)}
                    placeholder="B4uCaEJo9ZCuZo5Am6BpAwt30lP86WMu"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Mistral Model</label>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 text-xs outline-none"
                  >
                    <option value="codestral-latest">codestral-latest (Specialized in Code & Lua)</option>
                    <option value="mistral-small-latest">mistral-small-latest</option>
                    <option value="mistral-large-latest">mistral-large-latest</option>
                    <option value="open-mistral-7b">open-mistral-7b</option>
                  </select>
                </div>
              </>
            )}

            {provider === 'gemini' && (
              <div className="space-y-1">
                <label className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Gemini API Key</span>
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs outline-none focus:border-cyan-500/50"
                />
              </div>
            )}

            <button
              onClick={handleSaveAiConfig}
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 cursor-pointer mt-2"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? 'Settings Saved' : 'Save AI Configuration'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Android Path Connection Diagnostic
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            Path Inspector
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={testedPath}
            onChange={(e) => setTestedPath(e.target.value)}
            className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs outline-none"
          />
          <button
            onClick={handleTestPath}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer shrink-0"
          >
            Test Path Connection
          </button>
        </div>

        {pathTestResult && (
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{pathTestResult.message}</span>
            </span>
            <span className="font-mono text-slate-400">{pathTestResult.latencyMs}ms latency</span>
          </div>
        )}

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Reference Path</th>
                <th className="py-2 px-3">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {ANDROID_RUNTIME_PATHS.map((item) => (
                <tr key={item.key} className="hover:bg-slate-950/40">
                  <td className="py-2.5 px-3 font-bold text-cyan-300 whitespace-nowrap font-mono text-[10px]">
                    {item.category}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-200 select-all">
                    {item.path}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Appilix APK Packaging Architecture</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            BMGO is built as a pure web application (React/Vite/CSS) hosted over HTTPS. Appilix only packages the completed web app into an Android APK with WebView container.
          </p>
          <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-cyan-300 space-y-1">
            <div>BMGO SOURCE (React / Vite)</div>
            <div>&darr; Web Build</div>
            <div>HTTPS WEBSITE</div>
            <div>&darr; Appilix Packaging</div>
            <div>ANDROID APK</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <RotateCcw className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Storage & Reset</h3>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Clear all locally cached scripts, custom config presets, sandbox files, and Harumi settings.
            </p>
          </div>

          <button
            onClick={handleResetAllStorage}
            className="w-full py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{resetSuccess ? 'Storage Reset Complete' : 'Restore Factory Defaults'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

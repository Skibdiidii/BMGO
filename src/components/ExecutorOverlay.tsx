import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Trash2,
  Minimize2,
  Maximize2,
  X,
  Sparkles,
  Terminal,
  Save,
  Copy,
  Check,
  GripHorizontal,
  ArrowDownToLine,
  Move
} from 'lucide-react';
import { LuaBridge } from '../services/luaBridge';
import { StorageService } from '../services/storage';
import { HarumiGPT } from '../services/harumiGpt';
import { ConsoleLogItem, ScriptItem } from '../types';

interface ExecutorOverlayProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  externalCode?: string;
  onCodeInjected?: () => void;
}

export const ExecutorOverlay: React.FC<ExecutorOverlayProps> = ({
  isOpen,
  onOpen,
  onClose,
  externalCode,
  onCodeInjected
}) => {
  const [code, setCode] = useState<string>('-- Lua 5.1 Blockman GO Script\nprint("Hello BMGO")\nUIHelper.showToast("^00FF00Ready")');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [runtimeMode, setRuntimeMode] = useState<'MOCK' | 'RUNTIME'>(LuaBridge.getMode());
  const [activeTab, setActiveTab] = useState<'editor' | 'ai' | 'scripts' | 'history' | 'console'>('editor');
  const [logs, setLogs] = useState<ConsoleLogItem[]>([]);
  const [historyItems, setHistoryItems] = useState<string[]>([]);
  const [savedScripts, setSavedScripts] = useState<ScriptItem[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [executing, setExecuting] = useState<boolean>(false);
  const [isDraggingState, setIsDraggingState] = useState<boolean>(false);

  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiGeneratedCode, setAiGeneratedCode] = useState<string>('');
  const [aiExplanation, setAiExplanation] = useState<string>('');

  const [saveModalOpen, setSaveModalOpen] = useState<boolean>(false);
  const [newScriptTitle, setNewScriptTitle] = useState<string>('');
  const [newScriptDesc, setNewScriptDesc] = useState<string>('');

  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 20, y: 76 });
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 360, height: 480 });

  const isDraggingRef = useRef<boolean>(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef<boolean>(false);
  const isResizingRef = useRef<boolean>(false);
  const resizeStartRef = useRef<{ x: number; y: number; w: number; h: number }>({ x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => {
    const config = StorageService.getActiveConfig();
    if (config?.overlay) {
      const initialX = Math.min(Math.max(10, config.overlay.x), Math.max(10, window.innerWidth - 360));
      const initialY = Math.min(Math.max(10, config.overlay.y), Math.max(10, window.innerHeight - 300));
      setPos({ x: initialX, y: initialY });
      setSize({
        width: Math.min(Math.max(280, config.overlay.width), window.innerWidth - 20),
        height: Math.min(Math.max(340, config.overlay.height), window.innerHeight - 80)
      });
      setIsMinimized(config.overlay.minimized);
    }
  }, []);

  useEffect(() => {
    if (externalCode) {
      setCode(externalCode);
      setActiveTab('editor');
      setIsMinimized(false);
      onOpen();
      onCodeInjected?.();
    }
  }, [externalCode, onOpen, onCodeInjected]);

  useEffect(() => {
    const unsubMode = LuaBridge.onModeChange((m) => setRuntimeMode(m));
    const unsubLog = LuaBridge.onLog((log) => {
      setLogs((prev) => [...prev.slice(-60), log]);
    });
    setHistoryItems(StorageService.getHistory());
    setSavedScripts(StorageService.getScripts());
    return () => {
      unsubMode();
      unsubLog();
    };
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (isDraggingRef.current) {
      hasMovedRef.current = true;
      const overlayWidth = !isOpen || isMinimized ? 150 : (isFullscreen ? window.innerWidth : size.width);
      const overlayHeight = !isOpen || isMinimized ? 52 : (isFullscreen ? window.innerHeight : size.height);
      const maxX = Math.max(0, window.innerWidth - overlayWidth);
      const maxY = Math.max(0, window.innerHeight - overlayHeight);

      const nextX = Math.min(Math.max(0, e.clientX - dragOffsetRef.current.x), maxX);
      const nextY = Math.min(Math.max(0, e.clientY - dragOffsetRef.current.y), maxY);
      setPos({ x: nextX, y: nextY });
    } else if (isResizingRef.current) {
      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;
      const minW = 280;
      const minH = 340;
      const maxW = Math.max(minW, window.innerWidth - pos.x - 10);
      const maxH = Math.max(minH, window.innerHeight - pos.y - 10);
      const newW = Math.min(Math.max(minW, resizeStartRef.current.w + deltaX), maxW);
      const newH = Math.min(Math.max(minH, resizeStartRef.current.h + deltaY), maxH);
      setSize({ width: newW, height: newH });
    }
  }, [isOpen, isMinimized, isFullscreen, size, pos]);

  const handlePointerUp = useCallback(() => {
    if (isDraggingRef.current || isResizingRef.current) {
      isDraggingRef.current = false;
      isResizingRef.current = false;
      setIsDraggingState(false);
      StorageService.updateOverlayConfig({
        x: pos.x,
        y: pos.y,
        width: size.width,
        height: size.height,
        minimized: isMinimized
      });
    }
  }, [pos, size, isMinimized]);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  const startDrag = (e: React.PointerEvent) => {
    if (isFullscreen) return;
    const target = e.target as HTMLElement;
    if (target.closest('input') || target.closest('textarea') || target.closest('a')) {
      return;
    }
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    setIsDraggingState(true);
    dragOffsetRef.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    };
  };

  const startResize = (e: React.PointerEvent) => {
    e.stopPropagation();
    isResizingRef.current = true;
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: size.width,
      h: size.height
    };
  };

  const handleExecute = async () => {
    if (!code.trim()) return;
    setExecuting(true);
    StorageService.addToHistory(code);
    setHistoryItems(StorageService.getHistory());
    try {
      await LuaBridge.executeScript(code);
    } finally {
      setExecuting(false);
    }
  };

  const handleClear = () => {
    setCode('');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await HarumiGPT.generate(aiPrompt);
      setAiGeneratedCode(res.code);
      setAiExplanation(res.explanation);
    } catch (err: any) {
      setAiExplanation(`Generation error: ${err?.message || 'Unknown error'}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleInsertAiCode = () => {
    if (!aiGeneratedCode) return;
    setCode(aiGeneratedCode);
    setActiveTab('editor');
  };

  const handleSaveCurrentScript = () => {
    if (!code.trim()) return;
    setNewScriptTitle(`Script_${new Date().toLocaleTimeString().replace(/:/g, '')}`);
    setSaveModalOpen(true);
  };

  const confirmSaveScript = () => {
    if (!newScriptTitle.trim()) return;
    StorageService.addScript({
      title: newScriptTitle.trim(),
      description: newScriptDesc.trim() || 'Saved from BMGO Floating Executor',
      code,
      category: 'Hacks',
      tags: ['Lua5.1', 'Custom'],
      author: 'You',
      favorite: false
    });
    setSavedScripts(StorageService.getScripts());
    setSaveModalOpen(false);
    setNewScriptTitle('');
    setNewScriptDesc('');
    setActiveTab('scripts');
  };

  if (!isOpen) {
    return (
      <div
        onPointerDown={startDrag}
        onClick={() => {
          if (!hasMovedRef.current) {
            onOpen();
          }
        }}
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
        className="fixed z-[9999] flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-950/95 border border-cyan-400/80 shadow-2xl shadow-cyan-500/40 backdrop-blur-xl cursor-grab active:cursor-grabbing select-none touch-none hover:border-cyan-300 animate-pulse"
        title="Floating GM Floater Bubble - Tap to open Executor"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-md shadow-cyan-500/50">
          GM
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-extrabold text-white leading-tight flex items-center gap-1">
            BMGO <span className="text-cyan-400 font-bold">FLOATER</span>
          </span>
          <span className="text-[9px] font-mono text-emerald-400 leading-tight flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            {runtimeMode}
          </span>
        </div>
        <Move className="w-3.5 h-3.5 text-slate-400 ml-1" />
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div
        onPointerDown={startDrag}
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
        className="fixed z-[9999] flex items-center gap-2.5 p-2 pr-3.5 rounded-full bg-slate-950/95 border border-cyan-500/60 shadow-2xl shadow-cyan-500/30 backdrop-blur-xl cursor-grab active:cursor-grabbing select-none touch-none hover:border-cyan-400"
        title="Drag anywhere • Click expand to open full window"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-sm shadow-cyan-500/40">
          B
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-white leading-tight">BMGO GM</span>
          <span className="text-[9px] font-mono text-cyan-400 leading-tight">
            {runtimeMode}
          </span>
        </div>
        <button
          onClick={() => setIsMinimized(false)}
          className="ml-1 p-1 rounded-md text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 cursor-pointer"
          title="Expand"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      style={
        isFullscreen
          ? { left: 0, top: 0, width: '100vw', height: '100dvh' }
          : { left: `${pos.x}px`, top: `${pos.y}px`, width: `${size.width}px`, height: `${size.height}px` }
      }
      className={`fixed z-[9999] flex flex-col bg-slate-950/95 border border-cyan-500/50 shadow-2xl shadow-cyan-950/80 backdrop-blur-2xl overflow-hidden ${
        isFullscreen ? 'rounded-none' : 'rounded-2xl'
      } ${isDraggingState ? 'ring-2 ring-cyan-400/60' : ''}`}
    >
      <div
        onPointerDown={startDrag}
        className="h-11 px-3 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border-b border-cyan-500/20 flex items-center justify-between cursor-grab active:cursor-grabbing select-none touch-none shrink-0"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 flex items-center justify-center font-black text-xs text-slate-950 shadow-sm shadow-cyan-500/30">
            B
          </div>
          <span className="text-xs font-bold text-white tracking-wider">BMGO FLOATING EXECUTOR</span>
          <button
            onClick={() => LuaBridge.setMode(runtimeMode === 'MOCK' ? 'RUNTIME' : 'MOCK')}
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono tracking-tight cursor-pointer transition-colors ${
              runtimeMode === 'RUNTIME'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
            }`}
            title="Toggle Runtime Mode"
          >
            ● {runtimeMode}
          </button>
        </div>

        <div className="flex items-center gap-1">
          <GripHorizontal className="w-4 h-4 text-slate-600 mr-1 hidden sm:block pointer-events-none" />
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            title="Minimize to Floating Pill"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 cursor-pointer"
            title="Close / Float GM Bubble"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden select-text touch-auto">
        {activeTab === 'editor' && (
          <div className="flex-1 flex flex-col p-2.5 space-y-2 overflow-hidden">
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span className="font-mono text-cyan-400 flex items-center gap-1">
                <Terminal className="w-3 h-3" /> Lua 5.1 Engine
              </span>
              <div className="flex items-center gap-2">
                <span>{code.split('\n').length} lines</span>
                <button
                  onClick={handleCopyCode}
                  className="hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-0.5"
                  title="Copy code"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="flex-1 relative rounded-xl bg-slate-900/80 border border-slate-800/80 overflow-hidden font-mono flex">
              <div className="w-8 py-2.5 text-right pr-2 text-slate-600 text-xs select-none bg-slate-950/40 border-r border-slate-800/50">
                {code.split('\n').map((_, i) => (
                  <div key={i} className="leading-5 text-[11px]">
                    {i + 1}
                  </div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                placeholder="-- Lua 5.1 Code\nprint('Hello BMGO')"
                className="flex-1 p-2.5 text-xs text-cyan-100 bg-transparent resize-none outline-none leading-5 custom-scrollbar font-mono select-text"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={handleExecute}
                disabled={executing}
                className="col-span-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${executing ? 'animate-spin' : ''}`} />
                <span>{executing ? 'Executing...' : 'Execute'}</span>
              </button>
              <button
                onClick={handleClear}
                className="py-2.5 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="flex-1 flex flex-col p-3 space-y-3 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white tracking-wide">HARUMI GPT CODE MAKER</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                Mistral / Lua 5.1
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400">Describe script functionality</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., Generate a BedWars fast bridge quickblock loop with speed multiplier"
                rows={3}
                className="w-full p-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-cyan-500/50 resize-none font-sans"
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {[
                'BedWars Fast Break',
                'DevFly Glider',
                'Tracer ESP Radar',
                'Auto Clicker 25ms'
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setAiPrompt(`Make a Lua 5.1 script for ${suggestion}`)}
                  className="px-2 py-1 text-[10px] rounded-lg bg-slate-900/90 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 border border-slate-800 cursor-pointer"
                >
                  + {suggestion}
                </button>
              ))}
            </div>

            <button
              onClick={handleAiGenerate}
              disabled={aiLoading || !aiPrompt.trim()}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
              <span>{aiLoading ? 'Synthesizing Lua 5.1...' : 'Generate with Harumi GPT'}</span>
            </button>

            {aiGeneratedCode && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-cyan-400">Generated Code:</span>
                  <button
                    onClick={handleInsertAiCode}
                    className="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowDownToLine className="w-3 h-3" />
                    <span>Insert into Editor</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/20 text-[11px] font-mono text-cyan-100 max-h-36 overflow-y-auto custom-scrollbar whitespace-pre">
                  {aiGeneratedCode}
                </div>
                {aiExplanation && (
                  <p className="text-[10px] text-slate-400 leading-relaxed bg-slate-900/40 p-2 rounded-lg border border-slate-800/60">
                    {aiExplanation}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'scripts' && (
          <div className="flex-1 flex flex-col p-3 space-y-2 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs font-bold text-white">SCRIPT LIBRARY</span>
              <button
                onClick={handleSaveCurrentScript}
                className="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Save className="w-3 h-3" />
                <span>Save Current</span>
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {savedScripts.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/70 hover:border-cyan-500/30 transition-all flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{item.title}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        setCode(item.code);
                        setActiveTab('editor');
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold cursor-pointer"
                    >
                      Load into Editor
                    </button>
                    <button
                      onClick={() => {
                        LuaBridge.executeScript(item.code);
                      }}
                      className="px-2 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Run Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="flex-1 flex flex-col p-3 space-y-2 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs font-bold text-white">EXECUTION HISTORY</span>
              <span className="text-[10px] text-slate-500">{historyItems.length} entries</span>
            </div>
            {historyItems.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">No executed scripts yet</div>
            ) : (
              <div className="space-y-2 pt-1">
                {historyItems.map((hist, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 flex flex-col gap-1"
                  >
                    <pre className="text-[10px] font-mono text-cyan-200 line-clamp-2 overflow-hidden">{hist}</pre>
                    <div className="flex justify-end gap-1 pt-1">
                      <button
                        onClick={() => {
                          setCode(hist);
                          setActiveTab('editor');
                        }}
                        className="text-[10px] text-slate-400 hover:text-cyan-300 font-semibold px-2 py-0.5 rounded bg-slate-800/60 cursor-pointer"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'console' && (
          <div className="flex-1 flex flex-col p-3 space-y-2 overflow-hidden">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>RUNTIME CONSOLE LOGS</span>
              </span>
              <button
                onClick={() => setLogs([])}
                className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
              >
                Clear Logs
              </button>
            </div>
            <div className="flex-1 p-2 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-[10px] overflow-y-auto custom-scrollbar space-y-1 select-text">
              {logs.length === 0 ? (
                <div className="text-slate-600 text-center py-6">Logs stream here upon Lua execution</div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={`leading-relaxed ${
                      log.type === 'error'
                        ? 'text-red-400'
                        : log.type === 'success'
                        ? 'text-emerald-400'
                        : log.type === 'lua'
                        ? 'text-cyan-300'
                        : 'text-slate-400'
                    }`}
                  >
                    <span className="text-slate-600 mr-1.5">[{log.timestamp}]</span>
                    {log.message}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="h-10 px-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'editor' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'ai' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>AI</span>
          </button>
          <button
            onClick={() => setActiveTab('scripts')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'scripts' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            Scripts
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'history' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('console')}
            className={`px-2 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === 'console' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
            }`}
            title="Console"
          >
            <Terminal className="w-3.5 h-3.5" />
          </button>
        </div>

        {!isFullscreen && (
          <div
            onPointerDown={startResize}
            className="w-5 h-5 flex items-center justify-center cursor-nwse-resize text-slate-600 hover:text-cyan-400 touch-none select-none"
            title="Resize handle"
          >
            <div className="w-2 h-2 border-r-2 border-b-2 border-current"></div>
          </div>
        )}
      </div>

      {saveModalOpen && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-xs bg-slate-900 border border-cyan-500/30 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-white">SAVE SCRIPT TO LIBRARY</h4>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400">Title</label>
              <input
                type="text"
                value={newScriptTitle}
                onChange={(e) => setNewScriptTitle(e.target.value)}
                className="w-full p-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500/50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400">Description</label>
              <input
                type="text"
                value={newScriptDesc}
                onChange={(e) => setNewScriptDesc(e.target.value)}
                placeholder="Optional notes"
                className="w-full p-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500/50"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSaveModalOpen(false)}
                className="px-3 py-1 text-xs rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmSaveScript}
                className="px-3 py-1 text-xs rounded-lg bg-cyan-500 text-slate-950 font-bold hover:brightness-110 cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

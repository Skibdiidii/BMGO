import React, { useState, useEffect, useRef } from 'react';
import {
  Code2,
  Plus,
  Play,
  Trash2,
  Edit3,
  Star,
  Download,
  Upload,
  Search,
  Check,
  Copy,
  ExternalLink,
  Terminal,
  Save,
  X
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { LuaBridge } from '../services/luaBridge';
import { ScriptItem } from '../types';

interface DashboardScriptsProps {
  onLoadScriptToExecutor: (code: string) => void;
  onOpenExecutor: () => void;
}

export const DashboardScripts: React.FC<DashboardScriptsProps> = ({
  onLoadScriptToExecutor,
  onOpenExecutor
}) => {
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeScript, setActiveScript] = useState<ScriptItem | null>(null);
  const [editorCode, setEditorCode] = useState<string>('');
  const [editorTitle, setEditorTitle] = useState<string>('');
  const [editorDesc, setEditorDesc] = useState<string>('');
  const [editorCategory, setEditorCategory] = useState<ScriptItem['category']>('Hacks');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadScripts();
  }, []);

  const loadScripts = () => {
    const list = StorageService.getScripts();
    setScripts(list);
    if (list.length > 0 && !activeScript) {
      selectScript(list[0]);
    }
  };

  const selectScript = (s: ScriptItem) => {
    setActiveScript(s);
    setEditorTitle(s.title);
    setEditorDesc(s.description);
    setEditorCode(s.code);
    setEditorCategory(s.category);
    setIsCreatingNew(false);
  };

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setActiveScript(null);
    setEditorTitle('New_Custom_Script');
    setEditorDesc('Custom Lua 5.1 script for Blockman GO');
    setEditorCode('-- Lua 5.1 Script\nlocal player = PlayerManager:getClientPlayer()\nprint("Executing custom hook...")\nUIHelper.showToast("^00FF00Executed")');
    setEditorCategory('Hacks');
  };

  const handleSave = () => {
    if (!editorTitle.trim()) return;

    if (isCreatingNew || !activeScript) {
      const created = StorageService.addScript({
        title: editorTitle.trim(),
        description: editorDesc.trim(),
        code: editorCode,
        category: editorCategory,
        tags: ['Lua5.1', editorCategory],
        author: 'You',
        favorite: false
      });
      loadScripts();
      selectScript(created);
    } else {
      StorageService.updateScript(activeScript.id, {
        title: editorTitle.trim(),
        description: editorDesc.trim(),
        code: editorCode,
        category: editorCategory
      });
      loadScripts();
    }
  };

  const handleDelete = (id: string) => {
    StorageService.deleteScript(id);
    const updated = scripts.filter((s) => s.id !== id);
    setScripts(updated);
    if (activeScript?.id === id) {
      if (updated.length > 0) {
        selectScript(updated[0]);
      } else {
        handleCreateNew();
      }
    }
  };

  const handleToggleFavorite = (script: ScriptItem, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.updateScript(script.id, { favorite: !script.favorite });
    loadScripts();
  };

  const handleExecuteCurrent = () => {
    LuaBridge.executeScript(editorCode);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(scripts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bmgo_scripts_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCurrentLua = () => {
    const blob = new Blob([editorCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editorTitle.replace(/\s+/g, '_')}.lua`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (file.name.endsWith('.json')) {
        try {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            parsed.forEach((item) => {
              if (item.title && item.code) {
                StorageService.addScript({
                  title: item.title,
                  description: item.description || '',
                  code: item.code,
                  category: item.category || 'Hacks',
                  tags: item.tags || ['Imported'],
                  author: item.author || 'Imported',
                  favorite: false
                });
              }
            });
            loadScripts();
          }
        } catch {}
      } else {
        StorageService.addScript({
          title: file.name.replace(/\.[^/.]+$/, ''),
          description: 'Imported Lua file',
          code: content,
          category: 'Utility',
          tags: ['Lua5.1', 'Imported'],
          author: 'You',
          favorite: false
        });
        loadScripts();
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredScripts = scripts.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
        <div>
          <h2 className="text-xl font-extrabold text-white">SCRIPTS MANAGER</h2>
          <p className="text-xs text-slate-400 mt-1">
            Build, import, export, and run Lua 5.1 scripts across mobile and desktop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".lua,.json,.txt"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </button>
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export All</span>
          </button>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/25 hover:brightness-110 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Script</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scripts..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {['All', 'Hacks', 'PvP', 'BedWars', 'Utility', 'Visual', 'AI Generated'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto custom-scrollbar pr-1">
            {filteredScripts.map((script) => (
              <div
                key={script.id}
                onClick={() => selectScript(script)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                  activeScript?.id === script.id && !isCreatingNew
                    ? 'bg-cyan-500/15 border-cyan-400/60 shadow-md shadow-cyan-950/40'
                    : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate max-w-[200px]">{script.title}</span>
                  <button
                    onClick={(e) => handleToggleFavorite(script, e)}
                    className="text-slate-500 hover:text-amber-400 cursor-pointer p-0.5"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        script.favorite ? 'text-amber-400 fill-amber-400' : ''
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{script.description}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                  <span>{script.category}</span>
                  <span>{script.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="space-y-1 flex-1">
              <input
                type="text"
                value={editorTitle}
                onChange={(e) => setEditorTitle(e.target.value)}
                placeholder="Script Title"
                className="w-full text-base font-bold text-white bg-transparent outline-none border-b border-transparent focus:border-cyan-500/40 pb-0.5"
              />
              <input
                type="text"
                value={editorDesc}
                onChange={(e) => setEditorDesc(e.target.value)}
                placeholder="Script description / notes..."
                className="w-full text-xs text-slate-400 bg-transparent outline-none"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={editorCategory}
                onChange={(e) => setEditorCategory(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-xs text-cyan-300 rounded-lg px-2.5 py-1.5 outline-none"
              >
                <option value="Hacks">Hacks</option>
                <option value="PvP">PvP</option>
                <option value="BedWars">BedWars</option>
                <option value="Utility">Utility</option>
                <option value="Visual">Visual</option>
                <option value="AI Generated">AI Generated</option>
              </select>
              {activeScript && (
                <button
                  onClick={() => handleDelete(activeScript.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 cursor-pointer"
                  title="Delete script"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono min-h-[280px]">
            <textarea
              value={editorCode}
              onChange={(e) => setEditorCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full p-3 text-xs text-cyan-100 bg-transparent resize-none outline-none leading-5 custom-scrollbar font-mono select-text"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 hover:brightness-110 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Script</span>
              </button>
              <button
                onClick={handleExportCurrentLua}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .lua</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onLoadScriptToExecutor(editorCode);
                  onOpenExecutor();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 border border-cyan-500/30 cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Send to Overlay</span>
              </button>
              <button
                onClick={handleExecuteCurrent}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute Lua 5.1</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

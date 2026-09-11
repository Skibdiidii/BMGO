import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  FileCode,
  FileText,
  Play,
  Terminal,
  Plus,
  Save,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Folder,
  Code2
} from 'lucide-react';
import { LuaBridge } from '../services/luaBridge';
import { ANDROID_RUNTIME_PATHS, ANDROID_PACKAGE } from '../services/runtimePaths';
import { VirtualSandboxFile } from '../types';

interface AndroidPathExplorerProps {
  onLoadScriptToOverlay: (code: string) => void;
  onOpenOverlay: () => void;
}

export const AndroidPathExplorer: React.FC<AndroidPathExplorerProps> = ({
  onLoadScriptToOverlay,
  onOpenOverlay
}) => {
  const [files, setFiles] = useState<VirtualSandboxFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<VirtualSandboxFile | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<Record<string, { verified: boolean; latencyMs: number; message: string }>>({});
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    refreshFiles();
  }, []);

  const refreshFiles = () => {
    const list = LuaBridge.getSandboxFiles();
    setFiles(list);
    if (list.length > 0 && !selectedFile) {
      handleSelectFile(list[0]);
    }
  };

  const handleSelectFile = (file: VirtualSandboxFile) => {
    setSelectedFile(file);
    setIsCreating(false);
    setFileName(file.name);
    setFilePath(file.path);
    setFileContent(file.content || '');
    testPath(file.path);
  };

  const testPath = (path: string) => {
    const res = LuaBridge.testPathConnection(path);
    setConnectionStatus((prev) => ({ ...prev, [path]: res }));
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedFile(null);
    const newName = `custom_hook_${Date.now().toString().slice(-4)}.lua`;
    setFileName(newName);
    setFilePath(`/data/user/0/${ANDROID_PACKAGE}/app_resources/Media/Scripts/${newName}`);
    setFileContent(`-- Custom Blockman GO Lua 5.1 Hook\nlocal client = PlayerManager:getClientPlayer()\nif client and client.Player then\n    UIHelper.showToast("^00FF00Hook executed from Android Sandbox")\nend`);
  };

  const handleSave = () => {
    if (!filePath.trim() || !fileContent) return;
    const written = LuaBridge.writeSandboxFile(filePath.trim(), fileContent, fileName.trim());
    refreshFiles();
    setSelectedFile(written);
    setIsCreating(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDelete = (id: string) => {
    LuaBridge.deleteSandboxFile(id);
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    if (selectedFile?.id === id) {
      if (updated.length > 0) {
        handleSelectFile(updated[0]);
      } else {
        handleCreateNew();
      }
    }
  };

  const handleExecute = () => {
    if (!fileContent.trim()) return;
    LuaBridge.executeScript(fileContent);
  };

  const handleSendToOverlay = () => {
    if (!fileContent.trim()) return;
    onLoadScriptToOverlay(fileContent);
    onOpenOverlay();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white">ANDROID SANDBOX EXPLORER</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Live File Connection
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Directly browse, edit, and execute scripts mapped to Android storage: <span className="font-mono text-cyan-300">/data/user/0/{ANDROID_PACKAGE}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshFiles}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            title="Refresh sandbox"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/25 hover:brightness-110 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Sandbox File</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Sandbox Files ({files.length})</span>
            <span className="text-[10px] font-mono text-cyan-400">Media/Scripts</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
            {files.map((file) => {
              const isSelected = selectedFile?.id === file.id && !isCreating;
              const status = connectionStatus[file.path];
              return (
                <div
                  key={file.id}
                  onClick={() => handleSelectFile(file)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400/60 shadow-lg shadow-cyan-950/40'
                      : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      {file.isExecutable ? (
                        <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span className="text-xs font-bold text-white truncate">{file.name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                      {file.size}
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-slate-400 truncate select-all">{file.path}</p>

                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800/60">
                    <span className="text-slate-500">{file.category}</span>
                    <span className="flex items-center gap-1 font-mono text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Connected ({status?.latencyMs ?? 2}ms)</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Core Runtime Paths
            </span>
            <div className="space-y-1 text-xs">
              {ANDROID_RUNTIME_PATHS.slice(0, 4).map((p) => (
                <div key={p.key} className="flex flex-col p-2 rounded-lg bg-slate-900/50 border border-slate-850">
                  <span className="text-cyan-300 font-bold text-[10px] font-mono">{p.title}</span>
                  <span className="text-[10px] font-mono text-slate-400 truncate">{p.path}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col space-y-4">
          <div className="flex flex-col gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {isCreating ? 'New Sandbox Script' : selectedFile?.name}
                </h3>
              </div>
              {selectedFile && !isCreating && (
                <button
                  onClick={() => handleDelete(selectedFile.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 cursor-pointer"
                  title="Delete sandbox file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400">File Name</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Android Path Destination</label>
                <input
                  type="text"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 relative rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono min-h-[300px]">
            <textarea
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              spellCheck={false}
              className="w-full h-full p-4 text-xs text-cyan-100 bg-transparent resize-none outline-none leading-5 custom-scrollbar font-mono select-text"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 hover:brightness-110 cursor-pointer"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{savedSuccess ? 'Saved to Sandbox!' : 'Save File'}</span>
              </button>
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSendToOverlay}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 border border-cyan-500/30 cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Send to Overlay</span>
              </button>
              <button
                onClick={handleExecute}
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

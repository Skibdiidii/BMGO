import React, { useState, useEffect } from 'react';
import { Sparkles, X, History, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PATCH_NOTES_HISTORY, LATEST_VERSION } from '../services/patchNotes';
import { StorageService } from '../services/storage';

interface WhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsNewModal: React.FC<WhatsNewModalProps> = ({ isOpen, onClose }) => {
  const [selectedVersion, setSelectedVersion] = useState<string>(LATEST_VERSION);

  useEffect(() => {
    if (isOpen) {
      StorageService.setLastVersionSeen(LATEST_VERSION);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentNote = PATCH_NOTES_HISTORY.find((n) => n.version === selectedVersion) || PATCH_NOTES_HISTORY[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-[#090d16] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/40 flex flex-col max-h-[90dvh] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white tracking-wide">WHAT'S NEW IN BMGO</h3>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {LATEST_VERSION}
                </span>
              </div>
              <p className="text-xs text-slate-400">Release Notes & Version Update History</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-2.5 bg-slate-950/30 border-b border-slate-800 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium shrink-0 mr-1">
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Versions (Scroll to view):</span>
          </div>
          {PATCH_NOTES_HISTORY.map((note) => (
            <button
              key={note.version}
              onClick={() => setSelectedVersion(note.version)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
                selectedVersion === note.version
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700/80'
              }`}
            >
              {note.version} {note.version === LATEST_VERSION && '• Latest'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          <div className="bg-slate-800/40 rounded-xl p-4 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>{currentNote.title}</span>
              </h4>
              <span className="text-xs font-medium text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                {currentNote.releaseDate}
              </span>
            </div>

            <div className="space-y-1.5 mt-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Key Highlights</div>
              {currentNote.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Full Changes & Modules</span>
            </div>

            {currentNote.changes.map((group, idx) => (
              <div key={idx} className="bg-slate-900/60 rounded-xl p-3.5 border border-slate-800">
                <div className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  {group.category}
                </div>
                <ul className="space-y-1.5">
                  {group.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-xs text-slate-300 flex items-start gap-2 pl-1">
                      <span className="text-cyan-500 font-mono">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <div className="text-xs font-semibold text-slate-400 mb-2">Older Version Archive</div>
            <div className="space-y-2">
              {PATCH_NOTES_HISTORY.filter(n => n.version !== selectedVersion).map((oldNote) => (
                <div
                  key={oldNote.version}
                  onClick={() => setSelectedVersion(oldNote.version)}
                  className="p-3 bg-slate-900/40 hover:bg-slate-850 border border-slate-800/60 rounded-lg cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{oldNote.version}</span>
                      <span className="text-[11px] text-slate-400">— {oldNote.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">{oldNote.releaseDate}</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 hover:text-cyan-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">BMGO Web Client • Appilix Ready</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
          >
            Got It, Launch BMGO
          </button>
        </div>
      </div>
    </div>
  );
};

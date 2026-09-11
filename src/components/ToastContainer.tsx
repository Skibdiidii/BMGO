import React, { useState, useEffect } from 'react';
import { LuaBridge } from '../services/luaBridge';
import { ToastNotification } from '../types';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    const unsub = LuaBridge.onToast((toast) => {
      setToasts((prev) => [...prev.slice(-4), toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3500);
    });
    return unsub;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4 w-full max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="px-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700/80 shadow-2xl backdrop-blur-md text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all duration-300 animate-bounce-short pointer-events-auto"
          style={{
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)'
          }}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping mr-1"></span>
          <div className="flex flex-wrap items-center">
            {toast.segments.map((seg, idx) => (
              <span key={idx} style={{ color: seg.color }}>
                {seg.text}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

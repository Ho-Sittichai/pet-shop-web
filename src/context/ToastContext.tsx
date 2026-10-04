'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const hideToast = useCallback((id?: string) => {
    setToasts((prev) => {
      if (!id) return [];
      return prev.filter((t) => t.id !== id);
    });
    if (id && timersRef.current.has(id)) {
      clearTimeout(timersRef.current.get(id));
      timersRef.current.delete(id);
    }
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success', duration = 4500) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, message, type };

    setToasts((prev) => [...prev.slice(-3), newToast]);

    const timer = setTimeout(() => {
      hideToast(id);
    }, duration);

    timersRef.current.set(id, timer);
  }, [hideToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm sm:max-w-md w-full px-4 sm:px-0">
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';

          return (
            <div
              key={t.id}
              className={`pointer-events-auto w-full px-4 py-3 rounded-2xl border shadow-xl flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold backdrop-blur-md animate-in slide-in-from-bottom duration-200 transition-all ${
                isSuccess
                  ? 'bg-slate-900/95 text-white border-slate-800 shadow-slate-950/20'
                  : isError
                  ? 'bg-rose-950/95 text-white border-rose-800 shadow-rose-950/20'
                  : 'bg-slate-800/95 text-white border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {isError && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                {!isSuccess && !isError && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
                <span className="leading-snug">{t.message}</span>
              </div>
              <button
                type="button"
                onClick={() => hideToast(t.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

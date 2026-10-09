'use client';

import React from 'react';
import { useFinEduStore } from '@/lib/store';
import { CheckCircle2, Award, Sparkles, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const toasts = useFinEduStore((s) => s.toasts);
  const removeToast = useFinEduStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'badge':
              return <Award className="w-6 h-6 text-amber-500 animate-bounce" />;
            case 'xp':
              return <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />;
            case 'success':
              return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
            case 'info':
            default:
              return <Info className="w-6 h-6 text-blue-500" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'badge':
              return 'border-amber-500/50 bg-amber-500/10 dark:bg-amber-950/40';
            case 'xp':
              return 'border-indigo-500/50 bg-indigo-500/10 dark:bg-indigo-950/40';
            case 'success':
              return 'border-emerald-500/50 bg-emerald-500/10 dark:bg-emerald-950/40';
            case 'info':
            default:
              return 'border-blue-500/50 bg-blue-500/10 dark:bg-blue-950/40';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-xl backdrop-blur-md border ${getBorderColor()} bg-white/95 dark:bg-slate-900/95 transition-all duration-300 animate-slide-up flex items-start gap-3`}
          >
            <div className="shrink-0 mt-0.5">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                  {toast.title}
                </h4>
                {toast.xpAmount && (
                  <span className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                    +{toast.xpAmount} XP
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

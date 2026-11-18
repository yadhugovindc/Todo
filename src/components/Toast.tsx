'use client';

import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export interface ToastState {
  type: 'success' | 'error';
  message: string;
}

interface ToastProps {
  toast: ToastState | null;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-6 right-4 left-4 z-50 flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl transition-all sm:left-auto sm:max-w-sm ${
        toast.type === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-100'
          : 'border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100'
      }`}
      role="status"
    >
      {toast.type === 'success' ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
      )}
      <span className="text-sm font-medium">{toast.message}</span>
      <button
        onClick={onClose}
        className="ml-auto rounded p-0.5 hover:bg-black/5 dark:hover:bg-white/10"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

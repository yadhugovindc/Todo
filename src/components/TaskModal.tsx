'use client';

import { useState } from 'react';
import type { Task, TaskStatus } from '@/types/database';
import { X, Loader2, Plus, Pencil } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  taskToEdit?: Task | null;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    status: TaskStatus;
  }) => Promise<{ success: boolean; error?: string }>;
}

function TaskModalContent({
  mode,
  taskToEdit,
  onClose,
  onSubmit,
}: Omit<TaskModalProps, 'isOpen'>) {
  const [title, setTitle] = useState(mode === 'edit' && taskToEdit ? taskToEdit.title : '');
  const [description, setDescription] = useState(
    mode === 'edit' && taskToEdit ? taskToEdit.description || '' : ''
  );
  const [status, setStatus] = useState<TaskStatus>(
    mode === 'edit' && taskToEdit ? taskToEdit.status : 'pending'
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please provide a task title.');
      return;
    }

    if (title.trim().length > 255) {
      setError('Title cannot exceed 255 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const result = await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status,
      });

      if (!result.success) {
        setError(result.error || 'Failed to save task.');
      } else {
        onClose();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              {mode === 'create' ? <Plus className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </div>
            <h3 id="modal-title" className="text-base font-bold text-zinc-900 dark:text-white">
              {mode === 'create' ? 'Create New Task' : 'Edit Task'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
            >
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              required
              placeholder="e.g., Review project proposal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="task-desc"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5"
            >
              Description (Optional)
            </label>
            <textarea
              id="task-desc"
              rows={3}
              placeholder="Add extra details, notes, or subtasks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 resize-none"
            />
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('pending')}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition ${
                  status === 'pending'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 dark:border-amber-600 dark:bg-amber-950/40 dark:text-amber-200'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Pending
              </button>

              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-semibold transition ${
                  status === 'completed'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Completed
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{mode === 'create' ? 'Create Task' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TaskModal({
  isOpen,
  mode,
  taskToEdit,
  onClose,
  onSubmit,
}: TaskModalProps) {
  if (!isOpen) return null;

  return (
    <TaskModalContent
      key={taskToEdit?.id ?? 'create'}
      mode={mode}
      taskToEdit={taskToEdit}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

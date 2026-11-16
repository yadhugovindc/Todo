'use client';

import { useState } from 'react';
import type { Task } from '@/types/database';
import {
  Check,
  Calendar,
  Pencil,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (taskId: string, currentStatus: Task['status']) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
}

export default function TaskCard({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const isCompleted = task.status === 'completed';

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await onToggleStatus(task.id, task.status);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
      setShowConfirmDelete(false);
    }
  };

  const formattedDate = new Date(task.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`group relative rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-zinc-900/70 ${
        isCompleted
          ? 'border-emerald-200/70 bg-emerald-50/20 dark:border-emerald-900/30 dark:bg-emerald-950/10'
          : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Toggle Checkbox Button */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={isToggling}
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isCompleted
              ? 'border-emerald-600 bg-emerald-600 text-white'
              : 'border-zinc-300 bg-white hover:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800'
          }`}
        >
          {isToggling ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500 dark:text-zinc-400" />
          ) : isCompleted ? (
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          ) : null}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4
              className={`text-base font-semibold tracking-tight transition-all truncate ${
                isCompleted
                  ? 'text-zinc-400 line-through dark:text-zinc-500'
                  : 'text-zinc-900 dark:text-zinc-100'
              }`}
              title={task.title}
            >
              {task.title}
            </h4>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3" />
                  <span>Pending</span>
                </>
              )}
            </span>
          </div>

          {/* Description */}
          {task.description && (
            <p
              className={`mt-2 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                isCompleted
                  ? 'text-zinc-400 line-through dark:text-zinc-500'
                  : 'text-zinc-600 dark:text-zinc-300'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Metadata Footer */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {showConfirmDelete ? (
                <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-lg dark:bg-red-950/40">
                  <span className="text-[11px] font-medium text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Delete?
                  </span>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="rounded bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Yes'}
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    disabled={isDeleting}
                    className="rounded bg-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    No
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => onEdit(task)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                    title="Edit task"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setShowConfirmDelete(true)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition dark:text-red-400 dark:hover:bg-red-950/50"
                    title="Delete task"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

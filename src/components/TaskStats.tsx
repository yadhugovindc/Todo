import { CheckCircle2, Clock, ListTodo } from 'lucide-react';

interface TaskStatsProps {
  total: number;
  pending: number;
  completed: number;
}

export default function TaskStats({ total, pending, completed }: TaskStatsProps) {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Total Tasks */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Total Tasks
            </p>
            <h3 className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              {total}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <ListTodo className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-zinc-600 dark:text-zinc-400">
          <span>{completionRate}% completed</span>
          <div className="ml-2 h-1.5 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-1.5 rounded-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-amber-900/40 dark:bg-zinc-900/60">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Pending Tasks
            </p>
            <h3 className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              {pending}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
            <Clock className="h-6 w-6" />
          </div>
        </div>
        <p className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">
          {pending === 1 ? '1 task requires attention' : `${pending} tasks require attention`}
        </p>
      </div>

      {/* Completed Tasks */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-emerald-900/40 dark:bg-zinc-900/60">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Completed Tasks
            </p>
            <h3 className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              {completed}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
        <p className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">
          {completed === 0 ? 'No tasks completed yet' : `Great job! ${completed} finished`}
        </p>
      </div>
    </div>
  );
}

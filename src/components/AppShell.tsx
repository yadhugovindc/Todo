import type { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import ExpenseQuickAddProvider from '@/components/ExpenseQuickAdd';

interface AppShellProps {
  userEmail: string;
  title: string;
  subtitle: ReactNode;
  error?: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function AppShell({
  userEmail,
  title,
  subtitle,
  error,
  action,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      <ExpenseQuickAddProvider>
        <Sidebar userEmail={userEmail} />

        <main className="flex-1 pt-16 lg:ml-64 lg:pt-0">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                    {title}
                  </h1>
                  <p className="mt-1 truncate text-sm text-zinc-600 dark:text-zinc-400">
                    {subtitle}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-3 sm:mt-0">
                  <div className="hidden text-xs text-zinc-600 dark:text-zinc-400 sm:block">
                    {new Date().toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  {action}
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                <strong>Database Notice:</strong> {error}. Please check if the{' '}
                <code>expenses</code> and <code>incomes</code> tables and their
                RLS policies are executed in your Supabase SQL editor.
              </div>
            )}

            {children}
          </div>
        </main>
      </ExpenseQuickAddProvider>
    </div>
  );
}

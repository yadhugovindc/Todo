import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import TaskDashboard from '@/components/TaskDashboard';
import type { Task } from '@/types/database';

export const metadata = {
  title: 'Dashboard | TaskFlow',
  description: 'Manage your tasks easily with Supabase and Next.js',
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch initial tasks server-side
  const { data: rawTasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const tasks: Task[] = (rawTasks as Task[]) || [];

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <Navbar userEmail={user.email || 'User'} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Welcome back! 👋
              </h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Logged in as <span className="font-semibold text-zinc-900 dark:text-zinc-200">{user.email}</span>
              </p>
            </div>
            <div className="mt-2 sm:mt-0 text-xs text-zinc-600 dark:text-zinc-400">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <strong>Database Notice:</strong> {error.message}. Please check if the `tasks` table and RLS policies are executed in your Supabase SQL editor.
          </div>
        )}

        {/* Task Management & CRUD */}
        <TaskDashboard initialTasks={tasks} />
      </main>
    </div>
  );
}

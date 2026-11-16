'use client';

import { useTransition } from 'react';
import { logoutAction } from '@/app/actions/auth';
import { CheckSquare, LogOut, User as UserIcon, Loader2 } from 'lucide-react';

interface NavbarProps {
  userEmail: string;
}

export default function Navbar({ userEmail }: NavbarProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              TaskFlow
            </span>
            <span className="hidden text-xs text-zinc-600 dark:text-zinc-400 sm:inline sm:ml-2">
              Supabase Workspace
            </span>
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <UserIcon className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
            <span className="max-w-[150px] truncate sm:max-w-[240px] font-medium" title={userEmail}>
              {userEmail}
            </span>
          </div>

          <button
            onClick={handleLogout}
            disabled={isPending}
            aria-label="Log out"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" />
            ) : (
              <LogOut className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

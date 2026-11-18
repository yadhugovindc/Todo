'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

/**
 * Read the theme currently applied to the document.
 * Falls back to the system preference when nothing has been stored yet.
 */
function getInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  if (document.documentElement.classList.contains('dark')) return 'dark';
  return 'light';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;

    root.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* localStorage may be unavailable (private mode) — theme still applies for the session */
    }

    setTheme(next);
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
    >
      <span className="flex items-center gap-2">
        {isDark ? (
          <Moon className="h-3.5 w-3.5" />
        ) : (
          <Sun className="h-3.5 w-3.5" />
        )}
        {isDark ? 'Dark mode' : 'Light mode'}
      </span>
      <span
        className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
          isDark ? 'bg-emerald-600' : 'bg-zinc-300'
        }`}
        aria-hidden="true"
      >
        <span
          className={`absolute h-3 w-3 rounded-full bg-white shadow transition-transform ${
            isDark ? 'translate-x-3.5' : 'translate-x-0.5'
          }`}
        />
      </span>
      {/* Keeps the button width stable before hydration resolves the theme */}
      <span className="sr-only">{mounted ? '' : 'Toggle theme'}</span>
    </button>
  );
}

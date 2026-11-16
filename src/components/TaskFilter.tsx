import { Plus, Search } from 'lucide-react';
import type { TaskStatus } from '@/types/database';

export type FilterType = 'all' | TaskStatus;

interface TaskFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: {
    all: number;
    pending: number;
    completed: number;
  };
  onOpenAddModal: () => void;
}

export default function TaskFilter({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  counts,
  onOpenAddModal,
}: TaskFilterProps) {
  const filterTabs: { id: FilterType; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'pending', label: 'Pending', count: counts.pending },
    { id: 'completed', label: 'Completed', count: counts.completed },
  ];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input & Filter Tabs */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600 dark:text-zinc-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900/60">
          <span className="sr-only">Filter by status</span>
          {filterTabs.map((tab) => {
            const isActive = currentFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onFilterChange(tab.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                      : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Task Button */}
      <button
        onClick={onOpenAddModal}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.98] dark:shadow-none"
      >
        <Plus className="h-4 w-4" />
        <span>Add Task</span>
      </button>
    </div>
  );
}

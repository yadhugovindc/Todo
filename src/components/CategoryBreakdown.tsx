'use client';

import { BarChart3, TrendingUp } from 'lucide-react';

interface CategoryBreakdownProps {
  categories: {
    name: string;
    amount: number;
    percentage: number;
    color: string;
  }[];
  totalExpenses: number;
}

const categoryColors: Record<string, string> = {
  Food: '#6366f1', // indigo
  Travel: '#f59e0b', // amber
  Rent: '#ef4444', // red
  Shopping: '#ec4899', // pink
  Bills: '#8b5cf6', // violet
  Entertainment: '#14b8a6', // teal
  Others: '#78716c', // stone
};

export default function CategoryBreakdown({
  categories,
  totalExpenses,
}: CategoryBreakdownProps) {
  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Category Breakdown
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Track where your money goes
            </p>
          </div>
        </div>
        <div className="flex h-40 items-center justify-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No expenses recorded yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Category Breakdown
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Your spending by category
          </p>
        </div>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.name}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-2.5 w-2.5 items-center justify-center rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {category.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-900 dark:text-white">
                  ₹{category.amount.toLocaleString()}
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  ({category.percentage}%)
                </span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden dark:bg-zinc-800">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${category.percentage}%`,
                  backgroundColor: category.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      {categories.length > 0 && (
        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Total: ₹{totalExpenses.toLocaleString()}</span>
            <TrendingUp className="h-3.5 w-3.5" />
          </div>
        </div>
      )}
    </div>
  );
}

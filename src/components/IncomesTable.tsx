'use client';

import type { Income } from '@/types/database';
import { Pencil, Trash2, Banknote } from 'lucide-react';

interface IncomesTableProps {
  incomes: Income[];
  onEdit: (income: Income) => void;
  onDelete: (incomeId: string) => void;
  isLoading?: boolean;
}

const sourceStyles: Record<string, string> = {
  Salary: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  Freelance: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300',
  Business: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  Investments: 'bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300',
  Gifts: 'bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300',
  Other: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
};

export default function IncomesTable({
  incomes,
  onEdit,
  onDelete,
  isLoading = false,
}: IncomesTableProps) {
  const total = incomes.reduce((sum, income) => sum + income.amount, 0);

  if (incomes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 px-4 py-10 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
          <Banknote className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">No income recorded yet</h3>
        <p className="mt-1 max-w-sm text-xs text-zinc-600 dark:text-zinc-400">
          Add your salary and other income sources to see your balance
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 sm:px-4">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Source
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 sm:table-cell">
                Date
              </th>
              <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 sm:px-4">
                Amount
              </th>
              <th className="px-2 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 sm:px-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {incomes.map((income) => (
              <tr key={income.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                <td className="px-3 py-3 sm:px-4">
                  <span className="block max-w-[140px] truncate text-sm font-medium text-zinc-900 dark:text-white sm:max-w-[240px]">
                    {income.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-zinc-500 dark:text-zinc-400 sm:hidden">
                    {new Date(income.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </td>
                <td className="px-3 py-3 sm:px-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      sourceStyles[income.source] || sourceStyles.Other
                    }`}
                  >
                    {income.source}
                  </span>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {new Date(income.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </td>
                <td className="px-3 py-3 text-right sm:px-4">
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{income.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-2 py-3 sm:px-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(income)}
                      disabled={isLoading}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800 dark:hover:text-blue-400 disabled:opacity-50"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(income.id)}
                      disabled={isLoading}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">Total Income</span>
        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
          ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}

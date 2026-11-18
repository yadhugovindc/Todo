'use client';

import { TrendingUp, TrendingDown, Wallet, Banknote } from 'lucide-react';

interface SummaryCardsProps {
  totalIncome: number;
  salaryIncome: number;
  otherIncome: number;
  totalExpenses: number;
  remainingBalance: number;
  fixedRent: number;
  variableExpenses: number;
}

export default function SummaryCards({
  totalIncome,
  salaryIncome,
  otherIncome,
  totalExpenses,
  remainingBalance,
  fixedRent,
  variableExpenses,
}: SummaryCardsProps) {
  const salaryPercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
  const budgetStatus =
    salaryPercentage > 80 ? 'danger' : salaryPercentage > 60 ? 'warning' : 'good';

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Income Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Banknote className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Total Income
            </p>
            <p className="text-xl font-bold text-zinc-900 dark:text-white">
              ₹{totalIncome.toLocaleString('en-IN')}
            </p>
            <p className="truncate text-[10px] text-zinc-400 dark:text-zinc-500">
              {totalIncome === 0
                ? 'No income recorded yet'
                : `Salary ₹${salaryIncome.toLocaleString('en-IN')} · Other ₹${otherIncome.toLocaleString('en-IN')}`}
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Expenses Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Fixed Expenses
              </p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">
                ₹{fixedRent.toLocaleString()}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Rent
          </span>
        </div>
      </div>

      {/* Total Expenses Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Total Expenses
              </p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">
                ₹{totalExpenses.toLocaleString()}
              </p>
            </div>
          </div>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold ${
              budgetStatus === 'danger'
                ? 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400'
                : budgetStatus === 'warning'
                ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
            }`}
          >
            {salaryPercentage.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Remaining Balance Card */}
      <div
        className={`rounded-xl border p-5 shadow-sm ${
          remainingBalance >= 0
            ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30'
            : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              remainingBalance >= 0
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                : 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400'
            }`}
          >
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Remaining Balance
            </p>
            <p
              className={`text-xl font-bold ${
                remainingBalance >= 0
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-red-700 dark:text-red-300'
              }`}
            >
              ₹{Math.abs(remainingBalance).toLocaleString()}
              {remainingBalance < 0 ? ' (Over Budget)' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

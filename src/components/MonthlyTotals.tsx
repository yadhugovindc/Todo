import type { MonthlyTotal } from '@/lib/finance';
import { CalendarRange } from 'lucide-react';

interface MonthlyTotalsProps {
  months: MonthlyTotal[];
}

export default function MonthlyTotals({ months }: MonthlyTotalsProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
          <CalendarRange className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Monthly Totals
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Income against spending per month
          </p>
        </div>
      </div>

      {months.length === 0 ? (
        <div className="flex h-32 items-center justify-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No transactions recorded yet
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 text-xs uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <th className="py-2 pr-3 text-left font-semibold">Month</th>
                <th className="px-3 py-2 text-right font-semibold">Income</th>
                <th className="px-3 py-2 text-right font-semibold">Expenses</th>
                <th className="py-2 pl-3 text-right font-semibold">Net</th>
              </tr>
            </thead>
            <tbody>
              {months.map((month) => (
                <tr
                  key={month.key}
                  className="border-b border-zinc-50 last:border-0 dark:border-zinc-800/60"
                >
                  <td className="py-2.5 pr-3 font-medium text-zinc-800 dark:text-zinc-200">
                    {month.label}
                  </td>
                  <td className="px-3 py-2.5 text-right text-emerald-600 dark:text-emerald-400">
                    ₹{month.income.toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-2.5 text-right text-rose-600 dark:text-rose-400">
                    ₹{month.expenses.toLocaleString('en-IN')}
                  </td>
                  <td
                    className={`py-2.5 pl-3 text-right font-semibold ${
                      month.net >= 0
                        ? 'text-zinc-900 dark:text-white'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    ₹{month.net.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

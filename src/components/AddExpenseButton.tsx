'use client';

import { Plus } from 'lucide-react';
import { useExpenseQuickAdd } from '@/components/ExpenseQuickAdd';

/** Opens the global Add Expense modal; usable from any page header. */
export default function AddExpenseButton() {
  const { openAddExpense } = useExpenseQuickAdd();

  return (
    <button
      onClick={openAddExpense}
      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      <Plus className="h-4 w-4" />
      Add Expense
    </button>
  );
}

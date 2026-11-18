'use client';

import { useEffect, useState } from 'react';
import type { Expense } from '@/types/database';
import {
  updateExpense,
  deleteExpense,
  getExpenses,
} from '@/app/actions/expenses';
import ExpensesTable from '@/components/ExpensesTable';
import ExpenseForm from '@/components/ExpenseForm';
import Toast, { type ToastState } from '@/components/Toast';
import { RefreshCw } from 'lucide-react';

interface ExpensesSectionProps {
  initialExpenses: Expense[];
}

interface ExpenseFormData {
  title: string;
  amount: number;
  category: string;
  date: string;
  payment_method: string;
}

export default function ExpensesSection({
  initialExpenses,
}: ExpensesSectionProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    expense: Expense | null;
  }>({ isOpen: false, expense: null });

  // Pick up rows added through the global "Add Expense" modal
  useEffect(() => {
    setExpenses(initialExpenses);
  }, [initialExpenses]);

  const closeModal = () => setEditModal({ isOpen: false, expense: null });

  const showToast = (type: ToastState['type'], message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const result = await getExpenses();
    if (result.success && result.data) {
      setExpenses(result.data);
    }
    setIsRefreshing(false);
  };

  const handleSubmit = async (data: ExpenseFormData) => {
    if (!editModal.expense) return;

    setIsLoading(true);
    const result = await updateExpense(editModal.expense.id, data);
    setIsLoading(false);

    if (result.success && result.data) {
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === editModal.expense!.id ? result.data! : expense
        )
      );
      showToast('success', 'Expense updated successfully!');
      closeModal();
    } else {
      showToast('error', result.error || 'Failed to update expense');
    }
  };

  const handleDelete = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    setIsLoading(true);
    const result = await deleteExpense(expenseId);
    if (result.success) {
      setExpenses((prev) => prev.filter((expense) => expense.id !== expenseId));
      showToast('success', 'Expense deleted successfully!');
    } else {
      showToast('error', result.error || 'Failed to delete expense');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading}
          className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
          title="Refresh"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </div>

      <ExpensesTable
        expenses={expenses}
        onEdit={(expense) => setEditModal({ isOpen: true, expense })}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <ExpenseForm
        key={`expense-${editModal.expense?.id ?? 'new'}-${editModal.isOpen}`}
        isOpen={editModal.isOpen}
        mode="edit"
        expense={editModal.expense}
        onClose={closeModal}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

'use client';

import { useState } from 'react';
import type { Income } from '@/types/database';
import {
  createIncome,
  updateIncome,
  deleteIncome,
} from '@/app/actions/incomes';
import IncomesTable from '@/components/IncomesTable';
import IncomeForm from '@/components/IncomeForm';
import Toast, { type ToastState } from '@/components/Toast';
import { Banknote, Plus } from 'lucide-react';

interface IncomeSectionProps {
  initialIncomes: Income[];
}

interface IncomeFormData {
  title: string;
  amount: number;
  source: string;
  date: string;
}

export default function IncomeSection({ initialIncomes }: IncomeSectionProps) {
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    income: Income | null;
  }>({ isOpen: false, mode: 'create', income: null });

  const showToast = (type: ToastState['type'], message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (data: IncomeFormData) => {
    setIsLoading(true);

    if (modal.mode === 'create') {
      const result = await createIncome(data);
      if (result.success && result.data) {
        setIncomes((prev) => [result.data!, ...prev]);
        showToast('success', 'Income added successfully!');
      } else {
        showToast('error', result.error || 'Failed to add income');
      }
    } else if (modal.income) {
      const result = await updateIncome(modal.income.id, data);
      if (result.success && result.data) {
        setIncomes((prev) =>
          prev.map((income) =>
            income.id === modal.income!.id ? result.data! : income
          )
        );
        showToast('success', 'Income updated successfully!');
      } else {
        showToast('error', result.error || 'Failed to update income');
      }
    }

    setIsLoading(false);
    setModal({ isOpen: false, mode: 'create', income: null });
  };

  const handleDelete = async (incomeId: string) => {
    if (!confirm('Are you sure you want to delete this income entry?')) return;
    setIsLoading(true);
    const result = await deleteIncome(incomeId);
    if (result.success) {
      setIncomes((prev) => prev.filter((income) => income.id !== incomeId));
      showToast('success', 'Income deleted successfully!');
    } else {
      showToast('error', result.error || 'Failed to delete income');
    }
    setIsLoading(false);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <Banknote className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Income
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Salary and other income sources
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            setModal({ isOpen: true, mode: 'create', income: null })
          }
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add Income
        </button>
      </div>

      <IncomesTable
        incomes={incomes}
        onEdit={(income) => setModal({ isOpen: true, mode: 'edit', income })}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <IncomeForm
        key={`income-${modal.income?.id ?? 'new'}-${modal.isOpen}`}
        isOpen={modal.isOpen}
        mode={modal.mode}
        income={modal.income}
        onClose={() => setModal({ isOpen: false, mode: 'create', income: null })}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </section>
  );
}

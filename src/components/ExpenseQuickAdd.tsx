'use client';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createExpense } from '@/app/actions/expenses';
import ExpenseForm from '@/components/ExpenseForm';
import Toast, { type ToastState } from '@/components/Toast';

interface ExpenseFormData {
  title: string;
  amount: number;
  category: string;
  date: string;
  payment_method: string;
}

const ExpenseQuickAddContext = createContext<{
  openAddExpense: () => void;
} | null>(null);

/** Lets any component open the global "Add Expense" modal. */
export function useExpenseQuickAdd() {
  const context = useContext(ExpenseQuickAddContext);
  if (!context) {
    throw new Error('useExpenseQuickAdd must be used within ExpenseQuickAddProvider');
  }
  return context;
}

export default function ExpenseQuickAddProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (type: ToastState['type'], message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (data: ExpenseFormData) => {
    setIsLoading(true);
    const result = await createExpense(data);
    setIsLoading(false);

    if (result.success) {
      setIsOpen(false);
      showToast('success', 'Expense added successfully!');
      // Refresh server-rendered totals on whichever page is open
      router.refresh();
    } else {
      showToast('error', result.error || 'Failed to add expense');
    }
  };

  return (
    <ExpenseQuickAddContext.Provider
      value={{ openAddExpense: () => setIsOpen(true) }}
    >
      {children}

      <ExpenseForm
        key={`quick-add-${isOpen}`}
        isOpen={isOpen}
        mode="create"
        expense={null}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </ExpenseQuickAddContext.Provider>
  );
}

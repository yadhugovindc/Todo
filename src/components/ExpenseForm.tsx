'use client';

import { useState } from 'react';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '@/types/database';
import { X, Plus, Pencil, Calendar, CreditCard, Tag } from 'lucide-react';

interface ExpenseFormProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  expense?: {
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
    payment_method: string;
  } | null;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    amount: number;
    category: string;
    date: string;
    payment_method: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function ExpenseForm({
  isOpen,
  mode,
  expense,
  onClose,
  onSubmit,
  isLoading = false,
}: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    title: expense?.title || '',
    amount: expense?.amount?.toString() || '',
    category: expense?.category || '',
    date: expense?.date?.split('T')[0] || new Date().toISOString().split('T')[0],
    payment_method: expense?.payment_method || 'Cash',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const amount = parseFloat(formData.amount);
    const validationErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      validationErrors.title = 'Title is required';
    }
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      validationErrors.amount = 'Enter a valid amount';
    }
    if (!formData.category) {
      validationErrors.category = 'Select a category';
    }
    if (!formData.date) {
      validationErrors.date = 'Select a date';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSubmit({
      title: formData.title.trim(),
      amount,
      category: formData.category,
      date: formData.date,
      payment_method: formData.payment_method,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            {mode === 'create' ? (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <Plus className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Add Expense
                </h2>
              </>
            ) : (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <Pencil className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Edit Expense
                </h2>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="flex items-center gap-1.5 mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              <Tag className="h-3.5 w-3.5 text-zinc-400" />
              Expense Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Groceries, Movie tickets..."
              className={`w-full rounded-lg border bg-zinc-50 px-4 py-2.5 text-sm placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white ${
                errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="flex items-center gap-1.5 mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
              Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="0.00"
              className={`w-full rounded-lg border bg-zinc-50 px-4 py-2.5 text-sm placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white ${
                errors.amount ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
              }`}
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
            )}
          </div>

          {/* Category & Payment Method - Side by side */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="flex items-center gap-1.5 mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                <Tag className="h-3.5 w-3.5 text-zinc-400" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className={`w-full rounded-lg border bg-zinc-50 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white ${
                  errors.category ? 'border-red-500 focus:border-red-500' : ''
                }`}
              >
                <option value="">Select category</option>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-red-500">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-1.5 mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
                Payment Method
              </label>
              <select
                value={formData.payment_method}
                onChange={(e) => handleChange('payment_method', e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="flex items-center gap-1.5 mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={`w-full rounded-lg border bg-zinc-50 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white ${
                errors.date ? 'border-red-500 focus:border-red-500' : ''
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {isLoading ? (
              'Saving...'
            ) : mode === 'create' ? (
              'Add Expense'
            ) : (
              'Update Expense'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

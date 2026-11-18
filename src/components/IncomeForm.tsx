'use client';

import { useState } from 'react';
import { INCOME_SOURCES } from '@/types/database';
import { X, Plus, Pencil, Calendar, IndianRupee, Tag, Landmark } from 'lucide-react';

interface IncomeFormProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  income?: {
    id: string;
    title: string;
    amount: number;
    source: string;
    date: string;
  } | null;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    amount: number;
    source: string;
    date: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export default function IncomeForm({
  isOpen,
  mode,
  income,
  onClose,
  onSubmit,
  isLoading = false,
}: IncomeFormProps) {
  const [formData, setFormData] = useState({
    title: income?.title || '',
    amount: income?.amount?.toString() || '',
    source: income?.source || 'Salary',
    date: income?.date?.split('T')[0] || new Date().toISOString().split('T')[0],
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
    if (!formData.source) {
      validationErrors.source = 'Select a source';
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
      source: formData.source,
      date: formData.date,
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
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            {mode === 'create' ? (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <Plus className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Add Income
                </h2>
              </>
            ) : (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <Pencil className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                  Edit Income
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
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Title */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              <Tag className="h-3.5 w-3.5 text-zinc-400" />
              Income Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., November salary, Freelance project..."
              className={`w-full rounded-lg border bg-zinc-50 px-4 py-2.5 text-sm placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white ${
                errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              <IndianRupee className="h-3.5 w-3.5 text-zinc-400" />
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
            {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
          </div>

          {/* Source & Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                <Landmark className="h-3.5 w-3.5 text-zinc-400" />
                Source
              </label>
              <select
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value)}
                className={`w-full rounded-lg border bg-zinc-50 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white ${
                  errors.source ? 'border-red-500 focus:border-red-500' : ''
                }`}
              >
                {INCOME_SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
              {errors.source && <p className="mt-1 text-xs text-red-500">{errors.source}</p>}
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
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
              {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {isLoading
              ? 'Saving...'
              : mode === 'create'
              ? 'Add Income'
              : 'Update Income'}
          </button>
        </form>
      </div>
    </div>
  );
}

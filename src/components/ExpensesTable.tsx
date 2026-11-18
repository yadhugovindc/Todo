'use client';

import { useState, useMemo } from 'react';
import type { Expense } from '@/types/database';
import {
  Pencil,
  Trash2,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '@/types/database';

interface ExpensesTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expenseId: string) => void;
  isLoading?: boolean;
}

type SortField = 'date' | 'amount' | 'title' | 'category' | 'payment_method';
type SortDirection = 'asc' | 'desc';

const categoryIcons: Record<string, string> = {
  Food: '🍕',
  Travel: '✈️',
  Rent: '🏠',
  Shopping: '🛍️',
  Bills: '📄',
  Entertainment: '🎬',
  Others: '📦',
};

export default function ExpensesTable({
  expenses,
  onEdit,
  onDelete,
  isLoading = false,
}: ExpensesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterOpen, setFilterOpen] = useState(false);

  // Generate available months from expenses
  const availableMonths = useMemo(() => {
    const months = new Set<string>(['All']);
    expenses.forEach((exp) => {
      const month = exp.date.substring(0, 7); // YYYY-MM
      months.add(month);
    });
    return Array.from(months).sort().reverse();
  }, [expenses]);

  // Filter & Search & Sort
  const processedExpenses = useMemo(() => {
    return expenses
      .filter((expense) => {
        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesSearch =
            expense.title.toLowerCase().includes(query) ||
            expense.category.toLowerCase().includes(query);
          if (!matchesSearch) return false;
        }

        // Month filter
        if (selectedMonth !== 'All') {
          if (!expense.date.startsWith(selectedMonth)) return false;
        }

        // Category filter
        if (selectedCategory !== 'All') {
          if (expense.category !== selectedCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case 'date':
            comparison = a.date.localeCompare(b.date);
            break;
          case 'amount':
            comparison = a.amount - b.amount;
            break;
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'category':
            comparison = a.category.localeCompare(b.category);
            break;
          case 'payment_method':
            comparison = a.payment_method.localeCompare(b.payment_method);
            break;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [expenses, searchQuery, selectedMonth, selectedCategory, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMonth('All');
    setSelectedCategory('All');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedMonth !== 'All' ||
    selectedCategory !== 'All';

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const filteredTotal = processedExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 py-16 px-4 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 mb-4">
          <Search className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          No expenses yet
        </h3>
        <p className="mt-1 max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
          Start tracking your expenses to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative sm:shrink-0">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:w-auto sm:justify-start"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="flex h-5 min-w-[18px] items-center justify-center rounded-full bg-emerald-100 px-1.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                {hasActiveFilters ? '✓' : ''}
              </span>
            )}
            {filterOpen ? (
              <ChevronUp className="h-4 w-4 text-zinc-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            )}
          </button>

          {filterOpen && (
            <div className="absolute left-0 top-full z-20 mt-2 w-full rounded-xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-700 dark:bg-zinc-900 sm:left-auto sm:right-0 sm:w-64">
              <div className="space-y-4">
                {/* Month Filter */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                    Month
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 px-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                  >
                    {availableMonths.map((month) => {
                      const [year, mon] = month.split('-');
                      const monthName = new Date(
                        parseInt(year),
                        parseInt(mon) - 1
                      )
                        .toLocaleString('default', { month: 'long' })
                        .substring(0, 3);
                      const displayLabel =
                        month === 'All'
                          ? 'All Months'
                          : `${monthName} ${year}`;
                      return (
                        <option key={month} value={month}>
                          {displayLabel}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 px-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
                  >
                    <option value="All">All Categories</option>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="flex-1 rounded-lg bg-zinc-100 py-2 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                    >
                      Clear Filters
                    </button>
                  )}
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="flex-1 rounded-lg bg-emerald-600 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-zinc-500 dark:text-zinc-400">
        <span>
          Showing {processedExpenses.length} of {expenses.length} expenses
        </span>
        {hasActiveFilters && (
          <span className="text-emerald-600 dark:text-emerald-400">
            Total: ₹{filteredTotal.toLocaleString()}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                <th
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center gap-1">
                    Title
                    {sortField === 'title' &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center gap-1">
                    Category
                    {sortField === 'category' &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      ))}
                  </div>
                </th>
                <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 md:table-cell">
                  Payment Method
                </th>
                <th
                  className="hidden cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 sm:table-cell"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Date
                    {sortField === 'date' &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 cursor-pointer hover:text-zinc-700 dark:hover:text-zinc-200"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Amount
                    {sortField === 'amount' &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      ))}
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {processedExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30"
                >
                  <td className="px-3 py-3 sm:px-4">
                    <span className="block max-w-[160px] truncate text-sm font-medium text-zinc-900 dark:text-white sm:max-w-[240px]">
                      {expense.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-zinc-500 dark:text-zinc-400 sm:hidden">
                      {expense.payment_method} ·{' '}
                      {new Date(expense.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </td>
                  <td className="px-3 py-3 sm:px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {categoryIcons[expense.category] || '📌'}
                      </span>
                      <span className="text-sm text-zinc-700 dark:text-zinc-300">
                        {expense.category}
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {expense.payment_method}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {new Date(expense.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right sm:px-4">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      ₹{expense.amount.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </td>
                  <td className="px-2 py-3 sm:px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(expense)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-blue-600 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
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

        {/* Footer */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Filtered Total
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              ₹{filteredTotal.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        )}
      </div>

      {/* Click outside to close filter dropdown */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setFilterOpen(false)}
        />
      )}
    </div>
  );
}

import type { Expense, Income } from '@/types/database';

export interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export const CATEGORY_COLORS: Record<string, string> = {
  Food: '#6366f1',
  Travel: '#f59e0b',
  Rent: '#ef4444',
  Shopping: '#ec4899',
  Bills: '#8b5cf6',
  Entertainment: '#14b8a6',
  Others: '#78716c',
};

export interface Totals {
  totalIncome: number;
  salaryIncome: number;
  otherIncome: number;
  totalExpenses: number;
  remainingBalance: number;
  fixedRent: number;
  variableExpenses: number;
}

export function computeTotals(expenses: Expense[], incomes: Income[]): Totals {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const fixedRent = expenses
    .filter((expense) => expense.category === 'Rent')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const variableExpenses = totalExpenses - fixedRent;

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const salaryIncome = incomes
    .filter((income) => income.source === 'Salary')
    .reduce((sum, income) => sum + income.amount, 0);
  const otherIncome = totalIncome - salaryIncome;

  return {
    totalIncome,
    salaryIncome,
    otherIncome,
    totalExpenses,
    remainingBalance: totalIncome - totalExpenses,
    fixedRent,
    variableExpenses,
  };
}

export interface MonthlyTotal {
  key: string;
  label: string;
  income: number;
  expenses: number;
  net: number;
}

/** Expense/income totals per month, newest first. */
export function computeMonthlyTotals(
  expenses: Expense[],
  incomes: Income[],
  limit = 6
): MonthlyTotal[] {
  const months = new Map<string, { income: number; expenses: number }>();

  const bucket = (isoDate: string) => {
    const key = isoDate.slice(0, 7);
    if (!months.has(key)) months.set(key, { income: 0, expenses: 0 });
    return months.get(key)!;
  };

  expenses.forEach((expense) => {
    bucket(expense.date).expenses += expense.amount;
  });
  incomes.forEach((income) => {
    bucket(income.date).income += income.amount;
  });

  return Array.from(months.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .slice(0, limit)
    .map(([key, { income, expenses: monthExpenses }]) => ({
      key,
      label: new Date(`${key}-01T00:00:00`).toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
      }),
      income,
      expenses: monthExpenses,
      net: income - monthExpenses,
    }));
}

export function computeCategoryBreakdown(expenses: Expense[]): CategoryData[] {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const byCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(byCategory)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      color: CATEGORY_COLORS[name] || '#78716c',
    }))
    .sort((a, b) => b.amount - a.amount);
}

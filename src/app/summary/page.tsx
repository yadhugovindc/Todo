import AppShell from '@/components/AppShell';
import AddExpenseButton from '@/components/AddExpenseButton';
import SummaryCards from '@/components/SummaryCards';
import CategoryBreakdown from '@/components/CategoryBreakdown';
import MonthlyTotals from '@/components/MonthlyTotals';
import { getFinancialData } from '@/lib/data';
import {
  computeCategoryBreakdown,
  computeMonthlyTotals,
  computeTotals,
} from '@/lib/finance';

export const metadata = {
  title: 'Summary | Expense Tracker',
  description: 'Category breakdown and monthly spending totals',
};

export default async function SummaryPage() {
  const { user, expenses, incomes, error } = await getFinancialData();
  const totals = computeTotals(expenses, incomes);
  const categories = computeCategoryBreakdown(expenses);
  const months = computeMonthlyTotals(expenses, incomes);

  return (
    <AppShell
      userEmail={user.email || 'User'}
      title="Summary"
      subtitle={
        <>
          Logged in as{' '}
          <span className="font-semibold text-zinc-900 dark:text-zinc-200">
            {user.email}
          </span>
        </>
      }
      error={error?.message}
      action={<AddExpenseButton />}
    >
      <div className="space-y-8">
        <SummaryCards
          totalIncome={totals.totalIncome}
          salaryIncome={totals.salaryIncome}
          otherIncome={totals.otherIncome}
          usingDefaultIncome={totals.usingDefaultIncome}
          totalExpenses={totals.totalExpenses}
          remainingBalance={totals.remainingBalance}
          fixedRent={totals.fixedRent}
          variableExpenses={totals.variableExpenses}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CategoryBreakdown
            categories={categories}
            totalExpenses={totals.totalExpenses}
          />
          <MonthlyTotals months={months} />
        </div>
      </div>
    </AppShell>
  );
}

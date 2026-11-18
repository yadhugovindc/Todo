import AppShell from '@/components/AppShell';
import AddExpenseButton from '@/components/AddExpenseButton';
import SummaryCards from '@/components/SummaryCards';
import IncomeSection from '@/components/IncomeSection';
import { getFinancialData } from '@/lib/data';
import { computeTotals } from '@/lib/finance';

export const metadata = {
  title: 'Dashboard | Expense Tracker',
  description: 'Salary, rent, expenses, and remaining balance at a glance',
};

export default async function DashboardPage() {
  const { user, expenses, incomes, error } = await getFinancialData();
  const totals = computeTotals(expenses, incomes);

  return (
    <AppShell
      userEmail={user.email || 'User'}
      title="Dashboard"
      subtitle={<>Logged in as <span className="font-semibold text-zinc-900 dark:text-zinc-200">{user.email}</span></>}
      error={error?.message}
      action={<AddExpenseButton />}
    >
      <div className="space-y-8">
        <SummaryCards
          totalIncome={totals.totalIncome}
          salaryIncome={totals.salaryIncome}
          otherIncome={totals.otherIncome}
          totalExpenses={totals.totalExpenses}
          remainingBalance={totals.remainingBalance}
          fixedRent={totals.fixedRent}
          variableExpenses={totals.variableExpenses}
        />

        <IncomeSection initialIncomes={incomes} />
      </div>
    </AppShell>
  );
}

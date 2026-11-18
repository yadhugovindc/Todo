import AppShell from '@/components/AppShell';
import AddExpenseButton from '@/components/AddExpenseButton';
import ExpensesSection from '@/components/ExpensesSection';
import { getFinancialData } from '@/lib/data';

export const metadata = {
  title: 'Expenses | Expense Tracker',
  description: 'Add, edit, filter, and review every expense',
};

export default async function ExpensesPage() {
  const { user, expenses, error } = await getFinancialData();

  return (
    <AppShell
      userEmail={user.email || 'User'}
      title="All Expenses"
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
      <ExpensesSection initialExpenses={expenses} />
    </AppShell>
  );
}

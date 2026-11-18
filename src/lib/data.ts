import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Expense, Income } from '@/types/database';

/**
 * Signed-in user plus every expense and income row, fetched once per request.
 * Shared by the dashboard, expenses, and summary routes.
 */
export async function getFinancialData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [expensesResult, incomesResult] = await Promise.all([
    supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false }),
    supabase
      .from('incomes')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false }),
  ]);

  return {
    user,
    expenses: (expensesResult.data as Expense[]) || [],
    incomes: (incomesResult.data as Income[]) || [],
    error: expensesResult.error ?? incomesResult.error,
  };
}

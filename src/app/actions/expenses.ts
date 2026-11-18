'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Expense, CreateExpenseInput, UpdateExpenseInput, Database } from '@/types/database';

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetch all expenses for the authenticated user, optionally filtered by month and category
 */
export async function getExpenses(
  month?: string, // YYYY-MM format
  category?: string
): Promise<ActionResponse<Expense[]>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized. Please sign in.' };
    }

    let query = supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (month) {
      const startOfMonth = `${month}-01`;
      const year = month.split('-')[0];
      const monthNum = month.split('-')[1];
      const nextMonth = new Date(parseInt(year), parseInt(monthNum), 1);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const endOfMonth = nextMonth.toISOString().split('T')[0];
      query = query.gte('date', startOfMonth).lte('date', endOfMonth);
    }

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: (data as Expense[]) || [] };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch expenses';
    return { success: false, error: errorMessage };
  }
}

/** 
 * Create a new expense for the authenticated user
 */
export async function createExpense(input: CreateExpenseInput): Promise<ActionResponse<Expense>> {
  try {
    const { title, amount, category, date, payment_method } = input;

    if (!title || !title.trim()) {
      return { success: false, error: 'Expense title is required.' };
    }

    if (!amount || amount <= 0) {
      return { success: false, error: 'Amount must be greater than 0.' };
    }

    if (!category) {
      return { success: false, error: 'Category is required.' };
    }

    if (!date) {
      return { success: false, error: 'Date is required.' };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized. Please sign in.' };
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        title: title.trim(),
        amount,
        category,
        date,
        payment_method: payment_method || 'Cash',
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, data: data as Expense };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create expense';
    return { success: false, error: errorMessage };
  }
}

/** 
 * Update an existing expense
 */
export async function updateExpense(
  expenseId: string,
  updates: UpdateExpenseInput
): Promise<ActionResponse<Expense>> {
  try {
    if (!expenseId) {
      return { success: false, error: 'Expense ID is required.' };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized. Please sign in.' };
    }

    const updatePayload: Database['public']['Tables']['expenses']['Update'] = {};

    if (updates.title !== undefined) {
      const cleanTitle = updates.title.trim();
      if (!cleanTitle) {
        return { success: false, error: 'Expense title cannot be empty.' };
      }
      updatePayload.title = cleanTitle;
    }

    if (updates.amount !== undefined) {
      if (updates.amount <= 0) {
        return { success: false, error: 'Amount must be greater than 0.' };
      }
      updatePayload.amount = updates.amount;
    }

    if (updates.category !== undefined) {
      updatePayload.category = updates.category;
    }

    if (updates.date !== undefined) {
      updatePayload.date = updates.date;
    }

    if (updates.payment_method !== undefined) {
      updatePayload.payment_method = updates.payment_method;
    }

    const { data, error } = await supabase
      .from('expenses')
      .update(updatePayload)
      .eq('id', expenseId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, data: data as Expense };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to update expense';
    return { success: false, error: errorMessage };
  }
}

/** 
 * Delete an expense
 */
export async function deleteExpense(expenseId: string): Promise<ActionResponse<null>> {
  try {
    if (!expenseId) {
      return { success: false, error: 'Expense ID is required.' };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized. Please sign in.' };
    }

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, data: null };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to delete expense';
    return { success: false, error: errorMessage };
  }
}

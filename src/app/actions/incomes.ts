'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Income, CreateIncomeInput, UpdateIncomeInput, Database } from '@/types/database';

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetch all income entries for the authenticated user
 */
export async function getIncomes(): Promise<ActionResponse<Income[]>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized. Please sign in.' };
    }

    const { data, error } = await supabase
      .from('incomes')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: (data as Income[]) || [] };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch incomes';
    return { success: false, error: errorMessage };
  }
}

/**
 * Create a new income entry for the authenticated user
 */
export async function createIncome(input: CreateIncomeInput): Promise<ActionResponse<Income>> {
  try {
    const { title, amount, source, date } = input;

    if (!title || !title.trim()) {
      return { success: false, error: 'Income title is required.' };
    }

    if (!amount || amount <= 0) {
      return { success: false, error: 'Amount must be greater than 0.' };
    }

    if (!source) {
      return { success: false, error: 'Income source is required.' };
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
      .from('incomes')
      .insert({
        user_id: user.id,
        title: title.trim(),
        amount,
        source,
        date,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, data: data as Income };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create income';
    return { success: false, error: errorMessage };
  }
}

/**
 * Update an existing income entry
 */
export async function updateIncome(
  incomeId: string,
  updates: UpdateIncomeInput
): Promise<ActionResponse<Income>> {
  try {
    if (!incomeId) {
      return { success: false, error: 'Income ID is required.' };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized. Please sign in.' };
    }

    const updatePayload: Database['public']['Tables']['incomes']['Update'] = {};

    if (updates.title !== undefined) {
      const cleanTitle = updates.title.trim();
      if (!cleanTitle) {
        return { success: false, error: 'Income title cannot be empty.' };
      }
      updatePayload.title = cleanTitle;
    }

    if (updates.amount !== undefined) {
      if (updates.amount <= 0) {
        return { success: false, error: 'Amount must be greater than 0.' };
      }
      updatePayload.amount = updates.amount;
    }

    if (updates.source !== undefined) {
      updatePayload.source = updates.source;
    }

    if (updates.date !== undefined) {
      updatePayload.date = updates.date;
    }

    const { data, error } = await supabase
      .from('incomes')
      .update(updatePayload)
      .eq('id', incomeId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, data: data as Income };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to update income';
    return { success: false, error: errorMessage };
  }
}

/**
 * Delete an income entry
 */
export async function deleteIncome(incomeId: string): Promise<ActionResponse<null>> {
  try {
    if (!incomeId) {
      return { success: false, error: 'Income ID is required.' };
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
      .from('incomes')
      .delete()
      .eq('id', incomeId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, data: null };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to delete income';
    return { success: false, error: errorMessage };
  }
}

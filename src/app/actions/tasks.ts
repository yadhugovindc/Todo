'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Task, TaskStatus, Database } from '@/types/database';

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetch all tasks for the authenticated user, optionally filtered by status
 */
export async function getTasks(filter: 'all' | 'pending' | 'completed' = 'all'): Promise<ActionResponse<Task[]>> {
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
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (filter === 'pending' || filter === 'completed') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: (data as Task[]) || [] };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
    return { success: false, error: errorMessage };
  }
}

/**
 * Create a new task for the authenticated user
 */
export async function createTask(formData: {
  title: string;
  description?: string;
}): Promise<ActionResponse<Task>> {
  try {
    const title = formData.title?.trim();
    const description = formData.description?.trim() || '';

    if (!title) {
      return { success: false, error: 'Task title is required.' };
    }

    if (title.length > 255) {
      return { success: false, error: 'Task title cannot exceed 255 characters.' };
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
      .from('tasks')
      .insert({
        user_id: user.id,
        title,
        description,
        status: 'pending' as TaskStatus,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, data: data as Task };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
    return { success: false, error: errorMessage };
  }
}

/**
 * Update an existing task
 */
export async function updateTask(
  taskId: string,
  updates: {
    title?: string;
    description?: string;
    status?: TaskStatus;
  }
): Promise<ActionResponse<Task>> {
  try {
    if (!taskId) {
      return { success: false, error: 'Task ID is required.' };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized. Please sign in.' };
    }

    const updatePayload: Database['public']['Tables']['tasks']['Update'] = {};

    if (updates.title !== undefined) {
      const cleanTitle = updates.title.trim();
      if (!cleanTitle) {
        return { success: false, error: 'Task title cannot be empty.' };
      }
      if (cleanTitle.length > 255) {
        return { success: false, error: 'Task title cannot exceed 255 characters.' };
      }
      updatePayload.title = cleanTitle;
    }

    if (updates.description !== undefined) {
      updatePayload.description = updates.description.trim();
    }

    if (updates.status !== undefined) {
      if (updates.status !== 'pending' && updates.status !== 'completed') {
        return { success: false, error: 'Invalid task status.' };
      }
      updatePayload.status = updates.status;
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updatePayload)
      .eq('id', taskId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, data: data as Task };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
    return { success: false, error: errorMessage };
  }
}

/**
 * Toggle task status between pending and completed
 */
export async function toggleTaskStatus(
  taskId: string,
  currentStatus: TaskStatus
): Promise<ActionResponse<Task>> {
  const nextStatus: TaskStatus = currentStatus === 'pending' ? 'completed' : 'pending';
  return updateTask(taskId, { status: nextStatus });
}

/**
 * Delete a task
 */
export async function deleteTask(taskId: string): Promise<ActionResponse<null>> {
  try {
    if (!taskId) {
      return { success: false, error: 'Task ID is required.' };
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
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard');
    return { success: true, data: null };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
    return { success: false, error: errorMessage };
  }
}

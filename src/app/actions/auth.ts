'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface AuthResponse {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function loginAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/dashboard');
}

export async function registerAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email')?.toString().trim();
  const password = formData.get('password')?.toString();
  const confirmPassword = formData.get('confirmPassword')?.toString();

  if (!email || !password) {
    return { error: 'All fields are required.' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  if (confirmPassword && password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // If Supabase has email confirmation enabled, user session might not be active immediately
  if (data.user && data.session === null) {
    return {
      success: true,
      message: 'Account created! Please check your email to confirm your account, then log in.',
    };
  }

  redirect('/dashboard');
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

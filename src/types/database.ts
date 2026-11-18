export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Expense = {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  payment_method: string;
  created_at: string;
  updated_at: string;
};

export type CreateExpenseInput = {
  title: string;
  amount: number;
  category: string;
  date: string;
  payment_method: string;
};

export type UpdateExpenseInput = {
  title?: string;
  amount?: number;
  category?: string;
  date?: string;
  payment_method?: string;
};

export type Income = {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  source: string;
  date: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
};

export type CreateIncomeInput = {
  title: string;
  amount: number;
  source: string;
  date: string;
};

export type UpdateIncomeInput = {
  title?: string;
  amount?: number;
  source?: string;
  date?: string;
};

export interface Database {
  public: {
    Tables: {
      expenses: {
        Row: Expense;
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          amount: number;
          category?: string;
          date?: string;
          payment_method?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          amount?: number;
          category?: string;
          date?: string;
          payment_method?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      incomes: {
        Row: Income;
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          amount: number;
          source?: string;
          date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          amount?: number;
          source?: string;
          date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export const EXPENSE_CATEGORIES = [
  'Food',
  'Travel',
  'Rent',
  'Shopping',
  'Bills',
  'Entertainment',
  'Others',
] as const;

export const INCOME_SOURCES = [
  'Salary',
  'Freelance',
  'Business',
  'Investments',
  'Gifts',
  'Other',
] as const;

export const PAYMENT_METHODS = [
  'Cash',
  'UPI',
  'Card',
  'Wallet',
  'Net Banking',
] as const;

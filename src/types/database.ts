export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TaskStatus = 'pending' | 'completed';

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
};

export type CreateTaskInput = {
  title: string;
  description?: string;
  status?: TaskStatus;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string;
  status?: TaskStatus;
};

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: Task;
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          status?: TaskStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          status?: TaskStatus;
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

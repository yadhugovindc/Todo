-- ==============================================================================
-- Full-Stack To-Do List Application: Database Schema & Row Level Security (RLS)
-- Run this script in the Supabase SQL Editor
-- ==============================================================================

-- 1. Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    title VARCHAR(255) NOT NULL CHECK (char_length(trim(title)) > 0),
    description TEXT DEFAULT '',
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_created ON public.tasks(user_id, created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- SELECT: Users can only read their own tasks
CREATE POLICY "Users can view their own tasks"
    ON public.tasks
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- INSERT: Users can only insert tasks where user_id matches their authenticated UID
CREATE POLICY "Users can insert their own tasks"
    ON public.tasks
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own tasks
CREATE POLICY "Users can update their own tasks"
    ON public.tasks
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own tasks
CREATE POLICY "Users can delete their own tasks"
    ON public.tasks
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 5. Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_tasks_updated_at ON public.tasks;
CREATE TRIGGER trigger_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

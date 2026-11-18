-- ==============================================================================
-- Personal Expense Tracker: Database Schema & Row Level Security (RLS)
-- Run this entire script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ==============================================================================

-- 1. Create expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    title VARCHAR(255) NOT NULL CHECK (char_length(trim(title)) > 0),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL DEFAULT 'Others',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(50) DEFAULT 'Cash',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create performance indexes for expenses
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_user_category ON public.expenses(user_id, category);

-- 3. Enable Row Level Security (RLS) for expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for expenses
DROP POLICY IF EXISTS "Users can view their own expenses" ON public.expenses;
CREATE POLICY "Users can view their own expenses"
    ON public.expenses
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own expenses" ON public.expenses;
CREATE POLICY "Users can insert their own expenses"
    ON public.expenses
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own expenses" ON public.expenses;
CREATE POLICY "Users can update their own expenses"
    ON public.expenses
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own expenses" ON public.expenses;
CREATE POLICY "Users can delete their own expenses"
    ON public.expenses
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 5. Auto-update updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_expenses_updated_at ON public.expenses;
CREATE TRIGGER trigger_expenses_updated_at
    BEFORE UPDATE ON public.expenses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- Income tracking (salary and other income sources)
-- ==============================================================================

-- 6. Create incomes table
CREATE TABLE IF NOT EXISTS public.incomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    title VARCHAR(255) NOT NULL CHECK (char_length(trim(title)) > 0),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    source VARCHAR(50) NOT NULL DEFAULT 'Other',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Create performance indexes for incomes
CREATE INDEX IF NOT EXISTS idx_incomes_user_id ON public.incomes(user_id);
CREATE INDEX IF NOT EXISTS idx_incomes_user_date ON public.incomes(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_incomes_user_source ON public.incomes(user_id, source);

-- 8. Enable Row Level Security (RLS) for incomes
ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies for incomes
DROP POLICY IF EXISTS "Users can view their own incomes" ON public.incomes;
CREATE POLICY "Users can view their own incomes"
    ON public.incomes
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own incomes" ON public.incomes;
CREATE POLICY "Users can insert their own incomes"
    ON public.incomes
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own incomes" ON public.incomes;
CREATE POLICY "Users can update their own incomes"
    ON public.incomes
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own incomes" ON public.incomes;
CREATE POLICY "Users can delete their own incomes"
    ON public.incomes
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 10. Auto-update updated_at timestamp trigger for incomes
DROP TRIGGER IF EXISTS trigger_incomes_updated_at ON public.incomes;
CREATE TRIGGER trigger_incomes_updated_at
    BEFORE UPDATE ON public.incomes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

# TaskFlow — Full-Stack To-Do List Application

A modern, responsive, and secure To-Do List application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL + Auth)**, configured for deployment on **Vercel**.

---

## 🚀 Features

- **Authentication (Supabase Auth)**:
  - User Registration with email & password.
  - User Login with secure session handling.
  - User Logout.
  - Route protection via Next.js Middleware.
  - Automatic redirect for unauthenticated users to `/login`.
- **Dashboard & Task Management (CRUD)**:
  - Welcome greeting showing the authenticated user's email.
  - Real-time task statistics: Total, Pending, and Completed counters with completion progress bar.
  - Create new tasks with title, description, and status.
  - Edit existing tasks.
  - Mark tasks as completed / pending with single-click toggle.
  - Delete tasks with confirmation dialog.
  - Filter tasks by **All**, **Pending**, and **Completed**.
  - Instant client-side search across task titles and descriptions.
  - Optimistic UI updates with rollback on error.
- **Enterprise-Grade Security**:
  - PostgreSQL Row Level Security (RLS).
  - Users can strictly access, insert, update, or delete only their own tasks.
  - Client credentials never expose service-role keys.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL & Supabase Auth with `@supabase/ssr`)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📂 Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/      # Sign-in page
│   │   │   └── register/   # Registration page
│   │   ├── actions/
│   │   │   ├── auth.ts     # Server Actions: login, register, logout
│   │   │   └── tasks.ts    # Server Actions: CRUD operations on tasks
│   │   ├── auth/callback/  # Supabase OAuth/email confirmation route handler
│   │   ├── dashboard/      # Protected dashboard page
│   │   ├── layout.tsx      # Root application layout
│   │   └── page.tsx        # Root entry redirecting to /dashboard or /login
│   ├── components/
│   │   ├── Navbar.tsx      # Header navigation bar with user profile & logout
│   │   ├── TaskCard.tsx    # Individual task card with status badge & actions
│   │   ├── TaskDashboard.tsx # Client dashboard state, filtering, search, toasts
│   │   ├── TaskFilter.tsx  # Filter tabs & search bar
│   │   ├── TaskModal.tsx   # Modal dialog for creating & editing tasks
│   │   └── TaskStats.tsx   # Metric cards for Total, Pending, Completed
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts   # Browser Supabase client (createBrowserClient)
│   │       ├── middleware.ts # Session refresh & route protection helper
│   │       └── server.ts   # Server Supabase client (createServerClient)
│   ├── middleware.ts       # Next.js middleware for auth & route guarding
│   └── types/
│       └── database.ts     # TypeScript schema and database types
├── supabase/
│   └── schema.sql          # Complete SQL schema & Row Level Security policies
├── .env.example            # Environment variables template
└── README.md
```

---

## 🗄️ Database Setup (Supabase)

### 1. Create a Supabase Project
1. Log in to your [Supabase Dashboard](https://app.supabase.com/).
2. Click **New Project**, choose an organization, assign a project name, and set a database password.
3. Select your preferred region and click **Create new project**.

### 2. Run the Database SQL Schema
1. Open the **SQL Editor** tab in the left sidebar of your Supabase dashboard.
2. Click **New query**.
3. Copy the entire contents of [`supabase/schema.sql`](./supabase/schema.sql) and paste it into the query editor:

```sql
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

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_created ON public.tasks(user_id, created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Users can view their own tasks"
    ON public.tasks FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
    ON public.tasks FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
    ON public.tasks FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
    ON public.tasks FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- 5. Updated_at trigger
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
```
4. Click **Run** to execute the script.

### 3. Retrieve Supabase Credentials
1. In Supabase, go to **Project Settings** -> **API**.
2. Copy the **Project URL** (`https://xyzcompany.supabase.co`).
3. Under **Project API keys**, copy the `anon` / `public` key.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> [!NOTE]
> Never use or commit the `service_role` key in `.env.local` or client-side code. Only the public anonymous key (`anon`) is required. Row Level Security ensures safety.

---

## 💻 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

4. Run code validation and tests:
   ```bash
   npm run lint
   npm run build
   ```

---

## 🚢 Deployment to Vercel

### Step 1: Push Code to GitHub
1. Initialize Git and commit your files:
   ```bash
   git add .
   git commit -m "feat: complete full-stack todo application"
   ```
2. Create a repository on [GitHub](https://github.com/new).
3. Push your repository:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Import into Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Select your GitHub repository and click **Import**.
4. In the **Configure Project** screen:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
5. Expand **Environment Variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project-id.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-supabase-anon-key`
6. Click **Deploy**.

### Step 3: Configure Supabase Auth Site URL
1. In the Supabase Dashboard, go to **Authentication** -> **URL Configuration**.
2. Set **Site URL** to your deployed Vercel domain (e.g., `https://your-app.vercel.app`).
3. Under **Redirect URLs**, add `https://your-app.vercel.app/**`.
4. Click **Save**.

---

## ✅ Production Verification Checklist

1. **User Registration**:
   - Navigate to `/register`.
   - Create an account with email and password (minimum 6 characters).
2. **User Login**:
   - Navigate to `/login`.
   - Sign in with the registered credentials.
3. **Route Protection**:
   - Try navigating to `/dashboard` in an incognito window without logging in: you should be redirected to `/login`.
   - Try navigating to `/login` while logged in: you should be redirected to `/dashboard`.
4. **Task CRUD Operations**:
   - **Create**: Click "Add Task", fill in title and description, and submit.
   - **View**: Verify the new task appears in the grid and the "Total Tasks" and "Pending Tasks" counters increment.
   - **Status Toggle**: Click the checkmark circle to mark the task completed. Watch the "Completed Tasks" counter update and the strikethrough effect apply.
   - **Edit**: Click "Edit", modify title or description, and save.
   - **Filter**: Filter by "Pending" or "Completed" and test the search bar.
   - **Delete**: Click "Delete" -> confirm "Yes", and ensure the card is removed.
5. **Row Level Security (RLS) Verification**:
   - Log out and register a second test user.
   - Observe that the second user's dashboard is completely clean and none of the first user's tasks are visible.

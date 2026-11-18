import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Expense Tracker | Manage Your Finances",
  description: "A simple, modern personal expense tracking application built with Next.js, Tailwind CSS, and Supabase.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%2310b981%22/><text x=%2250%22 y=%2270%22 text-anchor=%22middle%22 font-size=%2250%22 fill=%22white%22 font-family=%22Arial%22>₹</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

/**
 * Applies the saved theme before first paint to avoid a light-mode flash.
 * Runs inline, so it must stay small and dependency-free.
 */
const themeScript = `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
        {children}
      </body>
    </html>
  );
}

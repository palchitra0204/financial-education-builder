import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FinEdu Builder - Interactive Financial Education & Module Authoring Platform',
  description:
    'A production-quality, modern financial education platform featuring interactive lessons, real-time calculators, quizzes, progress tracking, and full module authoring tools.',
  keywords: [
    'Financial Education',
    'Stock Market Basics',
    'Compound Interest Calculator',
    'SIP Calculator',
    'Loan EMI Calculator',
    'Portfolio Diversification',
    'Curriculum Builder',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

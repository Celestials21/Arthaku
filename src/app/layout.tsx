import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';

import { AuthGuard } from '@/components/layout/AuthGuard';

export const metadata: Metadata = {
  title: 'Aplikasi ArthaKu - Pencatat Keuangan Bulanan',
  description: 'Aplikasi pencatat keuangan bulanan yang responsif dan mudah digunakan dengan fitur Role-Based Access Control (Admin & User).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <AuthGuard>
            <Navbar />
            <div className="flex flex-1 max-w-7xl w-full mx-auto">
              <Sidebar />
              <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-8 min-w-0">
                {children}
              </main>
            </div>
            <BottomNav />
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ClientLayout } from '@/components/layout/ClientLayout';

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
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

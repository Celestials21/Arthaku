'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { AuthGuard } from '@/components/layout/AuthGuard';

export const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return (
      <div 
        className="min-h-screen flex flex-col relative bg-slate-950 items-center justify-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1506744626753-1fa44df14dd4?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-0" />
        <main className="relative z-10 w-full max-w-md mx-auto min-h-screen flex flex-col shadow-2xl bg-slate-950/80 border-x border-slate-800/50">
          {children}
        </main>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div 
        className="min-h-screen flex flex-col relative bg-slate-950"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1506744626753-1fa44df14dd4?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay gelap agar teks/konten tetap mudah dibaca. Semakin kecil angkanya, semakin terang gambarnya */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-0" />
        
        {/* Konten Dashboard (Mobile-Only Constraint) */}
        <div className="relative z-10 flex flex-col min-h-screen w-full max-w-[480px] mx-auto shadow-2xl bg-slate-950/90 border-x border-slate-800/50">
          <Navbar />
          <main className="flex-1 p-4 pb-24 min-w-0">
            {children}
          </main>
          <BottomNav />
        </div>
      </div>
    </AuthGuard>
  );
};

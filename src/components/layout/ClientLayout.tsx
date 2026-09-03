'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { AuthGuard } from '@/components/layout/AuthGuard';

export const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) {
    return (
      <main className="min-w-0">
        {children}
      </main>
    );
  }

  return (
    <AuthGuard>
      <div 
        className="min-h-screen flex flex-col relative"
        style={{
          // 👇 PASTIKAN LINK BERAKHIRAN .jpg, .png, ATAU .webp (Direct Image Link) 👇
          backgroundImage: 'url("https://images.unsplash.com/photo-1506744626753-1fa44df14dd4?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay gelap agar teks/konten tetap mudah dibaca. Semakin kecil angkanya, semakin terang gambarnya */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-0" />
        
        {/* Konten Dashboard (z-10 agar berada di atas background) */}
        <div className="relative z-10 flex flex-col flex-1">
          <Navbar />
          <div className="flex flex-1 max-w-7xl w-full mx-auto">
            <Sidebar />
            <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-8 min-w-0">
              {children}
            </main>
          </div>
          <BottomNav />
        </div>
      </div>
    </AuthGuard>
  );
};

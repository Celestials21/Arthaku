'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/login' && pathname !== '/register') {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Allow rendering of auth pages without auth
  if (pathname === '/login' || pathname === '/register') {
    return <>{children}</>;
  }

  // Hide content until authenticated
  if (!isAuthenticated || isLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-500 font-bold">Memuat...</div>;
  }

  return <>{children}</>;
};

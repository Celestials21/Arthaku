'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, PlusCircle, PieChart, Tags, Shield, User } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { role } = useAuth();

  const navItems = [
    {
      label: 'Ringkasan Utama',
      href: '/',
      icon: LayoutDashboard,
      roles: ['user', 'admin'],
    },
    {
      label: 'Catat Transaksi',
      href: '/transactions',
      icon: PlusCircle,
      roles: ['user', 'admin'],
    },
    {
      label: 'Rekap Bulanan (Admin)',
      href: '/admin',
      icon: PieChart,
      roles: ['admin'],
    },
    {
      label: 'Manajemen Kategori',
      href: '/admin/categories',
      icon: Tags,
      roles: ['admin'],
    },
  ];

  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-4 min-h-[calc(100vh-4rem)]">
      <div className="mb-6 px-3 py-2 bg-slate-800/40 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          {role === 'admin' ? (
            <Shield className="w-4 h-4 text-indigo-400" />
          ) : (
            <User className="w-4 h-4 text-emerald-400" />
          )}
          <span>Mode: {role === 'admin' ? 'Administrator' : 'Pengguna (User)'}</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="mt-auto p-3 text-center rounded-xl bg-slate-950/60 border border-slate-800/60">
        <p className="text-[11px] text-slate-500">Aplikasi Keuangan Bulanan v1.0</p>
        <p className="text-[10px] text-emerald-400 font-medium">Responsive & Role-Based</p>
      </div>
    </aside>
  );
};

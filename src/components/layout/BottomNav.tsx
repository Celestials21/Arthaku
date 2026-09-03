'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, PlusCircle, PieChart, Tags } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { role } = useAuth();

  const navItems = [
    {
      label: 'Beranda',
      href: '/',
      icon: LayoutDashboard,
      roles: ['user', 'admin'],
    },
    {
      label: 'Input',
      href: '/transactions',
      icon: PlusCircle,
      roles: ['user', 'admin'],
    },
    {
      label: 'Rekap Admin',
      href: '/admin',
      icon: PieChart,
      roles: ['admin'],
    },
    {
      label: 'Kategori',
      href: '/admin/categories',
      icon: Tags,
      roles: ['admin'],
    },
  ];

  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2">
      <nav className="flex items-center justify-around">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

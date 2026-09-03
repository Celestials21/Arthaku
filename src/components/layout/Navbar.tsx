'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Wallet, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { role, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Wallet className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              ArthaKu
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              PENCATAT KEUANGAN BULANAN
            </p>
          </div>
        </div>

          {/* Logout Button & User Badge */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-xl border border-slate-700/40 text-xs mr-2">
              <div className={`w-2 h-2 rounded-full ${role === 'admin' ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-400 animate-pulse'}`} />
              <span className="text-slate-300 font-medium truncate max-w-[120px]">
                {role === 'admin' ? 'Admin Mode' : 'User Mode'}
              </span>
            </div>

            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30 transition-all text-xs font-bold"
            >
              Keluar
            </button>
          </div>
      </div>
    </header>
  );
};

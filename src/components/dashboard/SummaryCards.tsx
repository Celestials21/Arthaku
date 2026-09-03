'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Wallet, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';

export const SummaryCards: React.FC = () => {
  const { transactions, role } = useAuth();

  // Format currency helper
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const currentBalance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {/* Primary Card: Current Balance */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 rounded-2xl p-5 text-white shadow-xl shadow-emerald-900/20 border border-emerald-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
            Saldo / Uang Saat Ini
          </span>
          <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
            <Wallet className="w-5 h-5 text-emerald-200" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {formatIDR(currentBalance)}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-emerald-100">
          <span>Status Keuangan</span>
          <span className="font-semibold bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-400/20">
            {currentBalance >= 0 ? 'Surplus' : 'Defisit'}
          </span>
        </div>
      </div>

      {/* Admin Extra Card: Total Income */}
      {role === 'admin' && (
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-lg text-slate-100 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Pemasukan
            </span>
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {formatIDR(totalIncome)}
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Dari {transactions.filter((t) => t.type === 'income').length} transaksi
          </p>
        </div>
      )}

      {/* Admin Extra Card: Total Expense */}
      {role === 'admin' && (
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-lg text-slate-100 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Pengeluaran
            </span>
            <div className="p-2 bg-rose-500/10 rounded-xl">
              <TrendingDown className="w-5 h-5 text-rose-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-400">
            {formatIDR(totalExpense)}
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Dari {transactions.filter((t) => t.type === 'expense').length} transaksi
          </p>
        </div>
      )}
    </div>
  );
};

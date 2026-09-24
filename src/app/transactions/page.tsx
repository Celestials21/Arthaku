'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { SmartInsights } from '@/components/dashboard/SmartInsights';
import { BudgetTracker } from '@/components/dashboard/BudgetTracker';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { LayoutDashboard } from 'lucide-react';

export default function TransactionsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>Beranda Saldo</span>
            <LayoutDashboard className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-xs text-slate-400">
            Pantau ringkasan saldo dan riwayat transaksi harian Anda.
          </p>
        </div>
      </div>

      {/* Kartu Informasi Saldo / Uang Saat Ini */}
      <SummaryCards />
      
      {/* Peringatan & Saran Cerdas */}
      <SmartInsights />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grafik Analisis Pengeluaran */}
        <div className="md:col-span-1">
          <AnalyticsChart />
        </div>
        
        {/* Batas Anggaran */}
        <div className="md:col-span-1">
          <BudgetTracker />
        </div>
      </div>

      {/* Tabel / Daftar Riwayat Transaksi */}
      <TransactionList
        limit={10}
        onEditTransaction={(tx) => {
          router.push(`/?editId=${tx.id}`);
        }}
      />
    </div>
  );
}


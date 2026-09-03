'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AdminMonthlyReport } from '@/components/dashboard/AdminMonthlyReport';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { TransactionForm } from '@/components/dashboard/TransactionForm';
import { Transaction } from '@/lib/types';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  const { role } = useAuth();
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  if (role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-slate-900 rounded-2xl p-8 border border-slate-800 text-center shadow-2xl">
        <ShieldAlert className="w-14 h-14 text-rose-500 mx-auto mb-4 animate-bounce" />
        <h2 className="text-xl font-black text-white">Akses Terbatas untuk Admin</h2>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Halaman Dashboard Rekap Bulanan ini khusus disiapkan untuk pengguna dengan rute dan hak akses <strong>Admin</strong>.
        </p>
        <div className="mt-6 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-300">
          💡 Klik tombol switcher <strong>"Admin"</strong> pada navigasi di kanan atas layar untuk menguji tampilan ini secara langsung.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Admin Title Badge */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <span>Dashboard Administrator</span>
          </h1>
          <p className="text-xs text-slate-400">
            Akses statistik penuh, rekapitulasi bulanan, filter historis, dan manajemen transaksi.
          </p>
        </div>
      </div>

      {/* 1. Dashboard Keseluruhan & Rekap Bulanan */}
      <AdminMonthlyReport />

      {/* 2. Form Edit/Input & Manajemen Transaksi Lengkap (Edit & Hapus) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {editingTx && (
          <div className="lg:col-span-5">
            <TransactionForm
              editData={editingTx}
              onCancelEdit={() => setEditingTx(null)}
              onSuccess={() => setEditingTx(null)}
            />
          </div>
        )}

        <div className={editingTx ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <TransactionList
            onEditTransaction={(tx) => setEditingTx(tx)}
          />
        </div>
      </div>
    </div>
  );
}

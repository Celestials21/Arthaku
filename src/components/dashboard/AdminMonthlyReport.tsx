'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PieChart, Calendar, TrendingUp, TrendingDown, Wallet, Download } from 'lucide-react';
import { exportTransactionsToPdf } from '@/lib/pdfExporter';

export const AdminMonthlyReport: React.FC = () => {
  const { transactions, user } = useAuth();

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());

  const months = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
  ];

  const years = [2024, 2025, 2026, 2027];

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const monthlyTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() + 1 === Number(selectedMonth) && d.getFullYear() === Number(selectedYear);
  });

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const monthlyExpense = monthlyTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const netBalance = monthlyIncome - monthlyExpense;

  const expenseByCategory: Record<string, number> = {};
  monthlyTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const catName = t.category_name || 'Lainnya';
      expenseByCategory[catName] = (expenseByCategory[catName] || 0) + Number(t.amount);
    });

  const handleExportPdf = () => {
    const monthObj = months.find((m) => m.value === selectedMonth);
    exportTransactionsToPdf({
      transactions: monthlyTransactions,
      title: `Rekapitulasi Keuangan Bulanan`,
      userEmail: user?.email || 'lutfi.maulana.rusli@gmail.com',
      monthLabel: monthObj?.label,
      yearLabel: selectedYear,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-400" />
            <span>Dashboard Keseluruhan & Rekap Bulanan</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Analisis detail performa keuangan dan statistik per bulan untuk Administrator.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Month & Year Selectors */}
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value} className="bg-slate-900 text-white">
                  {m.label}
                </option>
              ))}
            </select>

            <span className="text-slate-600">/</span>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y} className="bg-slate-900 text-white">
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Export PDF Button */}
          <button
            onClick={handleExportPdf}
            disabled={monthlyTransactions.length === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-900/30 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Cetak PDF Rekap Bulanan</span>
          </button>
        </div>
      </div>

      {/* Monthly Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Pemasukan
            </span>
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {formatIDR(monthlyIncome)}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Periode: {months.find((m) => m.value === selectedMonth)?.label} {selectedYear}
          </p>
        </div>

        {/* Total Expense */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Pengeluaran
            </span>
            <div className="p-2 bg-rose-500/10 rounded-xl">
              <TrendingDown className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400">
            {formatIDR(monthlyExpense)}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Periode: {months.find((m) => m.value === selectedMonth)?.label} {selectedYear}
          </p>
        </div>

        {/* Net Balance */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Saldo Bersih (Net)
            </span>
            <div className="p-2 bg-indigo-500/10 rounded-xl">
              <Wallet className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div className={`text-2xl font-black ${netBalance >= 0 ? 'text-indigo-400' : 'text-rose-400'}`}>
            {formatIDR(netBalance)}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {netBalance >= 0 ? 'Pemasukan > Pengeluaran' : 'Pengeluaran > Pemasukan'}
          </p>
        </div>
      </div>

      {/* Breakdown by Category */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3">
          Rincian Pengeluaran per Kategori ({months.find((m) => m.value === selectedMonth)?.label})
        </h3>

        {Object.keys(expenseByCategory).length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            Tidak ada transaksi pengeluaran pada bulan ini.
          </p>
        ) : (
          <div className="space-y-3">
            {Object.entries(expenseByCategory).map(([category, amount]) => {
              const percentage = monthlyExpense > 0 ? ((amount / monthlyExpense) * 100).toFixed(1) : '0';
              return (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-300">{category}</span>
                    <span className="text-white font-mono">{formatIDR(amount)} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

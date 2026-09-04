'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Transaction } from '@/lib/types';
import { ArrowUpRight, ArrowDownLeft, Trash2, Edit, Search, Download, Trash, RefreshCw } from 'lucide-react';
import { exportTransactionsToPdf } from '@/lib/pdfExporter';

interface TransactionListProps {
  onEditTransaction?: (transaction: Transaction) => void;
  limit?: number;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  onEditTransaction,
  limit,
}) => {
  const { transactions, role, deleteTransaction, clearAllTransactions, categories, user } = useAuth();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch {
      return dateString;
    }
  };

  // Filter transactions
  let filtered = transactions.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesCat = categoryFilter === 'all' || t.category_id === categoryFilter || t.category_name === categoryFilter;
    return matchesSearch && matchesType && matchesCat;
  });

  if (limit && limit > 0) {
    filtered = filtered.slice(0, limit);
  }

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus transaksi "${title}"?`)) {
      deleteTransaction(id);
    }
  };

  const handleClearAll = () => {
    if (confirm('Apakah Anda yakin ingin MENGHAPUS SEMUA RIWAYAT transaksi? Data yang dihapus tidak dapat dikembalikan.')) {
      clearAllTransactions();
    }
  };

  const handleExportPdf = () => {
    exportTransactionsToPdf({
      transactions: filtered,
      title: 'Laporan Transaksi Keuangan',
      userEmail: user?.email || 'lutfi.maulana.rusli@gmail.com',
      typeFilter,
      categoryFilter,
    });
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Daftar Riwayat Transaksi</span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-normal">
              {filtered.length} Data
            </span>
          </h3>
        </div>

        {/* Action Buttons: PDF Export & Clear History */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportPdf}
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 text-xs font-bold transition-all disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Cetak PDF</span>
          </button>

          {role === 'admin' && transactions.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30 text-xs font-bold transition-all"
            >
              <Trash className="w-3.5 h-3.5" />
              <span>Hapus Semua Riwayat</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 p-2 bg-slate-950 rounded-xl border border-slate-800">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value="all">Semua Jenis (Pemasukan & Pengeluaran)</option>
          <option value="income">Hanya Pemasukan</option>
          <option value="expense">Hanya Pengeluaran</option>
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-10 px-4 border border-dashed border-slate-800 rounded-xl">
          <p className="text-sm text-slate-400 font-medium">Belum ada riwayat transaksi</p>
          <p className="text-xs text-slate-600 mt-1">
            Silakan tambahkan transaksi baru menggunakan form input.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Barang / Deskripsi</th>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3 text-right">Jumlah (Nominal)</th>
                {role === 'admin' && <th className="py-3 px-3 text-center">Aksi (Admin)</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          tx.type === 'income'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {tx.type === 'income' ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{tx.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {tx.category_name && (
                            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-medium">
                              {tx.category_name}
                            </span>
                          )}
                          {role === 'admin' && tx.user_email && (
                            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md font-medium border border-indigo-500/20">
                              Oleh: {tx.user_email}
                            </span>
                          )}
                          {tx.is_reimbursable && (
                            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md font-medium border border-indigo-500/20">
                              Reimburse ke {tx.reimburse_to} ({tx.reimburse_amount ? formatIDR(tx.reimburse_amount) : formatIDR(tx.amount)})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>

                  <td className="py-3.5 px-3 text-right whitespace-nowrap font-mono font-bold text-sm">
                    <span
                      className={
                        tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                      }
                    >
                      {tx.type === 'income' ? '+' : '-'} {formatIDR(tx.amount)}
                    </span>
                  </td>

                  {role === 'admin' && (
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        {onEditTransaction && (
                          <button
                            onClick={() => onEditTransaction(tx)}
                            title="Edit Transaksi"
                            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(tx.id, tx.title)}
                          title="Hapus Transaksi"
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

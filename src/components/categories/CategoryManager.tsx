'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { TransactionType } from '@/lib/types';
import { Tags, Plus, Trash2, ArrowUpRight, ArrowDownLeft, ShieldAlert } from 'lucide-react';

export const CategoryManager: React.FC = () => {
  const { categories, addCategory, deleteCategory, role } = useAuth();

  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (role !== 'admin') {
    return (
      <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 text-center">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">Akses Ditolak</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Fitur Manajemen Kategori hanya dapat diakses oleh peran <strong>Administrator</strong>. Silakan ubah mode menjadi Admin pada bilah navigasi atas.
        </p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCategory({
      name: name.trim(),
      type,
    });

    setName('');
    setFeedback(`Kategori "${name}" berhasil ditambahkan!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDelete = (id: string, catName: string) => {
    if (confirm(`Hapus kategori "${catName}"?`)) {
      deleteCategory(id);
    }
  };

  const incomeCategories = categories.filter((c) => c.type === 'income');
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  return (
    <div className="space-y-6">
      {/* Add Category Form */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <Tags className="w-4 h-4 text-indigo-400" />
          <span>Tambah Kategori Baru</span>
        </h3>

        {feedback && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
            {feedback}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              required
              placeholder="Nama Kategori (contoh: Investasi, Belanja, Hiburan)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="w-full sm:w-44">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="expense">Pengeluaran</option>
              <option value="income">Pemasukan</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </form>
      </div>

      {/* Category List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Income Categories */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Kategori Pemasukan</h4>
            <span className="ml-auto text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md font-semibold">
              {incomeCategories.length}
            </span>
          </div>

          <div className="space-y-2">
            {incomeCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
              >
                <span className="text-slate-200 font-medium">{cat.name}</span>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Hapus Kategori"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
            <ArrowDownLeft className="w-4 h-4 text-rose-400" />
            <h4 className="text-sm font-bold text-white">Kategori Pengeluaran</h4>
            <span className="ml-auto text-xs bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-md font-semibold">
              {expenseCategories.length}
            </span>
          </div>

          <div className="space-y-2">
            {expenseCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
              >
                <span className="text-slate-200 font-medium">{cat.name}</span>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Hapus Kategori"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

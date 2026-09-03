'use client';

import React from 'react';
import { CategoryManager } from '@/components/categories/CategoryManager';

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">
          Manajemen Kategori Transaksi
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Kelola daftar kategori pemasukan dan pengeluaran yang tersedia dalam sistem.
        </p>
      </div>

      <CategoryManager />
    </div>
  );
}

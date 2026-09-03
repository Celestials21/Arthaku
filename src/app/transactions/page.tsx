'use client';

import React, { useState } from 'react';
import { TransactionForm } from '@/components/dashboard/TransactionForm';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { Transaction } from '@/lib/types';

export default function TransactionsPage() {
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">
          Manajemen & Catatan Transaksi
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Kelola seluruh riwayat transaksi pemasukan dan pengeluaran Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <TransactionForm
            editData={editingTx}
            onCancelEdit={() => setEditingTx(null)}
            onSuccess={() => setEditingTx(null)}
          />
        </div>

        <div className="lg:col-span-7">
          <TransactionList
            onEditTransaction={(tx) => setEditingTx(tx)}
          />
        </div>
      </div>
    </div>
  );
}

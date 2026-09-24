'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TransactionForm } from '@/components/dashboard/TransactionForm';
import { useAuth } from '@/context/AuthContext';
import { Sparkles } from 'lucide-react';

function TransactionFormWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { transactions } = useAuth();
  
  const editId = searchParams.get('editId');
  const editingTx = editId ? transactions.find(t => t.id === editId) || null : null;

  const handleCancel = () => {
    if (editId) {
      router.push('/transactions');
    }
  };

  const handleSuccess = () => {
    if (editId) {
      router.push('/transactions');
    }
  };

  return (
    <div className="w-full">
      <TransactionForm
        editData={editingTx}
        onCancelEdit={editId ? handleCancel : undefined}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
          <span>Catat Transaksi</span>
          <Sparkles className="w-5 h-5 text-emerald-400" />
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Catat transaksi pemasukan atau pengeluaran harian Anda di sini.
        </p>
      </div>

      <div className="flex flex-col gap-6 items-stretch">
        <Suspense fallback={<div className="text-slate-400 text-xs">Memuat form...</div>}>
          <TransactionFormWrapper />
        </Suspense>
      </div>
    </div>
  );
}


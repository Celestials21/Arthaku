'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { TransactionType } from '@/lib/types';
import { PlusCircle, ArrowUpRight, ArrowDownLeft, Calendar, Tag, DollarSign, Edit2, Check } from 'lucide-react';

interface TransactionFormProps {
  onSuccess?: () => void;
  editData?: {
    id: string;
    title: string;
    amount: number;
    type: TransactionType;
    category_id?: string;
    date: string;
    is_reimbursable?: boolean;
    reimburse_to?: string;
    reimburse_amount?: number;
  } | null;
  onCancelEdit?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSuccess,
  editData,
  onCancelEdit,
}) => {
  const { categories, addTransaction, updateTransaction } = useAuth();

  const [title, setTitle] = useState(editData?.title || '');
  const [amount, setAmount] = useState(editData?.amount ? editData.amount.toString() : '');
  const [type, setType] = useState<TransactionType>(editData?.type || 'expense');
  const [categoryId, setCategoryId] = useState(editData?.category_id || '');
  const [date, setDate] = useState(editData?.date || new Date().toISOString().split('T')[0]);
  
  const [isReimbursable, setIsReimbursable] = useState(editData?.is_reimbursable || false);
  const [reimburseTo, setReimburseTo] = useState(editData?.reimburse_to || '');
  const [reimburseAmount, setReimburseAmount] = useState(editData?.reimburse_amount ? editData.reimburse_amount.toString() : '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Filter categories by type
  const availableCategories = categories.filter((c) => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || Number(amount) <= 0) {
      setFeedback('Mohon isi nama barang dan jumlah nominal yang valid!');
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const numAmount = parseFloat(amount);

    if (editData) {
      updateTransaction(editData.id, {
        title,
        amount: numAmount,
        type,
        category_id: categoryId || undefined,
        date,
        is_reimbursable: type === 'expense' ? isReimbursable : false,
        reimburse_to: type === 'expense' && isReimbursable ? reimburseTo : undefined,
        reimburse_amount: type === 'expense' && isReimbursable && reimburseAmount ? parseFloat(reimburseAmount) : undefined,
      });
      setFeedback('Transaksi berhasil diperbarui!');
    } else {
      addTransaction({
        title,
        amount: numAmount,
        type,
        category_id: categoryId || (availableCategories[0]?.id || undefined),
        date,
        is_reimbursable: type === 'expense' ? isReimbursable : false,
        reimburse_to: type === 'expense' && isReimbursable ? reimburseTo : undefined,
        reimburse_amount: type === 'expense' && isReimbursable && reimburseAmount ? parseFloat(reimburseAmount) : undefined,
      });
      setFeedback('Transaksi berhasil ditambahkan!');

      // Reset form
      setTitle('');
      setAmount('');
      setIsReimbursable(false);
      setReimburseTo('');
      setReimburseAmount('');
    }

    setIsSubmitting(false);
    if (onSuccess) onSuccess();
    
    setTimeout(() => {
      setFeedback(null);
    }, 3000);
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          {editData ? (
            <>
              <Edit2 className="w-4 h-4 text-indigo-400" />
              <span>Edit Transaksi</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Form Input Transaksi</span>
            </>
          )}
        </h3>

        {editData && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-slate-400 hover:text-white underline"
          >
            Batal Edit
          </button>
        )}
      </div>

      {feedback && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Toggle Pemasukan / Pengeluaran */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Jenis Transaksi
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategoryId('');
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Pemasukan</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategoryId('');
              }}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Pengeluaran</span>
            </button>
          </div>
        </div>

        {/* Nama Barang / Transaksi */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Nama Barang / Deskripsi Transaksi
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Belanja Bulanan, Gaji, Makan Siang"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Jumlah Uang (Nominal) */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Jumlah Uang (Nominal Rp)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-500 text-sm font-semibold">
              Rp
            </span>
            <input
              type="number"
              required
              min="1"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
            />
          </div>
        </div>

        {/* Opsi Reimburse (Khusus Pengeluaran) */}
        {type === 'expense' && (
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isReimbursable}
                onChange={(e) => setIsReimbursable(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
              />
              <span className="text-sm font-semibold text-slate-300">
                Apakah pengeluaran ini bisa di-reimburse?
              </span>
            </label>

            {isReimbursable && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Direimburse Oleh Siapa?
                  </label>
                  <input
                    type="text"
                    required={isReimbursable}
                    placeholder="Nama Orang/Perusahaan"
                    value={reimburseTo}
                    onChange={(e) => setReimburseTo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Jumlah Reimburse (Rp)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder={`Bawaan: Sesuai nominal`}
                    value={reimburseAmount}
                    onChange={(e) => setReimburseAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Grid: Kategori & Tanggal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Kategori */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Kategori
            </label>
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="">Pilih Kategori...</option>
                {availableCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tanggal */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Tanggal Transaksi
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-900/30 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>{editData ? 'Simpan Perubahan' : 'Tambah Transaksi'}</span>
        </button>
      </form>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { TransactionForm } from '@/components/dashboard/TransactionForm';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { Transaction } from '@/lib/types';
import { PlusCircle, LayoutDashboard, CheckCircle2, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { role } = useAuth();
  const [viewState, setViewState] = useState<'form' | 'post_submit_options' | 'main_menu'>('form');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleFormSuccess = () => {
    // Switch to interactive option dialog post-submit
    setViewState('post_submit_options');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>Pencatat Keuangan</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-xs text-slate-400">
            Fokus menginput transaksi keuangan harian Anda dengan cepat dan rapi.
          </p>
        </div>

        {/* View Switcher: Input Form vs Main Menu */}
        <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => {
              setViewState('form');
              setEditingTransaction(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewState === 'form' || viewState === 'post_submit_options'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Form Input</span>
          </button>

          <button
            onClick={() => {
              setViewState('main_menu');
              setEditingTransaction(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewState === 'main_menu'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>

      {/* STATE 1: FOCUS ON FORM INPUT */}
      {viewState === 'form' && (
        <div className="max-w-xl mx-auto space-y-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 text-center font-medium">
            👇 Silakan isi form di bawah ini untuk mencatat transaksi baru Anda:
          </div>

          <TransactionForm
            editData={editingTransaction}
            onCancelEdit={() => setEditingTransaction(null)}
            onSuccess={handleFormSuccess}
          />
        </div>
      )}

      {/* STATE 2: POST-SUBMIT INTERACTIVE OPTIONS */}
      {viewState === 'post_submit_options' && (
        <div className="max-w-lg mx-auto bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-200">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-xl font-black text-white">Transaksi Berhasil Disimpan!</h2>
            <p className="text-xs text-slate-400 mt-1">
              Data transaksi Anda telah berhasil tersimpan dalam sistem.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <p className="text-xs font-bold text-slate-300">
              Apa yang ingin Anda lakukan selanjutnya?
            </p>

            <div className="flex flex-col gap-2.5">
              {/* Option A: Lanjut Memasukkan Transaksi Lagi */}
              <button
                onClick={() => setViewState('form')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Lanjut Memasukkan Transaksi Lagi</span>
              </button>

              {/* Option B: Melihat Main Menu / Ringkasan Keuangan */}
              <button
                onClick={() => setViewState('main_menu')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Melihat Main Menu & Ringkasan Keuangan</span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATE 3: FULL MAIN MENU / RINGKASAN UTAMA */}
      {viewState === 'main_menu' && (
        <div className="space-y-6">
          {/* Quick Bar back to Form Input */}
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Ingin mencatat transaksi lagi?</h3>
              <p className="text-xs text-slate-400">Tambah pengeluaran atau pemasukan baru.</p>
            </div>
            <button
              onClick={() => setViewState('form')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Input Transaksi</span>
            </button>
          </div>

          {/* Kartu Informasi Saldo / Uang Saat Ini */}
          <SummaryCards />

          {/* Tabel / Daftar Riwayat Transaksi */}
          <TransactionList
            limit={10}
            onEditTransaction={(tx) => {
              setEditingTransaction(tx);
              setViewState('form');
            }}
          />
        </div>
      )}
    </div>
  );
}

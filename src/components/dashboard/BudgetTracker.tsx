'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ShieldAlert, Plus, Trash2, Edit3, ShieldCheck } from 'lucide-react';

interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  limitAmount: number;
}

export const BudgetTracker = () => {
  const { user, categories, transactions } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formCategory, setFormCategory] = useState('');
  const [formLimit, setFormLimit] = useState<number>(0);

  useEffect(() => {
    if (user?.email) {
      const saved = localStorage.getItem(`budgets_${user.email}`);
      if (saved) {
        try {
          setBudgets(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [user]);

  const saveToLocal = (newBudgets: Budget[]) => {
    setBudgets(newBudgets);
    if (user?.email) {
      localStorage.setItem(`budgets_${user.email}`, JSON.stringify(newBudgets));
    }
  };

  const handleSave = () => {
    if (!formCategory || formLimit <= 0) return;

    const catObj = categories.find(c => c.id === formCategory);
    if (!catObj) return;

    const newBudget: Budget = {
      id: editingId || Date.now().toString(),
      categoryId: catObj.id,
      categoryName: catObj.name,
      limitAmount: formLimit
    };

    if (editingId) {
      saveToLocal(budgets.map(b => b.id === editingId ? newBudget : b));
    } else {
      // If budget for this category already exists, update it instead
      const existing = budgets.find(b => b.categoryId === formCategory);
      if (existing) {
        saveToLocal(budgets.map(b => b.categoryId === formCategory ? { ...b, limitAmount: formLimit } : b));
      } else {
        saveToLocal([...budgets, newBudget]);
      }
    }

    setIsEditing(false);
    setEditingId(null);
    setFormCategory('');
    setFormLimit(0);
  };

  const handleDelete = (id: string) => {
    saveToLocal(budgets.filter(b => b.id !== id));
  };

  const startEdit = (b: Budget) => {
    setEditingId(b.id);
    setFormCategory(b.categoryId);
    setFormLimit(b.limitAmount);
    setIsEditing(true);
  };

  // Calculate current month's expenses per category
  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const expenses = transactions.filter(t => {
      if (t.type !== 'expense') return false;
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    return expenses.reduce((acc, t) => {
      const cat = t.category_id || 'unassigned';
      acc[cat] = (acc[cat] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);
  }, [transactions]);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-800 shadow-xl mt-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-500/20 rounded-lg">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Batas Anggaran Kategori</h3>
        </div>
        {!isEditing && (
          <button 
            onClick={() => { setIsEditing(true); setFormCategory(''); setFormLimit(0); }}
            className="text-[10px] flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-white px-2 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3 h-3" /> Tambah Anggaran
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4 animate-in fade-in zoom-in duration-200">
          <h4 className="text-xs font-bold text-slate-300 mb-3">{editingId ? 'Edit Anggaran' : 'Set Anggaran Bulanan Baru'}</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Pilih Kategori Pengeluaran</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:ring-1 focus:ring-rose-500"
              >
                <option value="" disabled>-- Pilih Kategori --</option>
                {categories.filter(c => c.type === 'expense').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Batas Maksimal (Rp)</label>
              <input
                type="number"
                value={formLimit || ''}
                onChange={(e) => setFormLimit(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:ring-1 focus:ring-rose-500"
                placeholder="Contoh: 1500000"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={handleSave} disabled={!formCategory || formLimit <= 0} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-2 rounded-lg disabled:opacity-50">Simpan</button>
              <button onClick={() => { setIsEditing(false); setEditingId(null); }} className="px-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 rounded-lg">Batal</button>
            </div>
          </div>
        </div>
      )}

      {budgets.length === 0 && !isEditing ? (
        <div className="text-center py-6">
          <p className="text-xs text-slate-500">Belum ada batas anggaran. Tambahkan untuk mencegah pengeluaran berlebih.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {budgets.map(b => {
            const spent = currentMonthExpenses[b.categoryId] || 0;
            const progress = Math.min(100, Math.max(0, (spent / b.limitAmount) * 100));
            
            let statusColor = 'bg-emerald-500';
            let textColor = 'text-emerald-400';
            let alertMsg = null;

            if (progress >= 100) {
              statusColor = 'bg-rose-500';
              textColor = 'text-rose-400';
              alertMsg = 'Melebihi Anggaran!';
            } else if (progress >= 80) {
              statusColor = 'bg-amber-500';
              textColor = 'text-amber-400';
              alertMsg = 'Hampir Habis';
            }

            return (
              <div key={b.id} className="group">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-200">{b.categoryName}</span>
                    {alertMsg && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded bg-slate-800 ${textColor} font-bold`}>{alertMsg}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(b)} className="text-slate-500 hover:text-indigo-400"><Edit3 className="w-3 h-3" /></button>
                    <button onClick={() => handleDelete(b.id)} className="text-slate-500 hover:text-rose-400"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
                
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                  <div 
                    className={`h-full rounded-full ${statusColor} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-[10px] mt-1.5">
                  <span className="text-slate-400">Terpakai: <strong className="text-white">{formatIDR(spent)}</strong></span>
                  <span className="text-slate-500">Batas: {formatIDR(b.limitAmount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

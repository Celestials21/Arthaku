'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Target, TrendingUp, Calendar, AlertCircle, Calculator, Clock, Plus, Trash2, Edit3, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Goal {
  id: string;
  name: string;
  icon: string;
  amount: number;
  mode: 'date' | 'simulation';
  date?: string;
  income?: number;
  expense?: number;
  createdAt: string;
}

const GOAL_ICONS = [
  { emoji: '🏖️', label: 'Liburan' },
  { emoji: '🚗', label: 'Kendaraan' },
  { emoji: '💻', label: 'Gadget' },
  { emoji: '🏠', label: 'Rumah' },
  { emoji: '🏥', label: 'Darurat' },
  { emoji: '🎓', label: 'Pendidikan' },
  { emoji: '💍', label: 'Menikah' },
  { emoji: '🎯', label: 'Lainnya' },
];

export default function TargetPage() {
  const { user, transactions } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formIcon, setFormIcon] = useState('🎯');
  const [formAmount, setFormAmount] = useState<number>(0);
  const [formMode, setFormMode] = useState<'date' | 'simulation'>('date');
  const [formDate, setFormDate] = useState<string>('');
  const [formIncome, setFormIncome] = useState<number>(0);
  const [formExpense, setFormExpense] = useState<number>(0);

  useEffect(() => {
    if (user?.email) {
      const saved = localStorage.getItem(`targets_v2_${user.email}`);
      if (saved) {
        try {
          setGoals(JSON.parse(saved));
        } catch (e) {}
      } else {
        // Migration from old single target
        const oldSaved = localStorage.getItem(`target_${user.email}`);
        if (oldSaved) {
          try {
            const parsed = JSON.parse(oldSaved);
            if (parsed.amount > 0) {
              const migratedGoal: Goal = {
                id: Date.now().toString(),
                name: 'Target Utama',
                icon: '🎯',
                amount: parsed.amount,
                mode: parsed.mode || 'date',
                date: parsed.date,
                income: parsed.income,
                expense: parsed.expense,
                createdAt: new Date().toISOString()
              };
              setGoals([migratedGoal]);
              localStorage.setItem(`targets_v2_${user.email}`, JSON.stringify([migratedGoal]));
            }
          } catch (e) {}
        }
      }
    }
  }, [user]);

  const saveToLocal = (newGoals: Goal[]) => {
    setGoals(newGoals);
    if (user?.email) {
      localStorage.setItem(`targets_v2_${user.email}`, JSON.stringify(newGoals));
    }
  };

  const handleSave = () => {
    const newGoal: Goal = {
      id: editingId || Date.now().toString(),
      name: formName || 'Target Baru',
      icon: formIcon,
      amount: formAmount,
      mode: formMode,
      date: formMode === 'date' ? formDate : undefined,
      income: formMode === 'simulation' ? formIncome : undefined,
      expense: formMode === 'simulation' ? formExpense : undefined,
      createdAt: new Date().toISOString()
    };

    if (editingId) {
      saveToLocal(goals.map(g => g.id === editingId ? newGoal : g));
    } else {
      saveToLocal([...goals, newGoal]);
    }
    
    setIsEditing(false);
    setEditingId(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus target ini?')) {
      saveToLocal(goals.filter(g => g.id !== id));
    }
  };

  const startEdit = (g: Goal) => {
    setEditingId(g.id);
    setFormName(g.name);
    setFormIcon(g.icon);
    setFormAmount(g.amount);
    setFormMode(g.mode);
    setFormDate(g.date || '');
    setFormIncome(g.income || 0);
    setFormExpense(g.expense || 0);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormName('');
    setFormIcon('🎯');
    setFormAmount(0);
    setFormMode('date');
    setFormDate('');
    setFormIncome(0);
    setFormExpense(0);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
  const currentBalance = totalIncome - totalExpense;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Trigger confetti if a milestone is reached
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>Target Keuangan</span>
            <Target className="w-5 h-5 text-blue-500" />
          </h1>
          <p className="text-xs text-slate-400">
            Kelola berbagai target tabungan Anda dalam satu tempat.
          </p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => { resetForm(); setIsEditing(true); }}
            className="flex items-center gap-1.5 px-3 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Target
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="relative z-10 space-y-4 max-w-md">
            <h3 className="text-sm font-bold text-white mb-4">{editingId ? 'Edit Target' : 'Buat Target Baru'}</h3>
            
            <div className="flex gap-3">
              <div className="w-20">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Ikon</label>
                <div className="relative">
                  <select
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2.5 text-xl appearance-none text-center focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    {GOAL_ICONS.map(i => <option key={i.emoji} value={i.emoji}>{i.emoji}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Nama Target</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
                  placeholder="Misal: Liburan ke Bali"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Jumlah Target (Rp)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 text-sm font-semibold">Rp</span>
                </div>
                <input
                  type="number"
                  value={formAmount || ''}
                  onChange={(e) => setFormAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all"
                  placeholder="Contoh: 10000000"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-400 mb-2">Metode Pencapaian</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFormMode('date')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    formMode === 'date' 
                      ? 'bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-300' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" /> Tenggat Waktu
                </button>
                <button
                  onClick={() => setFormMode('simulation')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    formMode === 'simulation' 
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" /> Anggaran
                </button>
              </div>
            </div>

            {formMode === 'date' ? (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 mt-2">Tenggat Waktu Pencapaian</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-3 mt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Pendapatan Rutin per Bulan</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 text-xs font-semibold">Rp</span>
                    </div>
                    <input
                      type="number"
                      value={formIncome || ''}
                      onChange={(e) => setFormIncome(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Target Pengeluaran per Bulan</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 text-xs font-semibold">Rp</span>
                    </div>
                    <input
                      type="number"
                      value={formExpense || ''}
                      onChange={(e) => setFormExpense(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex gap-2">
              <button
                onClick={handleSave}
                disabled={!formName || !formAmount}
                className="flex-1 bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-500 transition-colors text-sm disabled:opacity-50"
              >
                Simpan Target
              </button>
              <button
                onClick={() => { setIsEditing(false); setEditingId(null); }}
                className="px-4 bg-slate-800 text-slate-300 font-bold py-2.5 rounded-xl hover:bg-slate-700 transition-colors text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Target className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h3 className="text-slate-300 font-bold mb-1">Belum ada target</h3>
          <p className="text-slate-500 text-xs mb-4">Mulai buat target keuangan pertama Anda untuk mulai menabung.</p>
          <button 
            onClick={() => { resetForm(); setIsEditing(true); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <Plus className="w-4 h-4" /> Buat Target
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {goals.map(goal => {
            const progress = goal.amount > 0 ? Math.min(100, Math.max(0, (currentBalance / goal.amount) * 100)) : 0;
            const remainingAmount = Math.max(0, goal.amount - currentBalance);
            
            const remainingDays = goal.mode === 'date' && goal.date 
              ? Math.ceil((new Date(goal.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              : null;
            
            const monthlySavings = (goal.income || 0) - (goal.expense || 0);
            const estimatedMonths = monthlySavings > 0 ? Math.ceil(remainingAmount / monthlySavings) : null;
            
            // Milestones logic (25, 50, 75, 100)
            const milestones = [25, 50, 75, 100];
            const achievedMilestones = milestones.filter(m => progress >= m).length;

            return (
              <div key={goal.id} className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl shadow-inner">
                      {goal.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{goal.name}</h3>
                      <div className="text-xl font-black text-blue-400">
                        {formatIDR(goal.amount)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(goal)} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(goal.id)} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress & Milestones */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Terkumpul: <span className="text-emerald-400">{formatIDR(currentBalance)}</span></span>
                    <span className="text-fuchsia-400">{progress.toFixed(1)}%</span>
                  </div>
                  
                  <div className="relative h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                    <div 
                      className="absolute top-0 bottom-0 left-0 rounded-full bg-blue-500 transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                    {/* Milestone Markers */}
                    {[25, 50, 75].map(m => (
                      <div 
                        key={m} 
                        className={`absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10 transition-colors ${progress >= m ? 'opacity-50' : 'opacity-100'}`}
                        style={{ left: `${m}%` }}
                      />
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold px-1">
                    <span>Mulai</span>
                    <span className={progress >= 25 ? 'text-fuchsia-400' : ''}>25%</span>
                    <span className={progress >= 50 ? 'text-indigo-400' : ''}>50%</span>
                    <span className={progress >= 75 ? 'text-indigo-400' : ''}>75%</span>
                    <span className={progress >= 100 ? 'text-emerald-400' : ''}>100%</span>
                  </div>

                  {progress >= 100 && (
                    <div className="mt-4 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-emerald-500/20 transition-colors" onClick={triggerConfetti}>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-emerald-400">Target Tercapai! 🎉</p>
                        <p className="text-[10px] text-emerald-400/80">Klik untuk merayakan</p>
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {progress < 100 && currentBalance >= 0 && goal.mode === 'date' && remainingDays !== null && remainingDays > 0 && (
                    <div className="mt-3 p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-indigo-400">Sisa Waktu: {remainingDays} hari</p>
                        <p className="text-[10px] text-indigo-300 mt-0.5">
                          Rekomendasi tabungan harian: <strong>{formatIDR(remainingAmount / remainingDays)}</strong>/hari
                        </p>
                      </div>
                    </div>
                  )}

                  {progress < 100 && currentBalance >= 0 && goal.mode === 'simulation' && monthlySavings > 0 && estimatedMonths !== null && (
                    <div className="mt-3 p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-start gap-2">
                      <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-indigo-400">Estimasi: {estimatedMonths} bulan lagi</p>
                        <p className="text-[10px] text-indigo-300 mt-0.5">
                          Dengan menabung {formatIDR(monthlySavings)} / bulan
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

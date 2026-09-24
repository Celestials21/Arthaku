'use client';

import React, { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Transaction } from '@/lib/types';

export const SmartInsights = () => {
  const { transactions } = useAuth();

  const insights = useMemo(() => {
    if (!transactions || transactions.length === 0) return null;

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Filter expenses
    const expenses = transactions.filter(t => t.type === 'expense');

    // This week's expenses
    const thisWeekExpenses = expenses.filter(t => new Date(t.date) >= oneWeekAgo && new Date(t.date) <= now);
    const thisWeekTotal = thisWeekExpenses.reduce((acc, t) => acc + Number(t.amount), 0);

    // Last week's expenses
    const lastWeekExpenses = expenses.filter(t => new Date(t.date) >= twoWeeksAgo && new Date(t.date) < oneWeekAgo);
    const lastWeekTotal = lastWeekExpenses.reduce((acc, t) => acc + Number(t.amount), 0);

    // Analyze highest category this week
    const categoryTotals = thisWeekExpenses.reduce((acc, t) => {
      const cat = t.category_name || 'Lainnya';
      acc[cat] = (acc[cat] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

    let topCategory = '';
    let topCategoryAmount = 0;
    for (const [cat, amount] of Object.entries(categoryTotals)) {
      if (amount > topCategoryAmount) {
        topCategoryAmount = amount;
        topCategory = cat;
      }
    }

    const formatIDR = (val: number) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const messages = [];

    // Compare week over week
    if (lastWeekTotal > 0) {
      const diff = thisWeekTotal - lastWeekTotal;
      const percent = (diff / lastWeekTotal) * 100;

      if (percent > 20) {
        messages.push({
          type: 'warning',
          icon: <TrendingUp className="w-5 h-5 text-rose-400" />,
          title: 'Pengeluaran Meningkat!',
          text: `Pengeluaran Anda 7 hari terakhir naik ${percent.toFixed(0)}% dibanding minggu sebelumnya.`
        });
      } else if (percent < -10) {
        messages.push({
          type: 'success',
          icon: <TrendingDown className="w-5 h-5 text-emerald-400" />,
          title: 'Kerja Bagus!',
          text: `Pengeluaran Anda turun ${Math.abs(percent).toFixed(0)}% dibanding minggu lalu. Teruskan kebiasaan hemat ini!`
        });
      }
    }

    // Top Category insight
    if (topCategoryAmount > 0 && topCategoryAmount > thisWeekTotal * 0.4) {
      messages.push({
        type: 'info',
        icon: <Lightbulb className="w-5 h-5 text-amber-400" />,
        title: 'Fokus Pengeluaran',
        text: `Hampir setengah pengeluaran Anda minggu ini (${formatIDR(topCategoryAmount)}) habis di kategori "${topCategory}".`
      });
    }

    if (messages.length === 0) {
      messages.push({
        type: 'neutral',
        icon: <Lightbulb className="w-5 h-5 text-indigo-400" />,
        title: 'Pola Stabil',
        text: 'Arus pengeluaran Anda dalam 7 hari terakhir terlihat stabil.'
      });
    }

    return messages;
  }, [transactions]);

  if (!insights) return null;

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-indigo-500/20 rounded-lg">
          <Lightbulb className="w-4 h-4 text-indigo-400" />
        </div>
        <h3 className="text-sm font-bold text-white">Sorotan Mingguan</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {insights.map((msg, i) => (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${
            msg.type === 'warning' ? 'bg-rose-500/10 border-rose-500/20' :
            msg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' :
            msg.type === 'info' ? 'bg-amber-500/10 border-amber-500/20' :
            'bg-slate-800/50 border-slate-700/50'
          }`}>
            <div className="mt-0.5">{msg.icon}</div>
            <div>
              <h4 className={`text-xs font-bold ${
                msg.type === 'warning' ? 'text-rose-400' :
                msg.type === 'success' ? 'text-emerald-400' :
                msg.type === 'info' ? 'text-amber-400' :
                'text-indigo-400'
              }`}>{msg.title}</h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

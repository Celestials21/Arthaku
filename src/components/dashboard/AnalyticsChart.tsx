'use client';

import React, { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const COLORS = ['#f43f5e', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export const AnalyticsChart = () => {
  const { transactions } = useAuth();

  const data = useMemo(() => {
    // Only care about expenses
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Group by category name
    const grouped = expenses.reduce((acc, curr) => {
      const cat = curr.category_name || 'Lainnya';
      acc[cat] = (acc[cat] || 0) + Number(curr.amount);
      return acc;
    }, {} as Record<string, number>);

    // Convert to array for Recharts
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // sort by largest
  }, [transactions]);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs">
          <p className="font-bold text-white mb-1">{payload[0].name}</p>
          <p className="text-rose-400 font-mono font-semibold">{formatIDR(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return null; // Don't show chart if no expenses
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/20 rounded-lg">
            <PieChartIcon className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-sm font-bold text-white">Analisis Pengeluaran</h3>
        </div>
      </div>
      
      <p className="text-[10px] text-slate-400 mb-6 border-b border-slate-800/50 pb-3">
        Visualisasi distribusi pengeluaran Anda berdasarkan kategori.
      </p>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationBegin={200}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={50}
              content={(props) => {
                const { payload } = props;
                return (
                  <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-[10px] max-h-16 overflow-y-auto custom-scrollbar">
                    {payload?.map((entry, index) => (
                      <li key={`item-${index}`} className="flex items-center gap-1.5 text-slate-300 font-medium bg-slate-950/50 px-2 py-1 rounded-md border border-slate-800/50">
                        <span className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                        {entry.value}
                      </li>
                    ))}
                  </ul>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

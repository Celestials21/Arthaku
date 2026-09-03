'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wallet, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const success = register(email.toLowerCase(), password, selectedRole);
    if (success) {
      router.push('/');
    } else {
      alert('Username sudah digunakan! Silakan gunakan username lain.');
    }
  };

  return (
    <div 
      className="min-h-[80vh] flex items-center justify-center py-12 px-4 relative overflow-hidden"
      style={{
        backgroundImage: 'url("https://media.craiyon.com/2025-04-10/VYO2VVWIRbuXBo7c7qquSw.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay gradient untuk memastikan text tetap terbaca */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />

      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Wallet className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <h2 className="text-2xl font-black text-white drop-shadow-sm">Buat Akun Baru</h2>
          <p className="text-xs text-slate-300">Daftarkan diri Anda untuk mencatat keuangan bulanan</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Pilih Peran Akun (Role)</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full bg-slate-950/70 border border-slate-700/50 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer transition-all"
            >
              <option value="user">User / Utama (Pencatat Biasa)</option>
              <option value="admin">Admin (Akses Rekap & Manajemen)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Username / Email</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="Masukkan username Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-700/50 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-700/50 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-xs"
          >
            <span>Daftar Akun</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-700/50">
          <p className="text-center text-xs text-slate-400">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-emerald-400 font-bold hover:text-emerald-300 hover:underline transition-all">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { Category, Transaction, UserProfile } from '@/lib/types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Gaji & Utama', type: 'income', created_at: new Date().toISOString() },
  { id: 'cat-2', name: 'Bonus & Freelance', type: 'income', created_at: new Date().toISOString() },
  { id: 'cat-3', name: 'Investasi', type: 'income', created_at: new Date().toISOString() },
  { id: 'cat-4', name: 'Makanan & Minuman', type: 'expense', created_at: new Date().toISOString() },
  { id: 'cat-5', name: 'Belanja Bulanan', type: 'expense', created_at: new Date().toISOString() },
  { id: 'cat-6', name: 'Transportasi & Bensin', type: 'expense', created_at: new Date().toISOString() },
  { id: 'cat-7', name: 'Tagihan & Utilitas', type: 'expense', created_at: new Date().toISOString() },
  { id: 'cat-8', name: 'Hiburan', type: 'expense', created_at: new Date().toISOString() },
  { id: 'cat-9', name: 'Kesehatan', type: 'expense', created_at: new Date().toISOString() },
];

// Kosongkan semua riwayat transaksi bawaan sesuai permintaan user
export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const DEMO_USERS: Record<string, UserProfile> = {
  admin: {
    id: 'usr-admin-1',
    email: 'lutfi.maulana.rusli@gmail.com',
    role: 'admin',
    created_at: '2026-01-01T00:00:00Z',
  },
  user: {
    id: 'usr-user-1',
    email: 'lutfi.maulana.rusli@gmail.com',
    role: 'user',
    created_at: '2026-01-02T00:00:00Z',
  },
};

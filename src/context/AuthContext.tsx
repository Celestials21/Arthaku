'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, Transaction, Category } from '@/lib/types';
import { DEMO_USERS, INITIAL_CATEGORIES, INITIAL_TRANSACTIONS } from '@/lib/mockData';
import { isSupabaseConfigured } from '@/lib/supabase/client';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (username: string, pass: string) => boolean;
  register: (username: string, pass: string, role: UserRole) => boolean;
  logout: () => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'created_at'>) => void;
  updateTransaction: (id: string, updated: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  clearAllTransactions: () => void;
  isLoading: boolean;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRoleState] = useState<UserRole>('user');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(!isSupabaseConfigured());

  useEffect(() => {
    const savedAuth = localStorage.getItem('demo_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      const savedRole = localStorage.getItem('demo_role') as UserRole;
      if (savedRole && (savedRole === 'admin' || savedRole === 'user')) {
        setRoleState(savedRole);
        setUser({ ...DEMO_USERS[savedRole], email: 'lutfi.maulana.rusli@gmail.com' });
      } else {
        setUser({ ...DEMO_USERS.user, email: 'lutfi.maulana.rusli@gmail.com' });
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }

    const savedTx = localStorage.getItem('demo_transactions');
    if (savedTx) {
      try {
        setTransactions(JSON.parse(savedTx));
      } catch (e) {
        console.error('Failed to parse saved transactions', e);
      }
    } else {
      setTransactions([]);
    }

    const savedCat = localStorage.getItem('demo_categories');
    if (savedCat) {
      try {
        setCategories(JSON.parse(savedCat));
      } catch (e) {
        console.error('Failed to parse saved categories', e);
      }
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setUser({ ...DEMO_USERS[newRole], email: 'lutfi.maulana.rusli@gmail.com' });
    localStorage.setItem('demo_role', newRole);
  };

  const login = (username: string, pass: string) => {
    if (username === 'admin' && pass === '123') {
      setIsAuthenticated(true);
      setRole('admin');
      localStorage.setItem('demo_auth', 'true');
      return true;
    } else if (username === 'user' && pass === '123') {
      setIsAuthenticated(true);
      setRole('user');
      localStorage.setItem('demo_auth', 'true');
      return true;
    }
    // Jika kita mendaftarkan pengguna lokal baru, kita juga mengecek apakah ada di localstorage (fitur mock lanjutan)
    // Untuk saat ini, kita beri pass karena demo mode akan login jika user sudah mendaftar (disimpan di session mock)
    const mockUsers = JSON.parse(localStorage.getItem('demo_registered_users') || '[]');
    const existing = mockUsers.find((u: any) => u.username === username && u.pass === pass);
    if (existing) {
      setIsAuthenticated(true);
      setRole(existing.role);
      localStorage.setItem('demo_auth', 'true');
      return true;
    }
    
    return false;
  };

  const register = (username: string, pass: string, roleToSet: UserRole) => {
    const mockUsers = JSON.parse(localStorage.getItem('demo_registered_users') || '[]');
    // Cek duplikasi
    if (mockUsers.find((u: any) => u.username === username)) {
      return false; // username already exists
    }
    // Simpan mock user baru
    mockUsers.push({ username, pass, role: roleToSet });
    localStorage.setItem('demo_registered_users', JSON.stringify(mockUsers));
    
    // Auto login setelah register
    setIsAuthenticated(true);
    setRole(roleToSet);
    localStorage.setItem('demo_auth', 'true');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('demo_auth');
  };

  const addTransaction = (txData: Omit<Transaction, 'id' | 'created_at'>) => {
    const category = categories.find((c) => c.id === txData.category_id);
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      created_at: new Date().toISOString(),
      category_name: category ? category.name : 'Lainnya',
      user_id: user?.id || 'usr-user-1',
      user_email: 'lutfi.maulana.rusli@gmail.com',
    };

    const updated = [newTx, ...transactions];
    setTransactions(updated);
    localStorage.setItem('demo_transactions', JSON.stringify(updated));
  };

  const updateTransaction = (id: string, updatedData: Partial<Transaction>) => {
    const updated = transactions.map((t) => {
      if (t.id === id) {
        const cat = updatedData.category_id 
          ? categories.find((c) => c.id === updatedData.category_id) 
          : categories.find((c) => c.id === t.category_id);
        return {
          ...t,
          ...updatedData,
          category_name: cat ? cat.name : t.category_name,
        };
      }
      return t;
    });
    setTransactions(updated);
    localStorage.setItem('demo_transactions', JSON.stringify(updated));
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    localStorage.setItem('demo_transactions', JSON.stringify(updated));
  };

  const clearAllTransactions = () => {
    setTransactions([]);
    localStorage.removeItem('demo_transactions');
  };

  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem('demo_categories', JSON.stringify(updated));
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    localStorage.setItem('demo_categories', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        register,
        logout,
        user,
        role,
        setRole,
        transactions,
        categories,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        clearAllTransactions,
        addCategory,
        deleteCategory,
        isLoading,
        isDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

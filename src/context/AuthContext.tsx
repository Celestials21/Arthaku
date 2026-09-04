'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, Transaction, Category } from '@/lib/types';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (username: string, pass: string) => Promise<boolean>;
  register: (username: string, pass: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  role: UserRole;
  setRole: (role: UserRole) => void;
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>;
  updateTransaction: (id: string, updated: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  clearAllTransactions: () => Promise<void>;
  isLoading: boolean;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRoleState] = useState<UserRole>('user');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode] = useState<boolean>(false);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (data && !error) {
      setUser(data);
      setRoleState(data.role);
    }
  };

  const fetchData = async () => {
    if (!user) return;
    
    // Fetch Categories
    const { data: catData } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });
      
    if (catData) setCategories(catData);

    // Fetch Transactions
    const { data: txData } = await supabase
      .from('transactions')
      .select(`*, categories(name), users(email)`)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (txData) {
      const formattedTx = txData.map(tx => ({
        ...tx,
        category_name: tx.categories?.name || 'Lainnya',
        user_email: tx.users?.email
      }));
      setTransactions(formattedTx);
    }
  };

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        fetchUserProfile(session.user.id);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          fetchUserProfile(session.user.id);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setTransactions([]);
          setCategories([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Fetch data whenever user profile is loaded
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const setRole = (newRole: UserRole) => {
    // In real app, role is managed in DB. This is just for local override if needed for testing.
    setRoleState(newRole);
  };

  const login = async (username: string, pass: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password: pass,
    });
    setIsLoading(false);
    
    if (error) {
      alert(error.message);
      return false;
    }
    return true;
  };

  const register = async (username: string, pass: string, _roleToSet: UserRole) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: username,
      password: pass,
    });
    setIsLoading(false);

    if (error) {
      alert(error.message);
      return false;
    }
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const addTransaction = async (txData: Omit<Transaction, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        title: txData.title,
        amount: txData.amount,
        type: txData.type,
        category_id: txData.category_id,
        date: txData.date,
        is_reimbursable: txData.is_reimbursable,
        reimburse_to: txData.reimburse_to,
        reimburse_amount: txData.reimburse_amount,
        user_id: user?.id,
      })
      .select(`*, categories(name), users(email)`)
      .single();

    if (!error && data) {
      const formatted = {
        ...data,
        category_name: data.categories?.name || 'Lainnya',
        user_email: data.users?.email
      };
      setTransactions([formatted, ...transactions]);
    }
  };

  const updateTransaction = async (id: string, updatedData: Partial<Transaction>) => {
    const { data, error } = await supabase
      .from('transactions')
      .update({
        title: updatedData.title,
        amount: updatedData.amount,
        type: updatedData.type,
        category_id: updatedData.category_id,
        date: updatedData.date,
        is_reimbursable: updatedData.is_reimbursable,
        reimburse_to: updatedData.reimburse_to,
        reimburse_amount: updatedData.reimburse_amount,
      })
      .eq('id', id)
      .select(`*, categories(name), users(email)`)
      .single();

    if (!error && data) {
      const formatted = {
        ...data,
        category_name: data.categories?.name || 'Lainnya',
        user_email: data.users?.email
      };
      setTransactions(transactions.map(t => t.id === id ? formatted : t));
    }
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const clearAllTransactions = async () => {
    if (role !== 'admin') return;
    const { error } = await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // delete all
    if (!error) {
      setTransactions([]);
    }
  };

  const addCategory = async (catData: Omit<Category, 'id'>) => {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: catData.name,
        type: catData.type
      })
      .select()
      .single();
      
    if (!error && data) {
      setCategories([...categories, data]);
    }
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) {
      setCategories(categories.filter(c => c.id !== id));
    }
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

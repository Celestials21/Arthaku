export type UserRole = 'admin' | 'user';
export type TransactionType = 'income' | 'expense';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  created_at?: string;
}

export interface Transaction {
  id: string;
  user_id?: string;
  title: string;
  amount: number;
  type: TransactionType;
  category_id?: string;
  category?: Category;
  category_name?: string;
  date: string;
  created_at: string;
  user_email?: string;
  is_reimbursable?: boolean;
  reimburse_to?: string;
  reimburse_amount?: number;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
}

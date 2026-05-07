// ── CashflowKu Type Definitions ─────────────────────────────────────────────

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: 'expense' | 'income';
  icon: string;
  color: string;
  is_default: boolean;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  name: string;
  type: 'cash' | 'bank' | 'e-wallet' | 'credit';
  balance: number;
  currency: string;
  icon: string | null;
  color: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  wallet_id: string;
  category_id: string | null;
  type: 'expense' | 'income' | 'transfer';
  amount: number;
  description: string | null;
  notes: string | null;
  date: string;
  receipt_url: string | null;
  is_recurring: boolean;
  recurring_id: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category;
  wallets?: Wallet;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string | null;
  category?: Category;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  start_date: string;
  end_date?: string;
  spent?: number; // calculated
  created_at: string;
}

export interface Target {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  icon: string;
  color: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  billing_cycle: 'monthly' | 'yearly' | 'weekly';
  category_id?: string;
  category?: Category;
  wallet_id?: string;
  wallet?: Wallet;
  next_billing_date: string;
  auto_renew: boolean;
  status: 'active' | 'paused' | 'cancelled';
  logo_url?: string;
  notes?: string;
  created_at: string;
}

export interface HealthScore {
  id: string;
  user_id: string;
  score: number;
  breakdown: {
    savings_rate: number;
    budget_adherence: number;
    spending_trend: number;
    expense_distribution: number;
  };
  month: string;
  created_at: string;
}

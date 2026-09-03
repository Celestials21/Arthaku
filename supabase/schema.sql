-- ===================================================
-- SKEMA DATABASE SUPABASE: APLIKASI PENCATAT KEUANGAN
-- ===================================================

-- 1. Create Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'user');
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense');

-- 2. Create Table: users / profiles
-- Terhubung dengan auth.users pada Supabase Auth
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role public.user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Table: categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type public.transaction_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Table: transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  type public.transaction_type NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_reimbursable BOOLEAN DEFAULT FALSE,
  reimburse_to TEXT,
  reimburse_amount NUMERIC(12, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Data Awal Kategori (Seed Data)
INSERT INTO public.categories (name, type) VALUES
  ('Gaji & Pendapatan', 'income'),
  ('Bonus & Insentif', 'income'),
  ('Investasi & Dividen', 'income'),
  ('Usaha & Penjualan', 'income'),
  ('Lainnya (Pemasukan)', 'income'),
  ('Makanan & Minuman', 'expense'),
  ('Belanja Bulanan', 'expense'),
  ('Transportasi & Bensin', 'expense'),
  ('Tagihan & Utilitas', 'expense'),
  ('Hiburan & Rekreasi', 'expense'),
  ('Kesehatan & Obat', 'expense'),
  ('Pendidikan', 'expense'),
  ('Lainnya (Pengeluaran)', 'expense')
ON CONFLICT DO NOTHING;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies: users
CREATE POLICY "Public users are viewable by authenticated users" 
  ON public.users FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE USING (auth.uid() = id);

-- 8. RLS Policies: categories
CREATE POLICY "Categories are viewable by all authenticated users" 
  ON public.categories FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can manage categories" 
  ON public.categories FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- 9. RLS Policies: transactions
CREATE POLICY "Users can view their own transactions or admins view all" 
  ON public.transactions FOR SELECT USING (
    auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can insert their own transactions" 
  ON public.transactions FOR INSERT WITH CHECK (
    auth.uid() = user_id OR user_id IS NULL
  );

CREATE POLICY "Users can edit/delete their own transactions or admins edit all" 
  ON public.transactions FOR ALL USING (
    auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- 10. Trigger Otimatis Sinkronisasi Profile User dari auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

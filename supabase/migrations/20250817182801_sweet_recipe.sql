-- Complete Database Schema Migration
-- This includes all tables that actually exist in your Supabase database

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('worker', 'supervisor', 'admin')),
  worker_id text,
  created_at timestamptz DEFAULT now()
);

-- Work logs table
CREATE TABLE IF NOT EXISTS work_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES users(id),
  worker_name text NOT NULL,
  product text NOT NULL,
  product_id text,
  task text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  completed boolean DEFAULT false,
  notes text,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- BOM table
CREATE TABLE IF NOT EXISTS bom (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product text NOT NULL,
  material text NOT NULL,
  qty_per_unit decimal NOT NULL CHECK (qty_per_unit > 0),
  unit text NOT NULL,
  waste_percent decimal DEFAULT 0 CHECK (waste_percent >= 0),
  deduct_at_stage text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Stock table (simplified - no used/remaining columns)
CREATE TABLE IF NOT EXISTS stock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material text UNIQUE NOT NULL,
  unit text NOT NULL,
  current_stock decimal DEFAULT 0 CHECK (current_stock >= 0),
  reorder_threshold decimal DEFAULT 10 CHECK (reorder_threshold >= 0),
  last_updated timestamptz DEFAULT now()
);

-- Stock movements table
CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  stock_id uuid NOT NULL,
  type text NOT NULL,
  quantity numeric NOT NULL,
  note text NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  CONSTRAINT stock_movements_pkey PRIMARY KEY (id),
  CONSTRAINT stock_movements_stock_id_fkey FOREIGN KEY (stock_id) REFERENCES stock(id) ON DELETE CASCADE,
  CONSTRAINT stock_movements_quantity_check CHECK (quantity >= 0),
  CONSTRAINT stock_movements_type_check CHECK (type = ANY(ARRAY['in'::text, 'out'::text]))
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  description_ar text NULL,
  description_en text NULL,
  icon text NULL,
  color_gradient text NULL,
  active boolean NULL DEFAULT true,
  created_at timestamptz NULL DEFAULT now(),
  CONSTRAINT tasks_pkey PRIMARY KEY (id),
  CONSTRAINT tasks_code_key UNIQUE (code)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL,
  name_ar text NOT NULL,
  name_en text NOT NULL,
  category text NOT NULL,
  icon text NULL,
  active boolean NULL DEFAULT true,
  created_at timestamptz NULL DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_code_key UNIQUE (code)
);

-- Rates table
CREATE TABLE IF NOT EXISTS rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product text NOT NULL,
  task text NOT NULL,
  rate_per_unit decimal NOT NULL CHECK (rate_per_unit > 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(product, task)
);

-- Payroll table
CREATE TABLE IF NOT EXISTS payroll (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES users(id),
  worker_name text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  total_earnings decimal NOT NULL DEFAULT 0,
  paid_status boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  country text NOT NULL DEFAULT 'UAE',
  phone text,
  email text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  worker_count integer DEFAULT 0 CHECK (worker_count >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Production stats table
CREATE TABLE IF NOT EXISTS production_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  date date NOT NULL,
  completed_tasks integer NULL DEFAULT 0,
  pending_tasks integer NULL DEFAULT 0,
  revenue numeric NULL DEFAULT 0,
  efficiency_rate numeric NULL DEFAULT 0,
  active_workers integer NULL DEFAULT 0,
  created_at timestamptz NULL DEFAULT now(),
  CONSTRAINT production_stats_pkey PRIMARY KEY (id),
  CONSTRAINT production_stats_date_key UNIQUE (date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS stock_movements_stock_id_idx ON stock_movements(stock_id);
CREATE INDEX IF NOT EXISTS stock_movements_type_idx ON stock_movements(type);
CREATE INDEX IF NOT EXISTS stock_movements_created_at_idx ON stock_movements(created_at);
CREATE INDEX IF NOT EXISTS locations_status_idx ON locations(status);
CREATE INDEX IF NOT EXISTS locations_city_idx ON locations(city);
CREATE INDEX IF NOT EXISTS locations_country_idx ON locations(country);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bom ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_stats ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (you can customize these)
CREATE POLICY "Enable read access for all authenticated users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable read access for all authenticated users" ON work_logs FOR SELECT USING (true);
CREATE POLICY "Enable read access for all authenticated users" ON bom FOR SELECT USING (true);
CREATE POLICY "Enable read access for all authenticated users" ON stock FOR SELECT USING (true);
CREATE POLICY "Enable read access for all authenticated users" ON stock_movements FOR SELECT USING (true);
CREATE POLICY "Enable read access for all authenticated users" ON tasks FOR SELECT USING (true);
CREATE POLICY "Enable read access for all authenticated users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable read access for all authenticated users" ON rates FOR SELECT USING (true);
CREATE POLICY "Enable read access for all authenticated users" ON payroll FOR SELECT USING (true);
CREATE POLICY "Enable read access for all authenticated users" ON locations FOR SELECT USING (true);
CREATE POLICY "Enable read access for all authenticated users" ON production_stats FOR SELECT USING (true);
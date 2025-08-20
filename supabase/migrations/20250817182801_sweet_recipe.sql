/*
  # Textile Production Management System Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `role` (text, worker/supervisor/admin)
      - `worker_id` (text, optional)
      - `created_at` (timestamp)
    
    - `work_logs`
      - `id` (uuid, primary key)
      - `worker_id` (uuid, foreign key)
      - `worker_name` (text)
      - `product` (text)
      - `product_id` (text, optional)
      - `task` (text)
      - `quantity` (integer)
      - `completed` (boolean)
      - `notes` (text, optional)
      - `approved` (boolean, default false)
      - `created_at` (timestamp)
    
    - `bom` (Bill of Materials)
      - `id` (uuid, primary key)
      - `product` (text)
      - `material` (text)
      - `qty_per_unit` (decimal)
      - `unit` (text)
      - `waste_percent` (decimal, default 0)
      - `deduct_at_stage` (text)
      - `created_at` (timestamp)
    
    - `stock`
      - `id` (uuid, primary key)
      - `material` (text, unique)
      - `unit` (text)
      - `current_stock` (decimal, default 0)
      - `used` (decimal, default 0)
      - `remaining` (decimal, default 0)
      - `reorder_threshold` (decimal, default 10)
      - `last_updated` (timestamp)
    
    - `rates`
      - `id` (uuid, primary key)
      - `product` (text)
      - `task` (text)
      - `rate_per_unit` (decimal)
      - `created_at` (timestamp)
    
    - `payroll`
      - `id` (uuid, primary key)
      - `worker_id` (uuid)
      - `worker_name` (text)
      - `period_start` (date)
      - `period_end` (date)
      - `total_earnings` (decimal, default 0)
      - `paid_status` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    - Workers can only see their own data
    - Supervisors can view production data
    - Admins have full access
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('worker', 'supervisor', 'admin')),
  worker_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('supervisor', 'admin')
  ));

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

ALTER TABLE work_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can insert own logs"
  ON work_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = worker_id);

CREATE POLICY "Workers can read own logs"
  ON work_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = worker_id OR EXISTS (
    SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('supervisor', 'admin')
  ));

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

ALTER TABLE bom ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read BOM"
  ON bom
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify BOM"
  ON bom
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

-- Stock table
CREATE TABLE IF NOT EXISTS stock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material text UNIQUE NOT NULL,
  unit text NOT NULL,
  current_stock decimal DEFAULT 0 CHECK (current_stock >= 0),
  used decimal DEFAULT 0 CHECK (used >= 0),
  remaining decimal DEFAULT 0 CHECK (remaining >= 0),
  reorder_threshold decimal DEFAULT 10 CHECK (reorder_threshold >= 0),
  last_updated timestamptz DEFAULT now()
);

ALTER TABLE stock ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Supervisors and admins can read stock"
  ON stock
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('supervisor', 'admin')
  ));

CREATE POLICY "Only admins can modify stock"
  ON stock
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

-- Rates table
CREATE TABLE IF NOT EXISTS rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product text NOT NULL,
  task text NOT NULL,
  rate_per_unit decimal NOT NULL CHECK (rate_per_unit > 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(product, task)
);

ALTER TABLE rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can read rates"
  ON rates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify rates"
  ON rates
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

-- Payroll table
CREATE TABLE IF NOT EXISTS payroll (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES users(id),
  worker_name text NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  total_earnings decimal DEFAULT 0 CHECK (total_earnings >= 0),
  paid_status boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(worker_id, period_start)
);

ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can read own payroll"
  ON payroll
  FOR SELECT
  TO authenticated
  USING (auth.uid() = worker_id OR EXISTS (
    SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('supervisor', 'admin')
  ));

CREATE POLICY "Only admins can modify payroll"
  ON payroll
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

-- Insert demo data
INSERT INTO users (email, name, role, worker_id) VALUES
  ('admin@textile.com', 'Admin User', 'admin', NULL),
  ('supervisor@textile.com', 'Supervisor User', 'supervisor', NULL),
  ('worker@textile.com', 'Worker One', 'worker', 'W001'),
  ('worker2@textile.com', 'Worker Two', 'worker', 'W002');

INSERT INTO stock (material, unit, current_stock, used, remaining, reorder_threshold) VALUES
  ('Cotton Fabric', 'meters', 1000, 0, 1000, 50),
  ('Polyester Thread', 'spools', 200, 0, 200, 20),
  ('Buttons', 'pieces', 5000, 0, 5000, 100),
  ('Zippers', 'pieces', 500, 0, 500, 25),
  ('Elastic Band', 'meters', 300, 0, 300, 15);

INSERT INTO bom (product, material, qty_per_unit, unit, waste_percent, deduct_at_stage) VALUES
  ('T-Shirt', 'Cotton Fabric', 2.5, 'meters', 5, 'cutting'),
  ('T-Shirt', 'Polyester Thread', 0.1, 'spools', 2, 'sewing'),
  ('Jeans', 'Cotton Fabric', 3.0, 'meters', 8, 'cutting'),
  ('Jeans', 'Polyester Thread', 0.15, 'spools', 3, 'sewing'),
  ('Jeans', 'Buttons', 5, 'pieces', 0, 'finishing'),
  ('Jeans', 'Zippers', 1, 'pieces', 0, 'finishing'),
  ('Dress', 'Cotton Fabric', 4.0, 'meters', 6, 'cutting'),
  ('Dress', 'Polyester Thread', 0.2, 'spools', 2, 'sewing'),
  ('Jacket', 'Cotton Fabric', 5.0, 'meters', 10, 'cutting'),
  ('Jacket', 'Polyester Thread', 0.25, 'spools', 5, 'sewing'),
  ('Jacket', 'Zippers', 2, 'pieces', 0, 'finishing');

INSERT INTO rates (product, task, rate_per_unit) VALUES
  ('T-Shirt', 'cutting', 0.50),
  ('T-Shirt', 'sewing', 1.50),
  ('T-Shirt', 'finishing', 0.75),
  ('T-Shirt', 'embroidery', 2.00),
  ('Jeans', 'cutting', 0.75),
  ('Jeans', 'sewing', 2.50),
  ('Jeans', 'finishing', 1.25),
  ('Dress', 'cutting', 1.00),
  ('Dress', 'sewing', 3.00),
  ('Dress', 'finishing', 1.50),
  ('Dress', 'embroidery', 4.00),
  ('Jacket', 'cutting', 1.50),
  ('Jacket', 'sewing', 4.00),
  ('Jacket', 'finishing', 2.00),
  ('Shirt', 'cutting', 0.60),
  ('Shirt', 'sewing', 2.00),
  ('Shirt', 'finishing', 1.00);
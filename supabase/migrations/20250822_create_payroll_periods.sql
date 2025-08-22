-- Create payroll_periods table
CREATE TABLE IF NOT EXISTS public.payroll_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_payroll_periods_status ON public.payroll_periods(status);
CREATE INDEX IF NOT EXISTS idx_payroll_periods_dates ON public.payroll_periods(start_date, end_date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payroll_periods_active ON public.payroll_periods(status) WHERE status = 'active';

-- Add RLS policies
ALTER TABLE public.payroll_periods ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can view
CREATE POLICY "Users can view payroll periods" ON public.payroll_periods
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Only supervisors and admins can insert/update
CREATE POLICY "Supervisors and admins can manage payroll periods" ON public.payroll_periods
  FOR ALL USING (auth.role() IN ('supervisor', 'admin'));

-- Insert initial period for August 2025 (current)
INSERT INTO public.payroll_periods (period_name, start_date, end_date, status, notes)
VALUES ('August 2025', '2025-08-01', '2025-08-31', 'active', 'Initial payroll period created');

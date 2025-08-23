export interface Payroll {
  id: string;
  worker_id: string;
  worker_name: string;
  period_start: string;
  period_end: string;
  total_earnings: number;
  paid_status: boolean;
  created_at: string;
}

export interface PayrollPeriod {
  id: string;
  period_name: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'closed' | 'pending';
  created_at: string;
  closed_at?: string;
  notes?: string;
}

export interface PayrollFilters {
  selectedPeriod: string;
  selectedSchedule: string;
  showUnpaidFirst: boolean;
  appliedWorkerFilter: string;
  appliedStatusFilter: string;
}

export interface Payroll {
  id: string;
  worker_id: string;
  worker_name: string;
  period_start: string;
  period_end: string;
  total_earnings: number;
  paid_status: boolean;
  created_at: string;
  updated_at: string;
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  payment_schedule?: string;
  payment_day?: string;
  next_payment_date?: string;
  last_payment_date?: string;
}

export interface PayrollFilters {
  selectedPeriod: string;
  selectedSchedule: string;
  showUnpaidFirst: boolean;
  appliedWorkerFilter: string;
  appliedStatusFilter: string;
}

export interface PayrollStats {
  totalPayroll: number;
  paidAmount: number;
  totalPending: number;
  paymentRate: number;
}

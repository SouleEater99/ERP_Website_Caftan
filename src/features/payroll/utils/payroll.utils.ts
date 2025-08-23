import { Payroll, Worker } from '../types/payroll.types';

export const formatCurrency = (amount: number | undefined): string => {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0';
  return `$${amount.toLocaleString()}`;
};

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return 'N/A';
  }
};

export const calculatePayrollStats = (payrollData: Payroll[]): {
  totalPayroll: number;
  paidAmount: number;
  totalPending: number;
  paymentRate: number;
} => {
  const total = payrollData.reduce((sum, record) => sum + (record.total_earnings || 0), 0);
  const paid = payrollData
    .filter(record => record.paid_status)
    .reduce((sum, record) => sum + (record.total_earnings || 0), 0);
  const pending = total - paid;
  const rate = total > 0 ? ((paid / total) * 100) : 0;
  
  return { totalPayroll: total, paidAmount: paid, totalPending: pending, paymentRate: rate };
};

export const getWorkersDueForPayment = (workers: Worker[]): Worker[] => {
  const now = new Date();
  return workers.filter(worker => {
    if (!worker.next_payment_date) return false;
    const nextPayment = new Date(worker.next_payment_date);
    return nextPayment <= now;
  });
};

export const calculateNextPaymentDate = (worker: Worker): string => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  switch (worker.payment_schedule) {
    case 'daily':
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      return tomorrow.toISOString().split('T')[0];
    case 'weekly':
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return nextWeek.toISOString().split('T')[0];
    case 'bi-weekly':
      const nextBiWeek = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
      return nextBiWeek.toISOString().split('T')[0];
    case 'monthly':
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
      return nextMonth.toISOString().split('T')[0];
    case 'quarterly':
      const nextQuarter = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
      return nextQuarter.toISOString().split('T')[0];
    default:
      return todayStr;
  }
};

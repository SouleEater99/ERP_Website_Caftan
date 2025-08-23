export const PAYROLL_SCHEDULES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BI_WEEKLY: 'bi-weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
  ALL: 'all'
} as const;

export const PAYROLL_PERIODS = {
  ALL: 'all',
  CURRENT: 'current',
  PREVIOUS: 'previous'
} as const;

export const PAYROLL_STATUSES = {
  PAID: 'paid',
  UNPAID: 'unpaid',
  ALL: 'all'
} as const;

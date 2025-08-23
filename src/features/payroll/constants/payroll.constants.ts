export const PAYROLL_SCHEDULES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BI_WEEKLY: 'bi-weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly'
} as const;

export const PAYROLL_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  ALL: 'all'
} as const;

export const PAYROLL_PERIODS = {
  ALL: 'all',
  CURRENT: 'current',
  PREVIOUS: 'previous'
} as const;

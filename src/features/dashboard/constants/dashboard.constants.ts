export const DASHBOARD_COLORS = {
  TOTAL_WORKERS: 'cold-gradient',
  ACTIVE_ORDERS: 'bg-gradient-to-r from-emerald-500 to-teal-600',
  COMPLETED_TASKS: 'bg-gradient-to-r from-blue-500 to-indigo-600',
  PENDING_APPROVALS: 'bg-gradient-to-r from-amber-500 to-yellow-500',
  TOTAL_EARNINGS: 'bg-gradient-to-r from-purple-500 to-pink-600',
} as const;

export const DASHBOARD_TRENDS = {
  WORKERS: '+15%',
  ORDERS: '+12%',
  TASKS: '+18%',
  EARNINGS: '+25%',
} as const;

export const DASHBOARD_DELAYS = {
  WORKERS: 100,
  ORDERS: 200,
  TASKS: 300,
  APPROVALS: 400,
  EARNINGS: 500,
} as const;

export const DASHBOARD_MESSAGES = {
  NO_ACTIVITIES: 'No recent activities',
  ALL_STOCK_ADEQUATE: 'All stock levels are adequate',
  WELCOME_BACK: 'Welcome back,',
  LOADING: 'Loading...',
  EXCELLENCE_TAGLINE: 'Caftan Talia - Excellence in Traditional Fashion',
} as const;

export const DASHBOARD_SECTIONS = {
  RECENT_ACTIVITIES: 'Recent Activities',
  LOW_STOCK_ALERTS: 'Low Stock Alerts',
  DEBUG_INFO: '🔍 Table Structure Debug',
} as const;

export const calculatePayrollPeriod = (schedule: string, period: string) => {
  const now = new Date();
  
  switch (schedule) {
    case 'daily':
      return {
        startDate: new Date(now),
        endDate: new Date(now)
      };
    case 'weekly':
      return {
        startDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        endDate: now
      };
    case 'monthly':
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: now
      };
    default:
      return {
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: now
      };
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const REPORT_PERIODS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
];

export const REPORT_TYPES = [
  { id: 'production', label: 'productionOverview', icon: 'BarChart3' },
  { id: 'workers', label: 'workerPerformance', icon: 'Users' },
  { id: 'materials', label: 'materialUsage', icon: 'PieChart' },
  { id: 'financial', label: 'financialSummary', icon: 'DollarSign' }
];

export const EXPORT_OPTIONS = [
  { format: 'pdf', label: 'exportAsPDF', icon: 'FileText' },
  { format: 'excel', label: 'exportAsExcel', icon: 'BarChart3' },
  { format: 'csv', label: 'exportAsCSV', icon: 'Activity' }
];
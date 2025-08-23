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

export const MOCK_PRODUCTION_DATA = [
  { month: 'Jan', completed: 245, pending: 32, revenue: 12500 },
  { month: 'Feb', completed: 289, pending: 28, revenue: 14200 },
  { month: 'Mar', completed: 312, pending: 35, revenue: 15800 },
  { month: 'Apr', completed: 278, pending: 22, revenue: 13900 },
  { month: 'May', completed: 334, pending: 41, revenue: 16700 },
  { month: 'Jun', completed: 356, pending: 29, revenue: 17800 }
];

export const MOCK_WORKER_PERFORMANCE = [
  { name: 'Ahmed Ali', tasks: 89, efficiency: 94, earnings: 2340 },
  { name: 'Fatima Hassan', tasks: 76, efficiency: 91, earnings: 2180 },
  { name: 'Mohammed Omar', tasks: 82, efficiency: 88, earnings: 2250 },
  { name: 'Aisha Salem', tasks: 71, efficiency: 92, earnings: 2100 },
  { name: 'Khalid Ahmed', tasks: 85, efficiency: 89, earnings: 2290 }
];

export const MOCK_MATERIAL_USAGE = [
  { name: 'Cotton Fabric', value: 35, color: '#0EA5E9' },
  { name: 'Silk Thread', value: 25, color: '#06B6D4' },
  { name: 'Buttons', value: 20, color: '#0891B2' },
  { name: 'Zippers', value: 12, color: '#0E7490' },
  { name: 'Other', value: 8, color: '#164E63' }
];

export const QUICK_STATS = [
  { label: 'todaysTasks', value: '47', color: 'text-slate-800' },
  { label: 'completionRate', value: '94.2%', color: 'text-emerald-600' },
  { label: 'activeOrders', value: '23', color: 'text-blue-600' },
  { label: 'pendingApprovals', value: '8', color: 'text-amber-600' }
];

export const RECENT_ACTIVITIES = [
  { 
    action: 'productionCompleted', 
    item: 'كفتان حريري #CT-001', 
    time: 'منذ ساعتين', 
    status: 'success' 
  },
  { 
    action: 'qualityCheck', 
    item: 'جلابية قطنية #CT-002', 
    time: 'منذ 4 ساعات', 
    status: 'pending' 
  },
  { 
    action: 'materialRestocked', 
    item: 'خيط حرير - 50 بكرة', 
    time: 'منذ 6 ساعات', 
    status: 'info' 
  }
];

export const EXPORT_OPTIONS = [
  { format: 'pdf', label: 'exportAsPDF', icon: 'FileText' },
  { format: 'excel', label: 'exportAsExcel', icon: 'BarChart3' },
  { format: 'csv', label: 'exportAsCSV', icon: 'Activity' }
];
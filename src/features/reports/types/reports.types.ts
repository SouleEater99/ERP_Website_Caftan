export interface ProductionData {
  month: string;
  completed: number;
  pending: number;
  revenue: number;
}

export interface WorkerPerformance {
  name: string;
  tasks: number;
  efficiency: number;
  earnings: number;
}

export interface MaterialUsage {
  name: string;
  value: number;
  color: string;
}

export interface ReportPeriod {
  value: string;
  label: string;
}

export interface ReportType {
  id: string;
  label: string;
  icon: string;
}

export interface QuickStat {
  label: string;
  value: string;
  color: string;
}

export interface RecentActivity {
  action: string;
  item: string;
  time: string;
  status: 'success' | 'pending' | 'info';
}

export interface ExportOption {
  format: string;
  label: string;
  icon: string;
}

export interface ReportCardProps {
  title: string;
  value: string;
  change?: string;
  icon: any;
  color: string;
  trend?: string;
}

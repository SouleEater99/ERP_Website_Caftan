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
  labelKey: string;
  value: string;
  color: string;
}

export interface RecentActivity {
  id: string;
  actionKey: string;
  item: string;
  timestamp: string;
  status: 'success' | 'pending' | 'error';
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

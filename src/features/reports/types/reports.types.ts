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
  value: string;
  label: string;
  icon: string;
}

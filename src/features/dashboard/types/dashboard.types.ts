export interface DashboardStats {
  totalWorkers: number;
  activeOrders: number;
  completedTasks: number;
  pendingApprovals: number;
  totalEarnings: number;
}

export interface RecentActivity {
  id: string;
  worker: string;
  task: string;
  product: string;
  time: string;
  avatar: string;
}

export interface LowStockItem {
  material: string;
  current: number;
  threshold: number;
  unit: string;
}

export interface TableStructure {
  usersColumns: string[];
  stockColumns: string[];
  ratesColumns: string[];
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  trend?: string;
  delay?: number;
}

import { supabase } from '../../../lib/supabase';

export interface WorkLogStats {
  total_completed: number;
  total_pending: number;
  total_revenue: number;
  worker_count: number;
  efficiency_rate: number;
}

export interface MonthlyProduction {
  month: string;
  completed: number;
  pending: number;
  revenue: number;
}

export interface WorkerPerformance {
  worker_name: string;
  tasks_completed: number;
  efficiency: number;
  total_earnings: number;
}

export interface MaterialUsage {
  material_name: string;
  quantity_used: number;
  percentage: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  item: string;
  timestamp: string;
  status: 'success' | 'pending' | 'info';
}

export class ReportsService {
  // Get overall statistics
  static async getWorkLogStats(period: string = 'monthly'): Promise<WorkLogStats> {
    const { data, error } = await supabase
      .from('work_logs')
      .select('*');

    if (error) throw error;

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const filteredData = data.filter(log => new Date(log.created_at) >= startDate);

    const total_completed = filteredData.filter(log => log.completed).length;
    const total_pending = filteredData.filter(log => !log.completed).length;
    const total_revenue = filteredData.reduce((sum, log) => sum + (log.quantity * 10), 0); // Assuming 10 per unit
    const worker_count = new Set(filteredData.map(log => log.worker_id)).size;
    const efficiency_rate = filteredData.length > 0 ? (total_completed / filteredData.length) * 100 : 0;

    return {
      total_completed,
      total_pending,
      total_revenue,
      worker_count,
      efficiency_rate
    };
  }

  // Get monthly production data
  static async getMonthlyProduction(): Promise<MonthlyProduction[]> {
    const { data, error } = await supabase
      .from('work_logs')
      .select('*')
      .gte('created_at', new Date(new Date().getFullYear(), 0, 1).toISOString());

    if (error) throw error;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData: MonthlyProduction[] = [];

    for (let i = 0; i < 6; i++) {
      const monthIndex = new Date().getMonth() - 5 + i;
      const monthName = months[monthIndex];
      const monthStart = new Date(new Date().getFullYear(), monthIndex, 1);
      const monthEnd = new Date(new Date().getFullYear(), monthIndex + 1, 0);

      const monthLogs = data.filter(log => {
        const logDate = new Date(log.created_at);
        return logDate >= monthStart && logDate <= monthEnd;
      });

      const completed = monthLogs.filter(log => log.completed).length;
      const pending = monthLogs.filter(log => !log.completed).length;
      const revenue = monthLogs.reduce((sum, log) => sum + (log.quantity * 10), 0);

      monthlyData.push({
        month: monthName,
        completed,
        pending,
        revenue
      });
    }

    return monthlyData;
  }

  // Get worker performance data
  static async getWorkerPerformance(): Promise<WorkerPerformance[]> {
    const { data, error } = await supabase
      .from('work_logs')
      .select('*')
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

    if (error) throw error;

    const workerStats = new Map<string, { tasks: number; completed: number; earnings: number }>();

    data.forEach(log => {
      const workerName = log.worker_name || 'Unknown Worker';
      const current = workerStats.get(workerName) || { tasks: 0, completed: 0, earnings: 0 };
      
      current.tasks += 1;
      if (log.completed) current.completed += 1;
      current.earnings += log.quantity * 10; // Assuming 10 per unit

      workerStats.set(workerName, current);
    });

    return Array.from(workerStats.entries()).map(([worker_name, stats]) => ({
      worker_name,
      tasks_completed: stats.completed,
      efficiency: stats.tasks > 0 ? (stats.completed / stats.tasks) * 100 : 0,
      total_earnings: stats.earnings
    })).sort((a, b) => b.tasks_completed - a.tasks_completed).slice(0, 5);
  }

  // Get material usage data
  static async getMaterialUsage(): Promise<MaterialUsage[]> {
    const { data, error } = await supabase
      .from('work_logs')
      .select('product, quantity')
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

    if (error) throw error;

    const materialStats = new Map<string, number>();
    const totalQuantity = data.reduce((sum, log) => sum + log.quantity, 0);

    data.forEach(log => {
      const product = log.product;
      const current = materialStats.get(product) || 0;
      materialStats.set(product, current + log.quantity);
    });

    const colors = ['#0EA5E9', '#06B6D4', '#0891B2', '#0E7490', '#164E63'];
    
    return Array.from(materialStats.entries())
      .map(([material_name, quantity_used], index) => ({
        material_name,
        quantity_used,
        percentage: totalQuantity > 0 ? (quantity_used / totalQuantity) * 100 : 0,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.quantity_used - a.quantity_used)
      .slice(0, 5);
  }

  // Get recent activities
  static async getRecentActivities(): Promise<RecentActivity[]> {
    const { data, error } = await supabase
      .from('work_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return data.map(log => ({
      id: log.id,
      action: log.completed ? 'productionCompleted' : 'taskStarted',
      item: `${log.product} - ${log.task}`,
      timestamp: log.created_at,
      status: log.completed ? 'success' : 'pending'
    }));
  }

  // Get quick stats
  static async getQuickStats(): Promise<{ label: string; value: string; color: string }[]> {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const { data: todayLogs, error: todayError } = await supabase
      .from('work_logs')
      .select('*')
      .gte('created_at', todayStart.toISOString());

    if (todayError) throw todayError;

    const { data: allLogs, error: allError } = await supabase
      .from('work_logs')
      .select('*');

    if (allError) throw allError;

    const todayTasks = todayLogs.length;
    const completionRate = allLogs.length > 0 ? (allLogs.filter(log => log.completed).length / allLogs.length) * 100 : 0;
    const activeOrders = allLogs.filter(log => !log.completed).length;
    const pendingApprovals = allLogs.filter(log => log.completed && !log.approved).length;

    return [
      { label: 'todaysTasks', value: todayTasks.toString(), color: 'text-slate-800' },
      { label: 'completionRate', value: `${completionRate.toFixed(1)}%`, color: 'text-emerald-600' },
      { label: 'activeOrders', value: activeOrders.toString(), color: 'text-blue-600' },
      { label: 'pendingApprovals', value: pendingApprovals.toString(), color: 'text-amber-600' }
    ];
  }
}

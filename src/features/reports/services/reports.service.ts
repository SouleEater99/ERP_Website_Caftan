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
  color: string;
  cost_per_unit?: number;
  total_cost?: number;
}

export interface MaterialUsageDetail {
  material_name: string;
  quantity_used: number;
  percentage: number;
  color: string;
  last_used: string;
  supplier?: string;
  stock_level?: number;
  reorder_point?: number;
}

export interface RecentActivity {
  id: string;
  actionKey: string; // Changed from 'action' to 'actionKey'
  item: string;
  timestamp: string;
  status: 'success' | 'pending' | 'error';
}

export interface ExportData {
  filename: string;
  data: any;
  format: string;
}

export class ReportsService {
  // Helper method to get start date based on period
  private static getStartDate(period: string): Date {
    const now = new Date();
    switch (period) {
      case 'daily':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case 'weekly':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'monthly':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'yearly':
        return new Date(now.getFullYear(), 0, 1);
      default:
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }
  }

  // Helper method to calculate revenue (placeholder - should use actual product prices)
  private static calculateRevenue(workLog: any): number {
    // TODO: Replace with actual product pricing from database
    const basePrice = 25; // Base price per unit
    const taskMultiplier = workLog.task === 'sewing' ? 1.2 : 
                          workLog.task === 'cutting' ? 1.0 : 
                          workLog.task === 'finishing' ? 1.1 : 1.0;
    return workLog.quantity * basePrice * taskMultiplier;
  }

  // Get overall statistics with proper period filtering
  static async getWorkLogStats(period: string = 'monthly'): Promise<WorkLogStats> {
    try {
      const startDate = this.getStartDate(period);
      
      const { data, error } = await supabase
        .from('work_logs')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          total_completed: 0,
          total_pending: 0,
          total_revenue: 0,
          worker_count: 0,
          efficiency_rate: 0
        };
      }

      const total_completed = data.filter(log => log.completed).length;
      const total_pending = data.filter(log => !log.completed).length;
      const total_revenue = data.reduce((sum, log) => sum + this.calculateRevenue(log), 0);
      const worker_count = new Set(data.map(log => log.worker_id)).size;
      const efficiency_rate = data.length > 0 ? (total_completed / data.length) * 100 : 0;

      return {
        total_completed,
        total_pending,
        total_revenue,
        worker_count,
        efficiency_rate
      };
    } catch (error) {
      console.error('Error fetching work log stats:', error);
      throw new Error('Failed to fetch work log statistics');
    }
  }

  // Get monthly production data with proper period filtering
  static async getMonthlyProduction(period: string = 'monthly'): Promise<MonthlyProduction[]> {
    try {
      const startDate = this.getStartDate(period);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyData: MonthlyProduction[] = [];

      // Get data for the last 6 months from the start date
      for (let i = 0; i < 6; i++) {
        const monthStart = new Date(startDate);
        monthStart.setMonth(startDate.getMonth() - 5 + i);
        const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
        
        const monthName = months[monthStart.getMonth()];

        const { data: monthLogs, error } = await supabase
          .from('work_logs')
          .select('*')
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString());

        if (error) throw error;

        const completed = monthLogs?.filter(log => log.completed).length || 0;
        const pending = monthLogs?.filter(log => !log.completed).length || 0;
        const revenue = monthLogs?.reduce((sum, log) => sum + this.calculateRevenue(log), 0) || 0;

        monthlyData.push({
          month: monthName,
          completed,
          pending,
          revenue
        });
      }

      return monthlyData;
    } catch (error) {
      console.error('Error fetching monthly production:', error);
      throw new Error('Failed to fetch monthly production data');
    }
  }

  // Get worker performance data with period filtering
  static async getWorkerPerformance(period: string = 'monthly'): Promise<WorkerPerformance[]> {
    try {
      const startDate = this.getStartDate(period);
      
      const { data, error } = await supabase
        .from('work_logs')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      const workerStats = new Map<string, { tasks: number; completed: number; earnings: number }>();

      data.forEach(log => {
        const workerName = log.worker_name || 'Unknown Worker';
        const current = workerStats.get(workerName) || { tasks: 0, completed: 0, earnings: 0 };
        
        current.tasks += 1;
        if (log.completed) current.completed += 1;
        current.earnings += this.calculateRevenue(log);

        workerStats.set(workerName, current);
      });

      return Array.from(workerStats.entries()).map(([worker_name, stats]) => ({
        worker_name,
        tasks_completed: stats.completed,
        efficiency: stats.tasks > 0 ? (stats.completed / stats.tasks) * 100 : 0,
        total_earnings: stats.earnings
      })).sort((a, b) => b.tasks_completed - a.tasks_completed).slice(0, 5);
    } catch (error) {
      console.error('Error fetching worker performance:', error);
      throw new Error('Failed to fetch worker performance data');
    }
  }

  // Get material usage data with period filtering and enhanced details
  static async getMaterialUsage(period: string = 'monthly'): Promise<MaterialUsage[]> {
    try {
      const startDate = this.getStartDate(period);
      
      const { data, error } = await supabase
        .from('work_logs')
        .select('product, quantity, created_at, task')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      const materialStats = new Map<string, { 
        quantity: number; 
        lastUsed: Date; 
        tasks: Set<string>;
        cost: number;
      }>();

      data.forEach(log => {
        const product = log.product;
        const current = materialStats.get(product) || { 
          quantity: 0, 
          lastUsed: new Date(log.created_at), 
          tasks: new Set(),
          cost: 0
        };
        
        current.quantity += log.quantity;
        current.lastUsed = new Date(Math.max(current.lastUsed.getTime(), new Date(log.created_at).getTime()));
        current.tasks.add(log.task);
        
        // Calculate estimated cost (placeholder - should use actual material costs)
        const materialCosts: { [key: string]: number } = {
          'cotton': 15,
          'silk': 45,
          'linen': 25,
          'wool': 35,
          'polyester': 8,
          'denim': 20
        };
        
        const baseCost = materialCosts[product.toLowerCase()] || 20;
        current.cost += log.quantity * baseCost;
        
        materialStats.set(product, current);
      });

      const totalQuantity = Array.from(materialStats.values()).reduce((sum, stats) => sum + stats.quantity, 0);
      const colors = ['#0EA5E9', '#06B6D4', '#0891B2', '#0E7490', '#164E63', '#F59E0B', '#EF4444', '#8B5CF6'];
      
      return Array.from(materialStats.entries())
        .map(([material_name, stats], index) => ({
          material_name,
          quantity_used: stats.quantity,
          percentage: totalQuantity > 0 ? (stats.quantity / totalQuantity) * 100 : 0,
          color: colors[index % colors.length],
          cost_per_unit: stats.cost / stats.quantity,
          total_cost: stats.cost
        }))
        .sort((a, b) => b.quantity_used - a.quantity_used)
        .slice(0, 8); // Show top 8 materials
    } catch (error) {
      console.error('Error fetching material usage:', error);
      throw new Error('Failed to fetch material usage data');
    }
  }

  // Get detailed material usage breakdown
  static async getMaterialUsageDetails(period: string = 'monthly'): Promise<MaterialUsageDetail[]> {
    try {
      const startDate = this.getStartDate(period);
      
      const { data, error } = await supabase
        .from('work_logs')
        .select('product, quantity, created_at, task, worker_name')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      const materialDetails = new Map<string, MaterialUsageDetail>();

      data.forEach(log => {
        const product = log.product;
        const current = materialDetails.get(product);
        
        if (current) {
          current.quantity_used += log.quantity;
          current.last_used = log.created_at;
        } else {
          const colors = ['#0EA5E9', '#06B6D4', '#0891B2', '#0E7490', '#164E63', '#F59E0B', '#EF4444', '#8B5CF6'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          
          materialDetails.set(product, {
            material_name: product,
            quantity_used: log.quantity,
            percentage: 0,
            color: randomColor,
            last_used: log.created_at,
            supplier: 'Local Supplier', // Placeholder
            stock_level: Math.floor(Math.random() * 100) + 50, // Placeholder
            reorder_point: 20 // Placeholder
          });
        }
      });

      // Calculate percentages
      const totalQuantity = Array.from(materialDetails.values()).reduce((sum, detail) => sum + detail.quantity_used, 0);
      materialDetails.forEach(detail => {
        detail.percentage = totalQuantity > 0 ? (detail.quantity_used / totalQuantity) * 100 : 0;
      });

      return Array.from(materialDetails.values())
        .sort((a, b) => b.quantity_used - a.quantity_used);
    } catch (error) {
      console.error('Error fetching material usage details:', error);
      throw new Error('Failed to fetch material usage details');
    }
  }

  // Get material usage trends over time
  static async getMaterialUsageTrends(period: string = 'monthly'): Promise<any[]> {
    try {
      const startDate = this.getStartDate(period);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const trendsData: any[] = [];

      // Get data for the last 6 months
      for (let i = 0; i < 6; i++) {
        const monthStart = new Date(startDate);
        monthStart.setMonth(startDate.getMonth() - 5 + i);
        const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
        
        const monthName = months[monthStart.getMonth()];

        const { data: monthLogs, error } = await supabase
          .from('work_logs')
          .select('product, quantity')
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString());

        if (error) throw error;

        const materialStats = new Map<string, number>();
        monthLogs?.forEach(log => {
          const current = materialStats.get(log.product) || 0;
          materialStats.set(log.product, current + log.quantity);
        });

        const monthData: any = { month: monthName };
        materialStats.forEach((quantity, material) => {
          monthData[material] = quantity;
        });

        trendsData.push(monthData);
      }

      return trendsData;
    } catch (error) {
      console.error('Error fetching material usage trends:', error);
      throw new Error('Failed to fetch material usage trends');
    }
  }

  // Get recent activities with period filtering
  static async getRecentActivities(period: string = 'monthly'): Promise<RecentActivity[]> {
    try {
      const startDate = this.getStartDate(period);
      
      const { data, error } = await supabase
        .from('work_logs')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (!data || data.length === 0) {
        return [];
      }

      return data.map(log => ({
        id: log.id,
        actionKey: log.completed ? 'dashboard.productionCompleted' : 'dashboard.taskStarted',
        item: `${log.product} - ${log.task}`,
        timestamp: log.created_at,
        status: log.completed ? 'success' : 'pending'
      }));
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw new Error('Failed to fetch recent activities');
    }
  }

  // Get quick stats with period filtering
  static async getQuickStats(period: string = 'monthly'): Promise<{ labelKey: string; value: string; color: string }[]> {
    try {
      const startDate = this.getStartDate(period);
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      // Get today's logs
      const { data: todayLogs, error: todayError } = await supabase
        .from('work_logs')
        .select('*')
        .gte('created_at', todayStart.toISOString());

      if (todayError) throw todayError;

      // Get period logs
      const { data: periodLogs, error: periodError } = await supabase
        .from('work_logs')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (periodError) throw periodError;

      const todayTasks = todayLogs?.length || 0;
      const completionRate = periodLogs && periodLogs.length > 0 ? 
        (periodLogs.filter(log => log.completed).length / periodLogs.length) * 100 : 0;
      const activeOrders = periodLogs?.filter(log => !log.completed).length || 0;
      const pendingApprovals = periodLogs?.filter(log => log.completed && !log.approved).length || 0;

      return [
        { labelKey: 'dashboard.todaysTasks', value: todayTasks.toString(), color: 'text-slate-800' },
        { labelKey: 'dashboard.completionRate', value: `${completionRate.toFixed(1)}%`, color: 'text-emerald-600' },
        { labelKey: 'dashboard.activeOrders', value: activeOrders.toString(), color: 'text-blue-600' },
        { labelKey: 'dashboard.pendingApprovals', value: pendingApprovals.toString(), color: 'text-amber-600' }
      ];
    } catch (error) {
      console.error('Error fetching quick stats:', error);
      throw new Error('Failed to fetch quick statistics');
    }
  }

  // Export report data
  static async exportReport(reportType: string, period: string, format: string): Promise<ExportData> {
    try {
      let data: any;
      
      switch (reportType) {
        case 'production':
          data = await this.getMonthlyProduction(period);
          break;
        case 'workers':
          data = await this.getWorkerPerformance(period);
          break;
        case 'materials':
          data = await this.getMaterialUsage(period);
          break;
        case 'financial':
          data = await this.getMonthlyProduction(period);
          break;
        default:
          throw new Error('Invalid report type');
      }

      const filename = `${reportType}_${period}_${new Date().toISOString().split('T')[0]}`;
      
      return {
        filename,
        data,
        format
      };
    } catch (error) {
      console.error('Error exporting report:', error);
      throw new Error('Failed to export report');
    }
  }
}
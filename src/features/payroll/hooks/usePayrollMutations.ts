import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Payroll, Worker } from '../types/payroll.types';

export const usePayrollMutations = () => {
  const queryClient = useQueryClient();

  const updatePaymentMutation = useMutation<Payroll, Error, { id: string, paid_status: boolean }>({
    mutationFn: async ({ id, paid_status }) => {
      const { data, error } = await supabase
        .from('payroll')
        .update({ paid_status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
    }
  });

  const payAllPendingMutation = useMutation<Payroll[], Error, void>({
    mutationFn: async () => {
      const { data: pendingPayrolls } = await supabase
        .from('payroll')
        .select('*')
        .eq('paid_status', false);
      
      if (!pendingPayrolls || pendingPayrolls.length === 0) return [];

      const results = [];
      for (const payroll of pendingPayrolls) {
        const { data, error } = await supabase
          .from('payroll')
          .update({ paid_status: true })
          .eq('id', payroll.id)
          .select()
          .single();
        
        if (error) throw error;
        results.push(data);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
    }
  });

  // Calculate worker earnings for a period
  const calculateWorkerEarnings = async (workerId: string, startDate: string, endDate: string) => {
    const { data: workLogs, error } = await supabase
      .from('work_logs')
      .select('*')
      .eq('worker_id', workerId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .eq('completed', true);
    
    if (error) {
      console.error('Error fetching work logs:', error);
      return 0;
    }
    
    let totalEarnings = 0;
    for (const log of workLogs || []) {
      const { data: rateData } = await supabase
        .from('rates')
        .select('rate_per_unit')
        .eq('product', log.product)
        .eq('task', log.task)
        .single();
      
      if (rateData) {
        totalEarnings += (log.quantity || 0) * rateData.rate_per_unit;
      }
    }
    
    return totalEarnings;
  };

  // Calculate next payment date based on schedule
  const calculateNextPaymentDate = (worker: Worker) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    switch (worker.payment_schedule) {
      case 'daily':
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        return tomorrow.toISOString().split('T')[0];
      case 'weekly':
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return nextWeek.toISOString().split('T')[0];
      case 'bi-weekly':
        const nextBiWeek = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
        return nextBiWeek.toISOString().split('T')[0];
      case 'monthly':
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
        return nextMonth.toISOString().split('T')[0];
      case 'quarterly':
        const nextQuarter = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
        return nextQuarter.toISOString().split('T')[0];
      default:
        return todayStr;
    }
  };

  // Generate payroll for a specific worker
  const generatePayrollForWorker = async (worker: Worker) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    let startDate, endDate;
    
    switch (worker.payment_schedule) {
      case 'daily':
        startDate = todayStr;
        endDate = todayStr;
        break;
      case 'weekly':
        const weekAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
        startDate = weekAgo.toISOString().split('T')[0];
        endDate = todayStr;
        break;
      case 'bi-weekly':
        const biWeekAgo = new Date(today.getTime() - 13 * 24 * 60 * 60 * 1000);
        startDate = biWeekAgo.toISOString().split('T')[0];
        endDate = todayStr;
        break;
      case 'monthly':
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        startDate = monthAgo.toISOString().split('T')[0];
        endDate = todayStr;
        break;
      case 'quarterly':
        const quarterAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
        startDate = quarterAgo.toISOString().split('T')[0];
        endDate = todayStr;
        break;
      default:
        startDate = todayStr;
        endDate = todayStr;
    }
    
    try {
      const earnings = await calculateWorkerEarnings(worker.id, startDate, endDate);
      
      if (earnings > 0) {
        const { error: insertError } = await supabase.from('payroll').insert({
          worker_id: worker.id,
          worker_name: worker.name,
          period_start: startDate,
          period_end: endDate,
          total_earnings: earnings,
          paid_status: false
        });
        
        if (insertError) throw insertError;
        
        const nextPaymentDate = calculateNextPaymentDate(worker);
        const { error: updateError } = await supabase
          .from('users')
          .update({
            last_payment_date: todayStr,
            next_payment_date: nextPaymentDate
          })
          .eq('id', worker.id);
        
        if (updateError) throw updateError;
        
        console.log(`✅ Generated payroll for ${worker.name}: ${earnings} MAD`);
        return true;
      } else {
        console.log(`⚠️ No earnings for ${worker.name} in period ${startDate} to ${endDate}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error generating payroll for ${worker.name}:`, error);
      return false;
    }
  };

  // Generate payroll for all due workers
  const generatePayrollMutation = useMutation<any, Error, { period: string, schedule: string }>({
    mutationFn: async ({ period, schedule }) => {
      // Get workers due for payment
      const { data: workers } = await supabase
        .from('users')
        .select('id, name, payment_schedule, payment_day, next_payment_date, last_payment_date')
        .eq('role', 'worker')
        .order('name');
      
      if (!workers) return [];
      
      const now = new Date();
      const workersDueForPayment = workers.filter(worker => {
        if (!worker.next_payment_date) return false;
        const nextPayment = new Date(worker.next_payment_date);
        return nextPayment <= now;
      });
      
      const results = [];
      for (const worker of workersDueForPayment) {
        const success = await generatePayrollForWorker(worker);
        results.push({ worker: worker.name, success });
      }
      
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      queryClient.invalidateQueries({ queryKey: ['workers', 'payment-schedules'] });
    }
  });

  return {
    updatePaymentMutation,
    payAllPendingMutation,
    generatePayrollMutation
  };
};

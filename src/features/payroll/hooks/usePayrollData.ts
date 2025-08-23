import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Payroll as PayrollType } from '../../../lib/supabase';

interface UsePayrollDataProps {
  selectedPeriod: string;
  selectedSchedule: string;
  showUnpaidFirst: boolean;
  appliedWorkerFilter: string;
  appliedStatusFilter: string;
  user: any;
}

export const usePayrollData = ({
  selectedPeriod,
  selectedSchedule,
  showUnpaidFirst,
  appliedWorkerFilter,
  appliedStatusFilter,
  user
}: UsePayrollDataProps) => {
  return useQuery<PayrollType[], Error>({
    queryKey: ['payroll', selectedPeriod, selectedSchedule, showUnpaidFirst, appliedWorkerFilter, appliedStatusFilter],
    queryFn: async () => {
      console.log('🚀 Starting payroll query...');
      console.log(' Selected Period:', selectedPeriod);
      console.log('⏰ Selected Schedule:', selectedSchedule);
      
      let query = supabase
        .from('payroll')
        .select('*')
        .order('created_at', { ascending: false });

      // Declare variables outside the if blocks
      let startDate: Date | null = null;
      let endDate: Date | null = null;

      // Apply period filtering based on selected schedule
      if (selectedPeriod !== 'all') {
        const now = new Date();
        
        if (selectedSchedule === 'all') {
          // Default to monthly for 'all' schedules
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getMonth() + 1, 0);
        } else {
          // Calculate dates based on selected schedule
          switch (selectedSchedule) {
            case 'daily':
              // For daily: use TODAY's work logs (not yesterday)
              startDate = new Date(now);
              endDate = new Date(now);
              break;
            case 'weekly':
              // For weekly: use last 7 days including today
              startDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000); // 6 days ago
              endDate = now;
              break;
            case 'bi-weekly':
              // For bi-weekly: use last 14 days including today
              startDate = new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000); // 13 days ago
              endDate = now;
              break;
            case 'monthly':
              startDate = new Date(now.getFullYear(), now.getMonth(), 1);
              endDate = now;
              break;
            case 'quarterly':
              startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
              endDate = now;
              break;
            default:
              startDate = new Date(now.getFullYear(), 0, 1); // Start of year
              endDate = now;
          }
        }
        
        query = query
          .gte('period_start', startDate.toISOString().split('T')[0])
          .lte('period_end', endDate.toISOString().split('T')[0]);
      } else {
        // When period is 'all', still apply schedule-based filtering
        if (selectedSchedule !== 'all') {
          const now = new Date();
          
          switch (selectedSchedule) {
            case 'daily':
              // For daily: use TODAY's work logs (not yesterday)
              startDate = new Date(now);
              endDate = new Date(now);
              break;
            case 'weekly':
              // For weekly: use last 7 days including today
              startDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000); // 6 days ago
              endDate = now;
              break;
            case 'bi-weekly':
              // For bi-weekly: use last 14 days including today
              startDate = new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000); // 13 days ago
              endDate = now;
              break;
            case 'monthly':
              startDate = new Date(now.getFullYear(), now.getMonth(), 1);
              endDate = now;
              break;
            case 'quarterly':
              startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
              endDate = now;
              break;
            default:
              startDate = new Date(now.getFullYear(), 0, 1); // Start of year
              endDate = now;
          }
          
          query = query
            .gte('period_start', startDate.toISOString().split('T')[0])
            .lte('period_end', endDate.toISOString().split('T')[0]);
        }
      }

      // Only log if dates were calculated
      if (startDate && endDate) {
        console.log(' Date range applied:', { 
          startDate: startDate.toISOString().split('T')[0], 
          endDate: endDate.toISOString().split('T')[0] 
        });
      }

      // Apply worker filter
      if (appliedWorkerFilter) {
        query = query.eq('worker_id', appliedWorkerFilter);
      }

      // Apply status filter
      if (appliedStatusFilter !== '') {
        query = query.eq('paid_status', appliedStatusFilter === 'paid');
      }

      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        console.error('❌ Query error:', fetchError);
        throw new Error(fetchError.message);
      }

      // Sort data based on unpaid priority
      let sortedData = data || [];
      if (showUnpaidFirst) {
        sortedData = sortedData.sort((a, b) => {
          if (a.paid_status !== b.paid_status) {
            return a.paid_status ? 1 : -1; // Unpaid first
          }
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // Recent first
        });
      }

      return sortedData;
    },
    enabled: !!user && (user.role === 'supervisor' || user.role === 'admin')
  });
};

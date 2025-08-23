import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { PayrollFilters } from '../types/payroll.types';

interface UsePayrollDataProps extends PayrollFilters {
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
  return useQuery({
    queryKey: ['payroll', selectedPeriod, selectedSchedule, showUnpaidFirst, appliedWorkerFilter, appliedStatusFilter],
    queryFn: async () => {
      console.log('🚀 Starting payroll query...');
      console.log(' Selected Period:', selectedPeriod);
      console.log(' ⏰ Selected Schedule:', selectedSchedule);
      console.log(' 🔄 Show Unpaid First:', showUnpaidFirst);

      let query = supabase
        .from('payroll')
        .select('*');

      // Apply period filter
      if (selectedPeriod && selectedPeriod !== 'all') {
        console.log(' Applying period filter:', selectedPeriod);
        const now = new Date();
        
        switch (selectedPeriod) {
          case 'current':
            // Current month
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            query = query
              .gte('period_start', startOfMonth.toISOString().split('T')[0])
              .lte('period_end', endOfMonth.toISOString().split('T')[0]);
            break;
          case 'previous':
            // Previous month
            const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            query = query
              .gte('period_start', startOfPrevMonth.toISOString().split('T')[0])
              .lte('period_end', endOfPrevMonth.toISOString().split('T')[0]);
            break;
          case 'quarterly':
            // Current quarter
            const currentQuarter = Math.floor(now.getMonth() / 3);
            const startOfQuarter = new Date(now.getFullYear(), currentQuarter * 3, 1);
            const endOfQuarter = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0);
            query = query
              .gte('period_start', startOfQuarter.toISOString().split('T')[0])
              .lte('period_end', endOfQuarter.toISOString().split('T')[0]);
            break;
          case 'yearly':
            // Current year
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const endOfYear = new Date(now.getFullYear(), 11, 31);
            query = query
              .gte('period_start', startOfYear.toISOString().split('T')[0])
              .lte('period_end', endOfYear.toISOString().split('T')[0]);
            break;
        }
      }

      // Apply worker filter
      if (appliedWorkerFilter && appliedWorkerFilter !== 'all' && appliedWorkerFilter.trim() !== '') {
        console.log(' Applying worker filter:', appliedWorkerFilter);
        query = query.eq('worker_id', appliedWorkerFilter);
      }

      // Apply status filter
      if (appliedStatusFilter && appliedStatusFilter !== 'all' && appliedStatusFilter.trim() !== '') {
        console.log(' Applying status filter:', appliedStatusFilter);
        const isPaid = appliedStatusFilter === 'paid';
        query = query.eq('paid_status', isPaid);
      }

      // Apply sorting based on unpaid priority
      if (showUnpaidFirst) {
        console.log(' Applying unpaid priority sorting');
        query = query.order('paid_status', { ascending: true }); // false (unpaid) comes first
      }
      
      // Default sorting by creation date
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('❌ Query error:', error);
        throw error;
      }

      console.log(' ✅ Query successful, found', data?.length || 0, 'records');
      return data || [];
    },
    enabled: !!user
  });
};

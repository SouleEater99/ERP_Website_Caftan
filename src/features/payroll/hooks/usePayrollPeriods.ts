import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';

export const usePayrollPeriods = (user: any) => {
  const queryClient = useQueryClient();

  // Get current period - using the correct 'status' column
  const { data: currentPeriod } = useQuery({
    queryKey: ['payroll-periods', 'current'],
    queryFn: async () => {
      try {
        // Get the active period using the 'status' column
        const { data, error } = await supabase
          .from('payroll_periods')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error) {
          console.log('No active payroll periods found, will create first one');
          return null;
        }
        
        return data;
      } catch (error) {
        console.log('Error fetching payroll periods:', error);
        return null;
      }
    },
    enabled: !!user
  });

  // Create new period mutation - using the correct schema
  const createPeriodMutation = useMutation({
    mutationFn: async () => {
      // First, close any existing active period
      if (currentPeriod) {
        const { error: closeError } = await supabase
          .from('payroll_periods')
          .update({ 
            status: 'closed',
            closed_at: new Date().toISOString()
          })
          .eq('id', currentPeriod.id);
        
        if (closeError) {
          console.error('Error closing current period:', closeError);
        }
      }

      // Create new period
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      
      const { data, error } = await supabase
        .from('payroll_periods')
        .insert({
          period_name: `${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          status: 'active',
          notes: 'Automatically created payroll period'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll-periods'] });
    }
  });

  return {
    currentPeriod,
    createPeriodMutation
  };
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';

export const usePayrollPeriods = (user: any) => {
  const queryClient = useQueryClient();

  const { data: currentPeriod } = useQuery({
    queryKey: ['payroll-periods', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll_periods')
        .select('*')
        .eq('status', 'active')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    },
    enabled: !!user && (user.role === 'supervisor' || user.role === 'admin')
  });

  const createPeriodMutation = useMutation({
    mutationFn: async () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      
      // 1. CHECK: Does current period already exist?
      const { data: existingPeriods } = await supabase
        .from('payroll_periods')
        .select('*')
        .eq('status', 'active')
        .gte('start_date', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`)
        .lte('end_date', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-31`);
      
      if (existingPeriods && existingPeriods.length > 0) {
        throw new Error(`Period ${existingPeriods[0].period_name} already exists`);
      }
      
      // 2. CLOSE: Previous active period if exists
      if (currentPeriod) {
        const { error: closeError } = await supabase
          .from('payroll_periods')
          .update({ 
            status: 'closed',
            closed_at: new Date().toISOString()
          })
          .eq('id', currentPeriod.id);
        
        if (closeError) throw closeError;
      }
      
      // 3. CREATE: New current period
      const periodStart = new Date(currentYear, currentMonth, 1);
      const periodEnd = new Date(currentYear, currentMonth + 1, 0);
      
      const newPeriod = {
        period_name: `${periodStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
        start_date: periodStart.toISOString().split('T')[0],
        end_date: periodEnd.toISOString().split('T')[0],
        status: 'active',
        notes: 'New payroll period created'
      };
      
      const { error: periodError } = await supabase
        .from('payroll_periods')
        .insert(newPeriod);
      
      if (periodError) throw periodError;
      
      // 4. UPDATE: All workers' payment dates to new period
      const { error: updateError } = await supabase
        .from('users')
        .update({
          next_payment_date: periodStart.toISOString().split('T')[0],
          last_payment_date: null
        })
        .eq('role', 'worker');
      
      if (updateError) throw updateError;
      
      return newPeriod;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      queryClient.invalidateQueries({ queryKey: ['workers', 'payment-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['payroll-periods'] });
    }
  });

  return {
    currentPeriod,
    createPeriodMutation
  };
};

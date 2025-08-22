import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Payroll as PayrollType } from '../lib/supabase';

export const usePayrollMutations = () => {
  const queryClient = useQueryClient();

  const updatePaymentMutation = useMutation<PayrollType[], Error, { id: string, paid_status: boolean }>({
    mutationFn: async ({ id, paid_status }) => {
      const { data, error: updateError } = await supabase
        .from('payroll')
        .update({ paid_status })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw new Error(updateError.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
    }
  });

  const payAllPendingMutation = useMutation<PayrollType[], Error, void>({
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
      return results as PayrollType[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
    }
  });

  return {
    updatePaymentMutation,
    payAllPendingMutation
  };
};

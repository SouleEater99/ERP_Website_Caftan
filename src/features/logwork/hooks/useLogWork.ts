import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { WorkLog, WorkForm } from '../types/logwork.types';

export const useAddWorkLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<WorkLog, 'id' | 'created_at'>) => {
      const { data: result, error } = await supabase
        .from('work_logs')
        .insert({
          worker_id: data.worker_id,
          worker_name: data.worker_name,
          product: data.product,
          product_id: data.product_id,
          task: data.task,
          quantity: data.quantity,
          completed: data.completed,
          notes: data.notes,
          approved: false
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-logs'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    }
  });
};

export const useWorkLogs = (workerId?: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['work-logs', workerId],
    queryFn: async () => {
      let query = supabase
        .from('work_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (workerId) {
        query = query.eq('worker_id', workerId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!workerId
  });
};
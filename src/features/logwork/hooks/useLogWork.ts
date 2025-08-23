import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { WorkLog, WorkForm } from '../types/logwork.types';

export const useAddWorkLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<WorkLog, 'id' | 'created_at'>) => {
      console.log('Submitting work log data:', data);
      
      try {
        // Get the actual user name from the users table
        let actualWorkerName = data.worker_name;
        
        if (data.worker_id) {
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('name')
              .eq('id', data.worker_id)
              .single();

            if (userData && !userError) {
              actualWorkerName = userData.name;
              console.log('Using real name from users table:', actualWorkerName);
            }
          } catch (userError) {
            console.log('Could not fetch user name, using provided name');
          }
        }

        // Insert work log with the real worker name
        const { data: result, error } = await supabase
          .from('work_logs')
          .insert({
            worker_id: data.worker_id || null,
            worker_name: actualWorkerName, // Use the real name
            product: data.product,
            product_id: data.product_id || null,
            task: data.task,
            quantity: data.quantity,
            completed: data.completed || false,
            notes: data.notes || null,
            approved: false
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(error.message);
        }
        
        console.log('Work log created successfully:', result);
        return result;
      } catch (error) {
        console.error('Error in useAddWorkLog:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-logs'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    }
  });
};

export const useWorkLogs = (workerId?: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['work-logs', workerId],
    queryFn: async () => {
      // Use the view instead of the base table
      let query = supabase
        .from('work_logs_with_names') // Use the view with real names
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
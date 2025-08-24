import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
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

export const useApproveWorkLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ logId, approved, approverNotes }: { 
      logId: string; 
      approved: boolean; 
      approverNotes?: string;
    }) => {
      const { data, error } = await supabase
        .from('work_logs')
        .update({ 
          approved, 
          approver_notes: approverNotes,
          approved_at: approved ? new Date().toISOString() : null,
          approver_id: approved ? (await supabase.auth.getUser()).data.user?.id : null
        })
        .eq('id', logId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-logs'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
    },
  });
};

export const usePendingApprovals = () => {
  return useQuery({
    queryKey: ['pending-approvals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_logs_with_names')
        .select('*')
        .eq('completed', true)
        .eq('approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
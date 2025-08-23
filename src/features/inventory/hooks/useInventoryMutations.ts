import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { StockAdjustment } from '../types/inventory.types';

export const useAddStockMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ stockId, quantity, note }: StockAdjustment) => {
      console.log('Adding stock:', { stockId, quantity, note })

      await supabase.rpc('adjust_stock', { 
        p_stock_id: stockId, 
        p_qty: quantity, 
        p_type: 'in', 
        p_note: note || null 
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] })
      queryClient.invalidateQueries({ queryKey: ['stock', 'usedSummary'] })
    }
  });
};

export const useConsumeStockMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ stockId, quantity, note }: StockAdjustment) => {
      console.log('Consuming stock:', { stockId, quantity, note })

      await supabase.rpc('adjust_stock', { 
        p_stock_id: stockId, 
        p_qty: quantity, 
        p_type: 'out', 
        p_note: note || null 
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] })
      queryClient.invalidateQueries({ queryKey: ['stock', 'usedSummary'] })
    }
  });
};

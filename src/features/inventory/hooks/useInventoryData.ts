import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Stock } from '../types/inventory.types';

export const useStock = () => {
  return useQuery<Stock[]>({
    queryKey: ['stock'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock')
        .select('*')
        .order('material')
      if (error) throw error
      return data || []
    }
  });
};

export const useStockMovements = () => {
  return useQuery<Map<string, number>>({
    queryKey: ['stock', 'usedSummary'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('stock_movements')
          .select('stock_id, quantity, type')
        
        if (error) {
          console.error('Error fetching movements:', error)
          // If table doesn't exist, return empty map
          if (error.code === '42P01') { // table doesn't exist
            console.warn('stock_movements table does not exist yet')
            return new Map<string, number>()
          }
          throw error
        }
        
        const totals = new Map<string, number>()
        for (const m of data || []) {
          if (m.type === 'out') {
            totals.set(m.stock_id, (totals.get(m.stock_id) || 0) + Number(m.quantity))
          }
        }
        return totals
      } catch (error) {
        console.error('Error in movements query:', error)
        return new Map<string, number>()
      }
    }
  });
};

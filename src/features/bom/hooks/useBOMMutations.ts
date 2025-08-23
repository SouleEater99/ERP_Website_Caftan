import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { BOMForm } from '../types/bom.types';

export const useAddBOMMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (form: BOMForm) => {
      const { error } = await supabase
        .from('bom')
        .insert({
          product: form.product,
          material: form.material,
          qty_per_unit: Number(form.qty_per_unit),
          unit: form.unit,
          waste_percent: Number(form.waste_percent || 0),
          deduct_at_stage: form.deduct_at_stage
        })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bom'] })
    }
  });
};

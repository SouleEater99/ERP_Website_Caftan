import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { BOM, Product, Material, Task } from '../types/bom.types';

export const useBOMItems = () => {
  return useQuery<BOM[]>({
    queryKey: ['bom'],
    queryFn: async () => {
      const { data } = await supabase
        .from('bom')
        .select('*')
        .order('product')
      return data || []
    }
  });
};

export const useProductOptions = () => {
  return useQuery<Product[]>({
    queryKey: ['bom', 'options', 'products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('code, name_en, name_ar')
        .eq('active', true)
        .order('name_en')
      if (error) throw error
      return data || []
    }
  });
};

export const useMaterialOptions = () => {
  return useQuery<Material[]>({
    queryKey: ['bom', 'options', 'materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock')
        .select('material, unit')
        .order('material')
      if (error) throw error
      return data || []
    }
  });
};

export const useStageOptions = () => {
  return useQuery<Task[]>({
    queryKey: ['bom', 'options', 'stages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('code, name_en, name_ar')
        .eq('active', true)
        .order('name_en')
      if (error) throw error
      return data || []
    }
  });
};

import { Product, Task } from '../types/bom.types';

export const getLocalizedName = (item: { name_en: string; name_ar: string }, language: string) => {
  return language === 'ar' ? item.name_ar : item.name_en;
};

export const getMaterialName = (material: string) => {
  // For now, materials are just text strings, but you could add translations later
  return material;
};

export const formatWastePercent = (wastePercent: number) => {
  return `${wastePercent}%`;
};

export const validateBOMForm = (form: any) => {
  const errors: string[] = [];
  
  if (!form.product) errors.push('Product is required');
  if (!form.material) errors.push('Material is required');
  if (!form.qty_per_unit || Number(form.qty_per_unit) <= 0) errors.push('Quantity must be positive');
  if (!form.unit) errors.push('Unit is required');
  
  return errors;
};

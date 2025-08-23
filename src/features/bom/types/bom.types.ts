export interface BOM {
  id: string;
  product: string;
  material: string;
  qty_per_unit: number;
  unit: string;
  waste_percent: number;
  deduct_at_stage: string;
  created_at: string;
}

export interface BOMForm {
  product: string;
  material: string;
  qty_per_unit: string;
  unit: string;
  waste_percent: string;
  deduct_at_stage: string;
}

export interface Product {
  code: string;
  name_en: string;
  name_ar: string;
  active: boolean;
}

export interface Material {
  material: string;
  unit: string;
}

export interface Task {
  code: string;
  name_en: string;
  name_ar: string;
  active: boolean;
}

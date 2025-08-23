export const BOM_FORM_LABELS = {
  PRODUCT: 'المنتج',
  MATERIAL: 'المادة',
  QTY_PER_UNIT: 'الكمية/الوحدة',
  UNIT: 'الوحدة',
  WASTE_PERCENT: 'نسبة الهدر %',
  STAGE: 'المرحلة',
} as const;

export const BOM_FORM_PLACEHOLDERS = {
  SELECT_PRODUCT: 'اختر المنتج',
  SELECT_MATERIAL: 'اختر المادة',
  SELECT_STAGE: 'اختر المرحلة',
  QTY_PER_UNIT: 'Qty/Unit',
  UNIT: 'Unit',
  WASTE_PERCENT: 'Waste %',
} as const;

export const BOM_ACTIONS = {
  ADD_COMPONENT: 'إضافة مكون',
  ADDING: 'جاري الإضافة...',
} as const;

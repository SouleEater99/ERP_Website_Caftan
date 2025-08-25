export const BOM_FORM_LABELS = {
  PRODUCT: 'product',
  MATERIAL: 'material',
  QTY_PER_UNIT: 'qtyPerUnit',
  UNIT: 'unit',
  WASTE_PERCENT: 'wastePercent',
  STAGE: 'stage',
} as const;

export const BOM_FORM_PLACEHOLDERS = {
  SELECT_PRODUCT: 'selectProduct',
  SELECT_MATERIAL: 'selectMaterial',
  SELECT_STAGE: 'selectStage',
  QTY_PER_UNIT: 'qtyPerUnit',
  UNIT: 'unit',
  WASTE_PERCENT: 'wastePercent',
} as const;

export const BOM_ACTIONS = {
  ADD_COMPONENT: 'addComponent',
  ADDING: 'adding',
} as const;

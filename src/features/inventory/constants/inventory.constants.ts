export const INVENTORY_ACTIONS = {
  ADD_STOCK: 'addStock',
  CONSUME_STOCK: 'consume',
  ADDING: 'Adding...',
  CONSUMING: 'Consuming...',
} as const;

export const INVENTORY_STATUS = {
  PENDING: 'Pending',
  ERROR: 'Error',
  IDLE: 'Idle',
} as const;

export const INVENTORY_MESSAGES = {
  ENTER_QUANTITY_ADD: 'Enter quantity to add:',
  ENTER_QUANTITY_CONSUME: 'Enter quantity to consume:',
  INVALID_QUANTITY: 'Invalid quantity entered',
} as const;

export const INVENTORY_DEBUG_INFO = {
  STOCK_ITEMS_LOADED: 'Stock items loaded:',
  MOVEMENTS_LOADED: 'Movements loaded:',
  ADD_MUTATION_STATE: 'Add mutation state:',
  CONSUME_MUTATION_STATE: 'Consume mutation state:',
  ADD_ERROR: 'Add error:',
  CONSUME_ERROR: 'Consume error:',
} as const;

export const INVENTORY_ACTIONS = {
  ADD_STOCK: 'addStock',
  CONSUME_STOCK: 'consume',
  ADDING: 'adding',
  CONSUMING: 'consuming',
} as const;

export const INVENTORY_STATUS = {
  PENDING: 'pending',
  ERROR: 'error',
  IDLE: 'idle',
} as const;

export const INVENTORY_MESSAGES = {
  ENTER_QUANTITY_ADD: 'enterQuantityToAdd',
  ENTER_QUANTITY_CONSUME: 'enterQuantityToConsume',
  INVALID_QUANTITY: 'invalidQuantity',
} as const;

export const INVENTORY_DEBUG_INFO = {
  STOCK_ITEMS_LOADED: 'stockItemsLoaded',
  MOVEMENTS_LOADED: 'movementsLoaded',
  ADD_MUTATION_STATE: 'addMutationState',
  CONSUME_MUTATION_STATE: 'consumeMutationState',
  ADD_ERROR: 'addError',
  CONSUME_ERROR: 'consumeError',
} as const;

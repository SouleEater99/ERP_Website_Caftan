import React from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { StockAdjustment } from '../types/inventory.types';
import { INVENTORY_DEBUG_INFO } from '../constants/inventory.constants';

interface DebugInfoProps {
  stockCount: number;
  movementsLoaded: boolean;
  addMutation: UseMutationResult<any, Error, StockAdjustment, unknown>;
  consumeMutation: UseMutationResult<any, Error, StockAdjustment, unknown>;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({
  stockCount,
  movementsLoaded,
  addMutation,
  consumeMutation
}) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
      <h3 className="text-sm font-medium text-blue-800 mb-2">Debug Info</h3>
      <div className="text-sm text-blue-700">
        <p>{INVENTORY_DEBUG_INFO.STOCK_ITEMS_LOADED} {stockCount}</p>
        <p>{INVENTORY_DEBUG_INFO.MOVEMENTS_LOADED} {movementsLoaded ? 'Yes' : 'No'}</p>
        <p>{INVENTORY_DEBUG_INFO.ADD_MUTATION_STATE} {
          addMutation.isPending ? 'Pending' : 
          addMutation.isError ? 'Error' : 'Idle'
        }</p>
        <p>{INVENTORY_DEBUG_INFO.CONSUME_MUTATION_STATE} {
          consumeMutation.isPending ? 'Pending' : 
          consumeMutation.isError ? 'Error' : 'Idle'
        }</p>
        {addMutation.error && <p>{INVENTORY_DEBUG_INFO.ADD_ERROR} {addMutation.error.message}</p>}
        {consumeMutation.error && <p>{INVENTORY_DEBUG_INFO.CONSUME_ERROR} {consumeMutation.error.message}</p>}
      </div>
    </div>
  );
};

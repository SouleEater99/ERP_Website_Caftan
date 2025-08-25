import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  InventoryHeader, 
  DebugInfo, 
  LowStockAlert, 
  InventoryTable 
} from '../features/inventory';
import { useStock, useStockMovements } from '../features/inventory';
import { useAddStockMutation, useConsumeStockMutation } from '../features/inventory';
import { calculateStockRow, filterLowStockItems, validateQuantity } from '../features/inventory';
import { StockRow } from '../features/inventory/types/inventory.types';
import { INVENTORY_MESSAGES } from '../features/inventory/constants/inventory.constants';

const Inventory: React.FC = () => {
  const { t } = useTranslation();
  
  const { data: stock, isLoading } = useStock();
  const { data: usedSummary } = useStockMovements();
  const addStockMutation = useAddStockMutation();
  const consumeStockMutation = useConsumeStockMutation();

  const handleAddStock = (id: string) => {
    const quantity = prompt(t('inventory.enterQuantityToAdd'));
    if (quantity && validateQuantity(quantity)) {
      console.log('Handling add stock for ID:', id, 'quantity:', quantity);
      addStockMutation.mutate({ stockId: id, quantity: Number(quantity) });
    }
  };

  const handleConsumeStock = (id: string) => {
    const quantity = prompt(t('inventory.enterQuantityToConsume'));
    if (quantity && validateQuantity(quantity)) {
      console.log('Handling consume stock for ID:', id, 'quantity:', quantity);
      consumeStockMutation.mutate({ stockId: id, quantity: Number(quantity) });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  // Calculate remaining dynamically and filter low stock items
  const rows: StockRow[] = (stock || []).map(item => 
    calculateStockRow(item, usedSummary)
  );
  const lowStockItems = filterLowStockItems(rows);

  return (
    <div className="space-y-6">
      <InventoryHeader />

      <DebugInfo 
        stockCount={stock?.length || 0}
        movementsLoaded={!!usedSummary}
        addMutation={addStockMutation}
        consumeMutation={consumeStockMutation}
      />

      <LowStockAlert lowStockItems={lowStockItems} />

      <InventoryTable 
        rows={rows}
        onAddStock={handleAddStock}
        onConsumeStock={handleConsumeStock}
        addMutationPending={addStockMutation.isPending}
        consumeMutationPending={consumeStockMutation.isPending}
      />
    </div>
  );
};

export default Inventory;
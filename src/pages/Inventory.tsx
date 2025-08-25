import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  InventoryHeader, 
  LowStockAlert, 
  InventoryTable 
} from '../features/inventory';
import { StockAdjustmentModal } from '../features/inventory/components/StockAdjustmentModal';
import { useStock, useStockMovements } from '../features/inventory';
import { useAddStockMutation, useConsumeStockMutation } from '../features/inventory';
import { calculateStockRow, filterLowStockItems, validateQuantity } from '../features/inventory';
import { StockRow } from '../features/inventory/types/inventory.types';

const Inventory: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const { data: stock, isLoading } = useStock();
  const { data: usedSummary } = useStockMovements();
  const addStockMutation = useAddStockMutation();
  const consumeStockMutation = useConsumeStockMutation();

  // Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'add' | 'consume';
    materialId: string;
    materialName: string;
    currentStock: number;
    unit: string;
  }>({
    isOpen: false,
    type: 'add',
    materialId: '',
    materialName: '',
    currentStock: 0,
    unit: ''
  });

  const handleAddStock = (id: string) => {
    const material = stock?.find(item => item.id === id);
    if (material) {
      setModalState({
        isOpen: true,
        type: 'add',
        materialId: id,
        materialName: material.material,
        currentStock: material.current_stock,
        unit: material.unit
      });
    }
  };

  const handleConsumeStock = (id: string) => {
    const material = stock?.find(item => item.id === id);
    if (material) {
      setModalState({
        isOpen: true,
        type: 'consume',
        materialId: id,
        materialName: material.material,
        currentStock: material.current_stock,
        unit: material.unit
      });
    }
  };

  const handleConfirmStockAdjustment = (quantity: number) => {
    if (modalState.type === 'add') {
      addStockMutation.mutate({ stockId: modalState.materialId, quantity });
    } else {
      consumeStockMutation.mutate({ stockId: modalState.materialId, quantity });
    }
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="glass-card p-8 text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">{t('common.loading')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate remaining dynamically and filter low stock items
  const rows: StockRow[] = (stock || []).map(item => 
    calculateStockRow(item, usedSummary)
  );
  const lowStockItems = filterLowStockItems(rows);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-6">
        <InventoryHeader />
        <LowStockAlert lowStockItems={lowStockItems} />
        <InventoryTable 
          rows={rows}
          onAddStock={handleAddStock}
          onConsumeStock={handleConsumeStock}
          addMutationPending={addStockMutation.isPending}
          consumeMutationPending={consumeStockMutation.isPending}
        />
      </div>

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmStockAdjustment}
        type={modalState.type}
        materialName={modalState.materialName}
        currentStock={modalState.currentStock}
        unit={modalState.unit}
        isRTL={isRTL}
      />
    </div>
  );
};

export default Inventory;
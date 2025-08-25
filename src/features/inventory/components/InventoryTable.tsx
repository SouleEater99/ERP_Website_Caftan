import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Minus } from 'lucide-react';
import { StockRow } from '../types/inventory.types';
import { StockAdjustment } from '../types/inventory.types';
import { INVENTORY_ACTIONS } from '../constants/inventory.constants';
import { formatQuantity, formatRemainingQuantity } from '../utils/inventory.utils';

interface InventoryTableProps {
  rows: StockRow[];
  onAddStock: (id: string) => void;
  onConsumeStock: (id: string) => void;
  addMutationPending: boolean;
  consumeMutationPending: boolean;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  rows,
  onAddStock,
  onConsumeStock,
  addMutationPending,
  consumeMutationPending
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={`px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('inventory.material')}
              </th>
              <th className={`px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('inventory.currentStock')}
              </th>
              <th className={`px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('inventory.used')}
              </th>
              <th className={`px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('inventory.remaining')}
              </th>
              <th className={`px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('inventory.reorderLevel')}
              </th>
              <th className={`px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('inventory.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((item) => (
              <tr key={item.id} className={item.isLow ? 'bg-red-50' : ''}>
                <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {item.material}
                </td>
                <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {formatQuantity(item.current_stock, item.unit)}
                </td>
                <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {formatQuantity(item.totalUsed, item.unit)}
                </td>
                <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <span className={item.isLow ? 'text-red-600 font-medium' : ''}>
                    {formatRemainingQuantity(item.remaining, item.unit, item.isLow)}
                  </span>
                </td>
                <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {formatQuantity(item.reorder_threshold, item.unit)}
                </td>
                <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                  <button
                    onClick={() => onAddStock(item.id)}
                    disabled={addMutationPending}
                    className="inline-flex items-center px-2 sm:px-3 py-1 rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 disabled:opacity-50 text-xs sm:text-sm"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">{addMutationPending ? t('inventory.adding') : t('inventory.addStock')}</span>
                    <span className="sm:hidden">+</span>
                  </button>
                  <button
                    onClick={() => onConsumeStock(item.id)}
                    disabled={consumeMutationPending}
                    className="inline-flex items-center px-2 sm:px-3 py-1 rounded-md text-red-700 bg-red-100 hover:bg-red-200 disabled:opacity-50 text-xs sm:text-sm"
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">{consumeMutationPending ? t('inventory.consuming') : t('inventory.consumeStock')}</span>
                    <span className="sm:hidden">-</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

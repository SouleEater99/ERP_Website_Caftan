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
  const { t } = useTranslation();

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('material')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('currentStock')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Used
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Remaining
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('reorderLevel')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((item) => (
            <tr key={item.id} className={item.isLow ? 'bg-red-50' : ''}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.material}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatQuantity(item.current_stock, item.unit)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatQuantity(item.totalUsed, item.unit)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={item.isLow ? 'text-red-600 font-medium' : ''}>
                  {formatRemainingQuantity(item.remaining, item.unit, item.isLow)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatQuantity(item.reorder_threshold, item.unit)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => onAddStock(item.id)}
                  disabled={addMutationPending}
                  className="inline-flex items-center px-3 py-1 rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {addMutationPending ? INVENTORY_ACTIONS.ADDING : t('addStock')}
                </button>
                <button
                  onClick={() => onConsumeStock(item.id)}
                  disabled={consumeMutationPending}
                  className="inline-flex items-center px-3 py-1 rounded-md text-red-700 bg-red-100 hover:bg-red-200 disabled:opacity-50"
                >
                  <Minus className="h-4 w-4 mr-1" />
                  {consumeMutationPending ? INVENTORY_ACTIONS.CONSUMING : INVENTORY_ACTIONS.CONSUME_STOCK}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

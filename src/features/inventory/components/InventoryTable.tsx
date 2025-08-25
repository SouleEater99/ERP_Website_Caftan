import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Minus, Package } from 'lucide-react';
import { StockRow } from '../types/inventory.types';
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
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 px-6 py-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-slate-700/20"></div>
        <div className={`relative flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-white font-semibold text-lg">{t('inventory.materialsList')}</h2>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/50">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100/80">
            <tr>
              <th className={`px-6 py-5 text-xs font-semibold text-slate-600 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('inventory.material')}
              </th>
              <th className={`px-6 py-5 text-xs font-semibold text-slate-600 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('inventory.currentStock')}
              </th>
              <th className={`px-6 py-5 text-xs font-semibold text-slate-600 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('inventory.used')}
              </th>
              <th className={`px-6 py-5 text-xs font-semibold text-slate-600 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('inventory.remaining')}
              </th>
              <th className={`px-6 py-5 text-xs font-semibold text-slate-600 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('inventory.reorderLevel')}
              </th>
              <th className={`px-6 py-5 text-xs font-semibold text-slate-600 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('inventory.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/50 divide-y divide-slate-200/50">
            {rows.map((item) => (
              <tr key={item.id} className={`hover:bg-slate-50/80 transition-all duration-300 ${item.isLow ? 'bg-red-50/80' : ''}`}>
                <td className={`px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${item.isLow ? 'bg-gradient-to-r from-red-100 to-red-200' : 'bg-gradient-to-r from-blue-100 to-blue-200'}`}>
                      <Package className={`w-5 h-5 ${item.isLow ? 'text-red-600' : 'text-blue-600'}`} />
                    </div>
                    <span className="font-semibold">{item.material}</span>
                  </div>
                </td>
                <td className={`px-6 py-5 whitespace-nowrap text-sm text-slate-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <span className="font-medium">{formatQuantity(item.current_stock, item.unit)}</span>
                </td>
                <td className={`px-6 py-5 whitespace-nowrap text-sm text-slate-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <span className="font-medium">{formatQuantity(item.totalUsed, item.unit)}</span>
                </td>
                <td className={`px-6 py-5 whitespace-nowrap text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                  <span className={`font-semibold ${item.isLow ? 'text-red-600' : 'text-slate-800'}`}>
                    {formatRemainingQuantity(item.remaining, item.unit, item.isLow)}
                  </span>
                </td>
                <td className={`px-6 py-5 whitespace-nowrap text-sm text-slate-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <span className="font-medium">{formatQuantity(item.reorder_threshold, item.unit)}</span>
                </td>
                <td className={`px-6 py-5 whitespace-nowrap text-sm font-medium ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <button
                    onClick={() => onAddStock(item.id)}
                    disabled={addMutationPending}
                    className="inline-flex items-center px-4 py-2.5 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-sm font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 border border-blue-400/20"
                  >
                    <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span className="hidden sm:inline">{addMutationPending ? t('inventory.adding') : t('inventory.addStock')}</span>
                    <span className="sm:hidden">+</span>
                  </button>
                  <button
                    onClick={() => onConsumeStock(item.id)}
                    disabled={consumeMutationPending}
                    className="inline-flex items-center px-4 py-2.5 rounded-xl text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 text-sm font-semibold shadow-lg hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 border border-red-400/20"
                  >
                    <Minus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
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
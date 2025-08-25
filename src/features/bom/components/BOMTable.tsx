import React from 'react';
import { useTranslation } from 'react-i18next';
import { BOM } from '../types/bom.types';

interface BOMTableProps {
  bomItems: BOM[];
  isLoading: boolean;
}

export const BOMTable: React.FC<BOMTableProps> = ({ bomItems, isLoading }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={`px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('bom.table.product')}
              </th>
              <th className={`px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('bom.table.material')}
              </th>
              <th className={`px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('bom.table.qtyPerUnit')}
              </th>
              <th className={`px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('bom.table.unit')}
              </th>
              <th className={`px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('bom.table.wastePercent')}
              </th>
              <th className={`px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('bom.table.deductAtStage')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bomItems?.map((item) => (
              <tr key={item.id}>
                <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {item.product}
                </td>
                <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {item.material}
                </td>
                <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {item.qty_per_unit}
                </td>
                <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {item.unit}
                </td>
                <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {item.waste_percent}%
                </td>
                <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {item.deduct_at_stage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

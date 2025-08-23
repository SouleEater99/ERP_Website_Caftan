import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { LowStockItem } from '../types/inventory.types';

interface LowStockAlertProps {
  lowStockItems: LowStockItem[];
}

export const LowStockAlert: React.FC<LowStockAlertProps> = ({ lowStockItems }) => {
  const { t } = useTranslation();

  if (lowStockItems.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
        <h3 className="text-sm font-medium text-red-800">
          {t('lowStockAlerts')} ({lowStockItems.length})
        </h3>
      </div>
      <div className="mt-2 text-sm text-red-700">
        {lowStockItems.map(item => (
          <div key={item.id}>
            {item.material}: {item.remaining.toFixed(2)} {item.unit} remaining
            (reorder at {item.reorder_threshold} {item.unit})
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';

export const InventoryHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900">{t('inventory')}</h1>
    </div>
  );
};

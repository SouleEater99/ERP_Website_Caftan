import React from 'react';
import { useTranslation } from 'react-i18next';

export const InventoryHeader: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{t('inventory.title')}</h1>
    </div>
  );
};

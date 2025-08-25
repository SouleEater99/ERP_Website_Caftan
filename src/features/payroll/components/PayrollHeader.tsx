import React from 'react';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PayrollHeaderProps {
  isRTL: boolean;
  onExport: () => void;
}

export const PayrollHeader: React.FC<PayrollHeaderProps> = ({ isRTL, onExport }) => {
  const { t } = useTranslation();
  
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
      <div className={isRTL ? 'text-right' : ''}>
        <h1 className="text-3xl font-bold cold-gradient-text arabic-heading">
          {t('payroll.title')}
        </h1>
        <p className="text-slate-600 mt-1 arabic-text">
          {t('payroll.description')}
        </p>
      </div>

      <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <button onClick={onExport} className="cold-button">
          <Download className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          <span className="arabic-text">{t('payroll.export')}</span>
        </button>
      </div>
    </div>
  );
};

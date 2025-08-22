import React from 'react';
import { useTranslation } from 'react-i18next';

interface PayrollPaymentSummaryProps {
  totalPayroll: number;
  paidAmount: number;
  totalPending: number;
  paymentRate: number;
  isRTL: boolean;
}

export const PayrollPaymentSummary: React.FC<PayrollPaymentSummaryProps> = ({
  totalPayroll,
  paidAmount,
  totalPending,
  paymentRate,
  isRTL
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="management-card">
      <h4 className="text-lg font-bold text-slate-800 mb-4 arabic-heading">
        {t('paymentSummary')}
      </h4>
      <div className="space-y-4">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-slate-600 arabic-text">{t('totalPayroll')}</span>
          <span className="font-bold text-slate-800">{totalPayroll.toLocaleString()} MAD</span>
        </div>
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-slate-600 arabic-text">{t('paidAmount')}</span>
          <span className="font-bold text-emerald-600">{paidAmount.toLocaleString()} MAD</span>
        </div>
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-slate-600 arabic-text">{t('pendingAmount')}</span>
          <span className="font-bold text-amber-600">{totalPending.toLocaleString()} MAD</span>
        </div>
        <div className={`flex items-center justify-between pt-4 border-t border-slate-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-slate-600 arabic-text">{t('paymentRate')}</span>
          <span className="font-bold text-blue-600">{paymentRate.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, CheckCircle, Clock, DollarSign } from 'lucide-react';

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
  
  const summaryItems = [
    {
      label: t('totalPayroll'),
      value: `${totalPayroll.toLocaleString()} MAD`,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      label: t('paidAmount'),
      value: `${paidAmount.toLocaleString()} MAD`,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'from-emerald-50 to-teal-50'
    },
    {
      label: t('pendingAmount'),
      value: `${totalPending.toLocaleString()} MAD`,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'from-amber-50 to-orange-50'
    },
    {
      label: t('paymentRate'),
      value: `${paymentRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'from-purple-50 to-violet-50'
    }
  ];
  
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 px-6 py-4">
        <h3 className="text-white font-semibold text-lg">{t('paymentSummary')}</h3>
      </div>
      
      <div className="space-y-5">
        {summaryItems.map((item, index) => (
          <div key={index} className={`group relative p-4 rounded-2xl bg-gradient-to-r ${item.bgColor} hover:shadow-lg transition-all duration-300 ${index === summaryItems.length - 1 ? 'border-t-2 border-slate-200 pt-6' : ''}`}>
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse justify-between' : 'justify-between'}`}>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
                <div className={`w-10 h-10 bg-gradient-to-r ${item.bgColor} rounded-xl flex items-center justify-center shadow-sm`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="text-slate-600 font-semibold">{item.label}</span>
              </div>
              <span className={`font-black text-lg ${item.color}`}>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

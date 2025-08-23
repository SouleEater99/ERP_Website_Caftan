import React from 'react';
import { User, Download, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Payroll as PayrollType } from '../../../lib/supabase';

interface PayrollTableProps {
  payrollData: PayrollType[];
  isRTL: boolean;
  onDownloadIndividual: (item: PayrollType) => void;
  onPaymentToggle: (id: string, currentStatus: boolean) => void;
  updatePaymentMutation: any;
}

export const PayrollTable: React.FC<PayrollTableProps> = ({
  payrollData,
  isRTL,
  onDownloadIndividual,
  onPaymentToggle,
  updatePaymentMutation
}) => {
  const { t, i18n } = useTranslation();
  
  return (
    <div className="management-section">
      <div className="management-header">
        <h3 className="text-xl font-bold text-slate-800 arabic-heading">
          {t('detailedPayrollRecords')}
        </h3>
        <div className={`text-sm text-slate-600 arabic-text ${isRTL ? 'text-right' : ''}`}>
          {t('totalWorkersCount', { count: payrollData.length })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th className={`${isRTL ? 'text-right' : 'text-left'} arabic-text`}>{t('workerName')}</th>
              <th className={`${isRTL ? 'text-right' : 'text-left'} arabic-text`}>{t('paymentPeriod')}</th>
              <th className={`${isRTL ? 'text-right' : 'text-left'} arabic-text`}>{t('totalEarnings')}</th>
              <th className={`${isRTL ? 'text-right' : 'text-left'} arabic-text`}>{t('paymentStatus')}</th>
              <th className={`${isRTL ? 'text-right' : 'text-left'} arabic-text`}>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {payrollData.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/30">
                <td>
                  <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className="w-10 h-10 cold-gradient rounded-xl flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className={isRTL ? 'text-right' : ''}>
                      <div className="font-medium text-slate-800 arabic-text">{item.worker_name}</div>
                      <div className="text-sm text-slate-500">{item.worker_id}</div>
                    </div>
                  </div>
                </td>
                <td className={`${isRTL ? 'text-right' : ''} arabic-text`}>
                  <div className="text-sm text-slate-600">
                    {new Date(item.period_start).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US')} - {new Date(item.period_end).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US')}
                  </div>
                </td>
                <td className={`${isRTL ? 'text-right' : ''}`}>
                  <div className="font-bold text-slate-800">
                    {item.total_earnings.toLocaleString()} <span className="arabic-text">MAD</span>
                  </div>
                </td>
                <td>
                  <span className={`status-indicator ${
                    item.paid_status ? 'status-active' : 'status-pending'
                  } arabic-text`}>
                    {item.paid_status ? t('paid') : t('pending')}
                  </span>
                </td>
                <td>
                  <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <button
                      onClick={() => onDownloadIndividual(item)}
                      className="cold-button-secondary text-sm"
                    >
                      <Download className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                      <span className="arabic-text">{t('download')}</span>
                    </button>
                    {!item.paid_status && (
                      <button
                        onClick={() => onPaymentToggle(item.id, item.paid_status)}
                        disabled={updatePaymentMutation.isPending}
                        className="cold-button text-sm"
                      >
                        <DollarSign className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        <span className="arabic-text">
                          {updatePaymentMutation.isPending ? t('paying') : t('pay')}
                        </span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

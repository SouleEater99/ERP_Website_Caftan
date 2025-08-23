import React from 'react';
import { Clock, DollarSign, Download, Calendar, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PayrollQuickActionsProps {
  isRTL: boolean;
  onGeneratePayroll: () => void;
  onPayAllPending: () => void;
  onExportPayroll: () => void;
  onCreateNewPeriod: () => void;
  onManageWageRates: () => void;
  generatePayrollMutation: any;
  payAllPendingMutation: any;
  isCreatingPeriod: boolean;
}

export const PayrollQuickActions: React.FC<PayrollQuickActionsProps> = ({
  isRTL,
  onGeneratePayroll,
  onPayAllPending,
  onExportPayroll,
  onCreateNewPeriod,
  onManageWageRates,
  generatePayrollMutation,
  payAllPendingMutation,
  isCreatingPeriod
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="management-card">
      <h4 className="text-lg font-bold text-slate-800 mb-4 arabic-heading">
        {t('quickActions')}
      </h4>
      <div className="space-y-3">
        {/* Generate Payroll button */}
        <button 
          onClick={onGeneratePayroll} 
          disabled={generatePayrollMutation.isPending}
          className={`w-full cold-button text-left ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
        >
          <Clock className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          <span className="arabic-text">
            {generatePayrollMutation.isPending 
              ? t('generatingPayroll') 
              : t('generatePayrollForDueWorkers')
            }
          </span>
        </button>
        
        <button 
          onClick={onPayAllPending} 
          disabled={payAllPendingMutation.isPending} 
          className={`w-full cold-button text-left ${isRTL ? 'flex-row-reverse justify-end' : ''}`} 
        >
          <DollarSign className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          <span className="arabic-text">
            {payAllPendingMutation.isPending ? t('payingAllPending') : t('payAllPendingPayroll')}
          </span>
        </button>
        
        <button
          onClick={onExportPayroll}
          className={`w-full cold-button-secondary text-left ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
        >
          <Download className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          <span className="arabic-text">{t('exportPayrollRecords')}</span>
        </button>
        
        <button
          onClick={onCreateNewPeriod}
          disabled={isCreatingPeriod}
          className={`w-full cold-button-secondary text-left ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
        >
          <Calendar className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          <span className="arabic-text">
            {isCreatingPeriod ? t('creatingPeriod') : t('createNewPayrollPeriod')}
          </span>
        </button>
        
        <button
          onClick={onManageWageRates}
          className={`w-full cold-button-secondary text-left ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
        >
          <Users className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          <span className="arabic-text">{t('manageWageRates')}</span>
        </button>
      </div>
    </div>
  );
};

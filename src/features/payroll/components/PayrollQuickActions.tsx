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
    <div className="glass-card p-8 rounded-3xl">
      <h4 className={`text-xl font-black text-slate-800 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('quickActions')}
      </h4>
      <div className="space-y-4">
        {/* Generate Payroll button */}
        <button 
          onClick={onGeneratePayroll} 
          disabled={generatePayrollMutation.isPending}
          className="w-full group relative px-6 py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-105 border border-blue-400/30 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <div className={`relative flex items-center ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
            <Clock className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
            <span>
              {generatePayrollMutation.isPending 
                ? t('generatingPayroll') 
                : t('generatePayrollForDueWorkers')
              }
            </span>
          </div>
        </button>
        
        <button 
          onClick={onPayAllPending} 
          disabled={payAllPendingMutation.isPending} 
          className="w-full group relative px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 transform hover:scale-105 border border-emerald-400/30 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <div className={`relative flex items-center ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
            <DollarSign className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
            <span>
              {payAllPendingMutation.isPending ? t('payingAllPending') : t('payAllPendingPayroll')}
            </span>
          </div>
        </button>
        
        <button
          onClick={onExportPayroll}
          className="w-full group relative px-6 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-2xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:shadow-slate-500/30 transform hover:scale-105 border border-slate-400/30 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <div className={`relative flex items-center ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
            <Download className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
            <span>{t('exportPayrollRecords')}</span>
          </div>
        </button>
        
        <button
          onClick={onCreateNewPeriod}
          disabled={isCreatingPeriod}
          className="w-full group relative px-6 py-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-2xl hover:from-purple-700 hover:to-violet-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transform hover:scale-105 border border-purple-400/30 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <div className={`relative flex items-center ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
            <Calendar className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
            <span>
              {isCreatingPeriod ? t('creatingPeriod') : t('createNewPayrollPeriod')}
            </span>
          </div>
        </button>
        
        <button
          onClick={onManageWageRates}
          className="w-full group relative px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl hover:from-orange-700 hover:to-amber-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:shadow-orange-500/30 transform hover:scale-105 border border-orange-400/30 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <div className={`relative flex items-center ${isRTL ? 'flex-row-reverse justify-end' : 'justify-start'}`}>
            <Users className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
            <span>{t('manageWageRates')}</span>
          </div>
        </button>
      </div>
    </div>
  );
};

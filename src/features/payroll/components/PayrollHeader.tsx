import React from 'react';
import { Download, TrendingUp, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PayrollHeaderProps {
  isRTL: boolean;
  onExport: () => void;
}

export const PayrollHeader: React.FC<PayrollHeaderProps> = ({ isRTL, onExport }) => {
  const { t } = useTranslation();
  
  return (
    <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-cyan-600/5 to-blue-700/5"></div>
      <div className="absolute inset-0 cold-pattern opacity-20"></div>
      
      <div className={`relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
        {/* Title Section */}
        <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'} mb-3`}>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-blue-800 to-slate-900 bg-clip-text text-transparent tracking-tight">
              {t('payroll.title')}
            </h1>
          </div>
          <p className="text-slate-600 text-lg font-medium leading-relaxed">
            {t('payroll.description')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-4' : 'space-x-4'}`}>
          <button 
            onClick={onExport} 
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transform hover:scale-105 border border-blue-400/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <div className={`relative flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
              <Download className="w-5 h-5" />
              <span>{t('payroll.export')}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

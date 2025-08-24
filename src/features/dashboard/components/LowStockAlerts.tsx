import React from 'react';
import { AlertTriangle, Scissors } from 'lucide-react';
import { LowStockItem } from '../types/dashboard.types';
import { DASHBOARD_SECTIONS, DASHBOARD_MESSAGES } from '../constants/dashboard.constants';
import { formatStockInfo, getAnimationDelay } from '../utils/dashboard.utils';
import { useTranslation } from 'react-i18next';

interface LowStockAlertsProps {
  stockItems: LowStockItem[];
  isRTL: boolean;
}

export const LowStockAlerts: React.FC<LowStockAlertsProps> = ({ stockItems, isRTL }) => {
  const { t } = useTranslation();
  
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 border-2 border-red-200/30 slide-up stagger-2 mobile-card">
      <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h3 className="responsive-subheading font-bold text-red-800">{t('dashboard.lowStockAlerts')}</h3>
        <div className="p-2 bg-red-100 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
      </div>
      <div className="tablet-spacing desktop-spacing">
        {stockItems.length > 0 ? (
          stockItems.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50/50 rounded-2xl border border-red-200/50 hover:border-red-300/70 transition-all duration-300 mobile-padding"
              style={{ animationDelay: getAnimationDelay(index, 150) }}
            >
              <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className="p-2 bg-red-100 rounded-xl">
                  <Scissors className="w-4 h-4 text-red-600" />
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <p className="text-red-800 font-bold responsive-text">{item.material}</p>
                  <p className="text-red-600 responsive-text">
                    {formatStockInfo(item)}
                  </p>
                </div>
              </div>
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-2 sm:mt-0 self-end sm:self-center" />
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>{t('dashboard.allStockAdequate')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Package, TrendingUp, AlertTriangle } from 'lucide-react';

export const InventoryHeader: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 px-6 py-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"></div>
        <div className="absolute inset-0 cold-pattern opacity-30"></div>
        <div className="relative flex items-center justify-between">
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-2xl">{t('inventory.title')}</h1>
              <p className="text-blue-100 text-sm mt-1">
                {t('inventory.manageMaterials')}
              </p>
            </div>
          </div>
          <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
            <div className={`flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 ${isRTL ? 'space-x-reverse' : ''}`}>
              <TrendingUp className="w-5 h-5 text-green-300" />
              <span className="text-white font-medium">{t('inventory.totalMaterials')}</span>
            </div>
            <div className={`flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 ${isRTL ? 'space-x-reverse' : ''}`}>
              <AlertTriangle className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-medium">{t('inventory.lowStock')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

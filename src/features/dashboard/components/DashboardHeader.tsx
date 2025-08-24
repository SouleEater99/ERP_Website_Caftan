import React from 'react';
import { useTranslation } from 'react-i18next';
import { Crown } from 'lucide-react';
import { handleImageError } from '../utils/dashboard.utils';

interface DashboardHeaderProps {
  userName?: string;
  isRTL: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName, isRTL }) => {
  const { t } = useTranslation();
  
  return (
    <div className="mb-8 slide-up">
      <div className={`flex items-center space-x-4 mb-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center pulse-glow shadow-lg">
          <img 
            src="/image.png" 
            alt="Caftan Talia Logo" 
            className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
            onError={handleImageError}
          />
          <Crown className="h-6 w-6 sm:h-8 sm:h-8 text-blue-600 hidden" />
        </div>
        <div className={isRTL ? 'text-right' : ''}>
          <h1 className="responsive-heading font-bold cold-gradient-text mb-2">{t('dashboard.title')}</h1>
          <p className="text-slate-600 font-medium responsive-text">
            {t('dashboard.welcomeBack')}, {userName || t('common.user')}
          </p>
        </div>
      </div>
    </div>
  );
};

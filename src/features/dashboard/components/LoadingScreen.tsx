import React from 'react';
import { useTranslation } from 'react-i18next';
import { Crown } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50/30 to-amber-50/50 caftan-pattern flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 caftan-gradient rounded-3xl flex items-center justify-center pulse-glow mb-4 mx-auto">
          <Crown className="h-10 w-10 text-white animate-pulse" />
        </div>
        <p className="text-orange-800 text-xl font-bold arabic-text">{t('loading')}</p>
      </div>
    </div>
  );
};

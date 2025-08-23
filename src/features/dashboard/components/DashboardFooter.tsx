import React from 'react';
import { Crown } from 'lucide-react';
import { DASHBOARD_MESSAGES } from '../constants/dashboard.constants';

export const DashboardFooter: React.FC = () => {
  return (
    <div className="mt-12 text-center">
      <div className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full border border-slate-200">
        <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        <span className="text-slate-700 font-bold responsive-text">{DASHBOARD_MESSAGES.EXCELLENCE_TAGLINE}</span>
        <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
      </div>
    </div>
  );
};

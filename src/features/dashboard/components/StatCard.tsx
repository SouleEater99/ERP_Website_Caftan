import React from 'react';
import { TrendingUp } from 'lucide-react';
import { StatCardProps } from '../types/dashboard.types';

interface StatCardComponentProps extends StatCardProps {
  isRTL: boolean;
}

export const StatCard: React.FC<StatCardComponentProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  delay = 0,
  isRTL 
}) => (
  <div 
    className={`glass-card rounded-2xl p-4 sm:p-6 border-2 border-slate-200/30 hover:border-slate-300/50 transition-all duration-300 slide-up mobile-card`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`flex items-center ${isRTL ? 'justify-start' : 'justify-between'} ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div className={isRTL ? 'text-right' : ''}>
        <p className="text-slate-600 responsive-text font-medium">{title}</p>
        <p className="text-slate-800 text-xl sm:text-2xl font-bold mt-1">{value}</p>
        {trend && (
          <div className={`flex items-center mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <TrendingUp className="w-4 h-4 text-green-500 mx-1" />
            <span className="text-green-500 responsive-text font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-2xl ${color} ${isRTL ? 'ml-4' : ''}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

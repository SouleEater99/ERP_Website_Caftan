import React from 'react';
import { TrendingUp } from 'lucide-react';
import { StatCardProps } from '../types/dashboard.types';

interface StatCardComponentProps extends StatCardProps {
  isRTL: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  delay = 0,
  isRTL 
}) => (
  <div 
    className="glass-card rounded-2xl p-4 sm:p-6 border-2 border-slate-200/30 hover:border-slate-300/50 transition-all duration-300 slide-up mobile-card"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center justify-between">
      <div className={isRTL ? 'text-right' : 'text-left'}>
        <p className="text-slate-600 responsive-text font-medium">{title}</p>
        <p className="text-slate-800 text-xl sm:text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-2xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

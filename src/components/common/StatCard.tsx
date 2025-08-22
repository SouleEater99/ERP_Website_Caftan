import React from 'react';
import { TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: string;
  isRTL: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, value, icon: Icon, color, trend, isRTL 
}) => (
  <div className="metric-card">
    <div className={`flex items-center ${isRTL ? 'justify-start' : 'justify-between'} ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div className={isRTL ? 'text-right' : ''}>
        <p className="text-slate-600 text-sm font-medium arabic-text">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        {trend && (
          <div className={`flex items-center mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <TrendingUp className="w-4 h-4 text-emerald-500 mx-1" />
            <span className="text-emerald-600 text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color} ${isRTL ? 'ml-4' : ''}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

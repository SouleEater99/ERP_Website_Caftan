import React from 'react';
import { Shirt } from 'lucide-react';
import { RecentActivity } from '../types/dashboard.types';
import { DASHBOARD_SECTIONS, DASHBOARD_MESSAGES } from '../constants/dashboard.constants';
import { getAnimationDelay } from '../utils/dashboard.utils';
import { useTranslation } from 'react-i18next';

interface RecentActivitiesProps {
  activities: RecentActivity[];
  isRTL: boolean;
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, isRTL }) => {
  const { t } = useTranslation();
  
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 border-2 border-slate-200/30 slide-up stagger-1 mobile-card">
      <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h3 className="responsive-subheading font-bold text-slate-800">{t('dashboard.recentActivities')}</h3>
        <div className="p-2 bg-blue-100 rounded-xl">
          <Shirt className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      <div className="tablet-spacing desktop-spacing">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-50/50 rounded-2xl border border-slate-200/50 hover:border-slate-300/70 transition-all duration-300 mobile-padding"
              style={{ animationDelay: getAnimationDelay(index) }}
            >
              <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className="text-xl sm:text-2xl">{activity.avatar}</div>
                <div className={isRTL ? 'text-right' : ''}>
                  <p className="text-slate-800 font-bold responsive-text">{activity.worker}</p>
                  <p className="text-slate-600 responsive-text">{activity.task} - {activity.product}</p>
                </div>
              </div>
              <span className="text-slate-500 responsive-text font-medium mt-2 sm:mt-0">{activity.time}</span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Shirt className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>{t('dashboard.noRecentActivities')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePendingApprovals } from '../hooks/useLogWork';
import { CheckCircle, XCircle, Clock, Package, User, Calendar, Eye, AlertTriangle } from 'lucide-react';
import { WorkLog } from '../types/logwork.types';

interface ApprovalDashboardProps {
  onOpenModal: (log: WorkLog) => void;
}

const ApprovalDashboard: React.FC<ApprovalDashboardProps> = ({ onOpenModal }) => {
  const { t, i18n } = useTranslation();
  const { data: pendingLogs, isLoading, error } = usePendingApprovals();
  
  const isRTL = i18n.language === 'ar';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="glass-card p-8 text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">{t('approvals.loadingApprovals')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="glass-card p-8 inline-block">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{t('approvals.errorLoadingApprovals')}</p>
        </div>
      </div>
    );
  }

  if (!pendingLogs || pendingLogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="glass-card p-8 inline-block">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <p className="text-green-600 font-medium">{t('approvals.allTasksApproved')}</p>
          <p className="text-slate-500 text-sm mt-2">{t('approvals.noPendingApprovals')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 px-6 py-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"></div>
        <div className="absolute inset-0 cold-pattern opacity-30"></div>
        <div className="relative flex items-center justify-between">
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">{t('approvals.pendingApprovals')}</h2>
              <p className="text-blue-100 text-sm mt-1">
                {pendingLogs.length} {pendingLogs.length !== 1 ? t('approvals.tasks') : t('approvals.task')} {t('approvals.awaitingApproval')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 shadow-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-medium">{pendingLogs.length}</span>
          </div>
        </div>
      </div>

      {/* Pending Logs */}
      <div className="divide-y divide-slate-200/50">
        {pendingLogs.map((log, index) => (
          <div key={log.id} className="p-6 hover:bg-slate-50/50 transition-all duration-200 group">
            <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className={`flex items-center space-x-3 mb-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full shadow-sm"></div>
                  <h3 className="font-semibold text-slate-800 text-lg">{log.product}</h3>
                  {log.product_id && (
                    <span className="px-3 py-1 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 text-xs rounded-full font-medium border border-slate-300/50">
                      {log.product_id}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div className={`flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-slate-600 text-xs block">{t('approvals.worker')}</span>
                      <span className="font-semibold text-slate-800">{log.worker_name}</span>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <span className="text-slate-600 text-xs block">{t('approvals.task')}</span>
                      <span className="font-semibold text-slate-800">{log.task}</span>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200/50 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <span className="text-slate-600 text-xs block">{t('approvals.completed')}</span>
                      <span className="font-semibold text-slate-800">
                        {new Date(log.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {log.notes && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
                    <p className="text-sm text-blue-800 font-medium">{log.notes}</p>
                  </div>
                )}
              </div>
              
              {/* Action Button */}
              <div className={isRTL ? 'mr-4' : 'ml-4'}>
                <button
                  onClick={() => onOpenModal(log)}
                  className="cold-button"
                >
                  <Eye className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('approvals.reviewAndApprove')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalDashboard;
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle, XCircle, User, Package, FileText, Calendar } from 'lucide-react';
import { useApproveWorkLog } from '../hooks/useLogWork';
import { WorkLog } from '../types/logwork.types';

interface TaskApprovalModalProps {
  workLog: WorkLog;
  isOpen: boolean;
  onClose: () => void;
  isRTL: boolean;
}

const TaskApprovalModal: React.FC<TaskApprovalModalProps> = ({ 
  workLog, 
  isOpen, 
  onClose,
  isRTL
}) => {
  const { t } = useTranslation();
  const [isApproving, setIsApproving] = useState(false);
  const approveWorkLog = useApproveWorkLog();

  if (!isOpen) return null;

  const handleApprove = async (approved: boolean) => {
    setIsApproving(true);
    try {
      await approveWorkLog.mutateAsync({
        logId: workLog.id,
        approved
      });
      onClose();
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 px-6 py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"></div>
          <div className="absolute inset-0 cold-pattern opacity-30"></div>
          <div className="relative flex items-center justify-between">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-xl">{t('approvals.taskApproval')}</h2>
                <p className="text-blue-100 text-sm mt-1">
                  {t('approvals.reviewWorkLog')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-semibold text-slate-800 mb-4 text-lg">{t('approvals.workLogDetails')}</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="text-slate-600 text-xs block">{t('approvals.worker')}</span>
                  <span className="font-semibold text-slate-800">{workLog.worker_name}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <span className="text-slate-600 text-xs block">{t('approvals.product')}</span>
                  <span className="font-semibold text-slate-800">{workLog.product}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200/50">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <span className="text-slate-600 text-xs block">{t('approvals.task')}</span>
                  <span className="font-semibold text-slate-800">{workLog.task}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200/50">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <span className="text-slate-600 text-xs block">{t('approvals.quantity')}</span>
                  <span className="font-semibold text-slate-800">{workLog.quantity}</span>
                </div>
              </div>
              
              {workLog.notes && (
                <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200/50">
                  <span className="text-slate-600 text-xs block mb-2">{t('approvals.notes')}</span>
                  <p className="text-slate-800 font-medium">{workLog.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <button
              onClick={() => handleApprove(false)}
              disabled={isApproving}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transform hover:scale-105"
            >
              <XCircle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('approvals.reject')}
            </button>
            <button
              onClick={() => handleApprove(true)}
              disabled={isApproving}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transform hover:scale-105"
            >
              <CheckCircle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('approvals.approve')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskApprovalModal;
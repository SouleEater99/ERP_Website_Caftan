import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b border-slate-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h3 className="text-lg font-semibold text-slate-800">
            {t('approvals.taskApproval')}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <h4 className="font-medium text-slate-800 mb-2">{t('approvals.workLogDetails')}</h4>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
              <div><span className="font-medium">{t('approvals.worker')}:</span> {workLog.worker_name}</div>
              <div><span className="font-medium">{t('approvals.product')}:</span> {workLog.product}</div>
              <div><span className="font-medium">{t('approvals.task')}:</span> {workLog.task}</div>
              <div><span className="font-medium">{t('approvals.quantity')}:</span> {workLog.quantity}</div>
              {workLog.notes && (
                <div><span className="font-medium">{t('approvals.notes')}:</span> {workLog.notes}</div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <button
              onClick={() => handleApprove(false)}
              disabled={isApproving}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              <XCircle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('approvals.reject')}
            </button>
            <button
              onClick={() => handleApprove(true)}
              disabled={isApproving}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
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
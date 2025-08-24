import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useApproveWorkLog } from '../hooks/useLogWork';
import { WorkLog } from '../types/logwork.types';

interface TaskApprovalModalProps {
  workLog: WorkLog;
  isOpen: boolean;
  onClose: () => void;
}

const TaskApprovalModal: React.FC<TaskApprovalModalProps> = ({ 
  workLog, 
  isOpen, 
  onClose 
}) => {
  const [approverNotes, setApproverNotes] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const approveWorkLog = useApproveWorkLog();

  if (!isOpen) return null;

  const handleApprove = async (approved: boolean) => {
    setIsApproving(true);
    try {
      await approveWorkLog.mutateAsync({
        logId: workLog.id,
        approved,
        approverNotes: approverNotes.trim() || undefined
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
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">
            Task Approval
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
            <h4 className="font-medium text-slate-800 mb-2">Work Log Details</h4>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
              <div><span className="font-medium">Worker:</span> {workLog.worker_name}</div>
              <div><span className="font-medium">Product:</span> {workLog.product}</div>
              <div><span className="font-medium">Task:</span> {workLog.task}</div>
              <div><span className="font-medium">Quantity:</span> {workLog.quantity}</div>
              {workLog.notes && (
                <div><span className="font-medium">Notes:</span> {workLog.notes}</div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Approval Notes (Optional)
            </label>
            <textarea
              value={approverNotes}
              onChange={(e) => setApproverNotes(e.target.value)}
              placeholder="Add any notes about this approval..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => handleApprove(false)}
              disabled={isApproving}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </button>
            <button
              onClick={() => handleApprove(true)}
              disabled={isApproving}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskApprovalModal;
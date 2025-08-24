import React, { useState } from 'react';
import { usePendingApprovals } from '../hooks/useLogWork';
import { CheckCircle, XCircle, Clock, Package, User, Calendar } from 'lucide-react';
import TaskApprovalModal from './TaskApprovalModal';
import { WorkLog } from '../types/logwork.types';

const ApprovalDashboard: React.FC = () => {
  const { data: pendingLogs, isLoading, error } = usePendingApprovals();
  const [selectedLog, setSelectedLog] = useState<WorkLog | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">Error loading pending approvals</p>
      </div>
    );
  }

  if (!pendingLogs || pendingLogs.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <p className="text-green-600 font-medium">All tasks are approved!</p>
        <p className="text-slate-500 text-sm mt-2">No pending approvals at this time.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Pending Approvals</h2>
              <p className="text-orange-100 text-sm">
                {pendingLogs.length} task{pendingLogs.length !== 1 ? 's' : ''} awaiting approval
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Logs */}
      <div className="divide-y divide-slate-200">
        {pendingLogs.map((log) => (
          <div key={log.id} className="p-6 hover:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <h3 className="font-semibold text-slate-800">{log.product}</h3>
                  {log.product_id && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                      {log.product_id}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-slate-600">Worker:</span>
                    <span className="font-medium text-slate-800">{log.worker_name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-green-600" />
                    <span className="text-slate-600">Task:</span>
                    <span className="font-medium text-slate-800">{log.task}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-slate-600">Completed:</span>
                    <span className="font-medium text-slate-800">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {log.notes && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">{log.notes}</p>
                  </div>
                )}
              </div>
              
              {/* Action Button */}
              <div className="ml-4">
                <button
                  onClick={() => {
                    setSelectedLog(log);
                    setShowApprovalModal(true);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review & Approve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Approval Modal */}
      {selectedLog && (
        <TaskApprovalModal
          workLog={selectedLog}
          isOpen={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedLog(null);
          }}
        />
      )}
    </div>
  );
};

export default ApprovalDashboard;
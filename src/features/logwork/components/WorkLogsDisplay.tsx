import React, { useState } from 'react';
import { useWorkLogs } from '../hooks/useLogWork';
import { useTranslation } from 'react-i18next';
import { 
  Clock, 
  Package, 
  Scissors, 
  CheckCircle, 
  XCircle, 
  Eye,
  Filter,
  RefreshCw,
  X,
  AlertCircle
} from 'lucide-react';
import TaskApprovalModal from './TaskApprovalModal';
import { WorkLog } from '../types/logwork.types';

interface WorkLogsDisplayProps {
  workerId?: string;
}

const WorkLogsDisplay: React.FC<WorkLogsDisplayProps> = ({ workerId }) => {
  const { data: workLogs, isLoading, error, refetch } = useWorkLogs(workerId);
  const { t } = useTranslation();
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress'>('all');
  const [filterProduct, setFilterProduct] = useState('all');
  const [selectedLog, setSelectedLog] = useState<WorkLog | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading work logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">Error loading work logs</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!workLogs || workLogs.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600">No work logs found</p>
      </div>
    );
  }

  // Filter work logs
  const filteredLogs = workLogs.filter(log => {
    if (filterStatus !== 'all') {
      if (filterStatus === 'completed' && !log.completed) return false;
      if (filterStatus === 'in-progress' && log.completed) return false;
    }
    if (filterProduct !== 'all' && log.product !== filterProduct) return false;
    return true;
  });

  // Get unique products for filter
  const uniqueProducts = [...new Set(workLogs.map(log => log.product))];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Recent Work Logs</h2>
              <p className="text-slate-300 text-sm">Track your production activities</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Product:</span>
            <select
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Products</option>
              {uniqueProducts.map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Work Logs List */}
      <div className="divide-y divide-slate-200">
        {filteredLogs.map((log) => (
          <div key={log.id} className="p-6 hover:bg-slate-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-3 h-3 rounded-full ${
                    log.completed ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <h3 className="font-semibold text-slate-800">{log.product}</h3>
                  {log.product_id && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                      {log.product_id}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Scissors className="w-4 h-4 text-blue-600" />
                    <span className="text-slate-600">Task:</span>
                    <span className="font-medium text-slate-800">{log.task}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-green-600" />
                    <span className="text-slate-600">Quantity:</span>
                    <span className="font-medium text-slate-800">{log.quantity}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-slate-600">Date:</span>
                    <span className="font-medium text-slate-800">
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {log.notes && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">{log.notes}</p>
                  </div>
                )}
              </div>
              
              {/* Status and Actions */}
              <div className="ml-4 flex flex-col items-end space-y-2">
                {/* Status Badge */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  log.completed 
                    ? log.approved 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {log.completed ? (
                    log.approved ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approved
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 mr-1" />
                        Pending Approval
                      </>
                    )
                  ) : (
                    <>
                      <Clock className="w-3 h-3 mr-1" />
                      In Progress
                    </>
                  )}
                </span>

                {/* Action Buttons */}
                {log.completed && !log.approved && (
                  <button
                    onClick={() => {
                      setSelectedLog(log);
                      setShowApprovalModal(true);
                    }}
                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Review & Approve
                  </button>
                )}
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

export default WorkLogsDisplay;

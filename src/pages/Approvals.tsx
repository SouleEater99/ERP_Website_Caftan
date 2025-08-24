import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApprovalDashboard } from '../features/logwork/components';
import TaskApprovalModal from '../features/logwork/components/TaskApprovalModal';
import { WorkLog } from '../features/logwork/types/logwork.types';

const Approvals: React.FC = () => {
  const { i18n } = useTranslation();
  const [selectedLog, setSelectedLog] = useState<WorkLog | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  
  const isRTL = i18n.language === 'ar';

  const handleOpenModal = (log: WorkLog) => {
    setSelectedLog(log);
    setShowApprovalModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 p-6">
      <div className="max-w-7xl mx-auto">
        <ApprovalDashboard onOpenModal={handleOpenModal} isRTL={isRTL} />
      </div>

      {/* Modal rendered at page level */}
      {selectedLog && (
        <TaskApprovalModal
          workLog={selectedLog}
          isOpen={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedLog(null);
          }}
          isRTL={isRTL}
        />
      )}
    </div>
  );
};

export default Approvals;

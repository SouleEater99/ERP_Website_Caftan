import React from 'react';
import { ApprovalDashboard } from '../features/logwork/components';

const Approvals: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <ApprovalDashboard />
      </div>
    </div>
  );
};

export default Approvals;

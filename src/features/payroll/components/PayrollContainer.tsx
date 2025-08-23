import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../../shared/store/authStore';
import { 
  PayrollHeader, 
  PayrollStats, 
  PayrollFilters,
  PayrollTable,
  PayrollQuickActions,
  PayrollPaymentSummary,
  PayrollFilterModal
} from './index';
import { usePayrollData, usePayrollFilters, usePayrollMutations } from '../hooks';
import { MessageToast } from '../../../shared/components/common/MessageToast';

export const PayrollContainer: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  
  // Initialize with default values to prevent undefined errors
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedSchedule, setSelectedSchedule] = useState('all');
  const [showUnpaidFirst, setShowUnpaidFirst] = useState(true);
  const [appliedWorkerFilter, setAppliedWorkerFilter] = useState('all');
  const [appliedStatusFilter, setAppliedStatusFilter] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Message state
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [messageContent, setMessageContent] = useState('');

  // Get payroll data and mutations
  const { data: payrollData, isLoading, error } = usePayrollData({
    selectedPeriod,
    selectedSchedule,
    showUnpaidFirst,
    appliedWorkerFilter,
    appliedStatusFilter,
    user
  });

  const mutations = usePayrollMutations();

  // Handler functions for quick actions
  const handleGeneratePayroll = () => {
    if (mutations?.generatePayrollMutation?.mutateAsync) {
      mutations.generatePayrollMutation.mutateAsync({
        period: selectedPeriod,
        schedule: selectedSchedule
      }).then(() => {
        setMessageContent(t('payrollGenerated'));
        setShowSuccessMessage(true);
      }).catch(() => {
        setMessageContent(t('errorGeneratingPayroll'));
        setShowErrorMessage(true);
      });
    }
  };

  const handlePayAllPending = () => {
    if (mutations?.payAllPendingMutation?.mutateAsync) {
      mutations.payAllPendingMutation.mutateAsync().then(() => {
        setMessageContent(t('allPendingPaid'));
        setShowSuccessMessage(true);
      }).catch(() => {
        setMessageContent(t('errorPayingAllPending'));
        setShowErrorMessage(true);
      });
    }
  };

  const handleExportPayroll = () => {
    setMessageContent(t('exportingPayroll'));
    setShowSuccessMessage(true);
  };

  const handleCreateNewPeriod = () => {
    setMessageContent(t('creatingNewPeriod'));
    setShowSuccessMessage(true);
  };

  const handleManageWageRates = () => {
    setMessageContent(t('managingWageRates'));
    setShowSuccessMessage(true);
  };

  if (isLoading) {
    return <div className="text-center py-8">{t('loading')}</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error loading payroll data</div>;
  }

  return (
    <div className="space-y-6">
      <PayrollHeader />
      
      <PayrollStats data={payrollData} />
      
      <PayrollFilters
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        selectedSchedule={selectedSchedule}
        setSelectedSchedule={setSelectedSchedule}
        showUnpaidFirst={showUnpaidFirst}
        setShowUnpaidFirst={setShowUnpaidFirst}
        onOpenFilterModal={() => setShowFilterModal(true)}
      />

      <PayrollQuickActions
        isRTL={false}
        onGeneratePayroll={handleGeneratePayroll}
        onPayAllPending={handlePayAllPending}
        onExportPayroll={handleExportPayroll}
        onCreateNewPeriod={handleCreateNewPeriod}
        onManageWageRates={handleManageWageRates}
        generatePayrollMutation={mutations?.generatePayrollMutation}
        payAllPendingMutation={mutations?.payAllPendingMutation}
        isCreatingPeriod={false}
      />

      <PayrollTable 
        data={payrollData || []}
        appliedWorkerFilter={appliedWorkerFilter}
        appliedStatusFilter={appliedStatusFilter}
      />

      <PayrollPaymentSummary data={payrollData} />

      {showFilterModal && (
        <PayrollFilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          appliedWorkerFilter={appliedWorkerFilter}
          setAppliedWorkerFilter={setAppliedWorkerFilter}
          appliedStatusFilter={appliedStatusFilter}
          setAppliedStatusFilter={setAppliedStatusFilter}
        />
      )}

      {showSuccessMessage && (
        <MessageToast
          message={messageContent}
          type="success"
          onClose={() => setShowSuccessMessage(false)}
        />
      )}

      {showErrorMessage && (
        <MessageToast
          message={messageContent}
          type="error"
          onClose={() => setShowErrorMessage(false)}
        />
      )}
    </div>
  );
};

import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../shared/store/authStore';
import { Payroll as PayrollType } from '../lib/supabase';

// Import our new components
import { 
  PayrollHeader, 
  PayrollStats, 
  PayrollFilters,
  PayrollTable,
  PayrollQuickActions,
  PayrollPaymentSummary,
  PayrollFilterModal
} from '../features/payroll';
import { MessageToast } from '../shared/components/common/MessageToast';

// Import our custom hooks
import { usePayrollData, usePayrollMutations, usePayrollPeriods } from '../features/payroll';

export default function Payroll() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  // State for filters
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [showUnpaidFirst, setShowUnpaidFirst] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState('all');
  const [appliedWorkerFilter, setAppliedWorkerFilter] = useState('all');
  const [appliedStatusFilter, setAppliedStatusFilter] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Message state
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [messageContent, setMessageContent] = useState('');

  const scheduleOptions = [
    { value: 'all', label: t('payroll.allSchedules') },
    { value: 'daily', label: t('payroll.daily') },
    { value: 'weekly', label: t('payroll.weekly') },
    { value: 'bi-weekly', label: t('payroll.biWeekly') },
    { value: 'monthly', label: t('payroll.monthly') },
    { value: 'quarterly', label: t('payroll.quarterly') }
  ];

  const isRTL = i18n.language === 'ar';

  // Debug logging for state changes
  console.log('Payroll state:', {
    selectedPeriod,
    showUnpaidFirst,
    selectedSchedule,
    appliedWorkerFilter,
    appliedStatusFilter
  });

  // Use our custom hooks
  const { data: payrollData = [], isLoading, error } = usePayrollData({
    selectedPeriod,
    selectedSchedule,
    showUnpaidFirst,
    appliedWorkerFilter,
    appliedStatusFilter,
    user
  });

  const { updatePaymentMutation, payAllPendingMutation, generatePayrollMutation } = usePayrollMutations();
  const { currentPeriod, createPeriodMutation } = usePayrollPeriods(user);

  // Fetch users for worker filter dropdown
  const { data: users = [] } = useQuery({
    queryKey: ['users', 'workers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, role')
        .eq('role', 'worker')
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && (user.role === 'supervisor' || user.role === 'admin')
  });

  // Fetch workers with their payment schedules
  const { data: workers = [] } = useQuery({
    queryKey: ['workers', 'payment-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, payment_schedule, payment_day, next_payment_date, last_payment_date')
        .eq('role', 'worker')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Get workers due for payment
  const workersDueForPayment = useMemo(() => {
    const now = new Date();
    return workers.filter(worker => {
      if (!worker.next_payment_date) return false;
      const nextPayment = new Date(worker.next_payment_date);
      return nextPayment <= now;
    });
  }, [workers]);

  // Memoized calculations
  const { totalPayroll, paidAmount, totalPending, paymentRate } = useMemo(() => {
    const total = payrollData.reduce((sum: number, record: PayrollType) => sum + (record.total_earnings || 0), 0);
    const paid = payrollData
      .filter((record: PayrollType) => record.paid_status)
      .reduce((sum: number, record: PayrollType) => sum + (record.total_earnings || 0), 0);
    const pending = total - paid;
    const rate = total > 0 ? ((paid / total) * 100) : 0;
    
    return { totalPayroll: total, paidAmount: paid, totalPending: pending, paymentRate: rate };
  }, [payrollData]);

  // Handler functions
  const handleGeneratePayroll = () => {
    if (workersDueForPayment.length === 0) {
      setMessageContent(t('payroll.noWorkersDueForPayment'));
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      return;
    }
    
    generatePayrollMutation.mutate({
      period: selectedPeriod,
      schedule: selectedSchedule
    });
  };

  const handlePaymentToggle = useCallback((id: string, currentStatus: boolean) => {
    updatePaymentMutation.mutate({ id, paid_status: !currentStatus });
  }, [updatePaymentMutation]);

  const handleExportPayroll = useCallback(() => {
    if (!payrollData || payrollData.length === 0) return;

    const headers = [
      t('payroll.workerName'),
      t('payroll.paymentPeriodStart'),
      t('payroll.paymentPeriodEnd'),
      t('payroll.totalEarnings'),
      t('payroll.paymentStatus')
    ];

    const csvRows = payrollData.map((item: PayrollType) => {
      const periodStart = new Date(item.period_start).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US');
      const periodEnd = new Date(item.period_end).toLocaleDateString(i18n.language === 'ar-SA' ? 'ar-SA' : 'en-US');
      const status = item.paid_status ? t('payroll.paid') : t('payroll.pending');
      return `"${item.worker_name}","${periodStart}","${periodEnd}",${item.total_earnings},"${status}"`;
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `payroll-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  }, [payrollData, selectedPeriod, t, i18n.language]);

  const handleDownloadIndividual = useCallback((item: PayrollType) => {
    const csvContent = [
      [t('payroll.workerName'), t('payroll.period'), t('payroll.totalEarnings'), t('payroll.paymentStatus')],
      [item.worker_name, `${item.period_start} - ${item.period_end}`, item.total_earnings, item.paid_status ? t('payroll.paid') : t('payroll.pending')]
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payroll-${item.worker_name}-${item.period_start}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [t]);

  const handlePayAllPending = useCallback(() => {
    payAllPendingMutation.mutate();
  }, [payAllPendingMutation]);

  // Create new period function
  const handleCreateNewPeriod = async () => {
    try {
      console.log('🔄 Creating new payroll period...');
      const newPeriod = await createPeriodMutation.mutateAsync();
      
      console.log('✅ New period created:', newPeriod);
      setMessageContent(`New payroll period created: ${newPeriod.period_name}`);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
    } catch (error: any) {
      console.error('❌ Error creating new period:', error);
      setMessageContent(`Error creating period: ${error.message}`);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    }
  };

  const handleManageWageRates = useCallback(() => {
    console.log('Navigate to wage rates management');
  }, []);

  // Filter handlers
  const openFilterModal = () => setShowFilterModal(true);
  const onClearFilters = () => {
    setAppliedWorkerFilter('all');
    setAppliedStatusFilter('all');
  };
  const onRemoveWorkerFilter = () => setAppliedWorkerFilter('all');
  const onRemoveStatusFilter = () => setAppliedStatusFilter('all');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 flex items-center justify-center">
        <div className="glass-card p-8 rounded-3xl text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold text-lg">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 flex items-center justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="glass-card p-8 rounded-3xl text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-bold text-lg mb-2">{t('payroll.errorLoadingPayroll')}</p>
          <p className="text-red-500 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Success/Error Messages */}
        <MessageToast
          showSuccessMessage={showSuccessMessage}
          showErrorMessage={showErrorMessage}
          messageContent={messageContent}
          isRTL={isRTL}
        />

        {/* Header */}
        <PayrollHeader 
          isRTL={isRTL} 
          onExport={handleExportPayroll} 
        />

        {/* Filters */}
        <PayrollFilters
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          showUnpaidFirst={showUnpaidFirst}
          setShowUnpaidFirst={setShowUnpaidFirst}
          selectedSchedule={selectedSchedule}
          setSelectedSchedule={setSelectedSchedule}
          scheduleOptions={scheduleOptions}
          isRTL={isRTL}
          openFilterModal={openFilterModal}
          appliedWorkerFilter={appliedWorkerFilter}
          appliedStatusFilter={appliedStatusFilter}
          users={users}
          onClearFilters={onClearFilters}
          onRemoveWorkerFilter={onRemoveWorkerFilter}
          onRemoveStatusFilter={onRemoveStatusFilter}
        />

        {/* Summary Cards */}
        <PayrollStats
          totalPayroll={totalPayroll}
          paidAmount={paidAmount}
          totalPending={totalPending}
          isRTL={isRTL}
        />

        {/* Payroll Table */}
        <PayrollTable
          payrollData={payrollData}
          isRTL={isRTL}
          onDownloadIndividual={handleDownloadIndividual}
          onPaymentToggle={handlePaymentToggle}
          updatePaymentMutation={updatePaymentMutation}
        />

        {/* Payment Summary and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PayrollPaymentSummary
            totalPayroll={totalPayroll}
            paidAmount={paidAmount}
            totalPending={totalPending}
            paymentRate={paymentRate}
            isRTL={isRTL}
          />

          <PayrollQuickActions
            isRTL={isRTL}
            onGeneratePayroll={handleGeneratePayroll}
            onPayAllPending={handlePayAllPending}
            onExportPayroll={handleExportPayroll}
            onCreateNewPeriod={handleCreateNewPeriod}
            onManageWageRates={handleManageWageRates}
            generatePayrollMutation={generatePayrollMutation}
            payAllPendingMutation={payAllPendingMutation}
            isCreatingPeriod={createPeriodMutation.isPending}
          />
        </div>

        {/* Filter Modal */}
        <PayrollFilterModal
          showFilterModal={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          tempWorkerFilter={appliedWorkerFilter}
          setTempWorkerFilter={setAppliedWorkerFilter}
          tempStatusFilter={appliedStatusFilter}
          setTempStatusFilter={setAppliedStatusFilter}
          users={users}
          onApplyFilters={() => setShowFilterModal(false)}
          onClearFilters={onClearFilters}
        />
      </div>
    </div>
  );
}
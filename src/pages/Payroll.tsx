import React, { useState, useMemo, useCallback } from 'react';
import { Calendar, User, Download, Filter, TrendingUp, Users, Package, CheckCircle, AlertCircle, X, Search, Clock, CalendarDays } from 'lucide-react';
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
import { usePayrollData } from '../features/payroll';
import { usePayrollMutations } from '../features/payroll';
import { usePayrollPeriods } from '../features/payroll';
import { usePayrollFilters } from '../features/payroll';

export default function Payroll() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  // Separate state for period and unpaid priority
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [showUnpaidFirst, setShowUnpaidFirst] = useState(true);
  
  // Add payment schedule state
  const [selectedSchedule, setSelectedSchedule] = useState('all');

  // Message state
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [messageContent, setMessageContent] = useState('');

  const scheduleOptions = [
    { value: 'all', label: t('allSchedules') },
    { value: 'daily', label: t('daily') },
    { value: 'weekly', label: t('weekly') },
    { value: 'bi-weekly', label: t('biWeekly') },
    { value: 'monthly', label: t('monthly') },
    { value: 'quarterly', label: t('quarterly') }
  ];

  const isRTL = i18n.language === 'ar';

  // Use our custom hooks
  const {
    showFilterModal,
    setShowFilterModal,
    tempWorkerFilter,
    setTempWorkerFilter,
    tempStatusFilter,
    setTempStatusFilter,
    appliedWorkerFilter,
    setAppliedWorkerFilter,
    appliedStatusFilter,
    setAppliedStatusFilter,
    handleApplyFilters,
    handleClearFilters,
    openFilterModal
  } = usePayrollFilters();

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

  // Use our custom hooks for data and mutations
  const { data: payrollData = [], isLoading, error } = usePayrollData({
    selectedPeriod,
    selectedSchedule,
    showUnpaidFirst,
    appliedWorkerFilter,
    appliedStatusFilter,
    user
  });

  const { updatePaymentMutation, payAllPendingMutation } = usePayrollMutations();
  const { currentPeriod, createPeriodMutation } = usePayrollPeriods(user);

  // Get workers due for payment based on their schedule
  const workersDueForPayment = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    return workers.filter(worker => {
      if (!worker.next_payment_date) return false;
      
      const nextPayment = new Date(worker.next_payment_date);
      return nextPayment <= now;
    });
  }, [workers]);

  // Memoized calculations to prevent unnecessary recalculations
  const { totalPayroll, paidAmount, totalPending, paymentRate } = useMemo(() => {
    const total = payrollData.reduce((sum, record) => sum + (record.total_earnings || 0), 0);
    const paid = payrollData
      .filter(record => record.paid_status)
      .reduce((sum, record) => sum + (record.total_earnings || 0), 0);
    const pending = total - paid;
    const rate = total > 0 ? ((paid / total) * 100) : 0;
    
    return { totalPayroll: total, paidAmount: paid, totalPending: pending, paymentRate: rate };
  }, [payrollData]);

  // Add automatic payroll generation functions
  const calculateWorkerEarnings = useCallback(async (workerId: string, startDate: string, endDate: string) => {
    // Get work logs for the period
    const { data: workLogs, error } = await supabase
      .from('work_logs')
      .select('*')
      .eq('worker_id', workerId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .eq('completed', true);
    
    if (error) {
      console.error('Error fetching work logs:', error);
      return 0;
    }
    
    // Calculate total earnings based on rates
    let totalEarnings = 0;
    for (const log of workLogs || []) {
      // Get rate for this product + task combination
      const { data: rateData } = await supabase
        .from('rates')
        .select('rate_per_unit')
        .eq('product', log.product)
        .eq('task', log.task)
        .single();
      
      if (rateData) {
        totalEarnings += (log.quantity || 0) * rateData.rate_per_unit;
      }
    }
    
    return totalEarnings;
  }, []);

  const calculateNextPaymentDate = useCallback((worker: any) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    switch (worker.payment_schedule) {
      case 'daily':
        // Next payment is tomorrow
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        return tomorrow.toISOString().split('T')[0];
        
      case 'weekly':
        // Next payment is next week same day
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return nextWeek.toISOString().split('T')[0];
        
      case 'bi-weekly':
        // Next payment is in 2 weeks
        const nextBiWeek = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
        return nextBiWeek.toISOString().split('T')[0];
        
      case 'monthly':
        // Next payment is next month same day
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
        return nextMonth.toISOString().split('T')[0];
        
      case 'quarterly':
        // Next payment is in 3 months
        const nextQuarter = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
        return nextQuarter.toISOString().split('T')[0];
        
      default:
        return todayStr;
    }
  }, []);

  const generatePayrollForWorker = useCallback(async (worker: any) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    let startDate, endDate;
    
    // Calculate date range based on payment schedule
    switch (worker.payment_schedule) {
      case 'daily':
        // For daily: use TODAY's work logs
        startDate = todayStr;
        endDate = todayStr;
        break;
        
      case 'weekly':
        // For weekly: use last 7 days including today
        const weekAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
        startDate = weekAgo.toISOString().split('T')[0];
        endDate = todayStr;
        break;
        
      case 'bi-weekly':
        // For bi-weekly: use last 14 days including today
        const biWeekAgo = new Date(today.getTime() - 13 * 24 * 60 * 60 * 1000);
        startDate = biWeekAgo.toISOString().split('T')[0];
        endDate = todayStr;
        break;
        
      case 'monthly':
        // For monthly: use last month including today
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        startDate = monthAgo.toISOString().split('T')[0];
        endDate = todayStr;
        break;
        
      case 'quarterly':
        // For quarterly: use last 3 months including today
        const quarterAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
        startDate = quarterAgo.toISOString().split('T')[0];
        endDate = todayStr;
        break;
        
      default:
        startDate = todayStr;
        endDate = todayStr;
    }
    
    try {
      // 1. Calculate earnings for the period
      const earnings = await calculateWorkerEarnings(worker.id, startDate, endDate);
      
      if (earnings > 0) {
        // 2. Create payroll record
        const { error: insertError } = await supabase.from('payroll').insert({
          worker_id: worker.id,
          worker_name: worker.name,
          period_start: startDate,
          period_end: endDate,
          total_earnings: earnings,
          paid_status: false // Mark as pending payment
        });
        
        if (insertError) throw insertError;
        
        // 3. Update worker's payment dates
        const nextPaymentDate = calculateNextPaymentDate(worker);
        const { error: updateError } = await supabase
          .from('users')
          .update({
            last_payment_date: todayStr,
            next_payment_date: nextPaymentDate
          })
          .eq('id', worker.id);
        
        if (updateError) throw updateError;
        
        console.log(`✅ Generated payroll for ${worker.name}: ${earnings} MAD`);
        return true;
      } else {
        console.log(`⚠️ No earnings for ${worker.name} in period ${startDate} to ${endDate}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error generating payroll for ${worker.name}:`, error);
      return false;
    }
  }, [calculateWorkerEarnings, calculateNextPaymentDate]);

  // Mutation for automatic payroll generation
  const generatePayrollMutation = useMutation({
    mutationFn: async () => {
      const results = [];
      
      // Check which workers are due for payment
      for (const worker of workersDueForPayment) {
        const success = await generatePayrollForWorker(worker);
        results.push({ worker: worker.name, success });
      }
      
      return results;
    },
    onSuccess: (results) => {
      const successCount = results.filter(r => r.success).length;
      const totalCount = results.length;
      
      setMessageContent(t('payrollGenerated', { success: successCount, total: totalCount }));
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      queryClient.invalidateQueries({ queryKey: ['workers', 'payment-schedules'] });
    },
    onError: (error) => {
      setMessageContent(`${t('errorGeneratingPayroll')}: ${error.message}`);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    }
  });

  // Handle automatic payroll generation
  const handleGeneratePayroll = () => {
    if (workersDueForPayment.length === 0) {
      setMessageContent(t('noWorkersDueForPayment'));
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      return;
    }
    
    generatePayrollMutation.mutate();
  };

  // Optimized event handlers using useCallback
  const handlePaymentToggle = useCallback((id: string, currentStatus: boolean) => {
    updatePaymentMutation.mutate({ id, paid_status: !currentStatus });
  }, [updatePaymentMutation]);

  const handleExportPayroll = useCallback(() => {
    if (!payrollData || payrollData.length === 0) return;

    const headers = [
      t('workerName'),
      t('paymentPeriodStart'),
      t('paymentPeriodEnd'),
      t('totalEarnings'),
      t('paymentStatus')
    ];

    const csvRows = payrollData.map(item => {
      const periodStart = new Date(item.period_start).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US');
      const periodEnd = new Date(item.period_end).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US');
      const status = item.paid_status ? t('paid') : t('pending');
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
      [t('workerName'), 'Period', t('totalEarnings'), t('paymentStatus')],
      [item.worker_name, `${item.period_start} - ${item.period_end}`, item.total_earnings, item.paid_status ? t('paid') : t('pending')]
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

  // Protected period creation function
  const handleCreateNewPeriod = async () => {
    try {
      await createPeriodMutation.mutateAsync();
      
      setMessageContent(t('newPeriodCreated', { 
        period: currentPeriod?.period_name || 'New Period'
      }));
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
    } catch (error: any) {
      console.error('❌ Error creating new period:', error);
      setMessageContent(`${t('errorCreatingPeriod')}: ${error.message}`);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    }
  };

  const handleManageWageRates = useCallback(() => {
    console.log('Navigate to wage rates management');
  }, []);

  // Add this section to your UI where you want to show payment schedules
  const renderPaymentSchedules = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
        {t('workerPaymentSchedules')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workers.map(worker => (
          <div key={worker.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800">{worker.name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                worker.next_payment_date && new Date(worker.next_payment_date) <= new Date()
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {worker.payment_schedule}
              </span>
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              <div>Payment Day: {worker.payment_day}</div>
              <div>Next Payment: {worker.next_payment_date ? new Date(worker.next_payment_date).toLocaleDateString() : 'Not set'}</div>
              <div>Last Payment: {worker.last_payment_date ? new Date(worker.last_payment_date).toLocaleDateString() : 'Not set'}</div>
            </div>
            
            {worker.next_payment_date && new Date(worker.next_payment_date) <= new Date() && (
              <div className="mt-2">
                <span className="text-xs text-red-600 font-medium">⚠️ Due for payment</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-slate-600 font-medium text-sm arabic-text">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-red-600 font-medium arabic-text">{t('errorLoadingPayroll')}</p>
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
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

      {/* Modern Controls Section */}
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
        onClearFilters={handleClearFilters}
        onRemoveWorkerFilter={() => setAppliedWorkerFilter('')}
        onRemoveStatusFilter={() => setAppliedStatusFilter('')}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        tempWorkerFilter={tempWorkerFilter}
        setTempWorkerFilter={setTempWorkerFilter}
        tempStatusFilter={tempStatusFilter}
        setTempStatusFilter={setTempStatusFilter}
        users={users}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Add the payment schedules section */}
      {renderPaymentSchedules()}
    </div>
  );
}
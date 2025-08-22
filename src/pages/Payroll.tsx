import React, { useState, useCallback, useMemo } from 'react';
import { DollarSign, Calendar, User, Download, Filter, TrendingUp, Users, Package, CheckCircle, AlertCircle, X, Search, Clock, CalendarDays } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Payroll as PayrollType } from '../lib/supabase';

export default function Payroll() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  // Separate state for period and unpaid priority
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [showUnpaidFirst, setShowUnpaidFirst] = useState(true);
  
  // Filter state - separate from applied filters
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempWorkerFilter, setTempWorkerFilter] = useState('');
  const [tempStatusFilter, setTempStatusFilter] = useState('');
  
  // Applied filters (these trigger the query)
  const [appliedWorkerFilter, setAppliedWorkerFilter] = useState('');
  const [appliedStatusFilter, setAppliedStatusFilter] = useState('');

  // Add payment schedule state
  const [selectedSchedule, setSelectedSchedule] = useState('all');

  // ADD THESE MISSING STATE VARIABLES:
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [isCreatingPeriod, setIsCreatingPeriod] = useState(false);

  const scheduleOptions = [
    { value: 'all', label: t('allSchedules') },
    { value: 'daily', label: t('daily') },
    { value: 'weekly', label: t('weekly') },
    { value: 'bi-weekly', label: t('biWeekly') },
    { value: 'monthly', label: t('monthly') },
    { value: 'quarterly', label: t('quarterly') }
  ];

  const isRTL = i18n.language === 'ar';

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

  // Modify your payroll query to handle different schedules
  const { data: payrollData = [], isLoading, error } = useQuery<PayrollType[], Error>({
    queryKey: ['payroll', selectedPeriod, selectedSchedule, showUnpaidFirst, appliedWorkerFilter, appliedStatusFilter],
    queryFn: async () => {
      console.log('🚀 Starting payroll query...');
      console.log(' Selected Period:', selectedPeriod);
      console.log('⏰ Selected Schedule:', selectedSchedule);
      
      let query = supabase
        .from('payroll')
        .select('*')
        .order('created_at', { ascending: false });

      // Declare variables outside the if blocks
      let startDate: Date | null = null;
      let endDate: Date | null = null;

      // Apply period filtering based on selected schedule
      if (selectedPeriod !== 'all') {
        const now = new Date();
        
        if (selectedSchedule === 'all') {
          // Default to monthly for 'all' schedules
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getMonth() + 1, 0);
        } else {
          // Calculate dates based on selected schedule
          switch (selectedSchedule) {
            case 'daily':
              // For daily: use TODAY's work logs (not yesterday)
              startDate = new Date(now);
              endDate = new Date(now);
              break;
            case 'weekly':
              // For weekly: use last 7 days including today
              startDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000); // 6 days ago
              endDate = now;
              break;
            case 'bi-weekly':
              // For bi-weekly: use last 14 days including today
              startDate = new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000); // 13 days ago
              endDate = now;
              break;
            case 'monthly':
              startDate = new Date(now.getFullYear(), now.getMonth(), 1);
              endDate = now;
              break;
            case 'quarterly':
              startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
              endDate = now;
              break;
            default:
              startDate = new Date(now.getFullYear(), 0, 1); // Start of year
              endDate = now;
          }
        }
        
        query = query
          .gte('period_start', startDate.toISOString().split('T')[0])
          .lte('period_end', endDate.toISOString().split('T')[0]);
      } else {
        // When period is 'all', still apply schedule-based filtering
        if (selectedSchedule !== 'all') {
          const now = new Date();
          
          switch (selectedSchedule) {
            case 'daily':
              // For daily: use TODAY's work logs (not yesterday)
              startDate = new Date(now);
              endDate = new Date(now);
              break;
            case 'weekly':
              // For weekly: use last 7 days including today
              startDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000); // 6 days ago
              endDate = now;
              break;
            case 'bi-weekly':
              // For bi-weekly: use last 14 days including today
              startDate = new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000); // 13 days ago
              endDate = now;
              break;
            case 'monthly':
              startDate = new Date(now.getFullYear(), now.getMonth(), 1);
              endDate = now;
              break;
            case 'quarterly':
              startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
              endDate = now;
              break;
            default:
              startDate = new Date(now.getFullYear(), 0, 1); // Start of year
              endDate = now;
          }
          
          query = query
            .gte('period_start', startDate.toISOString().split('T')[0])
            .lte('period_end', endDate.toISOString().split('T')[0]);
        }
      }

      // Only log if dates were calculated
      if (startDate && endDate) {
        console.log(' Date range applied:', { 
          startDate: startDate.toISOString().split('T')[0], 
          endDate: endDate.toISOString().split('T')[0] 
        });
      }

      // Apply worker filter
      if (appliedWorkerFilter) {
        query = query.eq('worker_id', appliedWorkerFilter);
      }

      // Apply status filter
      if (appliedStatusFilter !== '') {
        query = query.eq('paid_status', appliedStatusFilter === 'paid');
      }

      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        console.error('❌ Query error:', fetchError);
        throw new Error(fetchError.message);
      }

      // Sort data based on unpaid priority
      let sortedData = data || [];
      if (showUnpaidFirst) {
        sortedData = sortedData.sort((a, b) => {
          if (a.paid_status !== b.paid_status) {
            return a.paid_status ? 1 : -1; // Unpaid first
          }
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // Recent first
        });
      }

      return sortedData;
    },
    enabled: !!user && (user.role === 'supervisor' || user.role === 'admin')
  });

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

  // Optimized mutation handlers
  const updatePaymentMutation = useMutation<PayrollType[], Error, { id: string, paid_status: boolean }>({
    mutationFn: async ({ id, paid_status }) => {
      const { data, error: updateError } = await supabase
        .from('payroll')
        .update({ paid_status })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw new Error(updateError.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
    }
  });

  const payAllPendingMutation = useMutation<PayrollType[], Error, void>({
    mutationFn: async () => {
      const pendingPayrolls = payrollData.filter(p => !p.paid_status);
      if (pendingPayrolls.length === 0) return [];

      const results = [];
      for (const payroll of pendingPayrolls) {
        const { data, error } = await supabase
          .from('payroll')
          .update({ paid_status: true })
          .eq('id', payroll.id)
          .select()
          .single();
        
        if (error) throw error;
        results.push(data);
      }
      return results as PayrollType[];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
    }
  });

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
      
      // setMessageContent(t('payrollGenerated', { success: successCount, total: totalCount })); // This state is not defined in the original file
      // setShowSuccessMessage(true); // This state is not defined in the original file
      // setTimeout(() => setShowSuccessMessage(false), 3000); // This state is not defined in the original file
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      queryClient.invalidateQueries({ queryKey: ['workers', 'payment-schedules'] });
    },
    onError: (error) => {
      // setMessageContent(`${t('errorGeneratingPayroll')}: ${error.message}`); // This state is not defined in the original file
      // setShowErrorMessage(true); // This state is not defined in the original file
      // setTimeout(() => setShowErrorMessage(false), 3000); // This state is not defined in the original file
    }
  });

  // Handle automatic payroll generation
  const handleGeneratePayroll = () => {
    if (workersDueForPayment.length === 0) {
      // setMessageContent(t('noWorkersDueForPayment')); // This state is not defined in the original file
      // setShowSuccessMessage(true); // This state is not defined in the original file
      // setTimeout(() => setShowSuccessMessage(false), 3000); // This state is not defined in the original file
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

  // Fetch current active period
  const { data: currentPeriod } = useQuery({
    queryKey: ['payroll-periods', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll_periods')
        .select('*')
        .eq('status', 'active')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    },
    enabled: !!user && (user.role === 'supervisor' || user.role === 'admin')
  });

  // Protected period creation function
  const handleCreateNewPeriod = async () => {
    if (isCreatingPeriod) return; // Prevent multiple calls
    
    setIsCreatingPeriod(true); // Disable button immediately
    
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      
      // 1. CHECK: Does current period already exist?
      const { data: existingPeriods } = await supabase
        .from('payroll_periods')
        .select('*')
        .eq('status', 'active')
        .gte('start_date', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`)
        .lte('end_date', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-31`);
      
      if (existingPeriods && existingPeriods.length > 0) {
        setMessageContent(t('periodAlreadyExists', { 
          period: existingPeriods[0].period_name 
        }));
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
        return; // Don't create duplicate
      }
      
      // 2. CLOSE: Previous active period if exists
      if (currentPeriod) {
        const { error: closeError } = await supabase
          .from('payroll_periods')
          .update({ 
            status: 'closed',
            closed_at: new Date().toISOString()
          })
          .eq('id', currentPeriod.id);
        
        if (closeError) throw closeError;
      }
      
      // 3. CREATE: New current period
      const periodStart = new Date(currentYear, currentMonth, 1);
      const periodEnd = new Date(currentYear, currentMonth + 1, 0);
      
      const newPeriod = {
        period_name: `${periodStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
        start_date: periodStart.toISOString().split('T')[0],
        end_date: periodEnd.toISOString().split('T')[0],
        status: 'active',
        notes: 'New payroll period created'
      };
      
      const { error: periodError } = await supabase
        .from('payroll_periods')
        .insert(newPeriod);
      
      if (periodError) throw periodError;
      
      // 4. UPDATE: All workers' payment dates to new period
      const { error: updateError } = await supabase
        .from('users')
        .update({
          next_payment_date: periodStart.toISOString().split('T')[0],
          last_payment_date: null
        })
        .eq('role', 'worker');
      
      if (updateError) throw updateError;
      
      // 5. SUCCESS: Show message and refresh data
      setMessageContent(t('newPeriodCreated', { 
        period: newPeriod.period_name 
      }));
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
      // Refresh all related data
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      queryClient.invalidateQueries({ queryKey: ['workers', 'payment-schedules'] });
      queryClient.invalidateQueries({ queryKey: ['payroll-periods'] });
      
      console.log(`✅ Created new payroll period: ${newPeriod.period_name}`);
      
    } catch (error) {
      console.error('❌ Error creating new period:', error);
      setMessageContent(`${t('errorCreatingPeriod')}: ${error.message}`);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    } finally {
      setIsCreatingPeriod(false); // Re-enable button
    }
  };

  // Update the button to show current period info
  <button 
    onClick={handleCreateNewPeriod} 
    disabled={isCreatingPeriod}
    className={`w-full cold-button-secondary text-left ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
  >
    <Calendar className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
    <span className="arabic-text">
      {isCreatingPeriod 
        ? t('creatingPeriod') 
        : currentPeriod 
          ? t('createNewPeriod', { current: currentPeriod.period_name })
          : t('createNewPayrollPeriod')
      }
    </span>
  </button>

  const handleManageWageRates = useCallback(() => {
    console.log('Navigate to wage rates management');
  }, []);

  // Filter handlers
  const handleApplyFilters = useCallback(() => {
    setAppliedWorkerFilter(tempWorkerFilter);
    setAppliedStatusFilter(tempStatusFilter);
    setShowFilterModal(false);
  }, [tempWorkerFilter, tempStatusFilter]);

  const handleClearFilters = useCallback(() => {
    setTempWorkerFilter('');
    setTempStatusFilter('');
    setAppliedWorkerFilter('');
    setAppliedStatusFilter('');
  }, []);

  const openFilterModal = useCallback(() => {
    // Initialize temp filters with current applied filters
    setTempWorkerFilter(appliedWorkerFilter);
    setTempStatusFilter(appliedStatusFilter);
    setShowFilterModal(true);
  }, [appliedWorkerFilter, appliedStatusFilter]);

  // StatCard component
  const StatCard = useCallback(({ title, value, icon: Icon, color, trend }: { 
    title: string, 
    value: string | number, 
    icon: React.ElementType, 
    color: string, 
    trend?: string 
  }) => (
    <div className="metric-card">
      <div className={`flex items-center ${isRTL ? 'justify-start' : 'justify-between'} ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : ''}>
          <p className="text-slate-600 text-sm font-medium arabic-text">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="w-4 h-4 text-emerald-500 mx-1" />
              <span className="text-emerald-600 text-sm font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} ${isRTL ? 'ml-4' : ''}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  ), [isRTL]);

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
      {/* ADD SUCCESS/ERROR MESSAGES */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 animate-bounce arabic-text">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse' : 'space-x-2'}`}>
            <CheckCircle className="h-5 w-5" />
            <span>{messageContent}</span>
          </div>
        </div>
      )}
      
      {showErrorMessage && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 animate-bounce arabic-text">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse' : 'space-x-2'}`}>
            <AlertCircle className="h-5 w-5" />
            <span>{messageContent}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : ''}>
          <h1 className="text-3xl font-bold cold-gradient-text arabic-heading">
            {t('payrollManagement')}
          </h1>
          <p className="text-slate-600 mt-1 arabic-text">
            {t('comprehensivePayrollManagement')}
          </p>
        </div>

        <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <button onClick={handleExportPayroll} className="cold-button">
            <Download className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            <span className="arabic-text">{t('export')}</span>
          </button>
        </div>
      </div>

      {/* Modern Controls Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Period Selection */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              <label className="text-sm font-semibold text-gray-700 arabic-text">
                {t('selectPeriod')}
              </label>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 arabic-text bg-gray-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="all">{t('allPeriods')}</option>
              <option value="current">{t('currentPeriod')}</option>
              <option value="previous">{t('previousPeriod')}</option>
              <option value="quarterly">{t('quarterly')}</option>
              <option value="yearly">{t('yearly')}</option>
            </select>
          </div>

          {/* Unpaid Priority Toggle */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <label className="text-sm font-semibold text-gray-700 arabic-text">
                {t('displayPriority')}
              </label>
            </div>
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUnpaidFirst}
                  onChange={(e) => setShowUnpaidFirst(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700 arabic-text">
                  {showUnpaidFirst ? t('enabled') : t('disabled')}
                </span>
              </label>
            </div>
          </div>

          {/* Payment Schedule Filter */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('paymentSchedule')}
            </label>
            <select
              value={selectedSchedule}
              onChange={(e) => setSelectedSchedule(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {scheduleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Button */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-green-600" />
              <label className="text-sm font-semibold text-gray-700 arabic-text">
                {t('filters')}
              </label>
            </div>
            <button 
              onClick={openFilterModal}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Filter className={`w-4 h-4 inline ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span className="arabic-text">
                {appliedWorkerFilter || appliedStatusFilter ? t('filtersActive') : t('filter')}
              </span>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(appliedWorkerFilter || appliedStatusFilter) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">{t('activeFilters')}:</span>
              {appliedWorkerFilter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {users.find(u => u.id === appliedWorkerFilter)?.name || appliedWorkerFilter}
                  <button
                    onClick={() => setAppliedWorkerFilter('')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {appliedStatusFilter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {appliedStatusFilter === 'paid' ? t('paid') : t('pending')}
                  <button
                    onClick={() => setAppliedStatusFilter('')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                {t('clearAll')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={t('totalPayroll')}
          value={`${totalPayroll.toLocaleString()} MAD`}
          icon={DollarSign}
          color="cold-gradient"
          trend="+12.5%"
        />
        <StatCard
          title={t('paidAmount')}
          value={`${paidAmount.toLocaleString()} MAD`}
          icon={Package}
          color="bg-gradient-to-r from-emerald-500 to-teal-600"
          trend="+8.3%"
        />
        <StatCard
          title={t('pendingAmount')}
          value={`${totalPending.toLocaleString()} MAD`}
          icon={Calendar}
          color="bg-gradient-to-r from-amber-500 to-orange-500"
        />
      </div>

      {/* Payroll Table */}
      <div className="management-section">
        <div className="management-header">
          <h3 className="text-xl font-bold text-slate-800 arabic-heading">
            {t('detailedPayrollRecords')}
          </h3>
          <div className={`text-sm text-slate-600 arabic-text ${isRTL ? 'text-right' : ''}`}>
            {t('totalWorkersCount', { count: payrollData.length })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table w-full">
            <thead>
              <tr>
                <th className={`${isRTL ? 'text-right' : 'text-left'} arabic-text`}>{t('workerName')}</th>
                <th className={`${isRTL ? 'text-right' : 'text-left'} arabic-text`}>{t('paymentPeriod')}</th>
                <th className={`${isRTL ? 'text-right' : 'text-left'} arabic-text`}>{t('totalEarnings')}</th>
                <th className={`${isRTL ? 'text-right' : 'text-left'} arabic-text`}>{t('paymentStatus')}</th>
                <th className={`${isRTL ? 'text-right' : 'text-left'} arabic-text`}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {payrollData.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30">
                  <td>
                    <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className="w-10 h-10 cold-gradient rounded-xl flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className={isRTL ? 'text-right' : ''}>
                        <div className="font-medium text-slate-800 arabic-text">{item.worker_name}</div>
                        <div className="text-sm text-slate-500">{item.worker_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className={`${isRTL ? 'text-right' : ''} arabic-text`}>
                    <div className="text-sm text-slate-600">
                      {new Date(item.period_start).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US')} - {new Date(item.period_end).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US')}
                    </div>
                  </td>
                  <td className={`${isRTL ? 'text-right' : ''}`}>
                    <div className="font-bold text-slate-800">
                      {item.total_earnings.toLocaleString()} <span className="arabic-text">MAD</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-indicator ${
                      item.paid_status ? 'status-active' : 'status-pending'
                    } arabic-text`}>
                      {item.paid_status ? t('paid') : t('pending')}
                    </span>
                  </td>
                  <td>
                    <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <button
                        onClick={() => handleDownloadIndividual(item)}
                        className="cold-button-secondary text-sm"
                      >
                        <Download className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                        <span className="arabic-text">{t('download')}</span>
                      </button>
                      {!item.paid_status && (
                        <button
                          onClick={() => handlePaymentToggle(item.id, item.paid_status)}
                          disabled={updatePaymentMutation.isPending}
                          className="cold-button text-sm"
                        >
                          <DollarSign className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                          <span className="arabic-text">
                            {updatePaymentMutation.isPending ? t('paying') : t('pay')}
                          </span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Summary and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Summary */}
        <div className="management-card">
          <h4 className="text-lg font-bold text-slate-800 mb-4 arabic-heading">
            {t('paymentSummary')}
          </h4>
          <div className="space-y-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-slate-600 arabic-text">{t('totalPayroll')}</span>
              <span className="font-bold text-slate-800">{totalPayroll.toLocaleString()} MAD</span>
            </div>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-slate-600 arabic-text">{t('paidAmount')}</span>
              <span className="font-bold text-emerald-600">{paidAmount.toLocaleString()} MAD</span>
            </div>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-slate-600 arabic-text">{t('pendingAmount')}</span>
              <span className="font-bold text-amber-600">{totalPending.toLocaleString()} MAD</span>
            </div>
            <div className={`flex items-center justify-between pt-4 border-t border-slate-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-slate-600 arabic-text">{t('paymentRate')}</span>
              <span className="font-bold text-blue-600">{paymentRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="management-card">
          <h4 className="text-lg font-bold text-slate-800 mb-4 arabic-heading">
            {t('quickActions')}
          </h4>
          <div className="space-y-3">
            {/* Add the new Generate Payroll button */}
            <button 
              onClick={handleGeneratePayroll} 
              disabled={generatePayrollMutation.isPending}
              className={`w-full cold-button text-left ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
            >
              <Clock className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span className="arabic-text">
                {generatePayrollMutation.isPending 
                  ? t('generatingPayroll') 
                  : t('generatePayrollForDueWorkers')
                }
              </span>
            </button>
            
            <button onClick={handlePayAllPending} disabled={payAllPendingMutation.isPending} className={`w-full cold-button text-left ${isRTL ? 'flex-row-reverse justify-end' : ''}`} >
              <DollarSign className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span className="arabic-text">
                {payAllPendingMutation.isPending ? t('payingAllPending') : t('payAllPendingPayroll')}
              </span>
            </button>
            
            <button
              onClick={handleExportPayroll}
              className={`w-full cold-button-secondary text-left ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
            >
              <Download className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span className="arabic-text">{t('exportPayrollRecords')}</span>
            </button>
            <button
              onClick={handleCreateNewPeriod}
              disabled={isCreatingPeriod}
              className={`w-full cold-button-secondary text-left ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
            >
              <Calendar className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span className="arabic-text">
                {isCreatingPeriod ? t('creatingPeriod') : t('createNewPayrollPeriod')}
              </span>
            </button>
            <button
              onClick={handleManageWageRates}
              className={`w-full cold-button-secondary text-left ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
            >
              <Users className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              <span className="arabic-text">{t('manageWageRates')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 max-w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">{t('filterPayroll')}</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">{t('workerName')}</label>
                <select
                  value={tempWorkerFilter}
                  onChange={(e) => setTempWorkerFilter(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">{t('allWorkers')}</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">{t('paymentStatus')}</label>
                <select
                  value={tempStatusFilter}
                  onChange={(e) => setTempStatusFilter(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">{t('allStatuses')}</option>
                  <option value="paid">{t('paid')}</option>
                  <option value="pending">{t('pending')}</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                {t('clear')}
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {t('apply')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add the payment schedules section */}
      {renderPaymentSchedules()}
    </div>
  );
}
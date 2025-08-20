import React, { useState } from 'react';
import { DollarSign, Calendar, User, Download, Filter, TrendingUp, Users, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

export default function Payroll() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  
  const isRTL = i18n.language === 'ar';

  // Fetch payroll data from Supabase
  const { data: payrollData = [], isLoading, error } = useQuery({
    queryKey: ['payroll', selectedPeriod],
    queryFn: async () => {
      let query = supabase
        .from('payroll')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Filter by period if needed
      if (selectedPeriod === 'current') {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        query = query
          .gte('period_start', startOfMonth.toISOString().split('T')[0])
          .lte('period_end', endOfMonth.toISOString().split('T')[0]);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data || [];
    },
    enabled: !!user && (user.role === 'supervisor' || user.role === 'admin')
  });

  // Mutation for updating payment status
  const updatePaymentMutation = useMutation({
    mutationFn: async ({ id, paid_status }: { id: string, paid_status: boolean }) => {
      const { data, error } = await supabase
        .from('payroll')
        .update({ paid_status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
    },
    onError: (error) => {
      console.error('Payment update error:', error);
    }
  });

  // Calculate totals
  const totalPayroll = payrollData.reduce((sum, record) => sum + (record.total_earnings || 0), 0);
  const paidAmount = payrollData
    .filter(record => record.paid_status)
    .reduce((sum, record) => sum + (record.total_earnings || 0), 0);
  const totalPending = payrollData
    .filter(p => !p.paid_status)
    .reduce((sum, p) => sum + (p.total_earnings || 0), 0);

  const handlePaymentToggle = (id: string, currentStatus: boolean) => {
    updatePaymentMutation.mutate({ id, paid_status: !currentStatus });
  };

  const handleExportPayroll = async () => {
    try {
      // Export functionality - could generate CSV, PDF, etc.
      const csvContent = payrollData.map(item => 
        `${item.worker_name},${item.period_start},${item.period_end},${item.total_earnings},${item.paid_status ? 'Paid' : 'Pending'}`
      ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payroll-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
    }
  };
  
  if (isLoading) {
    return <div className="text-center py-8">{t('loading')}</div>
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-red-600 font-medium">Error loading payroll data</p>
          <p className="text-red-500 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
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
  );
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : ''}>
          <h1 className="text-3xl font-bold cold-gradient-text arabic-heading">{t('payrollManagement')}</h1>
          <p className="text-slate-600 mt-1 arabic-text">إدارة شاملة لكشوف رواتب العمال والمدفوعات</p>
        </div>
        
        <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            onClick={handleExportPayroll}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <option value="current">الفترة الحالية</option>
            <option value="previous">الفترة السابقة</option>
            <option value="quarterly">ربع سنوي</option>
            <option value="yearly">سنوي</option>
          </select>
          
          <button className="cold-button-secondary">
            <Filter className="w-4 h-4 mr-2" />
            <span className="arabic-text">تصفية</span>
          </button>
          
          <button className="cold-button">
            <Download className="w-4 h-4 mr-2" />
            <span className="arabic-text">تصدير</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={t('totalPayroll')}
          value={`${totalPayroll.toLocaleString()} ريال`}
          icon={DollarSign}
          color="cold-gradient"
          trend="+12.5%"
        />
        <StatCard
          title={t('paidAmount')}
          value={`${paidAmount.toLocaleString()} ريال`}
          icon={Package}
          color="bg-gradient-to-r from-emerald-500 to-teal-600"
          trend="+8.3%"
        />
        <StatCard
          title={t('pendingAmount')}
          value={`${totalPending.toLocaleString()} ريال`}
          icon={Calendar}
          color="bg-gradient-to-r from-amber-500 to-orange-500"
        />
      </div>
      
      {/* Payroll Table */}
      <div className="management-section">
        <div className="management-header">
          <h3 className="text-xl font-bold text-slate-800 arabic-heading">كشوف الرواتب التفصيلية</h3>
          <div className={`text-sm text-slate-600 arabic-text ${isRTL ? 'text-right' : ''}`}>
            إجمالي {payrollData.length} عامل
          </div>
        </div>

        <div className="data-table">
          <table className="w-full">
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
                      {new Date(item.period_start).toLocaleDateString('ar-SA')} - {new Date(item.period_end).toLocaleDateString('ar-SA')}
                    </div>
                  </td>
                  <td className={`${isRTL ? 'text-right' : ''}`}>
                    <div className="font-bold text-slate-800">
                      {item.total_earnings.toLocaleString()} <span className="arabic-text">ريال</span>
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
                      <button className="cold-button-secondary text-sm">
                        <Download className="w-4 h-4 mr-1" />
                        <span className="arabic-text">تحميل</span>
                      </button>
                      {!item.paid_status && (
                        <button className="cold-button text-sm">
                          onClick={() => handlePaymentToggle(item.id, item.paid_status)}
                          disabled={updatePaymentMutation.isPending}
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span className="arabic-text">
                            {updatePaymentMutation.isPending ? 'جاري الدفع...' : 'دفع'}
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

      {/* Payment Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="management-card">
          <h4 className="text-lg font-bold text-slate-800 mb-4 arabic-heading">ملخص المدفوعات</h4>
          <div className="space-y-4">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-slate-600 arabic-text">إجمالي الرواتب</span>
              <span className="font-bold text-slate-800">{totalPayroll.toLocaleString()} ريال</span>
            </div>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-slate-600 arabic-text">المبلغ المدفوع</span>
              <span className="font-bold text-emerald-600">{paidAmount.toLocaleString()} ريال</span>
            </div>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-slate-600 arabic-text">المبلغ المعلق</span>
              <span className="font-bold text-amber-600">{totalPending.toLocaleString()} ريال</span>
            </div>
            <div className={`flex items-center justify-between pt-4 border-t border-slate-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-slate-600 arabic-text">معدل الدفع</span>
              <span className="font-bold text-blue-600">{((paidAmount / totalPayroll) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="management-card">
          <h4 className="text-lg font-bold text-slate-800 mb-4 arabic-heading">إجراءات سريعة</h4>
          <div className="space-y-3">
            <button className="w-full cold-button text-left">
              <DollarSign className="w-4 h-4 mr-2" />
              <span className="arabic-text">دفع جميع الرواتب المعلقة</span>
            </button>
            <button className="w-full cold-button-secondary text-left">
              <Download className="w-4 h-4 mr-2" />
              <span className="arabic-text">تصدير كشوف الرواتب</span>
            </button>
            <button className="w-full cold-button-secondary text-left">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="arabic-text">إنشاء فترة راتب جديدة</span>
            </button>
            <button className="w-full cold-button-secondary text-left">
              <Users className="w-4 h-4 mr-2" />
              <span className="arabic-text">إدارة معدلات الأجور</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
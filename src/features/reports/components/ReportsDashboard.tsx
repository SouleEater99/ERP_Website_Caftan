import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  PieChart,
  Activity,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie,
  Cell, 
  LineChart, 
  Line, 
  Area, 
  AreaChart
} from 'recharts';
import { 
  REPORT_PERIODS, 
  REPORT_TYPES, 
  EXPORT_OPTIONS
} from '../constants/reports.constants';
import { useReportsData } from '../hooks/useReportsData';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/reports.utils';
import { ReportsService } from '../services/reports.service';

const ReportsDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedReport, setSelectedReport] = useState('production');
  const [exporting, setExporting] = useState(false);
  
  const isRTL = i18n.language === 'ar';

  const {
    workLogStats,
    monthlyProduction,
    workerPerformance,
    materialUsage,
    materialUsageDetails,
    materialUsageTrends,
    recentActivities,
    quickStats,
    isLoading,
    hasErrors,
    errors,
    refetchAll
  } = useReportsData(selectedPeriod);

  const handleRefresh = () => {
    refetchAll();
  };

  const handleExport = async (format: string) => {
    try {
      setExporting(true);
      const exportData = await ReportsService.exportReport(selectedReport, selectedPeriod, format);
      
      // Convert data to appropriate format
      let dataString = '';
      let mimeType = '';
      let fileExtension = '';
      
      switch (format) {
        case 'csv':
          dataString = convertToCSV(exportData.data);
          mimeType = 'text/csv';
          fileExtension = 'csv';
          break;
        case 'excel':
          dataString = convertToExcel(exportData.data);
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          fileExtension = 'xlsx';
          break;
        case 'pdf':
          // For PDF, we'd need a proper PDF library
          dataString = JSON.stringify(exportData.data, null, 2);
          mimeType = 'application/pdf';
          fileExtension = 'pdf';
          break;
        default:
          throw new Error('Unsupported export format');
      }
      
      // Create and download file
      const blob = new Blob([dataString], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportData.filename}.${fileExtension}`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      // Show success message
      showToast(t('reports.exportSuccessful'), 'success');
    } catch (error) {
      console.error('Export failed:', error);
      showToast(t('reports.exportFailed'), 'error');
    } finally {
      setExporting(false);
    }
  };

  const convertToCSV = (data: any[]): string => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  };

  const convertToExcel = (data: any[]): string => {
    // Simplified Excel format - in production, use a proper Excel library
    return convertToCSV(data);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const ReportCard = ({ title, value, change, icon: Icon, color, trend }: any) => (
    <div className="glass-card p-8 rounded-3xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-cyan-600/5 to-blue-700/5"></div>
      <div className="absolute inset-0 cold-pattern opacity-20"></div>
      
      <div className={`relative flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
          <p className="text-slate-600 text-sm font-bold uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-black text-slate-900 mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{value}</p>
          {change && (
            <div className={`flex items-center mt-3 ${isRTL ? 'flex-row-reverse space-x-reverse space-x-2' : 'space-x-2'}`}>
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
              <span className="text-emerald-600 text-sm font-bold">{change}</span>
            </div>
          )}
        </div>
        <div className={`w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300 ${isRTL ? 'mr-6' : 'ml-6'} flex-shrink-0`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-orange-600 text-lg">{t('reports.loadingReports')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header - Fully Professional */}
        <div className="glass-card p-10 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-cyan-600/5 to-blue-700/5"></div>
          <div className="absolute inset-0 cold-pattern opacity-30"></div>
          
          <div className={`relative flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className="text-5xl font-black text-slate-900 mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 bg-clip-text text-transparent">
                {t('reports.title')}
              </h1>
              <p className="text-slate-600 text-xl font-medium">{t('reports.description')}</p>
            </div>
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-6' : 'space-x-6'}`}>
              <button
                onClick={handleRefresh}
                className="glass-button flex items-center px-8 py-4"
              >
                <RefreshCw className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <span className="font-bold">{t('common.refresh')}</span>
              </button>
              <button
                onClick={() => setExporting(!exporting)}
                className="cold-button"
              >
                <Download className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                <span className="font-bold">{exporting ? t('reports.exporting') : t('common.export')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Period and Report Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="glass-card p-8 rounded-3xl">
            <label className={`block text-sm font-black text-slate-900 uppercase tracking-widest mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
              <span className={`inline-flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-4' : 'space-x-4'}`}>
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-full shadow-lg shadow-blue-500/30"></div>
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {t('reports.selectPeriod')}
                </span>
              </span>
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-6 py-5 bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-800 font-semibold shadow-lg hover:shadow-xl text-lg"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {REPORT_PERIODS.map(period => (
                <option key={period.value} value={period.value}>
                  {t(`reports.periods.${period.label}`)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="glass-card p-8 rounded-3xl">
            <label className={`block text-sm font-black text-slate-900 uppercase tracking-widest mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
              <span className={`inline-flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-4' : 'space-x-4'}`}>
                <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 rounded-full shadow-lg shadow-emerald-500/30"></div>
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {t('reports.selectReportType')}
                </span>
              </span>
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-6 py-5 bg-white/90 backdrop-blur-sm border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-slate-800 font-semibold shadow-lg hover:shadow-xl text-lg"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {REPORT_TYPES.map(report => (
                <option key={report.id} value={report.id}>
                  {t(`reports.types.${report.label}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Enhanced Error Display */}
        {hasErrors && (
          <div className="glass-card p-10 rounded-3xl border-l-8 border-red-500 bg-gradient-to-r from-red-50/50 to-red-100/30">
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-6' : 'space-x-6'}`}>
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-xl shadow-red-500/25">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className="text-2xl font-black text-red-800 mb-3">{t('reports.someDataFailed')}</h3>
                <p className="text-red-700 text-lg mb-6">{t('reports.pleaseRefresh')}</p>
                <button 
                  onClick={handleRefresh}
                  className="px-8 py-4 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white rounded-2xl hover:from-red-600 hover:via-red-700 hover:to-red-800 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  {t('reports.retry')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ReportCard
            title={t('navigation.totalProduction')}
            value={workLogStats ? formatNumber(workLogStats.total_completed + workLogStats.total_pending) : '0'}
            change="+12.5%"
            icon={Package}
          />
          <ReportCard
            title={t('navigation.activeWorkers')}
            value={workLogStats ? workLogStats.worker_count.toString() : '0'}
            change="+3.2%"
            icon={Users}
          />
          <ReportCard
            title={t('navigation.revenue')}
            value={workLogStats ? formatCurrency(workLogStats.total_revenue) : '$0'}
            change="+18.7%"
            icon={DollarSign}
          />
          <ReportCard
            title={t('navigation.efficiency')}
            value={workLogStats ? formatPercentage(workLogStats.efficiency_rate) : '0%'}
            change="+5.1%"
            icon={TrendingUp}
          />
        </div>

        {/* Enhanced Report Navigation */}
        <div className="glass-card p-8 rounded-3xl">
          <div className={`flex flex-wrap gap-6 ${isRTL ? 'justify-end' : 'justify-start'}`}>
            {REPORT_TYPES.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedReport(tab.id)}
                className={`flex items-center px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                  selectedReport === tab.id
                    ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 text-white shadow-xl shadow-blue-500/25'
                    : 'bg-white/70 text-slate-700 hover:bg-white/90 hover:shadow-lg border border-slate-200'
                } ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}
              >
                {tab.icon === 'BarChart3' && <BarChart3 className="w-5 h-5" />}
                {tab.icon === 'Users' && <Users className="w-5 h-5" />}
                {tab.icon === 'PieChart' && <PieChart className="w-5 h-5" />}
                {tab.icon === 'DollarSign' && <DollarSign className="w-5 h-5" />}
                <span>{t(`dashboard.${tab.label}`)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Report Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Chart */}
          <div className="lg:col-span-2 space-y-8">
            {/* Production Report */}
            {selectedReport === 'production' && monthlyProduction && (
              <div className="glass-card p-10 rounded-3xl">
                <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {t('dashboard.productionTrends')}
                    </h3>
                    <p className="text-slate-600 font-medium">{t('dashboard.monthlyAnalysis')}</p>
                  </div>
                  <div className={`flex items-center bg-blue-50 px-4 py-2 rounded-2xl ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-blue-700 font-semibold">{t('dashboard.lastSixMonths')}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 rounded-2xl p-6">
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={monthlyProduction}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} fontWeight={500} />
                      <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: 'none',
                          borderRadius: '16px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(10px)'
                        }} 
                      />
                      <Area type="monotone" dataKey="completed" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={3} />
                      <Area type="monotone" dataKey="pending" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Worker Performance Report */}
            {selectedReport === 'workers' && workerPerformance && (
              <div className="glass-card p-10 rounded-3xl">
                <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      {t('dashboard.workerPerformance')}
                    </h3>
                    <p className="text-slate-600 font-medium">{t('dashboard.performanceMetrics')}</p>
                  </div>
                  <button className="cold-button">
                    <Eye className="w-5 h-5" />
                    <span>{t('dashboard.viewDetails')}</span>
                  </button>
                </div>
                <div className="bg-gradient-to-br from-emerald-50/50 to-green-50/50 rounded-2xl p-6">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={workerPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="worker_name" stroke="#64748b" fontSize={12} fontWeight={500} />
                      <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: 'none',
                          borderRadius: '16px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(10px)'
                        }} 
                      />
                      <Bar dataKey="tasks_completed" fill="url(#emeraldGradient)" radius={[8, 8, 0, 0]} />
                      <defs>
                        <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                          <stop offset="95%" stopColor="#059669" stopOpacity={0.7}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Enhanced Materials Report */}
            {selectedReport === 'materials' && materialUsage && (
              <div className="glass-card p-10 rounded-3xl">
                <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {t('dashboard.materialUsageDistribution')}
                    </h3>
                    <p className="text-slate-600 font-medium">{t('dashboard.currentMonth')}</p>
                  </div>
                </div>
                
                {/* Enhanced Material Usage Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Enhanced Pie Chart */}
                  <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-2xl p-6">
                    <h4 className="text-lg font-bold text-slate-800 mb-6">{t('reports.usageDistribution')}</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={materialUsage}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="percentage"
                          label={({ material_name, percentage }) => `${material_name} ${percentage.toFixed(1)}%`}
                        >
                          {materialUsage.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Enhanced Material Details */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-slate-800">{t('reports.materialDetails')}</h4>
                    <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                      {materialUsage.map((material, index) => (
                        <div key={index} className={`glass-card p-4 rounded-2xl hover:shadow-lg transition-all duration-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}>
                              <div 
                                className="w-4 h-4 rounded-full shadow-sm" 
                                style={{ backgroundColor: material.color }}
                              ></div>
                              <span className="font-bold text-slate-900">{material.material_name}</span>
                            </div>
                            <div className={isRTL ? 'text-left' : 'text-right'}>
                              <div className="text-sm font-bold text-slate-800">
                                {material.quantity_used} {t('common.unit')}
                              </div>
                              <div className="text-xs text-slate-600">
                                {material.percentage.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enhanced Cost Analysis */}
                <div className="glass-card p-8 rounded-2xl bg-gradient-to-r from-purple-50/50 to-pink-50/50">
                  <h4 className="text-xl font-bold text-slate-900 mb-6">{t('reports.costAnalysis')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`text-center p-6 bg-white/70 rounded-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className="text-3xl font-black text-purple-900 mb-2">
                        {formatCurrency(materialUsage.reduce((sum, m) => sum + (m.total_cost || 0), 0))}
                      </div>
                      <div className="text-sm text-purple-600 font-semibold">{t('reports.totalMaterialCost')}</div>
                    </div>
                    <div className={`text-center p-6 bg-white/70 rounded-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className="text-3xl font-black text-purple-900 mb-2">
                        {materialUsage.length}
                      </div>
                      <div className="text-sm text-purple-600 font-semibold">{t('reports.materialsUsed')}</div>
                    </div>
                    <div className={`text-center p-6 bg-white/70 rounded-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className="text-3xl font-black text-purple-900 mb-2">
                        {formatCurrency((materialUsage.reduce((sum, m) => sum + (m.total_cost || 0), 0) / 
                           materialUsage.reduce((sum, m) => sum + m.quantity_used, 0)).toFixed(2))}
                      </div>
                      <div className="text-sm text-purple-600 font-semibold">{t('reports.costPerUnit')}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedReport === 'financial' && monthlyProduction && (
              <div className="glass-card p-10 rounded-3xl">
                <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {t('dashboard.revenueTrends')}
                    </h3>
                    <p className="text-slate-600 font-medium">{t('dashboard.monthlyRevenue')}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-2xl p-6">
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={monthlyProduction}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} fontWeight={500} />
                      <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          border: 'none',
                          borderRadius: '16px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(10px)'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10b981" 
                        strokeWidth={4} 
                        dot={{ fill: '#10b981', strokeWidth: 3, r: 8 }}
                        activeDot={{ r: 10, stroke: '#10b981', strokeWidth: 3, fill: '#ffffff' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Enhanced Empty State */}
            {!monthlyProduction && !workerPerformance && !materialUsage && (
              <div className="glass-card p-16 rounded-3xl text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-slate-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{t('reports.noDataAvailable')}</h3>
                <p className="text-slate-600 mb-6">{t('reports.selectDifferentPeriod')}</p>
                <button onClick={handleRefresh} className="cold-button">
                  <RefreshCw className="w-5 h-5" />
                  <span>{t('common.refresh')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Enhanced Side Panel */}
          <div className="space-y-8">
            {/* Enhanced Quick Stats */}
            <div className="glass-card p-8 rounded-3xl">
              <h4 className="text-xl font-black text-slate-900 mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {t('dashboard.quickStats')}
              </h4>
              <div className="space-y-4">
                {quickStats?.map((stat, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl hover:bg-blue-50 transition-all duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-slate-700 font-semibold">{t(stat.labelKey)}</span>
                    <span className={`font-black text-lg ${stat.color}`}>{stat.value}</span>
                  </div>
                )) || (
                  <div className="flex items-center justify-center p-8">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Recent Activities */}
            <div className="glass-card p-8 rounded-3xl">
              <h4 className="text-xl font-black text-slate-900 mb-6 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {t('dashboard.recentActivities')}
              </h4>
              <div className="space-y-4">
                {recentActivities?.map((activity) => (
                  <div key={activity.id} className={`flex items-start p-4 bg-emerald-50/50 rounded-2xl hover:bg-emerald-50 transition-all duration-300 ${isRTL ? 'flex-row-reverse space-x-reverse space-x-4' : 'space-x-4'}`}>
                    <div className={`w-3 h-3 rounded-full mt-2 shadow-sm ${
                      activity.status === 'success' ? 'bg-emerald-500' :
                      activity.status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}></div>
                    <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <p className="text-sm font-bold text-slate-900">{t(activity.actionKey)}</p>
                      <p className="text-xs text-slate-700 mt-1">{activity.item}</p>
                      <p className="text-xs text-slate-500 mt-2">{new Date(activity.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                )) || (
                  <div className="flex items-center justify-center p-8">
                    <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Export Options */}
            <div className="glass-card p-8 rounded-3xl">
              <h4 className="text-xl font-black text-slate-900 mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t('dashboard.exportReports')}
              </h4>
              <div className="space-y-4">
                {EXPORT_OPTIONS.map((option, index) => (
                  <button 
                    key={index}
                    onClick={() => handleExport(option.format)}
                    disabled={exporting}
                    className={`w-full flex items-center px-6 py-4 bg-purple-50 text-purple-700 rounded-2xl hover:bg-purple-100 transition-all duration-300 font-semibold shadow-sm hover:shadow-md disabled:opacity-50 ${isRTL ? 'flex-row-reverse space-x-reverse space-x-3' : 'space-x-3'}`}
                  >
                    {option.icon === 'FileText' && <FileText className="w-5 h-5" />}
                    {option.icon === 'BarChart3' && <BarChart3 className="w-5 h-5" />}
                    {option.icon === 'Activity' && <Activity className="w-5 h-5" />}
                    <span>{t(`dashboard.${option.label}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Material Usage Trends - Previously Missing */}
      {selectedReport === 'materials' && materialUsageTrends && materialUsageTrends.length > 0 && (
        <div className="glass-card p-10 rounded-3xl">
          <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h4 className="text-2xl font-black text-slate-900 mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {t('reports.usageTrendsOverTime')}
              </h4>
              <p className="text-slate-600 font-medium">{t('reports.monthlyTrends')}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50/50 to-amber-50/50 rounded-2xl p-8">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={materialUsageTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} fontWeight={500} />
                <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }} 
                />
                {materialUsage.slice(0, 5).map((material, index) => (
                  <Bar 
                    key={material.material_name}
                    dataKey={material.material_name} 
                    fill={material.color} 
                    radius={[6, 6, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Enhanced Material Insights - Previously Missing */}
      {selectedReport === 'materials' && materialUsage && (
        <div className="glass-card p-10 rounded-3xl bg-gradient-to-br from-purple-50/30 to-pink-50/30 border border-purple-200/50">
          <h4 className="text-2xl font-black text-slate-900 mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('reports.materialInsights')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className={`glass-card p-8 rounded-2xl text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-black text-purple-900 mb-2">
                {materialUsage[0]?.material_name || t('common.notAvailable')}
              </div>
              <div className="text-sm text-purple-600 font-bold uppercase tracking-wide">{t('reports.mostUsed')}</div>
            </div>
            <div className={`glass-card p-8 rounded-2xl text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-black text-blue-900 mb-2">
                {materialUsage.reduce((sum, m) => sum + m.quantity_used, 0).toLocaleString()}
              </div>
              <div className="text-sm text-blue-600 font-bold uppercase tracking-wide">{t('reports.totalUnits')}</div>
            </div>
            <div className={`glass-card p-8 rounded-2xl text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-black text-emerald-900 mb-2">
                {(materialUsage.reduce((sum, m) => sum + m.quantity_used, 0) / materialUsage.length).toFixed(0)}
              </div>
              <div className="text-sm text-emerald-600 font-bold uppercase tracking-wide">{t('reports.avgUsage')}</div>
            </div>
            <div className={`glass-card p-8 rounded-2xl text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div className="text-lg font-black text-amber-900 mb-2 leading-tight">
                {materialUsage.slice(0, 3).map(m => m.material_name).join(', ')}
              </div>
              <div className="text-sm text-amber-600 font-bold uppercase tracking-wide">{t('reports.top3Materials')}</div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Cost Analysis - Better RTL Support */}
      {selectedReport === 'materials' && materialUsage && (
        <div className="glass-card p-10 rounded-3xl bg-gradient-to-br from-indigo-50/30 to-purple-50/30 border border-indigo-200/50">
          <h4 className="text-2xl font-black text-slate-900 mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('reports.costAnalysis')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`glass-card p-8 rounded-2xl text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-black text-indigo-900 mb-3">
                {formatCurrency(materialUsage.reduce((sum, m) => sum + (m.total_cost || 0), 0))}
              </div>
              <div className="text-sm text-indigo-600 font-bold uppercase tracking-wide">{t('reports.totalMaterialCost')}</div>
            </div>
            <div className={`glass-card p-8 rounded-2xl text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-black text-emerald-900 mb-3">
                {materialUsage.length}
              </div>
              <div className="text-sm text-emerald-600 font-bold uppercase tracking-wide">{t('reports.materialsUsed')}</div>
            </div>
            <div className={`glass-card p-8 rounded-2xl text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-black text-orange-900 mb-3">
                {formatCurrency((materialUsage.reduce((sum, m) => sum + (m.total_cost || 0), 0) / 
                   materialUsage.reduce((sum, m) => sum + m.quantity_used, 0)).toFixed(2))}
              </div>
              <div className="text-sm text-orange-600 font-bold uppercase tracking-wide">{t('reports.costPerUnit')}</div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Custom Scrollbar CSS */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(148, 163, 184, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #06b6d4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #0891b2);
        }
      `}</style>
    </div>
  );
};

export default ReportsDashboard;
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
      showToast('Export successful!', 'success');
    } catch (error) {
      console.error('Export failed:', error);
      showToast('Export failed. Please try again.', 'error');
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
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/30">
      <div className={`flex items-center ${isRTL ? 'justify-start' : 'justify-between'} ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : ''}>
          <p className="text-orange-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
              <span className="text-emerald-600 text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 ${isRTL ? 'ml-4' : ''}`}>
          <Icon className="w-6 h-6 text-white" />
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('reports.title')}</h1>
              <p className="text-slate-600">{t('reports.description')}</p>
            </div>
            <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <button
                onClick={handleRefresh}
                className="flex items-center px-4 py-2 bg-white text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                <span>{t('common.refresh')}</span>
              </button>
              <button
                onClick={() => setExporting(!exporting)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                <span>{exporting ? t('reports.exporting') : t('common.export')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Period and Report Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('reports.selectPeriod')}</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {REPORT_PERIODS.map(period => (
                <option key={period.value} value={period.value}>
                  {t(`reports.periods.${period.label}`)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('reports.selectReportType')}</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {REPORT_TYPES.map(report => (
                <option key={report.id} value={report.id}>
                  {t(`reports.types.${report.label}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Display */}
        {hasErrors && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">{t('reports.someDataFailed')}</h3>
                <p className="text-sm text-red-700 mt-1">{t('reports.pleaseRefresh')}</p>
                <button 
                  onClick={handleRefresh}
                  className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                >
                  {t('reports.retry')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ReportCard
            title={t('navigation.totalProduction')}
            value={workLogStats ? formatNumber(workLogStats.total_completed + workLogStats.total_pending) : '0'}
            change="+12.5%"
            icon={Package}
            color="bg-gradient-to-r from-orange-500 to-red-600"
          />
          <ReportCard
            title={t('navigation.activeWorkers')}
            value={workLogStats ? workLogStats.worker_count.toString() : '0'}
            change="+3.2%"
            icon={Users}
            color="bg-gradient-to-r from-orange-500 to-red-600"
          />
          <ReportCard
            title={t('navigation.revenue')}
            value={workLogStats ? formatCurrency(workLogStats.total_revenue) : '$0'}
            change="+18.7%"
            icon={DollarSign}
            color="bg-gradient-to-r from-orange-500 to-red-600"
          />
          <ReportCard
            title={t('navigation.efficiency')}
            value={workLogStats ? formatPercentage(workLogStats.efficiency_rate) : '0%'}
            change="+5.1%"
            icon={TrendingUp}
            color="bg-gradient-to-r from-orange-500 to-red-600"
          />
        </div>

        {/* Report Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-orange-200/30">
          <div className="flex flex-wrap gap-2 p-2">
            {REPORT_TYPES.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedReport(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedReport === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                    : 'text-orange-700 hover:text-orange-900 hover:bg-orange-100'
                }`}
              >
                {tab.icon === 'BarChart3' && <BarChart3 className="w-4 h-4 mr-2" />}
                {tab.icon === 'Users' && <Users className="w-4 h-4 mr-2" />}
                {tab.icon === 'PieChart' && <PieChart className="w-4 h-4 mr-2" />}
                {tab.icon === 'DollarSign' && <DollarSign className="w-4 h-4 mr-2" />}
                <span>{t(`dashboard.${tab.label}`)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Report Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            {selectedReport === 'production' && monthlyProduction && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/30">
                <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h3 className="text-xl font-bold text-orange-900">{t('dashboard.productionTrends')}</h3>
                  <div className={`flex items-center space-x-2 text-sm text-orange-700 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Calendar className="w-4 h-4" />
                    <span>{t('dashboard.lastSixMonths')}</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyProduction}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fbbf24" />
                    <XAxis dataKey="month" stroke="#92400e" />
                    <YAxis stroke="#92400e" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #fbbf24',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Area type="monotone" dataKey="completed" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="pending" stackId="1" stroke="#dc2626" fill="#dc2626" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {selectedReport === 'workers' && workerPerformance && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/30">
                <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h3 className="text-xl font-bold text-orange-900">{t('dashboard.workerPerformance')}</h3>
                  <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{t('dashboard.viewDetails')}</span>
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={workerPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fbbf24" />
                    <XAxis dataKey="worker_name" stroke="#92400e" />
                    <YAxis stroke="#92400e" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #fbbf24',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Bar dataKey="tasks_completed" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {selectedReport === 'materials' && materialUsage && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/30">
                <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h3 className="text-xl font-bold text-orange-900">{t('dashboard.materialUsageDistribution')}</h3>
                  <div className="text-sm text-orange-700">{t('dashboard.currentMonth')}</div>
                </div>
                
                {/* Material Usage Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Pie Chart */}
                  <div>
                    <h4 className="text-lg font-semibold text-orange-800 mb-4">{t('reports.usageDistribution')}</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                        <Pie
                          data={materialUsage}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
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

                  {/* Material Details Table */}
                  <div>
                    <h4 className="text-lg font-semibold text-orange-800 mb-4">{t('reports.materialDetails')}</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {materialUsage.map((material, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-orange-50/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: material.color }}
                            ></div>
                            <span className="font-medium text-orange-900">{material.material_name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-orange-800">
                              {material.quantity_used} {t('common.unit')}
                            </div>
                            <div className="text-xs text-orange-600">
                              {material.percentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Material Usage Trends */}
                {materialUsageTrends && materialUsageTrends.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-orange-800 mb-4">{t('reports.usageTrendsOverTime')}</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={materialUsageTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#fbbf24" />
                        <XAxis dataKey="month" stroke="#92400e" />
                        <YAxis stroke="#92400e" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #fbbf24',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                          }} 
                        />
                        {materialUsage.slice(0, 5).map((material, index) => (
                          <Bar 
                            key={material.material_name}
                            dataKey={material.material_name} 
                            fill={material.color} 
                            radius={[2, 2, 0, 0]}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Material Cost Analysis */}
                <div className="mt-6 p-4 bg-orange-50/50 rounded-lg">
                  <h4 className="text-lg font-semibold text-orange-800 mb-3">{t('reports.costAnalysis')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-900">
                        ${materialUsage.reduce((sum, m) => sum + (m.total_cost || 0), 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-orange-600">{t('reports.totalMaterialCost')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-900">
                        {materialUsage.length}
                      </div>
                      <div className="text-sm text-orange-600">{t('reports.materialsUsed')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-900">
                        ${(materialUsage.reduce((sum, m) => sum + (m.total_cost || 0), 0) / 
                           materialUsage.reduce((sum, m) => sum + m.quantity_used, 0)).toFixed(2)}
                      </div>
                      <div className="text-sm text-orange-600">{t('reports.costPerUnit')}</div>
                    </div>
                  </div>
                </div>

                {/* Material Insights - Now below the chart instead of on the right side */}
                <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50/50 rounded-lg border border-orange-200">
                  <h4 className="text-lg font-bold text-orange-900 mb-4">{t('reports.materialInsights')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-white/70 rounded-lg">
                      <div className="text-2xl font-bold text-orange-900">
                        {materialUsage[0]?.material_name || 'N/A'}
                      </div>
                      <div className="text-sm text-orange-600">{t('reports.mostUsed')}</div>
                    </div>
                    <div className="text-center p-3 bg-white/70 rounded-lg">
                      <div className="text-2xl font-bold text-orange-900">
                        {materialUsage.reduce((sum, m) => sum + m.quantity_used, 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-orange-600">{t('reports.totalUnits')}</div>
                    </div>
                    <div className="text-center p-3 bg-white/70 rounded-lg">
                      <div className="text-2xl font-bold text-orange-900">
                        {(materialUsage.reduce((sum, m) => sum + m.quantity_used, 0) / materialUsage.length).toFixed(0)}
                      </div>
                      <div className="text-sm text-orange-600">{t('reports.avgUsage')}</div>
                    </div>
                    <div className="text-center p-3 bg-white/70 rounded-lg">
                      <div className="text-lg font-bold text-orange-900">
                        {materialUsage.slice(0, 3).map(m => m.material_name).join(', ')}
                      </div>
                      <div className="text-sm text-orange-600">{t('reports.top3Materials')}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedReport === 'financial' && monthlyProduction && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/30">
                <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h3 className="text-xl font-bold text-orange-900">{t('dashboard.revenueTrends')}</h3>
                  <div className="text-sm text-orange-700">{t('dashboard.monthlyRevenue')}</div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyProduction}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fbbf24" />
                    <XAxis dataKey="month" stroke="#92400e" />
                    <YAxis stroke="#92400e" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #fbbf24',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', strokeWidth: 2, r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Empty State */}
            {!monthlyProduction && !workerPerformance && !materialUsage && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-orange-200/30 text-center">
                <Package className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-orange-900 mb-2">{t('reports.noDataAvailable')}</h3>
                <p className="text-orange-600">{t('reports.selectDifferentPeriod')}</p>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/30">
              <h4 className="text-lg font-bold text-orange-900 mb-4">{t('dashboard.quickStats')}</h4>
              <div className="space-y-4">
                {quickStats?.map((stat, index) => (
                  <div key={index} className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-orange-700">{t(stat.label)}</span>
                    <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                )) || (
                  <div className="text-orange-500 text-sm">{t('common.loading')}</div>
                )}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/30">
              <h4 className="text-lg font-bold text-orange-900 mb-4">{t('dashboard.recentActivities')}</h4>
              <div className="space-y-3">
                {recentActivities?.map((activity) => (
                  <div key={activity.id} className={`flex items-start space-x-3 p-3 bg-orange-50/50 rounded-lg ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-emerald-500' :
                      activity.status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'
                    }`}></div>
                    <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                      <p className="text-sm font-medium text-orange-900">{t(activity.action)}</p>
                      <p className="text-xs text-orange-700">{activity.item}</p>
                      <p className="text-xs text-orange-600 mt-1">{new Date(activity.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                )) || (
                  <div className="text-orange-500 text-sm">{t('common.loading')}</div>
                )}
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-200/30">
              <h4 className="text-lg font-bold text-orange-900 mb-4">{t('dashboard.exportReports')}</h4>
              <div className="space-y-2">
                {EXPORT_OPTIONS.map((option, index) => (
                  <button 
                    key={index}
                    onClick={() => handleExport(option.format)}
                    disabled={exporting}
                    className={`w-full px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors ${isRTL ? 'text-right' : 'text-left'} disabled:opacity-50`}
                  >
                    {option.icon === 'FileText' && <FileText className="w-4 h-4 mr-2" />}
                    {option.icon === 'BarChart3' && <BarChart3 className="w-4 h-4 mr-2" />}
                    {option.icon === 'Activity' && <Activity className="w-4 h-4 mr-2" />}
                    <span>{t(`dashboard.${option.label}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  Activity
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, Area, AreaChart } from 'recharts'

// Mock data for reports
const productionData = [
  { month: 'Jan', completed: 245, pending: 32, revenue: 12500 },
  { month: 'Feb', completed: 289, pending: 28, revenue: 14200 },
  { month: 'Mar', completed: 312, pending: 35, revenue: 15800 },
  { month: 'Apr', completed: 278, pending: 22, revenue: 13900 },
  { month: 'May', completed: 334, pending: 41, revenue: 16700 },
  { month: 'Jun', completed: 356, pending: 29, revenue: 17800 }
]

const workerPerformance = [
  { name: 'Ahmed Ali', tasks: 89, efficiency: 94, earnings: 2340 },
  { name: 'Fatima Hassan', tasks: 76, efficiency: 91, earnings: 2180 },
  { name: 'Mohammed Omar', tasks: 82, efficiency: 88, earnings: 2250 },
  { name: 'Aisha Salem', tasks: 71, efficiency: 92, earnings: 2100 },
  { name: 'Khalid Ahmed', tasks: 85, efficiency: 89, earnings: 2290 }
]

const materialUsage = [
  { name: 'Cotton Fabric', value: 35, color: '#0EA5E9' },
  { name: 'Silk Thread', value: 25, color: '#06B6D4' },
  { name: 'Buttons', value: 20, color: '#0891B2' },
  { name: 'Zippers', value: 12, color: '#0E7490' },
  { name: 'Other', value: 8, color: '#164E63' }
]

const Reports: React.FC = () => {
  const { t, i18n } = useTranslation()
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [selectedReport, setSelectedReport] = useState('production')
  const [loading, setLoading] = useState(false)
  
  const isRTL = i18n.language === 'ar'

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  const handleExport = (format: string) => {
    // Mock export functionality
    console.log(`Exporting ${selectedReport} report as ${format}`)
  }

  const ReportCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <div className="metric-card">
      <div className={`flex items-center ${isRTL ? 'justify-start' : 'justify-between'} ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : ''}>
          <p className="text-slate-600 text-sm font-medium arabic-text">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
              <span className="text-emerald-600 text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} ${isRTL ? 'ml-4' : ''}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : ''}>
          <h1 className="text-3xl font-bold cold-gradient-text arabic-heading">{t('reportsAnalytics')}</h1>
          <p className="text-slate-600 mt-1 arabic-text">{t('comprehensiveInsights')}</p>
        </div>
        
        <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="form-input w-auto arabic-text"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <option value="daily">{t('daily')}</option>
            <option value="weekly">{t('weekly')}</option>
            <option value="monthly">{t('monthly')}</option>
            <option value="yearly">{t('yearly')}</option>
          </select>
          
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="cold-button-secondary"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            <span className="arabic-text">{t('refresh')}</span>
          </button>
          
          <button 
            onClick={() => handleExport('pdf')}
            className="cold-button"
          >
            <Download className="w-4 h-4 mr-2" />
            <span className="arabic-text">{t('export')}</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReportCard
          title={t('totalProduction')}
          value="1,814"
          change="+12.5%"
          icon={Package}
          color="cold-gradient"
        />
        <ReportCard
          title={t('activeWorkers')}
          value="32"
          change="+3.2%"
          icon={Users}
          color="bg-gradient-to-r from-emerald-500 to-teal-600"
        />
        <ReportCard
          title={t('revenue')}
          value="$89,200"
          change="+18.7%"
          icon={DollarSign}
          color="bg-gradient-to-r from-violet-500 to-purple-600"
        />
        <ReportCard
          title={t('efficiency')}
          value="91.2%"
          change="+5.1%"
          icon={TrendingUp}
          color="bg-gradient-to-r from-amber-500 to-orange-500"
        />
      </div>

      {/* Report Navigation */}
      <div className="management-card">
        <div className="flex flex-wrap gap-2 p-2">
          {[
            { id: 'production', label: t('productionOverview'), icon: BarChart3 },
            { id: 'workers', label: t('workerPerformance'), icon: Users },
            { id: 'materials', label: t('materialUsage'), icon: PieChart },
            { id: 'financial', label: t('financialSummary'), icon: DollarSign }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedReport(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedReport === tab.id
                  ? 'cold-gradient text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              <span className="arabic-text">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          {selectedReport === 'production' && (
            <div className="chart-container">
              <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className="text-xl font-bold text-slate-800 arabic-heading">{t('productionTrends')}</h3>
                <div className={`flex items-center space-x-2 text-sm text-slate-600 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Calendar className="w-4 h-4" />
                  <span className="arabic-text">{t('lastSixMonths')}</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Area type="monotone" dataKey="completed" stackId="1" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="pending" stackId="1" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {selectedReport === 'workers' && (
            <div className="chart-container">
              <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className="text-xl font-bold text-slate-800 arabic-heading">{t('workerPerformance')}</h3>
                <button className="cold-button-secondary text-sm">
                  <Eye className="w-4 h-4 mr-1" />
                  <span className="arabic-text">{t('viewDetails')}</span>
                </button>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workerPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Bar dataKey="tasks" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {selectedReport === 'materials' && (
            <div className="chart-container">
              <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className="text-xl font-bold text-slate-800 arabic-heading">{t('materialUsageDistribution')}</h3>
                <div className="text-sm text-slate-600 arabic-text">{t('currentMonth')}</div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={materialUsage}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {materialUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          )}

          {selectedReport === 'financial' && (
            <div className="chart-container">
              <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className="text-xl font-bold text-slate-800 arabic-heading">{t('revenueTrends')}</h3>
                <div className="text-sm text-slate-600 arabic-text">{t('monthlyRevenue')}</div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#0EA5E9" strokeWidth={3} dot={{ fill: '#0EA5E9', strokeWidth: 2, r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="management-card">
            <h4 className="text-lg font-bold text-slate-800 mb-4 arabic-heading">{t('quickStats')}</h4>
            <div className="space-y-4">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-slate-600 arabic-text">{t('todaysTasks')}</span>
                <span className="font-bold text-slate-800">47</span>
              </div>
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-slate-600 arabic-text">{t('completionRate')}</span>
                <span className="font-bold text-emerald-600">94.2%</span>
              </div>
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-slate-600 arabic-text">{t('activeOrders')}</span>
                <span className="font-bold text-blue-600">23</span>
              </div>
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-slate-600 arabic-text">{t('pendingApprovals')}</span>
                <span className="font-bold text-amber-600">8</span>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="management-card">
            <h4 className="text-lg font-bold text-slate-800 mb-4 arabic-heading">{t('recentActivities')}</h4>
            <div className="space-y-3">
              {[
                { action: t('productionCompleted'), item: 'كفتان حريري #CT-001', time: 'منذ ساعتين', status: 'success' },
                { action: t('qualityCheck'), item: 'جلابية قطنية #CT-002', time: 'منذ 4 ساعات', status: 'pending' },
                { action: t('materialRestocked'), item: 'خيط حرير - 50 بكرة', time: 'منذ 6 ساعات', status: 'info' }
              ].map((activity, index) => (
                <div key={index} className={`flex items-start space-x-3 p-3 bg-slate-50/50 rounded-lg ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-emerald-500' :
                    activity.status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}></div>
                  <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                    <p className="text-sm font-medium text-slate-800 arabic-text">{activity.action}</p>
                    <p className="text-xs text-slate-600 arabic-text">{activity.item}</p>
                    <p className="text-xs text-slate-500 mt-1 arabic-text">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="management-card">
            <h4 className="text-lg font-bold text-slate-800 mb-4 arabic-heading">{t('exportReports')}</h4>
            <div className="space-y-2">
              <button 
                onClick={() => handleExport('pdf')}
                className={`w-full cold-button-secondary ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <FileText className="w-4 h-4 mr-2" />
                <span className="arabic-text">{t('exportAsPDF')}</span>
              </button>
              <button 
                onClick={() => handleExport('excel')}
                className={`w-full cold-button-secondary ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                <span className="arabic-text">{t('exportAsExcel')}</span>
              </button>
              <button 
                onClick={() => handleExport('csv')}
                className={`w-full cold-button-secondary ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <Activity className="w-4 h-4 mr-2" />
                <span className="arabic-text">{t('exportAsCSV')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
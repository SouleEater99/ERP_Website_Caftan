import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../shared/store/authStore'
import { 
  useUsers, 
  useLocations, 
  useAddLocation,
  useUpdateLocation, 
  useDeleteLocation 
} from "../shared/hooks/useSupabaseQuery";  // ✅ Updated path
import { LoadingSpinner, EmptyState, LocationCardSkeleton } from '../shared/components/LoadingStates'
import { 
  Settings, 
  Users, 
  MapPin, 
  BarChart3, 
  Shield, 
  Database,
  Bell,
  Cog,
  UserPlus,
  Edit3,
  Trash2,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Save,
  X,
  Check,
  AlertTriangle,
  Info,
  Globe,
  Building,
  Phone,
  Mail
} from 'lucide-react'

const Management: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [showUserModal, setShowUserModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  const isRTL = i18n.language === 'ar'

  // Use custom hooks
  const { data: users = [], isLoading: usersLoading } = useUsers()
  const { data: locations = [], isLoading: locationsLoading } = useLocations()
  const addUserMutation = useAddLocation()
  const addLocationMutation = useAddLocation()
  const updateLocationMutation = useUpdateLocation()
  const deleteLocationMutation = useDeleteLocation()
  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const userData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as string,
      worker_id: formData.get('worker_id') as string || undefined,
      password: formData.get('password') as string
    };

    addUserMutation.mutate(userData, {
      onSuccess: () => setShowUserModal(false),
      onError: (error) => alert('Failed to add user: ' + error.message)
    });
  };

  const handleAddLocation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const locationData = {
      name: formData.get('name') as string,
      city: formData.get('city') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      country: formData.get('country') as string
    };

    addLocationMutation.mutate(locationData, {
      onSuccess: () => setShowLocationModal(false),
      onError: (error) => alert('Failed to add location: ' + error.message)
    });
  };

  const handleToggleLocationStatus = (id: string, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateLocationMutation.mutate({ id, updates: { status: newStatus } });
  };

  const handleDeleteLocation = (id: string) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      deleteLocationMutation.mutate(id);
    }
  };
  const systemStats = {
    totalUsers: users.length,
    activeUsers: users.length, // All users are considered active in this context
    totalLocations: locations.length,
    activeLocations: locations.filter(l => l.status === 'active').length,
    totalWorkers: locations.reduce((sum, l) => sum + l.worker_count, 0),
    systemUptime: '99.9%'
  }

  const QuickActionCard = ({ title, description, icon: Icon, onClick, color = 'cold-gradient' }) => (
    <div 
      onClick={onClick}
      className="quick-action-card group"
    >
      <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={isRTL ? 'text-right' : ''}>
          <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors arabic-text">{title}</h4>
          <p className="text-sm text-slate-600 arabic-text">{description}</p>
        </div>
      </div>
    </div>
  )

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="metric-card">
      <div className={`flex items-center ${isRTL ? 'justify-start' : 'justify-between'} ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : ''}>
          <p className="text-slate-600 text-sm font-medium arabic-text">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {change && (
            <p className="text-sm text-emerald-600 font-medium mt-1 arabic-text">{change}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} ${isRTL ? 'ml-4' : ''}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  const UserModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h3 className="text-xl font-bold text-slate-800 arabic-heading">{t('addNewUser')}</h3>
          <button 
            onClick={() => setShowUserModal(false)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <label className="form-label arabic-text">{t('fullName')}</label>
            <input 
              type="text" 
              name="name"
              className="form-input" 
              placeholder={t('enterFullName')} 
              dir={isRTL ? 'rtl' : 'ltr'}
              required 
            />
          </div>
          <div>
            <label className="form-label arabic-text">{t('emailAddress')}</label>
            <input 
              type="email" 
              name="email"
              className="form-input" 
              placeholder={t('enterEmailAddress')} 
              dir={isRTL ? 'rtl' : 'ltr'}
              required 
            />
          </div>
          <div>
            <label className="form-label arabic-text">{t('role')}</label>
            <select name="role" className="form-input arabic-text" dir={isRTL ? 'rtl' : 'ltr'} required>
              <option value="">{t('selectRole')}</option>
              <option value="admin">{t('admin')}</option>
              <option value="supervisor">{t('supervisor')}</option>
              <option value="worker">عامل</option>
            </select>
          </div>
          <div>
            <label className="form-label arabic-text">{t('location')}</label>
            <select name="location" className="form-input arabic-text" dir={isRTL ? 'rtl' : 'ltr'}>
              <option value="">{t('selectLocation')}</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label arabic-text">Worker ID (Optional)</label>
            <input 
              type="text" 
              name="worker_id"
              className="form-input" 
              placeholder="W001" 
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          <div>
            <label className="form-label arabic-text">Password</label>
            <input 
              type="password" 
              name="password"
              className="form-input" 
              placeholder="Enter password" 
              dir={isRTL ? 'rtl' : 'ltr'}
              required
              minLength={6}
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={() => setShowUserModal(false)} className="flex-1 cold-button-secondary">
              <span className="arabic-text">{t('cancel')}</span>
            </button>
            <button type="submit" disabled={addUserMutation.isPending} className="flex-1 cold-button">
              <UserPlus className="w-4 h-4 mr-2" />
              <span className="arabic-text">
                {addUserMutation.isPending ? 'جاري الإضافة...' : t('addUser')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  const LocationModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl">
        <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h3 className="text-xl font-bold text-slate-800 arabic-heading">{t('addLocation')}</h3>
          <button 
            onClick={() => setShowLocationModal(false)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        
        <form onSubmit={handleAddLocation} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label arabic-text">{t('locationName')}</label>
              <input 
                type="text" 
                name="name"
                className="form-input" 
                placeholder={t('enterLocationName')} 
                dir={isRTL ? 'rtl' : 'ltr'}
                required 
              />
            </div>
            <div>
              <label className="form-label arabic-text">{t('city')}</label>
              <input 
                type="text" 
                name="city"
                className="form-input" 
                placeholder={t('enterCity')} 
                dir={isRTL ? 'rtl' : 'ltr'}
                required 
              />
            </div>
          </div>
          <div>
            <label className="form-label arabic-text">{t('address')}</label>
            <input 
              type="text" 
              name="address"
              className="form-input" 
              placeholder={t('enterFullAddress')} 
              dir={isRTL ? 'rtl' : 'ltr'}
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label arabic-text">{t('phone')}</label>
              <input 
                type="tel" 
                name="phone"
                className="form-input" 
                placeholder={t('enterPhoneNumber')} 
                dir={isRTL ? 'rtl' : 'ltr'}
                required 
              />
            </div>
            <div>
              <label className="form-label arabic-text">{t('email')}</label>
              <input 
                type="email" 
                name="email"
                className="form-input" 
                placeholder={t('enterEmail')} 
                dir={isRTL ? 'rtl' : 'ltr'}
                required 
              />
            </div>
          </div>
          <div>
            <label className="form-label arabic-text">Country</label>
            <input 
              type="text" 
              name="country"
              className="form-input" 
              placeholder="Enter country" 
              dir={isRTL ? 'rtl' : 'ltr'}
              defaultValue="الإمارات"
              required 
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={() => setShowLocationModal(false)} className="flex-1 cold-button-secondary">
              <span className="arabic-text">{t('cancel')}</span>
            </button>
            <button type="submit" disabled={addLocationMutation.isPending} className="flex-1 cold-button">
              <Plus className="w-4 h-4 mr-2" />
              <span className="arabic-text">
                {addLocationMutation.isPending ? 'جاري الإضافة...' : t('addLocation')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : ''}>
          <h1 className="text-3xl font-bold cold-gradient-text arabic-heading">{t('managementPanel')}</h1>
          <p className="text-slate-600 mt-1 arabic-text">{t('centralizedControl')}</p>
        </div>
        
        <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <button className="cold-button-secondary">
            <RefreshCw className="w-4 h-4 mr-2" />
            <span className="arabic-text">{t('refresh')}</span>
          </button>
          <button className="cold-button">
            <Settings className="w-4 h-4 mr-2" />
            <span className="arabic-text">{t('settings')}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="management-card">
        <div className="flex flex-wrap gap-2 p-2">
          {[
            { id: 'overview', label: t('overview'), icon: BarChart3 },
            { id: 'users', label: t('userManagement'), icon: Users },
            { id: 'locations', label: t('locationManagement'), icon: MapPin },
            { id: 'system', label: t('systemConfiguration'), icon: Cog }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
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

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title={t('totalUsers')}
              value={systemStats.totalUsers}
              change={`${systemStats.activeUsers} نشط`}
              icon={Users}
              color="cold-gradient"
            />
            <StatCard
              title={t('locations')}
              value={systemStats.totalLocations}
              change={`${systemStats.activeLocations} نشط`}
              icon={MapPin}
              color="bg-gradient-to-r from-emerald-500 to-teal-600"
            />
            <StatCard
              title={t('totalWorkers')}
              value={systemStats.totalWorkers}
              change={t('acrossAllLocations')}
              icon={Building}
              color="bg-gradient-to-r from-violet-500 to-purple-600"
            />
          </div>

          {/* Quick Actions */}
          <div className="management-section">
            <div className="management-header">
              <h3 className="text-xl font-bold text-slate-800 arabic-heading">{t('quickActions')}</h3>
              <Info className="w-5 h-5 text-slate-400" />
            </div>
            
            <div className="management-grid">
              <QuickActionCard
                title={t('addNewUser')}
                description={t('createUserAccounts')}
                icon={UserPlus}
                onClick={() => setShowUserModal(true)}
              />
              <QuickActionCard
                title={t('addLocation')}
                description={t('registerNewFacilities')}
                icon={Plus}
                onClick={() => setShowLocationModal(true)}
                color="bg-gradient-to-r from-emerald-500 to-teal-600"
              />
              <QuickActionCard
                title={t('systemBackup')}
                description={t('createBackupExport')}
                icon={Download}
                onClick={() => console.log('Backup initiated')}
                color="bg-gradient-to-r from-violet-500 to-purple-600"
              />
              <QuickActionCard
                title={t('viewReports')}
                description={t('accessDetailedAnalytics')}
                icon={BarChart3}
                onClick={() => console.log('Navigate to reports')}
                color="bg-gradient-to-r from-amber-500 to-orange-500"
              />
              <QuickActionCard
                title={t('securitySettings')}
                description={t('managePermissionsSecurity')}
                icon={Shield}
                onClick={() => console.log('Open security settings')}
                color="bg-gradient-to-r from-red-500 to-pink-600"
              />
              <QuickActionCard
                title={t('systemNotifications')}
                description={t('configureAlertsNotifications')}
                icon={Bell}
                onClick={() => console.log('Open notifications')}
                color="bg-gradient-to-r from-indigo-500 to-blue-600"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* User Management Header */}
          <div className="management-section">
            <div className="management-header">
              <h3 className="text-xl font-bold text-slate-800 arabic-heading">{t('userManagement')}</h3>
              <button 
                onClick={() => setShowUserModal(true)}
                className="cold-button"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                <span className="arabic-text">{t('addUser')}</span>
              </button>
            </div>

            {/* Search and Filter */}
            <div className={`flex flex-col sm:flex-row gap-4 mb-6 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <div className="relative flex-1">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400`} />
                <input
                  type="text"
                  placeholder={t('searchUsers')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`form-input ${isRTL ? 'pr-10' : 'pl-10'} arabic-text`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
              <select className="form-input w-auto arabic-text" dir={isRTL ? 'rtl' : 'ltr'}>
                <option>{t('allRoles')}</option>
                <option>{t('admin')}</option>
                <option>{t('supervisor')}</option>
                <option>عامل</option>
              </select>
              <select className="form-input w-auto arabic-text" dir={isRTL ? 'rtl' : 'ltr'}>
                <option>{t('allStatus')}</option>
                <option>نشط</option>
                <option>غير نشط</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="data-table">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className={`${isRTL ? 'text-right' : 'text-left'} arabic-text`}>{t('user')}</th>
                    <th className={`${isRTL ? 'text-right' : 'text-left'} arabic-text`}>{t('role')}</th>
                    <th className={`${isRTL ? 'text-right' : 'text-left'} arabic-text`}>{t('location')}</th>
                    <th className={`${isRTL ? 'text-right' : 'text-left'} arabic-text`}>{t('status')}</th>
                    <th className={`${isRTL ? 'text-right' : 'text-left'} arabic-text`}>{t('lastActive')}</th>
                    <th className={`${isRTL ? 'text-right' : 'text-left'} arabic-text`}>{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(user => 
                    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className={isRTL ? 'text-right' : ''}>
                          <div className="font-medium text-slate-800 arabic-text">{user.name}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                      </td>
                      <td>
                        <span className="status-indicator bg-blue-100 text-blue-800 arabic-text">
                          {user.role}
                        </span>
                      </td>
                      <td className={`${isRTL ? 'text-right' : ''} arabic-text`}>
                        {user.worker_id ? `Worker: ${user.worker_id}` : 'N/A'}
                      </td>
                      <td>
                        <span className="status-indicator status-active arabic-text">
                          نشط
                        </span>
                      </td>
                      <td className={`${isRTL ? 'text-right' : ''} arabic-text`}>
                        {new Date(user.created_at).toLocaleDateString('ar-SA')}
                      </td>
                      <td>
                        <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <Edit3 className="w-4 h-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'locations' && (
        <div className="space-y-6">
          {/* Location Management */}
          <div className="management-section">
            <div className="management-header">
              <h3 className="text-xl font-bold text-slate-800 arabic-heading">{t('locationManagement')}</h3>
              <button 
                onClick={() => setShowLocationModal(true)}
                className="cold-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="arabic-text">{t('addLocation')}</span>
              </button>
            </div>

            {/* Locations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locationsLoading && (
                Array.from({ length: 6 }).map((_, i) => (
                  <LocationCardSkeleton key={i} />
                ))
              )}
              
              {!locationsLoading && locations.length === 0 && (
                <div className="col-span-full">
                  <EmptyState
                    icon={MapPin}
                    title="لا توجد مواقع"
                    description="لم يتم تسجيل أي مواقع بعد. ابدأ بإضافة أول موقع لك."
                    action={{
                      label: "إضافة موقع جديد",
                      onClick: () => setShowLocationModal(true)
                    }}
                  />
                </div>
              )}
              
              {locations.map((location) => (
                <div key={location.id} className="management-card">
                  <div className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : ''}>
                      <h4 className="font-bold text-slate-800 arabic-text">{location.name}</h4>
                      <p className="text-sm text-slate-600 arabic-text">{location.city}, {location.country}</p>
                    </div>
                    <span className={`status-indicator ${
                      location.status === 'active' ? 'status-active' : 'status-inactive'
                    } arabic-text`}>
                      {location.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className={`flex items-center text-sm text-slate-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="arabic-text">{location.address}</span>
                    </div>
                    {location.phone && (
                      <div className={`flex items-center text-sm text-slate-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        {location.phone}
                      </div>
                    )}
                    {location.email && (
                      <div className={`flex items-center text-sm text-slate-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        {location.email}
                      </div>
                    )}
                    <div className={`flex items-center text-sm text-slate-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Users className="w-4 h-4 mr-2" />
                      <span className="arabic-text">{location.worker_count} عامل</span>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <button className="flex-1 cold-button-secondary text-sm">
                      <Edit3 className="w-4 h-4 mr-1" />
                      <span className="arabic-text">{t('edit')}</span>
                    </button>
                    <button 
                      onClick={() => handleToggleLocationStatus(location.id, location.status)}
                      disabled={updateLocationMutation.isPending}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      title={location.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      <Eye className="w-4 h-4 text-slate-600" />
                    </button>
                    <button 
                      onClick={() => handleDeleteLocation(location.id)}
                      disabled={deleteLocationMutation.isPending}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete location"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* System Configuration */}
          <div className="management-section">
            <div className="management-header">
              <h3 className="text-xl font-bold text-slate-800 arabic-heading">{t('systemConfiguration')}</h3>
              <button className="cold-button">
                <Save className="w-4 h-4 mr-2" />
                <span className="arabic-text">{t('saveChanges')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Settings */}
              <div className="management-card">
                <h4 className="text-lg font-bold text-slate-800 mb-4 arabic-heading">{t('generalSettings')}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="form-label arabic-text">{t('systemName')}</label>
                    <input type="text" className="form-input arabic-text" defaultValue="نظام إنتاج كفتان تاليا" dir={isRTL ? 'rtl' : 'ltr'} />
                  </div>
                  <div>
                    <label className="form-label arabic-text">{t('defaultLanguage')}</label>
                    <select className="form-input arabic-text" dir={isRTL ? 'rtl' : 'ltr'}>
                      <option>{t('english')}</option>
                      <option>{t('arabic')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label arabic-text">{t('timezone')}</label>
                    <select className="form-input arabic-text" dir={isRTL ? 'rtl' : 'ltr'}>
                      <option>{t('gulfStandardTime')}</option>
                      <option>{t('gmt')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="management-card">
                <h4 className="text-lg font-bold text-slate-800 mb-4 arabic-heading">{t('securitySettings')}</h4>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : ''}>
                      <p className="font-medium text-slate-800 arabic-text">{t('twoFactorAuth')}</p>
                      <p className="text-sm text-slate-600 arabic-text">{t('require2FA')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : ''}>
                      <p className="font-medium text-slate-800 arabic-text">{t('sessionTimeout')}</p>
                      <p className="text-sm text-slate-600 arabic-text">{t('autoLogoutInactivity')}</p>
                    </div>
                    <select className="form-input w-auto arabic-text" dir={isRTL ? 'rtl' : 'ltr'}>
                      <option>{t('thirtyMinutes')}</option>
                      <option>{t('oneHour')}</option>
                      <option>{t('twoHours')}</option>
                      <option>{t('never')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Backup Settings */}
              <div className="management-card">
                <h4 className="text-lg font-bold text-slate-800 mb-4 arabic-heading">{t('backupRecovery')}</h4>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : ''}>
                      <p className="font-medium text-slate-800 arabic-text">{t('automaticBackups')}</p>
                      <p className="text-sm text-slate-600 arabic-text">{t('lastBackup')}</p>
                    </div>
                    <button className="cold-button-secondary">
                      <Download className="w-4 h-4 mr-2" />
                      <span className="arabic-text">{t('backupNow')}</span>
                    </button>
                  </div>
                  
                  <div>
                    <label className="form-label arabic-text">{t('backupFrequency')}</label>
                    <select className="form-input arabic-text" dir={isRTL ? 'rtl' : 'ltr'}>
                      <option>{t('daily')}</option>
                      <option>{t('weekly')}</option>
                      <option>{t('monthly')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="management-card">
                <h4 className="text-lg font-bold text-slate-800 mb-4 arabic-heading">{t('notifications')}</h4>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : ''}>
                      <p className="font-medium text-slate-800 arabic-text">{t('emailNotifications')}</p>
                      <p className="text-sm text-slate-600 arabic-text">{t('systemAlertsReports')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : ''}>
                      <p className="font-medium text-slate-800 arabic-text">{t('lowStockAlerts')}</p>
                      <p className="text-sm text-slate-600 arabic-text">{t('inventoryThresholdWarnings')}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showUserModal && <UserModal />}
      {showLocationModal && <LocationModal />}
    </div>
  )
}

export default Management
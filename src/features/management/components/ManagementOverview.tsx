import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../../shared/store/authStore';
import { useUsers, useLocations } from '../hooks/useManagement';
import { LoadingSpinner, EmptyState } from '../../../shared/components/LoadingStates';
import { MANAGEMENT_TABS, QUICK_ACTIONS, SYSTEM_SETTINGS } from '../constants/management.constants';
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
} from 'lucide-react';

// Import the new components
import UserModal from './UserModal';
import LocationModal from './LocationModal';
import UserManagement from './UserManagement';
import LocationManagement from './LocationManagement';
import SystemConfiguration from './SystemConfiguration';

const ManagementOverview: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: locations = [], isLoading: locationsLoading } = useLocations();
  
  const isRTL = i18n.language === 'ar';

  const systemStats = {
    totalUsers: users.length,
    activeUsers: users.length,
    totalLocations: locations.length,
    activeLocations: locations.filter(l => l.status === 'active').length,
    totalWorkers: locations.reduce((sum, l) => sum + l.worker_count, 0),
    systemUptime: '99.9%'
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'addUser':
        setShowUserModal(true);
        break;
      case 'addLocation':
        setShowLocationModal(true);
        break;
      case 'backup':
        console.log('Backup initiated');
        break;
      case 'reports':
        console.log('Navigate to reports');
        break;
      case 'security':
        setActiveTab('system');
        break;
      case 'notifications':
        console.log('Open notifications');
        break;
      default:
        console.log('Action:', action);
    }
  };

  const QuickActionCard = ({ title, description, icon: Icon, onClick, color = 'bg-gradient-to-r from-blue-500 to-blue-600' }: any) => (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 cursor-pointer group hover:shadow-xl transition-all duration-300"
    >
      <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={isRTL ? 'text-right' : ''}>
          <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{t(title)}</h4>
          <p className="text-sm text-slate-600">{t(description)}</p>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
      <div className={`flex items-center ${isRTL ? 'justify-start' : 'justify-between'} ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : ''}>
          <p className="text-slate-600 text-sm font-medium">{t(title)}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {change && (
            <p className="text-sm text-emerald-600 font-medium mt-1">{change}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} ${isRTL ? 'ml-4' : ''}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (usersLoading || locationsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-3xl font-bold text-slate-800">
              {t('managementPanel')}
            </h1>
            <p className="text-slate-600 mt-1">
              {t('centralizedControl')}
            </p>
          </div>
          
          <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
              <RefreshCw className="w-4 h-4 mr-2" />
              <span>{t('refresh')}</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Settings className="w-4 h-4 mr-2" />
              <span>{t('settings')}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200">
          <div className="flex flex-wrap gap-2 p-2">
            {MANAGEMENT_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                {tab.icon === 'BarChart3' && <BarChart3 className="w-4 h-4 mr-2" />}
                {tab.icon === 'Users' && <Users className="w-4 h-4 mr-2" />}
                {tab.icon === 'MapPin' && <MapPin className="w-4 h-4 mr-2" />}
                {tab.icon === 'Cog' && <Cog className="w-4 h-4 mr-2" />}
                <span>{t(tab.label)}</span>
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
                title="totalUsers"
                value={systemStats.totalUsers}
                change={`${systemStats.activeUsers} نشط`}
                icon={Users}
                color="bg-gradient-to-r from-blue-500 to-blue-600"
              />
              <StatCard
                title="locations"
                value={systemStats.totalLocations}
                change={`${systemStats.activeLocations} نشط`}
                icon={MapPin}
                color="bg-gradient-to-r from-emerald-500 to-teal-600"
              />
              <StatCard
                title="totalWorkers"
                value={systemStats.totalWorkers}
                change={t('acrossAllLocations')}
                icon={Building}
                color="bg-gradient-to-r from-violet-500 to-purple-600"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">{t('quickActions')}</h3>
                <Info className="w-5 h-5 text-slate-400" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {QUICK_ACTIONS.map((action, index) => (
                  <QuickActionCard
                    key={index}
                    title={action.title}
                    description={action.description}
                    icon={action.icon === 'UserPlus' ? UserPlus : 
                          action.icon === 'Plus' ? Plus :
                          action.icon === 'Download' ? Download :
                          action.icon === 'BarChart3' ? BarChart3 :
                          action.icon === 'Shield' ? Shield :
                          action.icon === 'Bell' ? Bell : UserPlus}
                    onClick={() => handleQuickAction(action.action)}
                    color={action.color}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <UserManagement />
        )}

        {/* Location Management Tab */}
        {activeTab === 'locations' && (
          <LocationManagement />
        )}

        {/* System Configuration Tab */}
        {activeTab === 'system' && (
          <SystemConfiguration />
        )}
      </div>

      {/* Modals */}
      <UserModal 
        isOpen={showUserModal} 
        onClose={() => setShowUserModal(false)} 
      />
      
      <LocationModal 
        isOpen={showLocationModal} 
        onClose={() => setShowLocationModal(false)} 
      />
    </div>
  );
};

export default ManagementOverview;
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../../shared/store/authStore';
import { useUsers, useLocations } from '../hooks/useManagement';
import { LoadingSpinner, EmptyState } from '../../../shared/components/LoadingStates';
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

const ManagementOverview: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: locations = [], isLoading: locationsLoading } = useLocations();
  
  const isRTL = i18n.language === 'ar';

  if (usersLoading || locationsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full mr-3">
              <Settings className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 arabic-text">
              {t('management')}
            </h1>
          </div>
          <p className="text-slate-600 arabic-text">
            {t('managementDescription')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 arabic-text">
                  {t('totalUsers')}
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {users.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 arabic-text">
                  {t('totalLocations')}
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {locations.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 arabic-text">
                  {t('activeLocations')}
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {locations.filter(loc => loc.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 arabic-text">
                  {t('adminUsers')}
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 arabic-text">
              {t('userManagement')}
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                <UserPlus className="w-5 h-5 mr-2" />
                {t('addNewUser')}
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
                <Users className="w-5 h-5 mr-2" />
                {t('viewAllUsers')}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 arabic-text">
              {t('locationManagement')}
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                <Plus className="w-5 h-5 mr-2" />
                {t('addNewLocation')}
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
                <MapPin className="w-5 h-5 mr-2" />
                {t('viewAllLocations')}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 arabic-text">
            {t('recentActivity')}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-slate-50 rounded-xl">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserPlus className="w-4 h-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-700 arabic-text">
                  {t('newUserAdded')}
                </p>
                <p className="text-xs text-slate-500">
                  {t('justNow')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-slate-50 rounded-xl">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-700 arabic-text">
                  {t('locationUpdated')}
                </p>
                <p className="text-xs text-slate-500">
                  {t('2HoursAgo')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementOverview;
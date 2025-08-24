import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUsers } from '../hooks/useManagement';
import { USER_ROLES } from '../constants/management.constants';
import { User } from '../types/management.types';
import { 
  UserPlus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  MoreHorizontal,
  AlertTriangle
} from 'lucide-react';

const UserManagement: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data: users = [], isLoading, error } = useUsers();
  const isRTL = i18n.language === 'ar';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    const roleData = USER_ROLES.find(r => r.value === role);
    return roleData?.icon || '👤';
  };

  const getRoleLabel = (role: string) => {
    const roleData = USER_ROLES.find(r => r.value === role);
    return roleData?.label || role;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">{t('loadingUsers')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
        <div className="text-center text-red-600">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">{t('errorLoadingUsers')}</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <h3 className="text-xl font-bold text-slate-800">{t('userManagement')}</h3>
            <p className="text-slate-600">{t('manageUserAccounts')}</p>
          </div>
          
          <button
            onClick={() => setShowUserModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            <span>{t('addUser')}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchUsers')}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="all">{t('allRoles')}</option>
              {USER_ROLES.map(role => (
                <option key={role.value} value={role.value}>
                  {role.icon} {t(role.label)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${isRTL ? 'text-right' : ''}`}>
                  {t('user')}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${isRTL ? 'text-right' : ''}`}>
                  {t('role')}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${isRTL ? 'text-right' : ''}`}>
                  {t('status')}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${isRTL ? 'text-right' : ''}`}>
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className={`ml-3 ${isRTL ? 'mr-3 ml-0' : ''}`}>
                        <div className="text-sm font-medium text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-2xl mr-2">{getRoleIcon(user.role)}</span>
                      <span className="text-sm text-slate-900">{t(getRoleLabel(user.role))}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {t('active')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setEditingUser(user)}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Users className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-slate-600">{t('noUsersFound')}</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
          <div className="text-3xl font-bold text-blue-600">{users.length}</div>
          <div className="text-sm text-slate-600">{t('totalUsers')}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
          <div className="text-3xl font-bold text-emerald-600">
            {users.filter(u => u.role === 'worker').length}
          </div>
          <div className="text-sm text-slate-600">{t('workers')}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
          <div className="text-3xl font-bold text-violet-600">
            {users.filter(u => u.role === 'admin').length}
          </div>
          <div className="text-sm text-slate-600">{t('administrators')}</div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
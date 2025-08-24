import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocations, useDeleteLocation } from '../hooks/useManagement';
import { LOCATION_STATUSES } from '../constants/management.constants';
import { Location } from '../types/management.types';
import { 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  Building,
  Phone,
  Mail,
  AlertTriangle
} from 'lucide-react';

const LocationManagement: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data: locations = [], isLoading, error } = useLocations();
  const deleteLocation = useDeleteLocation();
  const isRTL = i18n.language === 'ar';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || location.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteLocation = async (id: string) => {
    if (window.confirm(t('locationManagement.confirmDeleteLocation'))) {
      try {
        await deleteLocation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting location:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">{t('locationManagement.loadingLocations')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
        <div className="text-center text-red-600">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">{t('locationManagement.errorLoadingLocations')}</p>
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
            <h3 className="text-xl font-bold text-slate-800">{t('locationManagement.locationManagement')}</h3>
            <p className="text-slate-600">{t('locationManagement.manageFacilities')}</p>
          </div>
          
          <button
            onClick={() => setShowLocationModal(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>{t('locationManagement.addLocation')}</span>
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
              placeholder={t('locationManagement.searchLocations')}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="all">{t('locationManagement.allStatuses')}</option>
              {LOCATION_STATUSES.map(status => (
                <option key={status.value} value={status.value}>
                  {t(status.label)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((location) => (
          <div key={location.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow">
            {/* Header */}
            <div className="p-6 border-b border-slate-200">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Building className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h4 className="font-semibold text-slate-900">{location.name}</h4>
                    <p className="text-sm text-slate-600">{location.city}, {location.country}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  location.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {t(location.status)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-3">
              <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <MapPin className="w-4 h-4 text-slate-400" />
                <p className="text-sm text-slate-600">{location.address}</p>
              </div>
              
              {location.phone && (
                <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Phone className="w-4 h-4 text-slate-400" />
                  <p className="text-sm text-slate-600">{location.phone}</p>
                </div>
              )}
              
              {location.email && (
                <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Mail className="w-4 h-4 text-slate-400" />
                  <p className="text-sm text-slate-600">{location.email}</p>
                </div>
              )}
              
              <div className="pt-3 border-t border-slate-200">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm text-slate-600">{t('locationManagement.workers')}</span>
                  <span className="font-semibold text-slate-900">{location.worker_count}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
              <div className={`flex items-center justify-end space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <button className="text-blue-600 hover:text-blue-900 p-1">
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setEditingLocation(location)}
                  className="text-emerald-600 hover:text-emerald-900 p-1"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteLocation(location.id)}
                  className="text-red-600 hover:text-red-900 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLocations.length === 0 && (
        <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200 text-center">
          <div className="text-slate-400 mb-4">
            <MapPin className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-slate-600">{t('locationManagement.noLocationsFound')}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
          <div className="text-3xl font-bold text-emerald-600">{locations.length}</div>
          <div className="text-sm text-slate-600">{t('locationManagement.totalLocations')}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
          <div className="text-3xl font-bold text-green-600">
            {locations.filter(l => l.status === 'active').length}
          </div>
          <div className="text-sm text-slate-600">{t('locationManagement.activeLocations')}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 text-center">
          <div className="text-3xl font-bold text-blue-600">
            {locations.reduce((sum, l) => sum + l.worker_count, 0)}
          </div>
          <div className="text-sm text-slate-600">{t('locationManagement.totalWorkers')}</div>
        </div>
      </div>
    </div>
  );
};

export default LocationManagement;
import React from 'react';
import { CalendarDays, Clock, Search, Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PayrollFiltersProps {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  showUnpaidFirst: boolean;
  setShowUnpaidFirst: (show: boolean) => void;
  selectedSchedule: string;
  setSelectedSchedule: (schedule: string) => void;
  scheduleOptions: Array<{ value: string; label: string }>;
  isRTL: boolean;
  openFilterModal: () => void;
  appliedWorkerFilter: string;
  appliedStatusFilter: string;
  users: Array<{ id: string; name: string }>;
  onClearFilters: () => void;
  onRemoveWorkerFilter: () => void;
  onRemoveStatusFilter: () => void;
}

export const PayrollFilters: React.FC<PayrollFiltersProps> = ({
  selectedPeriod,
  setSelectedPeriod,
  showUnpaidFirst,
  setShowUnpaidFirst,
  selectedSchedule,
  setSelectedSchedule,
  scheduleOptions,
  isRTL,
  openFilterModal,
  appliedWorkerFilter,
  appliedStatusFilter,
  users,
  onClearFilters,
  onRemoveWorkerFilter,
  onRemoveStatusFilter
}) => {
  const { t } = useTranslation();
  
  return (
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
                  onClick={onRemoveWorkerFilter}
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
                  onClick={onRemoveStatusFilter}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={onClearFilters}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              {t('clearAll')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

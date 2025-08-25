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
  
  // Debug logging to see what's happening
  console.log('PayrollFilters props:', {
    selectedPeriod,
    showUnpaidFirst,
    selectedSchedule,
    appliedWorkerFilter,
    appliedStatusFilter
  });
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Period Selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <label className="text-sm font-semibold text-gray-700">
              {t('payroll.selectPeriod')}
            </label>
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <option value="all">{t('payroll.allPeriods')}</option>
            <option value="current">{t('payroll.currentPeriod')}</option>
            <option value="previous">{t('payroll.previousPeriod')}</option>
            <option value="quarterly">{t('payroll.quarterly')}</option>
            <option value="yearly">{t('payroll.yearly')}</option>
          </select>
        </div>

        {/* Unpaid Priority Toggle */}
        <div className="space-y-3">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-2' : 'space-x-2'}`}>
            <Clock className="w-5 h-5 text-amber-600" />
            <label className={`text-sm font-semibold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('payroll.displayPriority')}
            </label>
          </div>
          <div className={`flex items-center ${isRTL ? 'justify-end' : 'justify-start'}`}>
            <label className={`relative inline-flex items-center cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}>
              <input
                type="checkbox"
                checked={showUnpaidFirst}
                onChange={(e) => setShowUnpaidFirst(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className={`text-sm font-medium text-gray-700 ${isRTL ? 'mr-3' : 'ml-3'}`}>
                {showUnpaidFirst ? t('payroll.enabled') : t('payroll.disabled')}
              </span>
            </label>
          </div>
        </div>

        {/* Payment Schedule */}
        <div className="space-y-3">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-2' : 'space-x-2'}`}>
            <Clock className="w-5 h-5 text-green-600" />
            <label className={`text-sm font-semibold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('payroll.paymentSchedule')}
            </label>
          </div>
          <select
            value={selectedSchedule}
            onChange={(e) => setSelectedSchedule(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {scheduleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applied Filters Section */}
      {(appliedWorkerFilter !== 'all' || appliedStatusFilter !== 'all') && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{t('payroll.appliedFilters')}</span>
            </div>
            <button
              onClick={onClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {t('payroll.clearAll')}
            </button>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {appliedWorkerFilter !== 'all' && (
              <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                <span>{users.find(u => u.id === appliedWorkerFilter)?.name}</span>
                <button onClick={onRemoveWorkerFilter} className="text-blue-500 hover:text-blue-700">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {appliedStatusFilter !== 'all' && (
              <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                <span>{appliedStatusFilter}</span>
                <button onClick={onRemoveStatusFilter} className="text-green-500 hover:text-green-700">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Advanced Filters Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={openFilterModal}
          className={`flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <Filter className="w-4 h-4" />
          <span>{t('payroll.advancedFilters')}</span>
        </button>
      </div>
    </div>
  );
};

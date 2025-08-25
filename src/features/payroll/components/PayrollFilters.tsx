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
              Select Period
            </label>
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => {
              console.log('Period changed to:', e.target.value);
              setSelectedPeriod(e.target.value);
            }}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <option value="all">All Periods</option>
            <option value="current">Current Period</option>
            <option value="previous">Previous Period</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Unpaid Priority Toggle */}
        <div className="space-y-3">
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse space-x-2' : 'space-x-2'}`}>
            <Clock className="w-5 h-5 text-amber-600" />
            <label className={`text-sm font-semibold text-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}>
              Display Priority
            </label>
          </div>
          <div className={`flex items-center ${isRTL ? 'justify-end' : 'justify-start'}`}>
            <label className={`relative inline-flex items-center cursor-pointer ${isRTL ? 'flex-row-reverse' : ''}`}>
              <input
                type="checkbox"
                checked={showUnpaidFirst}
                onChange={(e) => {
                  console.log('Unpaid priority changed to:', e.target.checked);
                  setShowUnpaidFirst(e.target.checked);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className={`text-sm font-medium text-gray-700 ${isRTL ? 'mr-3' : 'ml-3'}`}>
                {showUnpaidFirst ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>
        </div>

        {/* Payment Schedule Filter */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Payment Schedule
          </label>
          <select
            value={selectedSchedule}
            onChange={(e) => {
              console.log('Schedule changed to:', e.target.value);
              setSelectedSchedule(e.target.value);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {scheduleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applied Filters Display */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Applied Filters:</span>
          
          {appliedWorkerFilter !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Worker: {users.find(u => u.id === appliedWorkerFilter)?.name || appliedWorkerFilter}
              <button
                onClick={onRemoveWorkerFilter}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
          
          {appliedStatusFilter !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              Status: {appliedStatusFilter}
              <button
                onClick={onRemoveStatusFilter}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          )}
          
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Advanced Filters Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={openFilterModal}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Advanced Filters</span>
        </button>
      </div>
    </div>
  );
};

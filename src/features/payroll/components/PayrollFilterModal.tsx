import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PayrollFilterModalProps {
  showFilterModal: boolean;
  onClose: () => void;
  tempWorkerFilter: string;
  setTempWorkerFilter: (filter: string) => void;
  tempStatusFilter: string;
  setTempStatusFilter: (filter: string) => void;
  users: Array<{ id: string; name: string }>;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export const PayrollFilterModal: React.FC<PayrollFilterModalProps> = ({
  showFilterModal,
  onClose,
  tempWorkerFilter,
  setTempWorkerFilter,
  tempStatusFilter,
  setTempStatusFilter,
  users,
  onApplyFilters,
  onClearFilters
}) => {
  const { t } = useTranslation();
  
  if (!showFilterModal) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 max-w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">{t('filterPayroll')}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">{t('workerName')}</label>
            <select
              value={tempWorkerFilter}
              onChange={(e) => setTempWorkerFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">{t('allWorkers')}</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
           
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">{t('paymentStatus')}</label>
            <select
              value={tempStatusFilter}
              onChange={(e) => setTempStatusFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">{t('allStatuses')}</option>
              <option value="paid">{t('paid')}</option>
              <option value="pending">{t('pending')}</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-8">
          <button
            onClick={onClearFilters}
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            {t('clear')}
          </button>
          <button
            onClick={onApplyFilters}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {t('apply')}
          </button>
        </div>
      </div>
    </div>
  );
};

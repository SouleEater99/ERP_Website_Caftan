import { useState, useCallback } from 'react';

export const usePayrollFilters = () => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempWorkerFilter, setTempWorkerFilter] = useState('');
  const [tempStatusFilter, setTempStatusFilter] = useState('');
  const [appliedWorkerFilter, setAppliedWorkerFilter] = useState('');
  const [appliedStatusFilter, setAppliedStatusFilter] = useState('');

  const handleApplyFilters = useCallback(() => {
    setAppliedWorkerFilter(tempWorkerFilter);
    setAppliedStatusFilter(tempStatusFilter);
    setShowFilterModal(false);
  }, [tempWorkerFilter, tempStatusFilter]);

  const handleClearFilters = useCallback(() => {
    setTempWorkerFilter('');
    setTempStatusFilter('');
    setAppliedWorkerFilter('');
    setAppliedStatusFilter('');
  }, []);

  const openFilterModal = useCallback(() => {
    // Initialize temp filters with current applied filters
    setTempWorkerFilter(appliedWorkerFilter);
    setTempStatusFilter(appliedStatusFilter);
    setShowFilterModal(true);
  }, [appliedWorkerFilter, appliedStatusFilter]);

  return {
    showFilterModal,
    setShowFilterModal,
    tempWorkerFilter,
    setTempWorkerFilter,
    tempStatusFilter,
    setTempStatusFilter,
    appliedWorkerFilter,
    setAppliedWorkerFilter,
    appliedStatusFilter,
    setAppliedStatusFilter,
    handleApplyFilters,
    handleClearFilters,
    openFilterModal
  };
};

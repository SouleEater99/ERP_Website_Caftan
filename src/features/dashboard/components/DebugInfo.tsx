import React from 'react';
import { TableStructure } from '../types/dashboard.types';
import { DASHBOARD_SECTIONS } from '../constants/dashboard.constants';

interface DebugInfoProps {
  tableStructure?: TableStructure;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({ tableStructure }) => {
  if (!tableStructure) return null;

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-bold text-blue-800 mb-2">{DASHBOARD_SECTIONS.DEBUG_INFO}</h3>
      <div className="text-sm text-blue-700">
        <p><strong>Users columns:</strong> {tableStructure.usersColumns.join(', ')}</p>
        <p><strong>Stock columns:</strong> {tableStructure.stockColumns.join(', ')}</p>
        <p><strong>Rates columns:</strong> {tableStructure.ratesColumns.join(', ')}</p>
      </div>
    </div>
  );
};

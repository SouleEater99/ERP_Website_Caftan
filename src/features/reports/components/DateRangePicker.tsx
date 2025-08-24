import React from 'react';

export const DateRangePicker: React.FC<{
  startDate: Date;
  endDate: Date;
  onDateChange: (start: Date, end: Date) => void;
}> = ({ startDate, endDate, onDateChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="date"
        value={startDate.toISOString().split('T')[0]}
        onChange={(e) => onDateChange(new Date(e.target.value), endDate)}
        className="px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
      />
      <span className="text-orange-600">to</span>
      <input
        type="date"
        value={endDate.toISOString().split('T')[0]}
        onChange={(e) => onDateChange(startDate, new Date(e.target.value))}
        className="px-3 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );
};

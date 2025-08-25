import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReportsDashboard } from '../features/reports';

const Reports: React.FC = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <ReportsDashboard />
        </div>
      </div>
    </div>
  );
};

export default Reports;
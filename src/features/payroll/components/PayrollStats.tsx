import React from 'react';
import { DollarSign, Calendar, Package } from "lucide-react";
import { StatCard } from "../../../shared/components/common/StatCard";  // ✅ Updated path
import { useTranslation } from "react-i18next";

interface PayrollStatsProps {
  totalPayroll: number;
  paidAmount: number;
  totalPending: number;
  isRTL: boolean;
}

export const PayrollStats: React.FC<PayrollStatsProps> = ({ 
  totalPayroll, paidAmount, totalPending, isRTL 
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title={t('totalPayroll')}
        value={`${totalPayroll.toLocaleString()} MAD`}
        icon={DollarSign}
        color="cold-gradient"
        trend="+12.5%"
        isRTL={isRTL}
      />
      <StatCard
        title={t('paidAmount')}
        value={`${paidAmount.toLocaleString()} MAD`}
        icon={Package}
        color="bg-gradient-to-r from-emerald-500 to-teal-600"
        trend="+8.3%"
        isRTL={isRTL}
      />
      <StatCard
        title={t('pendingAmount')}
        value={`${totalPending.toLocaleString()} MAD`}
        icon={Calendar}
        color="bg-gradient-to-r from-amber-500 to-orange-500"
        isRTL={isRTL}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BOMForm, BOMTable } from '../features/bom';
import { useBOMItems } from '../features/bom';
import { BOMForm as BOMFormType } from '../features/bom/types/bom.types';

const BOM: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { data: bomItems, isLoading } = useBOMItems();
  
  const [form, setForm] = useState<BOMFormType>({
    product: '',
    material: '',
    qty_per_unit: '',
    unit: '',
    waste_percent: '',
    deduct_at_stage: ''
  });

  const handleFormSuccess = () => {
    setForm({
      product: '',
      material: '',
      qty_per_unit: '',
      unit: '',
      waste_percent: '',
      deduct_at_stage: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 px-6 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"></div>
            <div className="absolute inset-0 cold-pattern opacity-30"></div>
            <div className="relative flex items-center justify-between">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-white font-bold text-2xl">{t('bom.title')}</h1>
                  <p className="text-blue-100 text-sm mt-1">
                    {t('bom.description')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 shadow-lg">
                <span className="text-white font-medium">{bomItems?.length || 0}</span>
                <span className="text-white/80 text-sm">{t('bom.totalItems')}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Form */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 px-6 py-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-slate-700/20"></div>
            <div className="relative flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-white font-semibold text-lg">{t('bom.addNewItem')}</h2>
            </div>
          </div>
          
          <div className="p-6">
            <BOMForm 
              form={form} 
              setForm={setForm} 
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>

        {/* Enhanced Table */}
        <BOMTable bomItems={bomItems || []} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default BOM;
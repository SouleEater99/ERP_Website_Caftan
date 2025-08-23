import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BOMForm, BOMTable } from '../features/bom';
import { useBOMItems } from '../features/bom';
import { BOMForm as BOMFormType } from '../features/bom/types/bom.types';

const BOM: React.FC = () => {
  const { t } = useTranslation();
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{t('bom')}</h1>
      </div>
      
      <BOMForm 
        form={form} 
        setForm={setForm} 
        onSuccess={handleFormSuccess}
      />

      <BOMTable bomItems={bomItems || []} isLoading={isLoading} />
    </div>
  );
};

export default BOM;
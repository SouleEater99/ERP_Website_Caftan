import React from 'react';
import { useTranslation } from 'react-i18next';
import { BOMForm as BOMFormType } from '../types/bom.types';
import { BOM_FORM_LABELS, BOM_FORM_PLACEHOLDERS, BOM_ACTIONS } from '../constants/bom.constants';
import { useProductOptions, useMaterialOptions, useStageOptions } from '../hooks/useBOMData';
import { useAddBOMMutation } from '../hooks/useBOMMutations';
import { getLocalizedName, getMaterialName } from '../utils/bom.utils';

interface BOMFormProps {
  form: BOMFormType;
  setForm: React.Dispatch<React.SetStateAction<BOMFormType>>;
  onSuccess?: () => void;
}

export const BOMForm: React.FC<BOMFormProps> = ({ form, setForm, onSuccess }) => {
  const { t, i18n } = useTranslation();
  const { data: productOptions = [], isLoading: productsLoading } = useProductOptions();
  const { data: materials = [], isLoading: materialsLoading } = useMaterialOptions();
  const { data: stageOptions = [], isLoading: stagesLoading } = useStageOptions();
  
  const addBomMutation = useAddBOMMutation();

  // Auto-fill unit when material changes
  const handleMaterialChange = (val: string) => {
    const mat = materials.find(m => m.material === val);
    setForm(prev => ({
      ...prev,
      material: val,
      unit: mat?.unit || prev.unit
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBomMutation.mutate(form, {
      onSuccess: () => {
        onSuccess?.();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2 bg-white p-4 rounded-md border">
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">
          {t('bom.labels.product')}
        </label>
        <select
          className="border rounded px-2 py-1"
          value={form.product}
          onChange={e => setForm({ ...form, product: e.target.value })}
          disabled={productsLoading}
        >
          <option value="">{t('bom.placeholders.selectProduct')}</option>
          {productOptions.map(p => (
            <option key={p.code} value={p.name_en}>
              {getLocalizedName(p, i18n.language)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">
          {t('bom.labels.material')}
        </label>
        <select
          className="border rounded px-2 py-1"
          value={form.material}
          onChange={e => handleMaterialChange(e.target.value)}
          disabled={materialsLoading}
        >
          <option value="">{t('bom.placeholders.selectMaterial')}</option>
          {materials.map(m => (
            <option key={m.material} value={m.material}>
              {getMaterialName(m.material)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">
          {t('bom.labels.qtyPerUnit')}
        </label>
        <input
          className="border rounded px-2 py-1 w-28"
          placeholder={t('bom.placeholders.qtyPerUnit')}
          type="number"
          step="0.01"
          value={form.qty_per_unit}
          onChange={e => setForm({ ...form, qty_per_unit: e.target.value })}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">
          {t('bom.labels.unit')}
        </label>
        <input
          className="border rounded px-2 py-1 w-24"
          placeholder={t('bom.placeholders.unit')}
          value={form.unit}
          onChange={e => setForm({ ...form, unit: e.target.value })}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">
          {t('bom.labels.wastePercent')}
        </label>
        <input
          className="border rounded px-2 py-1 w-24"
          placeholder={t('bom.placeholders.wastePercent')}
          type="number"
          step="0.01"
          value={form.waste_percent}
          onChange={e => setForm({ ...form, waste_percent: e.target.value })}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">
          {t('bom.labels.stage')}
        </label>
        <select
          className="border rounded px-2 py-1"
          value={form.deduct_at_stage}
          onChange={e => setForm({ ...form, deduct_at_stage: e.target.value })}
          disabled={stagesLoading}
        >
          <option value="">{t('bom.placeholders.selectStage')}</option>
          {stageOptions.map(s => (
            <option key={s.code} value={s.name_en}>
              {getLocalizedName(s, i18n.language)}
            </option>
          ))}
        </select>
      </div>

      <button
        className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
        type="submit"
        disabled={addBomMutation.isPending}
      >
        {addBomMutation.isPending 
          ? (i18n.language === 'ar' ? BOM_ACTIONS.ADDING : 'Adding...') 
          : (i18n.language === 'ar' ? BOM_ACTIONS.ADD_COMPONENT : 'Add Component')
        }
      </button>
    </form>
  );
};

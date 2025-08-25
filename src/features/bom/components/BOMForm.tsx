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
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          {t('bom.labels.product')}
        </label>
        <select
          className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white/80 backdrop-blur-sm"
          value={form.product}
          onChange={e => setForm({ ...form, product: e.target.value })}
          disabled={productsLoading}
        >
          <option value="">{t('bom.placeholders.selectProduct')}</option>
          {productOptions.map(p => {
            // Safety check to ensure p is a valid object with required properties
            if (!p || typeof p !== 'object' || !p.code || !p.name_en || !p.name_ar) {
              console.warn('Invalid product option:', p);
              return null;
            }
            return (
              <option key={p.code} value={p.code}>
                {getLocalizedName(p, i18n.language)}
              </option>
            );
          })}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          {t('bom.labels.material')}
        </label>
        <select
          className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white/80 backdrop-blur-sm"
          value={form.material}
          onChange={e => handleMaterialChange(e.target.value)}
          disabled={materialsLoading}
        >
          <option value="">{t('bom.placeholders.selectMaterial')}</option>
          {materials.map(m => {
            // Safety check to ensure m.material is a string
            if (!m || typeof m.material !== 'string') {
              console.warn('Invalid material option:', m);
              return null;
            }
            return (
              <option key={m.material} value={m.material}>
                {getMaterialName(m.material)}
              </option>
            );
          })}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          {t('bom.labels.qtyPerUnit')}
        </label>
        <input
          className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white/80 backdrop-blur-sm"
          placeholder={t('bom.placeholders.qtyPerUnit')}
          type="number"
          step="0.01"
          value={form.qty_per_unit}
          onChange={e => setForm({ ...form, qty_per_unit: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          {t('bom.labels.unit')}
        </label>
        <input
          className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white/80 backdrop-blur-sm"
          placeholder={t('bom.placeholders.unit')}
          value={form.unit}
          onChange={e => setForm({ ...form, unit: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          {t('bom.labels.wastePercent')}
        </label>
        <input
          className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white/80 backdrop-blur-sm"
          placeholder={t('bom.placeholders.wastePercent')}
          type="number"
          step="0.01"
          value={form.waste_percent}
          onChange={e => setForm({ ...form, waste_percent: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          {t('bom.labels.deductAtStage')}
        </label>
        <select
          className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white/80 backdrop-blur-sm"
          value={form.deduct_at_stage}
          onChange={e => setForm({ ...form, deduct_at_stage: e.target.value })}
          disabled={stagesLoading}
        >
          <option value="">{t('bom.placeholders.selectStage')}</option>
          {stageOptions.map(s => {
            // Safety check to ensure s is a string
            if (typeof s !== 'string') {
              console.warn('Invalid stage option:', s);
              return null;
            }
            return (
              <option key={s} value={s}>{s}</option>
            );
          })}
        </select>
      </div>

      <div className="xl:col-span-6 flex justify-end">
        <button
          type="submit"
          disabled={addBomMutation.isPending}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          {addBomMutation.isPending ? t('bom.adding') : t('bom.addItem')}
        </button>
      </div>
    </form>
  );
};

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

  const isRTL = i18n.language === 'ar';

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Product Selection */}
        <div className="group">
          <div className="space-y-5">
            <label className={`block text-sm font-black text-slate-900 uppercase tracking-widest ${isRTL ? 'text-right' : 'text-left'}`}>
              <span className={`inline-flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-full shadow-lg shadow-blue-500/30"></div>
                <span className={`bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent ${isRTL ? 'mr-4' : 'ml-3'}`}>{t('bom.labels.product')}</span>
              </span>
            </label>
            <div className="relative">
              <select
                className={`w-full px-7 py-6 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-500 bg-gradient-to-r from-white via-slate-50/90 to-white backdrop-blur-sm shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 hover:border-slate-300 group-hover:shadow-blue-500/15 transform group-hover:scale-[1.02] ${isRTL ? 'text-right' : 'text-left'}`}
                value={form.product}
                onChange={e => setForm({ ...form, product: e.target.value })}
                disabled={productsLoading}
              >
                <option value="">{t('bom.placeholders.selectProduct')}</option>
                {productOptions.map(p => {
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
              <div className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-7' : 'right-0 pr-7'} flex items-center pointer-events-none`}>
                <div className="w-8 h-8 bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg shadow-slate-500/20 transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Material Selection */}
        <div className="group">
          <div className="space-y-5">
            <label className={`block text-sm font-black text-slate-900 uppercase tracking-widest ${isRTL ? 'text-right' : 'text-left'}`}>
              <span className={`inline-flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-3 h-3 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 rounded-full shadow-lg shadow-green-500/30"></div>
                <span className={`bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent ${isRTL ? 'mr-4' : 'ml-3'}`}>{t('bom.labels.material')}</span>
              </span>
            </label>
            <div className="relative">
              <select
                className={`w-full px-7 py-6 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-500 bg-gradient-to-r from-white via-slate-50/90 to-white backdrop-blur-sm shadow-xl hover:shadow-2xl hover:shadow-green-500/20 hover:border-slate-300 group-hover:shadow-green-500/15 transform group-hover:scale-[1.02] ${isRTL ? 'text-right' : 'text-left'}`}
                value={form.material}
                onChange={e => handleMaterialChange(e.target.value)}
                disabled={materialsLoading}
              >
                <option value="">{t('bom.placeholders.selectMaterial')}</option>
                {materials.map(m => {
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
              <div className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-7' : 'right-0 pr-7'} flex items-center pointer-events-none`}>
                <div className="w-8 h-8 bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg shadow-slate-500/20 transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quantity Per Unit */}
        <div className="group">
          <div className="space-y-5">
            <label className={`block text-sm font-black text-slate-900 uppercase tracking-widest ${isRTL ? 'text-right' : 'text-left'}`}>
              <span className={`inline-flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 rounded-full shadow-lg shadow-purple-500/30"></div>
                <span className={`bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent ${isRTL ? 'mr-4' : 'ml-3'}`}>{t('bom.labels.qtyPerUnit')}</span>
              </span>
            </label>
            <input
              className={`w-full px-7 py-6 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-500 bg-gradient-to-r from-white via-slate-50/90 to-white backdrop-blur-sm shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 hover:border-slate-300 group-hover:shadow-purple-500/15 transform group-hover:scale-[1.02] placeholder-slate-400 ${isRTL ? 'text-right' : 'text-left'}`}
              placeholder={t('bom.placeholders.qtyPerUnit')}
              type="number"
              step="0.01"
              value={form.qty_per_unit}
              onChange={e => setForm({ ...form, qty_per_unit: e.target.value })}
            />
          </div>
        </div>

        {/* Unit */}
        <div className="group">
          <div className="space-y-4">
            <label className="block text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              <span className="inline-flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                <span>{t('bom.labels.unit')}</span>
              </span>
            </label>
            <input
              className="w-full px-6 py-5 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-500 bg-gradient-to-r from-white to-slate-50/80 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-slate-300 group-hover:shadow-orange-500/10 placeholder-slate-400"
              placeholder={t('bom.placeholders.unit')}
              value={form.unit}
              onChange={e => setForm({ ...form, unit: e.target.value })}
            />
          </div>
        </div>

        {/* Waste Percent */}
        <div className="group">
          <div className="space-y-4">
            <label className="block text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              <span className="inline-flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                <span>{t('bom.labels.wastePercent')}</span>
              </span>
            </label>
            <input
              className="w-full px-6 py-5 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-500 bg-gradient-to-r from-white to-slate-50/80 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-slate-300 group-hover:shadow-red-500/10 placeholder-slate-400"
              placeholder={t('bom.placeholders.wastePercent')}
              type="number"
              step="0.01"
              value={form.waste_percent}
              onChange={e => setForm({ ...form, waste_percent: e.target.value })}
            />
          </div>
        </div>

        {/* Deduct At Stage */}
        <div className="group">
          <div className="space-y-4">
            <label className="block text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              <span className="inline-flex items-center space-x-2">
                <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
                <span>{t('bom.labels.deductAtStage')}</span>
              </span>
            </label>
            <div className="relative">
              <select
                className="w-full px-6 py-5 border-2 border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-500 bg-gradient-to-r from-white to-slate-50/80 backdrop-blur-sm shadow-lg hover:shadow-xl hover:border-slate-300 group-hover:shadow-indigo-500/10"
                value={form.deduct_at_stage}
                onChange={e => setForm({ ...form, deduct_at_stage: e.target.value })}
                disabled={stagesLoading}
              >
                <option value="">{t('bom.placeholders.selectStage')}</option>
                {stageOptions.map(s => {
                  if (typeof s !== 'string') {
                    console.warn('Invalid stage option:', s);
                    return null;
                  }
                  return (
                    <option key={s} value={s}>{s}</option>
                  );
                })}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                <div className="w-6 h-6 bg-gradient-to-r from-slate-400 to-slate-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-8 border-t-2 border-gradient-to-r from-slate-200 to-slate-300">
        <button
          type="submit"
          disabled={addBomMutation.isPending}
          className="px-12 py-5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white rounded-3xl hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 disabled:opacity-50 font-black text-xl shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 transform hover:scale-110 border border-blue-400/30"
        >
          {addBomMutation.isPending ? (
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{t('bom.adding')}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span>{t('bom.addItem')}</span>
            </div>
          )}
        </button>
      </div>
    </form>
  );
};

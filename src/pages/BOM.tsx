import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

const BOM: React.FC = () => {
  const { t, i18n } = useTranslation()
  
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    product: '', material: '', qty_per_unit: '', unit: '', waste_percent: '', deduct_at_stage: ''
  })

  // Products from dedicated products table - dynamic language
  const { data: productOptions = [], isLoading: productsLoading } = useQuery({
    queryKey: ['bom', 'options', 'products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('code, name_en, name_ar')
        .eq('active', true)
        .order('name_en')
      if (error) throw error
      return data || []
    }
  })

  // Materials from stock table
  const { data: materials = [], isLoading: materialsLoading } = useQuery({
    queryKey: ['bom', 'options', 'materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock')
        .select('material, unit')
        .order('material')
      if (error) throw error
      return data || []
    }
  })

  // Tasks from dedicated tasks table - dynamic language
  const { data: stageOptions = [], isLoading: stagesLoading } = useQuery({
    queryKey: ['bom', 'options', 'stages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('code, name_en, name_ar')
        .eq('active', true)
        .order('name_en')
      if (error) throw error
      return data || []
    }
  })

  // Helper function to get the correct language name
  const getLocalizedName = (item: { name_en: string; name_ar: string }) => {
    return i18n.language === 'ar' ? item.name_ar : item.name_en
  }

  // Helper function to get the correct language name for materials (if they have translations)
  const getMaterialName = (material: string) => {
    // For now, materials are just text strings, but you could add translations later
    return material
  }

  const addBomMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('bom')
        .insert({
          product: form.product,
          material: form.material,
          qty_per_unit: Number(form.qty_per_unit),
          unit: form.unit,
          waste_percent: Number(form.waste_percent || 0),
          deduct_at_stage: form.deduct_at_stage
        })
      if (error) throw error
    },
    onSuccess: () => {
      setForm({
        product: '',
        material: '',
        qty_per_unit: '',
        unit: '',
        waste_percent: '',
        deduct_at_stage: ''
      })
      queryClient.invalidateQueries({ queryKey: ['bom'] })
    }
  })

  // Auto-fill unit when material changes
  const handleMaterialChange = (val: string) => {
    const mat = materials.find(m => m.material === val)
    setForm(prev => ({
      ...prev,
      material: val,
      unit: mat?.unit || prev.unit
    }))
  }
  
  const { data: bomItems, isLoading } = useQuery({
    queryKey: ['bom'],
    queryFn: async () => {
      const { data } = await supabase
        .from('bom')
        .select('*')
        .order('product')
      return data || []
    }
  })
  
  if (isLoading) {
    return <div className="text-center py-8">{t('loading')}</div>
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{t('bom')}</h1>
      </div>
      
      <form
        onSubmit={e => { e.preventDefault(); addBomMutation.mutate() }}
        className="flex flex-wrap items-end gap-2 bg-white p-4 rounded-md border"
      >
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">
            {i18n.language === 'ar' ? 'المنتج' : 'Product'}
          </label>
          <select
            className="border rounded px-2 py-1"
            value={form.product}
            onChange={e => setForm({ ...form, product: e.target.value })}
            disabled={productsLoading}
          >
            <option value="">{i18n.language === 'ar' ? 'اختر المنتج' : 'Select product'}</option>
            {productOptions.map(p => (
              <option key={p.code} value={p.name_en}>
                {getLocalizedName(p)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">
            {i18n.language === 'ar' ? 'المادة' : 'Material'}
          </label>
          <select
            className="border rounded px-2 py-1"
            value={form.material}
            onChange={e => handleMaterialChange(e.target.value)}
            disabled={materialsLoading}
          >
            <option value="">{i18n.language === 'ar' ? 'اختر المادة' : 'Select material'}</option>
            {materials.map(m => (
              <option key={m.material} value={m.material}>
                {getMaterialName(m.material)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">
            {i18n.language === 'ar' ? 'الكمية/الوحدة' : 'Qty/Unit'}
          </label>
          <input
            className="border rounded px-2 py-1 w-28"
            placeholder="Qty/Unit"
            type="number"
            step="0.01"
            value={form.qty_per_unit}
            onChange={e => setForm({ ...form, qty_per_unit: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">
            {i18n.language === 'ar' ? 'الوحدة' : 'Unit'}
          </label>
          <input
            className="border rounded px-2 py-1 w-24"
            placeholder="Unit"
            value={form.unit}
            onChange={e => setForm({ ...form, unit: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">
            {i18n.language === 'ar' ? 'نسبة الهدر %' : 'Waste %'}
          </label>
          <input
            className="border rounded px-2 py-1 w-24"
            placeholder="Waste %"
            type="number"
            step="0.01"
            value={form.waste_percent}
            onChange={e => setForm({ ...form, waste_percent: e.target.value })}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">
            {i18n.language === 'ar' ? 'المرحلة' : 'Stage'}
          </label>
          <select
            className="border rounded px-2 py-1"
            value={form.deduct_at_stage}
            onChange={e => setForm({ ...form, deduct_at_stage: e.target.value })}
            disabled={stagesLoading}
          >
            <option value="">{i18n.language === 'ar' ? 'اختر المرحلة' : 'Select stage'}</option>
            {stageOptions.map(s => (
              <option key={s.code} value={s.name_en}>
                {getLocalizedName(s)}
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
            ? (i18n.language === 'ar' ? 'جاري الإضافة...' : 'Adding...') 
            : (i18n.language === 'ar' ? 'إضافة مكون' : 'Add Component')
          }
        </button>
      </form>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('product')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('material')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('qtyPerUnit')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('unit')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('wastePercent')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('deductAtStage')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bomItems?.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.product}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.material}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.qty_per_unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.waste_percent}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.deduct_at_stage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BOM
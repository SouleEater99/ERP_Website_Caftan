import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Plus, AlertTriangle } from 'lucide-react'

const Inventory: React.FC = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  
  const { data: stock, isLoading } = useQuery({
    queryKey: ['stock'],
    queryFn: async () => {
      const { data } = await supabase
        .from('stock')
        .select('*')
        .order('material')
      return data || []
    }
  })
  
  const addStockMutation = useMutation({
    mutationFn: async ({ material, quantity }: { material: string, quantity: number }) => {
      await supabase
        .from('stock')
        .update({
          current_stock: supabase.sql`current_stock + ${quantity}`,
          remaining: supabase.sql`remaining + ${quantity}`
        })
        .eq('material', material)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] })
    }
  })
  
  const handleAddStock = (material: string) => {
    const quantity = prompt('Enter quantity to add:')
    if (quantity && !isNaN(Number(quantity))) {
      addStockMutation.mutate({ material, quantity: Number(quantity) })
    }
  }
  
  if (isLoading) {
    return <div className="text-center py-8">{t('loading')}</div>
  }
  
  const lowStockItems = stock?.filter(item => item.remaining <= item.reorder_threshold) || []
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{t('inventory')}</h1>
      </div>
      
      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-sm font-medium text-red-800">
              {t('lowStockAlerts')} ({lowStockItems.length})
            </h3>
          </div>
          <div className="mt-2 text-sm text-red-700">
            {lowStockItems.map(item => (
              <div key={item.id}>
                {item.material}: {item.remaining.toFixed(2)} {item.unit} remaining 
                (reorder at {item.reorder_threshold} {item.unit})
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Inventory Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('material')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('currentStock')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Used
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remaining
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('reorderLevel')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stock?.map((item) => (
              <tr key={item.id} className={item.remaining <= item.reorder_threshold ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.material}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.current_stock.toFixed(2)} {item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.used.toFixed(2)} {item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={item.remaining <= item.reorder_threshold ? 'text-red-600 font-medium' : ''}>
                    {item.remaining.toFixed(2)} {item.unit}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.reorder_threshold} {item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleAddStock(item.material)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {t('addStock')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Inventory
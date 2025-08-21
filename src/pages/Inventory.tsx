import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Plus, Minus, AlertTriangle } from 'lucide-react'

const Inventory: React.FC = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  // 1) Load stock
  const { data: stock, isLoading } = useQuery({
    queryKey: ['stock'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock')
        .select('*')
        .order('material')
      if (error) throw error
      return data || []
    }
  })

  // 2) Load movements summary (total used = sum(out))
  const { data: usedSummary } = useQuery({
    queryKey: ['stock', 'usedSummary'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('stock_movements')
          .select('stock_id, quantity, type')
        
        if (error) {
          console.error('Error fetching movements:', error)
          // If table doesn't exist, return empty map
          if (error.code === '42P01') { // table doesn't exist
            console.warn('stock_movements table does not exist yet')
            return new Map<string, number>()
          }
          throw error
        }
        
        const totals = new Map<string, number>()
        for (const m of data || []) {
          if (m.type === 'out') {
            totals.set(m.stock_id, (totals.get(m.stock_id) || 0) + Number(m.quantity))
          }
        }
        return totals
      } catch (error) {
        console.error('Error in movements query:', error)
        return new Map<string, number>()
      }
    }
  })

  // 3) Add stock (movement + update current_stock)
  const addStockMutation = useMutation({
    mutationFn: async ({ stockId, quantity, note }: { stockId: string, quantity: number, note?: string }) => {
      console.log('Adding stock:', { stockId, quantity, note })

      await supabase.rpc('adjust_stock', { p_stock_id: stockId, p_qty: quantity, p_type: 'in', p_note: note || null })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] })
      queryClient.invalidateQueries({ queryKey: ['stock', 'usedSummary'] })
    }
  })

  // 4) Consume stock (movement + update current_stock)
  const consumeStockMutation = useMutation({
    mutationFn: async ({ stockId, quantity, note }: { stockId: string, quantity: number, note?: string }) => {
      console.log('Consuming stock:', { stockId, quantity, note })

      await supabase.rpc('adjust_stock', { p_stock_id: stockId, p_qty: quantity, p_type: 'out', p_note: note || null })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] })
      queryClient.invalidateQueries({ queryKey: ['stock', 'usedSummary'] })
    }
  })

  const handleAddStock = (id: string) => {
    const quantity = prompt('Enter quantity to add:')
    if (quantity && !isNaN(Number(quantity))) {
      console.log('Handling add stock for ID:', id, 'quantity:', quantity)
      addStockMutation.mutate({ stockId: id, quantity: Number(quantity) })
    }
  }

  const handleConsumeStock = (id: string) => {
    const quantity = prompt('Enter quantity to consume:')
    if (quantity && !isNaN(Number(quantity))) {
      console.log('Handling consume stock for ID:', id, 'quantity:', quantity)
      consumeStockMutation.mutate({ stockId: id, quantity: Number(quantity) })
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">{t('loading')}</div>
  }

  // Calculate remaining dynamically and filter low stock items
  const rows = (stock || []).map(item => {
    const remaining = Number(item.current_stock) - Number(item.reorder_threshold)
    const isLow = remaining <= 0
    const totalUsed = usedSummary?.get(item.id) || 0
    return { ...item, remaining, isLow, totalUsed }
  })

  const lowStockItems = rows.filter(x => x.isLow)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{t('inventory')}</h1>
      </div>

      {/* Debug Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Debug Info</h3>
        <div className="text-sm text-blue-700">
          <p>Stock items loaded: {stock?.length || 0}</p>
          <p>Movements loaded: {usedSummary ? 'Yes' : 'No'}</p>
          <p>Add mutation state: {addStockMutation.isPending ? 'Pending' : addStockMutation.isError ? 'Error' : 'Idle'}</p>
          <p>Consume mutation state: {consumeStockMutation.isPending ? 'Pending' : consumeStockMutation.isError ? 'Error' : 'Idle'}</p>
          {addStockMutation.error && <p>Add error: {addStockMutation.error.message}</p>}
          {consumeStockMutation.error && <p>Consume error: {consumeStockMutation.error.message}</p>}
        </div>
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
            {rows.map((item) => (
              <tr key={item.id} className={item.isLow ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.material}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Number(item.current_stock).toFixed(2)} {item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.totalUsed.toFixed(2)} {item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={item.isLow ? 'text-red-600 font-medium' : ''}>
                    {item.remaining.toFixed(2)} {item.unit}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {Number(item.reorder_threshold).toFixed(2)} {item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleAddStock(item.id)}
                    disabled={addStockMutation.isPending}
                    className="inline-flex items-center px-3 py-1 rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {addStockMutation.isPending ? 'Adding...' : t('addStock')}
                  </button>
                  <button
                    onClick={() => handleConsumeStock(item.id)}
                    disabled={consumeStockMutation.isPending}
                    className="inline-flex items-center px-3 py-1 rounded-md text-red-700 bg-red-100 hover:bg-red-200 disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4 mr-1" />
                    {consumeStockMutation.isPending ? 'Consuming...' : 'Consume'}
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
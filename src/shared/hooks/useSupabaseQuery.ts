import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";  // ✅ Go up two levels
import { useMonitoring } from "../../lib/monitoring";  // ✅ Go up two levels
import { useAuthStore } from "../store/authStore";
import { getStockStatus } from '../utils/stockUtils'

// Enhanced Supabase query hook with monitoring and error handling
export const useSupabaseQuery = <T = any>(
  key: string[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) => {
  const { logDatabaseOperation, logError } = useMonitoring()
  const { user } = useAuthStore()

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const startTime = performance.now()
      const operation = key[0] || 'query'
      const table = key[1] || 'unknown'

      try {
        const result = await queryFn()
        const duration = performance.now() - startTime
        
        logDatabaseOperation(operation, table, duration, true)
        return result
      } catch (error) {
        const duration = performance.now() - startTime
        
        logDatabaseOperation(operation, table, duration, false)
        logError(error as Error, {
          userId: user?.id,
          userRole: user?.role,
          action: `${operation}_${table}`,
          route: window.location.pathname
        })
        
        throw error
      }
    },
    ...options
  })
}

// Enhanced Supabase mutation hook with monitoring
export const useSupabaseMutation = <TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, Error, TVariables>
) => {
  const { logDatabaseOperation, logError, logUserAction } = useMonitoring()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const startTime = performance.now()
      
      try {
        const result = await mutationFn(variables)
        const duration = performance.now() - startTime
        
        logDatabaseOperation('mutation', 'unknown', duration, true)
        logUserAction('database_mutation', { variables })
        
        return result
      } catch (error) {
        const duration = performance.now() - startTime
        
        logDatabaseOperation('mutation', 'unknown', duration, false)
        logError(error as Error, {
          userId: user?.id,
          userRole: user?.role,
          action: 'database_mutation',
          route: window.location.pathname
        })
        
        throw error
      }
    },
    ...options
  })
}

// Specific hooks for common operations
export const useUsers = () => {
  return useSupabaseQuery(
    ['users'],
    async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    }
  )
}

export const useLocations = () => {
  return useSupabaseQuery(
    ['locations'],
    async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    }
  )
}

export const usePayroll = (period?: string) => {
  return useSupabaseQuery(
    ['payroll', period || 'all'],
    async () => {
      let query = supabase
        .from('payroll')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (period === 'current') {
        const currentDate = new Date()
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        
        query = query
          .gte('period_start', startOfMonth.toISOString().split('T')[0])
          .lte('period_end', endOfMonth.toISOString().split('T')[0])
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    }
  )
}

export const useWorkLogs = (workerId?: string) => {
  return useSupabaseQuery(
    ['work_logs', workerId || 'all'],
    async () => {
      let query = supabase
        .from('work_logs')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (workerId) {
        query = query.eq('worker_id', workerId)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    }
  )
}

export const useInventory = () => {
  return useSupabaseQuery(
    ['stock'],
    async () => {
      const { data, error } = await supabase
        .from('stock')
        .select('*')
        .order('material')
      
      if (error) throw error
      return data || []
    }
  )
}

export const useBOM = () => {
  return useSupabaseQuery(
    ['bom'],
    async () => {
      const { data, error } = await supabase
        .from('bom')
        .select('*')
        .order('product')
      
      if (error) throw error
      return data || []
    }
  )
}

// Mutation hooks
export const useAddUser = () => {
  const queryClient = useQueryClient()
  
  return useSupabaseMutation(
    async (userData: {
      name: string
      email: string
      role: string
      worker_id?: string
      password: string
    }) => {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      })

      if (authError) throw authError

      // Create user profile
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          worker_id: userData.worker_id || null
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] })
      }
    }
  )
}

export const useAddLocation = () => {
  const queryClient = useQueryClient()
  
  return useSupabaseMutation(
    async (locationData: {
      name: string
      address: string
      city: string
      country: string
      phone?: string
      email?: string
    }) => {
      const { data, error } = await supabase
        .from('locations')
        .insert({
          ...locationData,
          status: 'active',
          worker_count: 0
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['locations'] })
      }
    }
  )
}

export const useUpdateLocation = () => {
  const queryClient = useQueryClient()
  
  return useSupabaseMutation(
    async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('locations')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['locations'] })
      }
    }
  )
}

export const useDeleteLocation = () => {
  const queryClient = useQueryClient()
  
  return useSupabaseMutation(
    async (id: string) => {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['locations'] })
      }
    }
  )
}

// Enhanced Dashboard hooks with debug logging
export const useDashboardStats = () => {
  return useSupabaseQuery(
    ['dashboard', 'stats'],
    async () => {
      console.log(' Fetching dashboard stats...')
      
      // Get total workers count
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, role')
        .eq('role', 'worker')
      
      console.log(' Users query result:', { users, usersError })
      
      if (usersError) throw usersError

      // Get active orders (work logs that are not completed)
      const { data: activeOrders, error: ordersError } = await supabase
        .from('work_logs')
        .select('id')
        .eq('completed', false)
      
      console.log('📦 Active orders query result:', { activeOrders, ordersError })
      
      if (ordersError) throw ordersError

      // Get completed tasks count
      const { data: completedTasks, error: completedError } = await supabase
        .from('work_logs')
        .select('id')
        .eq('completed', true)
      
      console.log('✅ Completed tasks query result:', { completedTasks, completedError })
      
      if (completedError) throw completedError

      // Get pending approvals (work logs that are completed but not approved)
      const { data: pendingApprovals, error: pendingError } = await supabase
        .from('work_logs')
        .select('id')
        .eq('completed', true)
        .eq('approved', false)
      
      console.log('⏳ Pending approvals query result:', { pendingApprovals, pendingError })
      
      if (pendingError) throw pendingError

      // Simplified earnings calculation - get all completed work logs first
      const { data: completedWorkLogs, error: workLogsError } = await supabase
        .from('work_logs')
        .select('quantity, product, task')
        .eq('completed', true)
        .eq('approved', true)
      
      console.log('💰 Completed work logs for earnings:', { completedWorkLogs, workLogsError })
      
      if (workLogsError) throw workLogsError

      // Get rates separately
      const { data: rates, error: ratesError } = await supabase
        .from('rates')
        .select('*')
      
      console.log('💰 Rates data:', { rates, ratesError })
      
      if (ratesError) throw ratesError

      // Calculate total earnings manually
      let totalEarnings = 0
      if (completedWorkLogs && rates) {
        completedWorkLogs.forEach(workLog => {
          const matchingRate = rates.find(rate => 
            rate.product === workLog.product && rate.task === workLog.task
          )
          if (matchingRate) {
            totalEarnings += workLog.quantity * matchingRate.rate_per_unit
          }
        })
      }

      // Remove efficiency calculation
      const result = {
        totalWorkers: users?.length || 0,
        activeOrders: activeOrders?.length || 0,
        completedTasks: completedTasks?.length || 0,
        pendingApprovals: pendingApprovals?.length || 0,
        totalEarnings: Math.round(totalEarnings * 100) / 100
      }

      console.log('📊 Final dashboard stats:', result)
      return result
    }
  )
}

export const useRecentActivities = () => {
  return useSupabaseQuery(
    ['dashboard', 'recent_activities'],
    async () => {
      const { data, error } = await supabase
        .from('work_logs')
        .select(`
          id,
          worker_name,
          task,
          product,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(4)
      
      if (error) throw error

      // Transform data to match the expected format
      return (data || []).map(log => ({
        id: log.id,
        worker: log.worker_name,
        task: log.task,
        product: log.product,
        time: formatTimeAgo(log.created_at),
        avatar: getWorkerAvatar(log.worker_name)
      }))
    }
  )
}

export const useLowStockItems = () => {
  return useSupabaseQuery(
    ['dashboard', 'low_stock'],
    async () => {
      console.log(' Fetching low stock items...')
      
      // Get all stock items and filter on client side
      const { data: allStock, error: stockError } = await supabase
        .from('stock')
        .select('*')
      
      console.log(' Stock query result:', { data: allStock, error: stockError })
      
      if (stockError) {
        console.error('Stock query error:', stockError)
        throw stockError
      }
      
      // Calculate remaining dynamically and filter low stock items
      const lowStockItems = (allStock || [])
        .map(item => ({
          material: item.material,
          current: item.current_stock,
          threshold: item.reorder_threshold,
          unit: item.unit,
          remaining: Number(item.current_stock) - Number(item.reorder_threshold)
        }))
        .filter(item => item.remaining <= 0)
        .sort((a, b) => a.remaining - b.remaining)
        .slice(0, 3)
      
      return lowStockItems
    }
  )
}

// Debug hook to check database content
export const useDebugDatabase = () => {
  return useSupabaseQuery(
    ['debug', 'database'],
    async () => {
      console.log('🔍 Debug: Checking database content...')
      
      // Check users table
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
      
      console.log('👥 All users:', { users, usersError })
      
      // Check work_logs table
      const { data: workLogs, error: workLogsError } = await supabase
        .from('work_logs')
        .select('*')
      
      console.log(' All work logs:', { workLogs, workLogsError })
      
      // Check stock table
      const { data: stock, error: stockError } = await supabase
        .from('stock')
        .select('*')
      
      console.log('📦 All stock:', { stock, stockError })
      
      // Check rates table
      const { data: rates, error: ratesError } = await supabase
        .from('rates')
        .select('*')
      
      console.log('💰 All rates:', { rates, ratesError })
      
      return {
        users: users || [],
        workLogs: workLogs || [],
        stock: stock || [],
        rates: rates || []
      }
    }
  )
}

// Helper functions
const formatTimeAgo = (timestamp: string) => {
  const now = new Date()
  const created = new Date(timestamp)
  const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'منذ دقائق'
  if (diffInHours === 1) return 'منذ ساعة'
  if (diffInHours < 24) return `منذ ${diffInHours} ساعات`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return 'منذ يوم'
  return `منذ ${diffInDays} أيام`
}

const getWorkerAvatar = (workerName: string) => {
  // Simple avatar assignment based on worker name
  const avatars = ['‍🎨', '‍🎨', '‍💼', '‍💼', '👨‍', '👩‍🔧']
  const hash = workerName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  return avatars[Math.abs(hash) % avatars.length]
}

// Add this new hook for work logs
export const useAddWorkLog = () => {
  const queryClient = useQueryClient()
  
  return useSupabaseMutation(
    async (workLogData: {
      worker_id: string
      worker_name: string
      product: string
      product_id?: string
      task: string
      quantity: number
      notes?: string
    }) => {
      const { data, error } = await supabase
        .from('work_logs')
        .insert({
          ...workLogData,
          completed: false,
          approved: false
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    {
      onSuccess: () => {
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['work_logs'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard', 'recent_activities'] })
      }
    }
  )
}

// Simple test query
export const useTestQuery = () => {
  return useSupabaseQuery(
    ['test', 'simple'],
    async () => {
      console.log('🧪 Testing simple query...')
      
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1)
      
      console.log('🧪 Simple query result:', { data, error })
      return { data, error }
    }
  )
}

// Alternative simple earnings calculation
const calculateEarnings = async () => {
  try {
    // Get all completed work logs
    const { data: workLogs, error } = await supabase
      .from('work_logs')
      .select('quantity, product, task')
      .eq('completed', true)
      .eq('approved', true)
    
    if (error) throw error
    
    // For now, use a simple calculation (you can enhance this later)
    // Assume average rate of $10 per unit for simplicity
    const totalEarnings = (workLogs || []).reduce((total, log) => {
      return total + (log.quantity * 10) // $10 per unit
    }, 0)
    
    return totalEarnings
  } catch (error) {
    console.error('Earnings calculation error:', error)
    return 0
  }
}

// Debug hook to check table structure
export const useTableStructure = () => {
  return useSupabaseQuery(
    ['debug', 'table_structure'],
    async () => {
      console.log('🔍 Checking table structure...')
      
      // Check what columns exist in each table
      const { data: usersCols, error: usersColsError } = await supabase
        .from('users')
        .select('*')
        .limit(1)
      
      const { data: stockCols, error: stockColsError } = await supabase
        .from('stock')
        .select('*')
        .limit(1)
      
      const { data: ratesCols, error: ratesColsError } = await supabase
        .from('rates')
        .select('*')
        .limit(1)
      
      console.log('👥 Users columns:', usersCols ? Object.keys(usersCols[0] || {}) : 'No data')
      console.log('📦 Stock columns:', stockCols ? Object.keys(stockCols[0] || {}) : 'No data')
      console.log('💰 Rates columns:', ratesCols ? Object.keys(ratesCols[0] || {}) : 'No data')
      
      return {
        usersColumns: usersCols ? Object.keys(usersCols[0] || {}) : [],
        stockColumns: stockCols ? Object.keys(stockCols[0] || {}) : [],
        ratesColumns: ratesCols ? Object.keys(ratesCols[0] || {}) : []
      }
    }
  )
}
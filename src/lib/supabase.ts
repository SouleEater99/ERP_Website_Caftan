import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Enhanced environment validation
const isValidSupabaseConfig = supabaseUrl && 
  supabaseKey && 
  !supabaseUrl.includes('your-project') && 
  !supabaseKey.includes('your-anon-key') &&
  supabaseUrl.startsWith('https://') &&
  supabaseKey.length > 50

if (!isValidSupabaseConfig) {
  console.warn('⚠️ Supabase environment variables not configured properly.')
  console.warn('Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly.')
  console.warn('Current URL:', supabaseUrl)
  console.warn('Key length:', supabaseKey?.length || 0)
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types based on the migration schema
export type UserRole = 'worker' | 'supervisor' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  worker_id?: string
  created_at: string
}

export interface WorkLog {
  id: string
  worker_id: string
  worker_name: string
  product: string
  product_id?: string
  task: string
  quantity: number
  completed: boolean
  notes?: string
  created_at: string
  approved: boolean
}

export interface BOM {
  id: string
  product: string
  material: string
  qty_per_unit: number
  unit: string
  waste_percent: number
  deduct_at_stage: string
  created_at: string
}

export interface Stock {
  id: string
  material: string
  unit: string
  current_stock: number
  reorder_threshold: number
  last_updated: string
}

export interface StockMovement {
  id: string
  stock_id: string
  type: 'in' | 'out'
  quantity: number
  note?: string | null
  created_at: string
}

export interface Rate {
  id: string
  product: string
  task: string
  rate_per_unit: number
  created_at: string
}

export interface Payroll {
  id: string
  worker_id: string
  worker_name: string
  period_start: string
  period_end: string
  total_earnings: number
  paid_status: boolean
  created_at: string
}

export interface Location {
  id: string
  name: string
  address: string
  city: string
  country: string
  phone?: string
  email?: string
  status: 'active' | 'inactive'
  worker_count: number
  created_at: string
  updated_at: string
}

export interface PayrollPeriod {
  id: string;
  period_name: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'closed' | 'pending';
  created_at: string;
  closed_at?: string;
  notes?: string;
}

// Helper functions for common operations
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export const checkUserPermission = (userRole: UserRole, requiredRole: UserRole) => {
  const roleHierarchy = { 'worker': 1, 'supervisor': 2, 'admin': 3 }
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

// Error handling helper
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error)
  
  if (error.code === 'PGRST301') {
    return 'Access denied. You do not have permission to perform this action.'
  }
  
  if (error.code === '23505') {
    return 'This record already exists.'
  }
  
  if (error.code === '23503') {
    return 'Cannot delete this record as it is referenced by other data.'
  }
  
  return error.message || 'An unexpected error occurred.'
}
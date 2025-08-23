import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export type UserRole = 'worker' | 'supervisor' | 'admin'

export interface AppUser {
  id: string
  email: string
  name: string
  role: UserRole
  worker_id?: string
  created_at: string
}

interface AuthState {
  user: AppUser | null
  session: Session | null
  loading: boolean
  initialized: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<boolean>
  initialize: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: false,
      initialized: false,
      error: null,

      initialize: async () => {
        const state = get()
        if (state.initialized || state.loading) {
          return
        }

        set({ loading: true })

        try {
          const { data: { session }, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('Session error:', error)
            set({ user: null, session: null, loading: false, initialized: true })
            return
          }

          if (session) {
            // Try to get user from users table
            try {
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single()

              if (userData && !userError) {
                // User exists in users table
                set({ user: userData, session, loading: false, initialized: true })
                return
              }
            } catch (userError) {
              console.log('User not found in users table during initialization')
            }

            // If user doesn't exist in users table, create a fallback user
            // This allows the app to work while we fix the user setup
            const fallbackUser: AppUser = {
              id: session.user.id,
              email: session.user.email || 'unknown@example.com',
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User',
              role: 'worker', // Default to worker for security
              created_at: session.user.created_at || new Date().toISOString()
            }
            
            set({ user: fallbackUser, session, loading: false, initialized: true })
          } else {
            set({ user: null, session: null, loading: false, initialized: true })
          }
        } catch (error) {
          console.error('Initialize error:', error)
          set({ user: null, session: null, loading: false, initialized: true })
        }
      },

      login: async (email: string, password: string) => {
        set({ loading: true, error: null })
        
        try {
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
          })

          if (authError) {
            set({ error: authError.message, loading: false })
            return false
          }

          if (authData.user && authData.session) {
            // Try to get user profile from users table
            try {
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', authData.user.id)
                .single()

              if (userData && !userError) {
                // User exists in users table - use their actual data
                set({ user: userData, session: authData.session, loading: false })
                return true
              }
            } catch (userError) {
              console.log('User not found in users table during login')
            }

            // If user doesn't exist in users table, create a fallback user
            // This allows login to work while we fix the user setup
            const fallbackUser: AppUser = {
              id: authData.user.id,
              email: authData.user.email || email,
              name: authData.user.user_metadata?.full_name || authData.user.user_metadata?.name || email.split('@')[0],
              role: 'worker', // Default to worker for security
              created_at: authData.user.created_at || new Date().toISOString()
            }
            
            set({ user: fallbackUser, session: authData.session, loading: false })
            return true
          }
          
          return false
        } catch (error: any) {
          set({ error: error.message, loading: false })
          return false
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut()
          set({ user: null, session: null })
        } catch (error) {
          console.error('Logout error:', error)
        }
      },

      resetPassword: async (email: string) => {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email)
          if (error) throw error
          return true
        } catch (error: any) {
          set({ error: error.message })
          return false
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, session: state.session })
    }
  )
)

// Simple auth state listener - no automatic initialization
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, session: null })
  }
})
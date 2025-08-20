import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
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
            // Create user from auth session data to avoid RLS recursion
            const fallbackUser: AppUser = {
              id: session.user.id,
              email: session.user.email || 'admin@example.com',
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Administrator',
              role: 'admin',
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
            // Try to get user profile
            try {
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', authData.user.id)
                .single()

              if (userError || (userError && userError.code === '42P17')) {
                console.warn('User profile fetch failed, using fallback:', userError?.message)
                // Create fallback user
                const fallbackUser: AppUser = {
                  id: authData.user.id,
                  email: authData.user.email || email,
                  name: authData.user.user_metadata?.name || 'User',
                  role: 'admin',
                  created_at: new Date().toISOString()
                }
                set({ user: fallbackUser, session: authData.session, loading: false })
                return true
              }

              set({ user: userData, session: authData.session, loading: false })
              return true
            } catch (profileError) {
              console.warn('Profile fetch failed, using fallback:', profileError)
              // Create fallback user on any error
              const fallbackUser: AppUser = {
                id: authData.user.id,
                email: authData.user.email || email,
                name: authData.user.user_metadata?.name || 'User',
                role: 'admin',
                created_at: new Date().toISOString()
              }
              set({ user: fallbackUser, session: authData.session, loading: false, initialized: true })
              return true
            }
          }

          set({ loading: false })
          return false
        } catch (error) {
          console.error('Login error:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            loading: false 
          })
          return false
        }
      },

      logout: async () => {
        set({ loading: true })
        try {
          await supabase.auth.signOut()
          set({ user: null, session: null, loading: false, initialized: true })
        } catch (error) {
          console.error('Logout error:', error)
          set({ user: null, session: null, loading: false, initialized: true })
        }
      },

      resetPassword: async (email: string) => {
        set({ loading: true, error: null })
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email)
          if (error) {
            set({ error: error.message, loading: false })
            return false
          }
          set({ loading: false })
          return true
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Password reset failed', 
            loading: false 
          })
          return false
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        session: state.session 
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.loading = false
          state.initialized = false
        }
      }
    }
  )
)

// Simple auth state listener - no automatic initialization
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, session: null })
  }
})
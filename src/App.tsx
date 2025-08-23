import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './shared/store/authStore'
import ErrorBoundary from './shared/components/ErrorBoundary'
import Layout from './shared/components/layout/Layout'
import Login from './shared/components/Login'
import Dashboard from './pages/Dashboard'
import LogWork from './pages/LogWork'
import Inventory from './pages/Inventory'
import BOM from './pages/BOM'
import Payroll from './pages/Payroll'
import Reports from './pages/Reports'
import Management from './pages/Management'
import './i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        if (error?.code === 'PGRST301' || error?.status === 401) {
          return false
        }
        return failureCount < 3
      }
    },
    mutations: {
      retry: false
    }
  }
})

function App() {
  const { user, loading, initialized, initialize } = useAuthStore()
  
  React.useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialized, initialize])
  
  // Show loading only if not initialized and currently loading
  if (!initialized && loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 font-medium text-sm">Initializing...</p>
        </div>
      </div>
    )
  }
  
  // If not initialized but not loading, or no user, show login
  if (!user) {
    return (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Login />
        </QueryClientProvider>
      </ErrorBoundary>
    )
  }
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              
              {user.role === 'worker' && (
                <Route path="/log-work" element={<LogWork />} />
              )}
              
              {(user.role === 'supervisor' || user.role === 'admin') && (
                <>
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/payroll" element={<Payroll />} />
                  <Route path="/reports" element={<Reports />} />
                </>
              )}
              
              {user.role === 'admin' && (
                <>
                  <Route path="/bom" element={<BOM />} />
                  <Route path="/management" element={<Management />} />
                </>
              )}
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
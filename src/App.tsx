import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./shared/store/authStore";
import ErrorBoundary from "./shared/components/ErrorBoundary";
import Layout from "./shared/components/layout/Layout";
import Login from "./shared/components/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Payroll from "./pages/Payroll";
import BOM from "./pages/BOM";
import Reports from "./pages/Reports";
import Management from "./pages/Management";
import LogWork from "./pages/LogWork";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  const { user, loading, initialized, initialize } = useAuthStore()

  useEffect(() => {
    if (!initialized) {
      initialize()
    }
  }, [initialized, initialize])

  if (loading || !initialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              
              {/* Only workers can access Log Work */}
              {user.role === 'worker' && (
                <Route path="/log-work" element={<LogWork />} />
              )}
              
              {/* Supervisors and admins can access these modules */}
              {(user.role === 'supervisor' || user.role === 'admin') && (
                <>
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/payroll" element={<Payroll />} />
                  <Route path="/reports" element={<Reports />} />
                </>
              )}
              
              {/* Only admins can access these modules */}
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
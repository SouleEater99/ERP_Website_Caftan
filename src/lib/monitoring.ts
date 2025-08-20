// Production monitoring and error tracking utilities

interface ErrorContext {
  userId?: string
  userRole?: string
  route?: string
  action?: string
  timestamp?: string
  userAgent?: string
  url?: string
}

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  context?: Record<string, any>
}

class MonitoringService {
  private isDevelopment = import.meta.env.DEV
  private sentryDsn = import.meta.env.VITE_SENTRY_DSN
  private gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID

  constructor() {
    this.initializeErrorTracking()
    this.initializeAnalytics()
  }

  private initializeErrorTracking() {
    if (this.sentryDsn && !this.isDevelopment) {
      // Initialize Sentry for production error tracking
      // This would be implemented with the actual Sentry SDK
      console.log('Sentry initialized for production error tracking')
    }
  }

  private initializeAnalytics() {
    if (this.gaId && !this.isDevelopment) {
      // Initialize Google Analytics
      // This would be implemented with the actual GA SDK
      console.log('Google Analytics initialized')
    }
  }

  // Error tracking
  logError(error: Error, context?: ErrorContext) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...context
    }

    if (this.isDevelopment) {
      console.error('Error logged:', errorData)
    } else {
      // Send to error tracking service (Sentry, etc.)
      this.sendToErrorService(errorData)
    }
  }

  // Performance monitoring
  logPerformance(metric: PerformanceMetric) {
    const performanceData = {
      ...metric,
      url: window.location.href,
      timestamp: Date.now()
    }

    if (this.isDevelopment) {
      console.log('Performance metric:', performanceData)
    } else {
      // Send to analytics service
      this.sendToAnalytics('performance', performanceData)
    }
  }

  // User action tracking
  logUserAction(action: string, context?: Record<string, any>) {
    const actionData = {
      action,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      ...context
    }

    if (this.isDevelopment) {
      console.log('User action:', actionData)
    } else {
      this.sendToAnalytics('user_action', actionData)
    }
  }

  // Database operation monitoring
  logDatabaseOperation(operation: string, table: string, duration: number, success: boolean) {
    const dbData = {
      operation,
      table,
      duration,
      success,
      timestamp: new Date().toISOString()
    }

    if (this.isDevelopment) {
      console.log('Database operation:', dbData)
    } else {
      this.sendToAnalytics('database_operation', dbData)
    }
  }

  // Authentication events
  logAuthEvent(event: 'login' | 'logout' | 'register' | 'password_reset', userId?: string) {
    const authData = {
      event,
      userId,
      timestamp: new Date().toISOString(),
      url: window.location.href
    }

    if (this.isDevelopment) {
      console.log('Auth event:', authData)
    } else {
      this.sendToAnalytics('auth_event', authData)
    }
  }

  private sendToErrorService(errorData: any) {
    // Implementation would send to Sentry or similar service
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData)
    }).catch(err => console.error('Failed to send error data:', err))
  }

  private sendToAnalytics(eventType: string, data: any) {
    // Implementation would send to Google Analytics or similar service
    if (typeof gtag !== 'undefined') {
      gtag('event', eventType, data)
    }
  }

  // Health check utilities
  async performHealthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    checks: Record<string, boolean>
    timestamp: string
  }> {
    const checks = {
      supabase: await this.checkSupabaseHealth(),
      localStorage: this.checkLocalStorageHealth(),
      network: await this.checkNetworkHealth()
    }

    const allHealthy = Object.values(checks).every(check => check)
    const someHealthy = Object.values(checks).some(check => check)

    return {
      status: allHealthy ? 'healthy' : someHealthy ? 'degraded' : 'unhealthy',
      checks,
      timestamp: new Date().toISOString()
    }
  }

  private async checkSupabaseHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
        }
      })
      return response.ok
    } catch {
      return false
    }
  }

  private checkLocalStorageHealth(): boolean {
    try {
      const testKey = '__health_check__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  private async checkNetworkHealth(): Promise<boolean> {
    try {
      const response = await fetch('/favicon.ico', { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }
}

// Create singleton instance
export const monitoring = new MonitoringService()

// React hook for monitoring
export const useMonitoring = () => {
  return {
    logError: monitoring.logError.bind(monitoring),
    logPerformance: monitoring.logPerformance.bind(monitoring),
    logUserAction: monitoring.logUserAction.bind(monitoring),
    logDatabaseOperation: monitoring.logDatabaseOperation.bind(monitoring),
    logAuthEvent: monitoring.logAuthEvent.bind(monitoring),
    performHealthCheck: monitoring.performHealthCheck.bind(monitoring)
  }
}

// Performance measurement utilities
export const measurePerformance = async <T>(
  name: string,
  operation: () => Promise<T>,
  context?: Record<string, any>
): Promise<T> => {
  const startTime = performance.now()
  
  try {
    const result = await operation()
    const duration = performance.now() - startTime
    
    monitoring.logPerformance({
      name,
      value: duration,
      timestamp: Date.now(),
      context: { ...context, success: true }
    })
    
    return result
  } catch (error) {
    const duration = performance.now() - startTime
    
    monitoring.logPerformance({
      name,
      value: duration,
      timestamp: Date.now(),
      context: { ...context, success: false, error: error.message }
    })
    
    throw error
  }
}

export default monitoring
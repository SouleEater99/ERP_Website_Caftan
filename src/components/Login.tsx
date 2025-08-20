import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../stores/authStore'
import { useTranslation } from 'react-i18next'
import { Languages, Sparkles, Zap, Shield, Crown, AlertCircle, Eye, EyeOff } from 'lucide-react'
import PasswordReset from './PasswordReset'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

type LoginForm = z.infer<typeof loginSchema>

const Login: React.FC = () => {
  const { login, loading, error, clearError } = useAuthStore()
  const { t, i18n } = useTranslation()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isResetMode, setIsResetMode] = React.useState(false)
  
  const isRTL = i18n.language === 'ar'
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })
  
  const onSubmit = async (data: LoginForm) => {
    clearError()
    try {
      const success = await login(data.email, data.password)
      if (!success) {
        // Error is already set in the store
        console.log('Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }
  
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')
  }
  
  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden calm-pattern ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-slate-50/60 to-cyan-50/80"></div>
      
      {/* Floating Elements - Traditional Arabic Patterns */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-300 to-cyan-400 rounded-full blur-xl opacity-15 floating-element"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-cyan-300 to-emerald-400 rounded-full blur-xl opacity-15 floating-element" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-r from-emerald-300 to-blue-400 rounded-full blur-xl opacity-15 floating-element" style={{animationDelay: '4s'}}></div>
      
      <div className="relative z-10 w-full max-w-md mx-4 px-4 sm:px-0">
        {/* Language Toggle */}
        <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} mb-6`}>
          <button
            onClick={toggleLanguage}
            className="glass-card px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-white/95 transition-all duration-300 group mobile-button"
          >
            <Languages className="h-4 w-4 text-blue-600 group-hover:text-cyan-600 transition-colors" />
            <span className="responsive-text font-medium text-blue-600 group-hover:text-cyan-600 transition-colors">
              {i18n.language === 'en' ? 'العربية' : 'English'}
            </span>
          </button>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8 slide-up border-2 border-slate-200/50 mobile-card">
          {isResetMode ? (
            <PasswordReset onBack={() => setIsResetMode(false)} />
          ) : (
            <>
              {/* Header with Logo */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white border-2 border-slate-200 rounded-3xl mb-4 pulse-glow relative overflow-hidden shadow-lg">
                  <Crown className="h-10 w-10 text-blue-600 relative z-10" />
                </div>
                <p className="text-slate-600 font-medium mt-4 responsive-text">
                  {t('welcome')}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <label className="block responsive-text font-semibold text-slate-700 mb-2">
                      {t('email')}
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 sm:py-4 bg-white/70 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all duration-300 text-slate-800 placeholder-slate-400 group-hover:border-slate-300 mobile-button"
                      placeholder="admin@caftantalia.com"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                    {errors.email && (
                      <p className="mt-2 responsive-text text-red-500 font-medium">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="relative group">
                    <label className="block responsive-text font-semibold text-slate-700 mb-2">
                      {t('password')}
                    </label>
                    <div className="relative">
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-4 py-3 sm:py-4 pr-12 bg-white/70 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all duration-300 text-slate-800 placeholder-slate-400 group-hover:border-slate-300 mobile-button"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 responsive-text text-red-500 font-medium">{errors.password.message}</p>
                    )}
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-center mobile-card">
                    <div className="flex items-center justify-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <div className="text-left">
                        <p className="text-red-600 font-medium responsive-text">{error}</p>
                        {error.includes('Invalid login credentials') && (
                          <div className="mt-2 text-sm text-red-500">
                            <p>Default admin credentials:</p>
                            <p>Email: admin@caftantalia.com</p>
                            <p>Password: admin123456</p>
                            <p className="mt-1 text-xs">Check setup docs if you've changed these.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cold-gradient text-white py-3 sm:py-4 px-6 rounded-2xl font-bold responsive-subheading hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl mobile-button"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="responsive-text">{t('loading')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span className="responsive-text">{t('login')}</span>
                    </div>
                  )}
                </button>
              </form>
              
              {/* Additional Options */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsResetMode(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors arabic-text"
                >
                  {t('forgotPassword')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
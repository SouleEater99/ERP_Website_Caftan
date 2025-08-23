import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../lib/supabase'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

const resetSchema = z.object({
  email: z.string().email('Invalid email address')
})

type ResetForm = z.infer<typeof resetSchema>

interface PasswordResetProps {
  onBack: () => void
}

const PasswordReset: React.FC<PasswordResetProps> = ({ onBack }) => {
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const isRTL = i18n.language === 'ar'
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema)
  })
  
  const onSubmit = async (data: ResetForm) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`
      })
      
      if (error) {
        setError(error.message)
      } else {
        setIsSuccess(true)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-4 arabic-heading">
          {isRTL ? 'تم إرسال البريد الإلكتروني' : 'Email Sent'}
        </h2>
        
        <p className="text-slate-600 mb-6 arabic-text">
          {isRTL 
            ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد والبريد المزعج.'
            : 'A password reset link has been sent to your email. Please check your inbox and spam folder.'
          }
        </p>
        
        <button
          onClick={onBack}
          className="cold-button w-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="arabic-text">
            {isRTL ? 'العودة لتسجيل الدخول' : 'Back to Login'}
          </span>
        </button>
      </div>
    )
  }
  
  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2 arabic-heading">
          {isRTL ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
        </h2>
        
        <p className="text-slate-600 arabic-text">
          {isRTL 
            ? 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور'
            : 'Enter your email and we\'ll send you a password reset link'
          }
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 arabic-text">
            {t('email')}
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-3 bg-white/70 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all duration-300 text-slate-800 placeholder-slate-400"
            placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-500 font-medium arabic-text">
              {errors.email.message}
            </p>
          )}
        </div>
        
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-600 font-medium text-sm arabic-text">{error}</p>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cold-gradient text-white py-3 px-6 rounded-2xl font-bold hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="arabic-text">
                  {isRTL ? 'جاري الإرسال...' : 'Sending...'}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Mail className="h-5 w-5" />
                <span className="arabic-text">
                  {isRTL ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link'}
                </span>
              </div>
            )}
          </button>
          
          <button
            type="button"
            onClick={onBack}
            className="w-full cold-button-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="arabic-text">
              {isRTL ? 'العودة لتسجيل الدخول' : 'Back to Login'}
            </span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default PasswordReset
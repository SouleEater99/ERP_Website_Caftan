import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'
import { CheckCircle, AlertTriangle, Package, Crown, Clock, User, Calendar, Scissors, Shirt } from 'lucide-react'
import { useAddWorkLog } from '../hooks/useSupabaseQuery';

const workSchema = z.object({
  product: z.string().min(1, 'Product is required'),
  product_id: z.string().optional(),
  task: z.string().min(1, 'Task is required'),
  quantity: z.number().min(1, 'Quantity must be positive'),
  completed: z.boolean(),
  notes: z.string().optional()
})

type WorkForm = z.infer<typeof workSchema>

const LogWork: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { user } = useAuthStore()
  const isRTL = i18n.language === 'ar'
  
  // Arabic product names for Caftan Talia
  const products = [
    { value: 'caftan', label: 'كفتان حريري', icon: '👘' },
    { value: 'jalabiya', label: 'جلابية قطنية', icon: '🥻' },
    { value: 'thobe', label: 'ثوب مطرز', icon: '👗' },
    { value: 'abaya', label: 'عباية مخملية', icon: '🧥' },
    { value: 'dress', label: 'فستان تراثي', icon: '👚' }
  ]
  
  const tasks = [
    { value: 'cutting', label: t('cutting'), icon: '✂️', color: 'from-red-500 to-pink-500', desc: 'قص الأقمشة والمواد' },
    { value: 'sewing', label: t('sewing'), icon: '🧵', color: 'from-blue-500 to-cyan-500', desc: 'خياطة القطع الأساسية' },
    { value: 'finishing', label: t('finishing'), icon: '✨', color: 'from-green-500 to-emerald-500', desc: 'اللمسات الأخيرة والتشطيب' },
    { value: 'embroidery', label: t('embroidery'), icon: '🎨', color: 'from-purple-500 to-pink-500', desc: 'التطريز والزخرفة' }
  ]
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<WorkForm>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      completed: false,
      quantity: 1
    }
  })
  
  const watchedTask = watch('task')
  const watchedProduct = watch('product')
  const watchedQuantity = watch('quantity')
  
  const addWorkLog = useAddWorkLog();

  const onSubmit = async (data: WorkForm) => {
    try {
      // Show loading state
      const loadingDiv = document.createElement('div')
      loadingDiv.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 animate-pulse arabic-text'
      loadingDiv.textContent = t('loggingWork') || 'Logging work...'
      document.body.appendChild(loadingDiv)

      // Submit to database
      await addWorkLog.mutateAsync({
        worker_id: user?.id || '',
        worker_name: user?.name || '',
        product: data.product,
        task: data.task,
        quantity: data.quantity,
        notes: data.notes
      })

      // Remove loading and show success
      document.body.removeChild(loadingDiv)
      
      const successDiv = document.createElement('div')
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 animate-bounce arabic-text'
      successDiv.textContent = t('workLoggedSuccess')
      document.body.appendChild(successDiv)
      setTimeout(() => document.body.removeChild(successDiv), 3000)
      
      reset()
    } catch (error) {
      // Remove loading and show error
      const loadingDiv = document.querySelector('.fixed.top-4.right-4.bg-blue-500')
      if (loadingDiv) document.body.removeChild(loadingDiv)
      
      const errorDiv = document.createElement('div')
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 animate-bounce arabic-text'
      errorDiv.textContent = t('workLogError') || 'Error logging work'
      document.body.appendChild(errorDiv)
      setTimeout(() => document.body.removeChild(errorDiv), 3000)
      
      console.error('Error logging work:', error)
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card rounded-3xl p-8 slide-up border-2 border-orange-200/30">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 caftan-gradient rounded-3xl mb-4 pulse-glow relative overflow-hidden">
            <img 
              src="/image.png" 
              alt="Caftan Talia Logo" 
              className="w-16 h-16 object-contain relative z-10"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'block';
              }}
            />
            <Crown className="h-10 w-10 text-white relative z-10 hidden" />
          </div>
          <h1 className="text-3xl font-bold caftan-gradient-text mb-2 arabic-heading">
            {t('logWork')}
          </h1>
          <p className="text-orange-700 font-medium arabic-text">
            سجل أعمالك اليومية في كفتان تاليا
          </p>
        </div>
        
        {/* Worker Info Card */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50/50 rounded-2xl p-6 mb-8 border border-orange-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="w-12 h-12 caftan-gradient rounded-2xl flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-sm font-semibold text-orange-600 arabic-text">العامل</p>
                <p className="font-bold text-orange-900 arabic-text">{user?.name}</p>
              </div>
            </div>
            <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-sm font-semibold text-orange-600 arabic-text">التاريخ</p>
                <p className="font-bold text-orange-900 arabic-text">{new Date().toLocaleDateString('ar-SA')}</p>
              </div>
            </div>
            <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-sm font-semibold text-orange-600 arabic-text">الوقت</p>
                <p className="font-bold text-orange-900 arabic-text">{new Date().toLocaleTimeString('ar-SA')}</p>
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-orange-800 arabic-text">
              {t('selectProduct')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {products.map(product => (
                <label key={product.value} className="cursor-pointer">
                  <input
                    {...register('product')}
                    type="radio"
                    value={product.value}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    watchedProduct === product.value
                      ? 'caftan-gradient text-white border-transparent shadow-lg scale-105'
                      : 'bg-white/70 border-orange-200 hover:border-orange-300 hover:bg-white'
                  }`}>
                    <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <span className="text-2xl">{product.icon}</span>
                      <span className="font-semibold arabic-text">{product.label}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.product && (
              <p className="text-sm text-red-500 font-medium flex items-center space-x-1 arabic-text">
                <AlertTriangle className="h-4 w-4" />
                <span>{errors.product.message}</span>
              </p>
            )}
          </div>
          
          {/* Product ID */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-orange-800 arabic-text">
              {t('productId')}
            </label>
            <input
              {...register('product_id')}
              type="text"
              className="w-full p-4 bg-white/70 border-2 border-orange-200 rounded-2xl focus:border-red-500 focus:bg-white transition-all duration-300 text-orange-900 font-medium arabic-text"
              placeholder="CT-001 (اختياري)"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          
          {/* Task Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-orange-800 arabic-text">
              {t('selectTask')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tasks.map(task => (
                <label key={task.value} className="cursor-pointer">
                  <input
                    {...register('task')}
                    type="radio"
                    value={task.value}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    watchedTask === task.value
                      ? `bg-gradient-to-r ${task.color} text-white border-transparent shadow-lg scale-105`
                      : 'bg-white/70 border-orange-200 hover:border-orange-300 hover:bg-white'
                  }`}>
                    <div className={`flex items-center space-x-3 mb-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <span className="text-2xl">{task.icon}</span>
                      <span className="font-semibold arabic-text">{task.label}</span>
                    </div>
                    <p className={`text-xs opacity-80 arabic-text ${isRTL ? 'text-right' : ''}`}>{task.desc}</p>
                  </div>
                </label>
              ))}
            </div>
            {errors.task && (
              <p className="text-sm text-red-500 font-medium flex items-center space-x-1 arabic-text">
                <AlertTriangle className="h-4 w-4" />
                <span>{errors.task.message}</span>
              </p>
            )}
          </div>
          
          {/* Quantity */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-orange-800 arabic-text">
              {t('quantity')}
            </label>
            <input
              {...register('quantity', { valueAsNumber: true })}
              type="number"
              min="1"
              className="w-full p-4 bg-white/70 border-2 border-orange-200 rounded-2xl focus:border-red-500 focus:bg-white transition-all duration-300 text-orange-900 font-medium text-center text-2xl"
            />
            {errors.quantity && (
              <p className="text-sm text-red-500 font-medium flex items-center space-x-1 arabic-text">
                <AlertTriangle className="h-4 w-4" />
                <span>{errors.quantity.message}</span>
              </p>
            )}
          </div>
          
          {/* Completion Status */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
            <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div className={isRTL ? 'text-right' : ''}>
                <span className="font-bold text-green-900 arabic-text">{t('completed')}</span>
                <p className="text-sm text-green-700 arabic-text">ضع علامة إذا تم إنجاز المهمة بالكامل</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                {...register('completed')}
                type="checkbox"
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-600"></div>
            </label>
          </div>
          
          {/* Notes */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-orange-800 arabic-text">
              {t('notes')}
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full p-4 bg-white/70 border-2 border-orange-200 rounded-2xl focus:border-red-500 focus:bg-white transition-all duration-300 text-orange-900 resize-none arabic-text"
              placeholder="ملاحظات اختيارية حول العمل..."
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full caftan-gradient text-white py-4 px-6 rounded-2xl font-bold text-lg hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-500/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            <div className={`flex items-center justify-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <Crown className="h-5 w-5" />
              <span className="arabic-text">{t('submit')}</span>
            </div>
          </button>
        </form>
      </div>
    </div>
  )
}

export default LogWork
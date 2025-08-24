import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../../shared/store/authStore';
import { CheckCircle, AlertTriangle, Package, Crown, Clock, User, Calendar, Scissors, Shirt } from 'lucide-react';
import { useAddWorkLog } from '../hooks/useLogWork';
import { PRODUCTS, TASKS } from '../constants/logwork.constants';
import { WorkForm } from '../types/logwork.types';

const workSchema = z.object({
  product: z.string().min(1, 'Product is required'),
  product_id: z.string().optional(),
  task: z.string().min(1, 'Task is required'),
  quantity: z.number().min(1, 'Quantity must be positive'),
  completed: z.boolean(),
  notes: z.string().optional()
});

const LogWorkForm: React.FC = () => {
  const { user } = useAuthStore();
  const addWorkLog = useAddWorkLog();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
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
  });
  
  const watchedTask = watch('task');
  const watchedProduct = watch('product');
  
  const onSubmit = async (data: WorkForm) => {
    try {
      console.log('Form data:', data);
      console.log('User:', user);
      
      if (!user?.id || !user?.name) {
        throw new Error('User information is missing');
      }

      // Show loading state
      const loadingDiv = document.createElement('div');
      loadingDiv.id = 'loading-message';
      loadingDiv.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 animate-bounce';
      loadingDiv.textContent = t('workLogging.submitting');
      document.body.appendChild(loadingDiv);

      const result = await addWorkLog.mutateAsync({
        worker_id: user.id,
        worker_name: user.name,
        product: data.product,
        product_id: data.product_id,
        task: data.task,
        quantity: data.quantity,
        completed: data.completed,
        notes: data.notes
      });

      console.log('Submission result:', result);

      // Remove loading message
      document.getElementById('loading-message')?.remove();

      // Show success message
      const successDiv = document.createElement('div');
      successDiv.id = 'success-message';
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 animate-bounce';
      successDiv.textContent = t('workLogging.workLoggedSuccess');
      document.body.appendChild(successDiv);

      // Remove success message after 3 seconds
      setTimeout(() => {
        document.getElementById('success-message')?.remove();
      }, 3000);

      // Reset form
      reset();
    } catch (error: any) {
      console.error('Error submitting work log:', error);
      
      // Remove loading message if it exists
      document.getElementById('loading-message')?.remove();

      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.id = 'error-message';
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50';
      errorDiv.textContent = `${t('messages.error.workLogFailed')}: ${error.message || t('messages.error.unknownError')}`;
      document.body.appendChild(errorDiv);

      // Remove error message after 5 seconds
      setTimeout(() => {
        document.getElementById('error-message')?.remove();
      }, 5000);
    }
  };

  if (addWorkLog.isPending) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-orange-200/30">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-600 font-medium text-sm">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-orange-200/30">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl mb-4 relative overflow-hidden shadow-lg">
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            {t('navigation.logWork')}
          </h1>
          <p className="text-orange-700 font-medium">
            {t('workLogging.dailyWorkLog')}
          </p>
        </div>
        
        {/* Worker Info Card */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50/50 rounded-2xl p-6 mb-8 border border-orange-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-sm font-semibold text-orange-600">{t('workLogging.worker')}</p>
                <p className="font-bold text-orange-900">{user?.name}</p>
              </div>
            </div>
            <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-sm font-semibold text-orange-600">{t('common.date')}</p>
                <p className="font-bold text-orange-900">{new Date().toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US')}</p>
              </div>
            </div>
            <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-sm font-semibold text-orange-600">{t('common.time')}</p>
                <p className="font-bold text-orange-900">{new Date().toLocaleTimeString(i18n.language === 'ar' ? 'ar-SA' : 'en-US')}</p>
              </div>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-orange-800">
              {t('workLogging.selectProduct')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PRODUCTS.map((product) => (
                <label key={product.value} className="cursor-pointer">
                  <input
                    {...register('product')}
                    type="radio"
                    value={product.value}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    watchedProduct === product.value
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-transparent shadow-lg scale-105'
                      : 'bg-white/70 border-orange-200 hover:border-orange-300 hover:bg-white'
                  }`}>
                    <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <span className="text-2xl">{product.icon}</span>
                      <span className="font-semibold">{t(`products.${product.value}`)}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.product && (
              <p className="text-sm text-red-500 font-medium flex items-center space-x-1">
                <AlertTriangle className="h-4 w-4" />
                <span>{t('validation.required')}</span>
              </p>
            )}
          </div>
          
          {/* Product ID */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-orange-800">
              {t('workLogging.productId')}
            </label>
            <input
              {...register('product_id')}
              type="text"
              className="w-full p-4 bg-white/70 border-2 border-orange-200 rounded-2xl focus:border-red-500 focus:bg-white transition-all duration-300 text-orange-900 font-medium"
              placeholder={t('workLogging.productId')}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          
          {/* Task Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-orange-800">
              {t('workLogging.selectTask')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TASKS.map((task) => (
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
                      <span className="font-semibold">{t(`tasks.${task.value}`)}</span>
                    </div>
                    <p className={`text-xs opacity-80 ${isRTL ? 'text-right' : ''}`}>
                      {t(`tasks.${task.value}Desc`)}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            {errors.task && (
              <p className="text-sm text-red-500 font-medium flex items-center space-x-1">
                <AlertTriangle className="h-4 w-4" />
                <span>{t('validation.required')}</span>
              </p>
            )}
          </div>
          
          {/* Quantity */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-orange-800">
              {t('workLogging.quantity')}
            </label>
            <input
              {...register('quantity', { valueAsNumber: true })}
              type="number"
              min="1"
              className="w-full p-4 bg-white/70 border-2 border-orange-200 rounded-2xl focus:border-red-500 focus:bg-white transition-all duration-300 text-orange-900 font-medium text-center text-2xl"
            />
            {errors.quantity && (
              <p className="text-sm text-red-500 font-medium flex items-center space-x-1">
                <AlertTriangle className="h-4 w-4" />
                <span>{t('validation.positiveNumber')}</span>
              </p>
            )}
          </div>
          
          {/* Completion Status */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
            <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div className={isRTL ? 'text-right' : ''}>
                <span className="font-bold text-green-900">{t('workLogging.completed')}</span>
                <p className="text-sm text-green-700">{t('workLogging.markAsCompleted')}</p>
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
            <label className="block text-sm font-bold text-orange-800">
              {t('workLogging.notes')}
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full p-4 bg-white/70 border-2 border-orange-200 rounded-2xl focus:border-red-500 focus:bg-white transition-all duration-300 text-orange-900 resize-none"
              placeholder={t('workLogging.optionalNotes')}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={addWorkLog.isPending}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-500/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addWorkLog.isPending ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>{t('workLogging.submitting')}</span>
              </div>
            ) : (
              <div className={`flex items-center justify-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Crown className="h-5 w-5" />
                <span>{t('workLogging.submitWork')}</span>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogWorkForm;
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
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
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
  const watchedQuantity = watch('quantity');
  
  const addWorkLog = useAddWorkLog();

  const onSubmit = async (data: WorkForm) => {
    try {
      // Show loading state
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 animate-pulse arabic-text';
      loadingDiv.textContent = t('loggingWork') || 'Logging work...';
      document.body.appendChild(loadingDiv);

      // Submit to database
      await addWorkLog.mutateAsync({
        worker_id: user?.id || '',
        worker_name: user?.name || '',
        product: data.product,
        task: data.task,
        quantity: data.quantity,
        notes: data.notes
      });

      // Remove loading and show success
      document.body.removeChild(loadingDiv);
      
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 animate-bounce arabic-text';
      successDiv.textContent = t('workLoggedSuccess');
      document.body.appendChild(successDiv);
      setTimeout(() => document.body.removeChild(successDiv), 3000);
      
      reset();
    } catch (error) {
      // Remove loading and show error
      const loadingDiv = document.querySelector('.fixed.top-4.right-4.bg-blue-500');
      if (loadingDiv) document.body.removeChild(loadingDiv);
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 animate-bounce arabic-text';
      errorDiv.textContent = t('workLogError') || 'Error logging work';
      document.body.appendChild(errorDiv);
      setTimeout(() => document.body.removeChild(errorDiv), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full mr-3">
              <Scissors className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 arabic-text">
              {t('logWork')}
            </h1>
          </div>
          <p className="text-slate-600 arabic-text">
            {t('logWorkDescription')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
          {/* Product Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3 arabic-text">
              {t('selectProduct')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {PRODUCTS.map((product) => (
                <label
                  key={product.value}
                  className={`relative cursor-pointer group ${
                    watchedProduct === product.value ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <input
                    type="radio"
                    value={product.value}
                    {...register('product')}
                    className="sr-only"
                  />
                  <div className="p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-200 text-center group-hover:scale-105">
                    <div className="text-2xl mb-2">{product.icon}</div>
                    <div className="text-sm font-medium text-slate-700 arabic-text">
                      {product.label}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.product && (
              <p className="text-red-500 text-sm mt-2 arabic-text">
                {errors.product.message}
              </p>
            )}
          </div>

          {/* Task Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3 arabic-text">
              {t('selectTask')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TASKS.map((task) => (
                <label
                  key={task.value}
                  className={`relative cursor-pointer group ${
                    watchedTask === task.value ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <input
                    type="radio"
                    value={task.value}
                    {...register('task')}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-200 text-center group-hover:scale-105 bg-gradient-to-br ${task.color} bg-opacity-10`}>
                    <div className="text-2xl mb-2">{task.icon}</div>
                    <div className="text-sm font-bold text-slate-700 mb-1 arabic-text">
                      {t(task.label)}
                    </div>
                    <div className="text-xs text-slate-600 arabic-text">
                      {task.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.task && (
              <p className="text-red-500 text-sm mt-2 arabic-text">
                {errors.task.message}
              </p>
            )}
          </div>

          {/* Quantity and Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 arabic-text">
                {t('quantity')}
              </label>
              <input
                type="number"
                min="1"
                {...register('quantity', { valueAsNumber: true })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-2 arabic-text">
                  {errors.quantity.message}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 arabic-text">
                {t('notes')} ({t('optional')})
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors resize-none"
                placeholder={t('addNotes')}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={addWorkLog.isPending}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed arabic-text"
            >
              {addWorkLog.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {t('loggingWork')}
                </div>
              ) : (
                <>
                  <CheckCircle className="inline w-5 h-5 mr-2" />
                  {t('logWork')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogWorkForm;
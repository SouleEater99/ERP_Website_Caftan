import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Minus, Package, TrendingUp, AlertCircle } from 'lucide-react';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  type: 'add' | 'consume';
  materialName: string;
  currentStock: number;
  unit: string;
  isRTL: boolean;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  materialName,
  currentStock,
  unit,
  isRTL
}) => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numQuantity = Number(quantity);
    
    if (!quantity || isNaN(numQuantity) || numQuantity <= 0) {
      setError(t('inventory.enterValidQuantity'));
      return;
    }

    if (type === 'consume' && numQuantity > currentStock) {
      setError(t('inventory.insufficientStock'));
      return;
    }

    onConfirm(numQuantity);
    onClose();
    setQuantity('');
    setError('');
  };

  const handleClose = () => {
    onClose();
    setQuantity('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-3xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100 border border-white/20">
        {/* Enhanced Header with Pattern */}
        <div className={`bg-gradient-to-r ${type === 'add' ? 'from-emerald-600 via-green-600 to-emerald-700' : 'from-red-600 via-red-700 to-red-800'} px-8 py-8 relative overflow-hidden rounded-t-3xl`}>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10"></div>
          <div className="absolute inset-0 cold-pattern opacity-20"></div>
          <div className="relative flex items-center justify-between">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-5' : 'space-x-5'}`}>
              <div className="w-16 h-16 bg-white/25 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/40 shadow-xl">
                {type === 'add' ? (
                  <Plus className="w-8 h-8 text-white" />
                ) : (
                  <Minus className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-white font-bold text-2xl">
                  {type === 'add' ? t('inventory.addStock') : t('inventory.consumeStock')}
                </h2>
                <p className="text-white/90 text-base mt-2 leading-relaxed">
                  {type === 'add' ? t('inventory.addStockDescription') : t('inventory.consumeStockDescription')}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Enhanced Material Info Card */}
            <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 rounded-2xl border border-slate-200/50 shadow-lg">
              <div className={`flex items-center space-x-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <span className="text-slate-600 text-sm block mb-1">{t('inventory.material')}</span>
                  <span className="font-bold text-slate-800 text-lg">{materialName}</span>
                </div>
              </div>
              <div className={`mt-4 flex items-center justify-between p-4 bg-white/60 rounded-xl border border-slate-200/30 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-slate-600 font-medium">{t('inventory.currentStock')}:</span>
                </div>
                <span className="font-bold text-2xl text-slate-800">{currentStock} <span className="text-sm text-slate-500">{unit}</span></span>
              </div>
            </div>

            {/* Enhanced Quantity Input */}
            <div className="space-y-3">
              <label className={`block text-sm font-semibold text-slate-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('inventory.quantity')} ({unit})
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setError('');
                  }}
                  min="0"
                  step="0.01"
                  className={`w-full px-6 py-4 border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg font-medium ${error ? 'border-red-500 focus:ring-red-500/20' : 'hover:border-slate-400'}`}
                  placeholder={type === 'add' ? t('inventory.enterQuantityToAdd') : t('inventory.enterQuantityToConsume')}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                {error && (
                  <div className="mt-3 flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className={`flex space-x-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-2xl hover:from-slate-200 hover:to-slate-300 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 border border-slate-300/50"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className={`flex-1 px-6 py-4 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl ${
                  type === 'add' 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 hover:shadow-emerald-500/30' 
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-red-500/30'
                }`}
              >
                {type === 'add' ? t('inventory.addStock') : t('inventory.consumeStock')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


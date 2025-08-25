import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Minus, Package } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className={`bg-gradient-to-r ${type === 'add' ? 'from-green-600 via-emerald-600 to-green-700' : 'from-red-600 via-red-700 to-red-800'} px-6 py-6 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10"></div>
          <div className="relative flex items-center justify-between">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                {type === 'add' ? (
                  <Plus className="w-6 h-6 text-white" />
                ) : (
                  <Minus className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-white font-bold text-xl">
                  {type === 'add' ? t('inventory.addStock') : t('inventory.consumeStock')}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  {type === 'add' ? t('inventory.addStockDescription') : t('inventory.consumeStockDescription')}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Material Info */}
            <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200/50">
              <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <span className="text-slate-600 text-xs block">{t('inventory.material')}</span>
                  <span className="font-semibold text-slate-800">{materialName}</span>
                </div>
              </div>
              <div className={`mt-3 flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-slate-600">{t('inventory.currentStock')}:</span>
                <span className="font-semibold text-slate-800">{currentStock} {unit}</span>
              </div>
            </div>

            {/* Quantity Input */}
            <div>
              <label className={`block text-sm font-medium text-slate-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('inventory.quantity')} ({unit})
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setError('');
                }}
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${error ? 'border-red-500' : ''}`}
                placeholder={type === 'add' ? t('inventory.enterQuantityToAdd') : t('inventory.enterQuantityToConsume')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className={`flex space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className={`flex-1 px-4 py-3 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                  type === 'add' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:shadow-green-500/25' 
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl hover:shadow-red-500/25'
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

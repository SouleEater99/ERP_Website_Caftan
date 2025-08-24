import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAddLocation } from '../hooks/useManagement';
import { COUNTRIES } from '../constants/management.constants';
import { LocationFormData } from '../types/management.types';
import { 
  MapPin, 
  X, 
  Save, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const addLocation = useAddLocation();
  const isRTL = i18n.language === 'ar';
  
  const [formData, setFormData] = useState<LocationFormData>({
    name: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    country: 'UAE'
  });
  const [errors, setErrors] = useState<Partial<LocationFormData>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Partial<LocationFormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await addLocation.mutateAsync(formData);
      onClose();
      setFormData({ name: '', city: '', address: '', phone: '', email: '', country: 'UAE' });
      setErrors({});
    } catch (error) {
      console.error('Error creating location:', error);
    }
  };

  const handleInputChange = (field: keyof LocationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <MapPin className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">{t('addNewLocation')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className={`block text-sm font-medium text-slate-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
              {t('locationName')}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.name ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder={t('enterLocationName')}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className={`block text-sm font-medium text-slate-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
              {t('country')}
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full p-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {COUNTRIES.map(country => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className={`block text-sm font-medium text-slate-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
              {t('city')}
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.city ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder={t('enterCity')}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.city}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className={`block text-sm font-medium text-slate-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
              {t('address')}
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${
                errors.address ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder={t('enterAddress')}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.address}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className={`block text-sm font-medium text-slate-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
              {t('phone')}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.phone ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder={t('enterPhone')}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className={`block text-sm font-medium text-slate-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
              {t('email')}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.email ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder={t('enterEmail')}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={addLocation.isPending}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {addLocation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-emerald-600 rounded-full animate-spin mr-2"></div>
                  {t('creating')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('createLocation')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationModal;
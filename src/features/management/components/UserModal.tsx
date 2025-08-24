import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAddUser } from '../hooks/useManagement';
import { USER_ROLES } from '../constants/management.constants';
import { UserFormData } from '../types/management.types';
import { 
  UserPlus, 
  X, 
  Save, 
  Eye, 
  EyeOff,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const addUser = useAddUser();
  const isRTL = i18n.language === 'ar';
  
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'worker',
    password: '',
    location: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<UserFormData>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Partial<UserFormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await addUser.mutateAsync(formData);
      onClose();
      setFormData({ name: '', email: '', role: 'worker', password: '', location: '' });
      setErrors({});
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">{t('addNewUser')}</h2>
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
              {t('fullName')}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder={t('enterFullName')}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name}
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
              className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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

          {/* Role */}
          <div>
            <label className={`block text-sm font-medium text-slate-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
              {t('role')}
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="w-full p-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {USER_ROLES.map(role => (
                <option key={role.value} value={role.value}>
                  {role.icon} {t(role.label)}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div>
            <label className={`block text-sm font-medium text-slate-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
              {t('password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full p-3 pr-12 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder={t('enterPassword')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.password}
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
              disabled={addUser.isPending}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {addUser.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  {t('creating')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('createUser')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;

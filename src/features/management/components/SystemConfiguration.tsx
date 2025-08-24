import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SYSTEM_SETTINGS } from '../constants/management.constants';
import { 
  Cog, 
  Save, 
  RefreshCw, 
  Shield, 
  Database, 
  Bell,
  Globe,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const SystemConfiguration: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const [settings, setSettings] = useState(SYSTEM_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: prev[category as keyof typeof prev].map(setting => 
        setting.key === key ? { ...setting, defaultValue: value } : setting
      )
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderSettingInput = (setting: any, category: string) => {
    switch (setting.type) {
      case 'text':
        return (
          <input
            type="text"
            value={setting.defaultValue || ''}
            onChange={(e) => handleSettingChange(category, setting.key, e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        );
      case 'select':
        return (
          <select
            value={setting.defaultValue || setting.options?.[0] || ''}
            onChange={(e) => handleSettingChange(category, setting.key, e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {setting.options?.map((option: string) => (
              <option key={option} value={option}>
                {t(option)}
              </option>
            ))}
          </select>
        );
      case 'toggle':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={setting.defaultChecked || false}
              onChange={(e) => handleSettingChange(category, setting.key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <h3 className="text-xl font-bold text-slate-800">{t('systemConfiguration')}</h3>
            <p className="text-slate-600">{t('configureSystemSettings')}</p>
          </div>
          
          <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  <span>{t('saving')}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  <span>{t('saveChanges')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-green-800">{t('settingsSavedSuccessfully')}</span>
          </div>
        </div>
      )}

      {/* Settings Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800">{t('generalSettings')}</h4>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {settings.general.map((setting) => (
              <div key={setting.key} className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <label className="text-sm font-medium text-slate-700">
                  {t(setting.key)}
                </label>
                <div className="w-48">
                  {renderSettingInput(setting, 'general')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800">{t('securitySettings')}</h4>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {settings.security.map((setting) => (
              <div key={setting.key} className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <label className="text-sm font-medium text-slate-700">
                  {t(setting.key)}
                </label>
                <div className="w-48">
                  {renderSettingInput(setting, 'security')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Backup Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="p-2 bg-violet-100 rounded-lg">
                <Database className="w-5 h-5 text-violet-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800">{t('backupSettings')}</h4>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {settings.backup.map((setting) => (
              <div key={setting.key} className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <label className="text-sm font-medium text-slate-700">
                  {t(setting.key)}
                </label>
                <div className="w-48">
                  {renderSettingInput(setting, 'backup')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Bell className="w-5 h-5 text-indigo-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800">{t('notificationSettings')}</h4>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {settings.notifications.map((setting) => (
              <div key={setting.key} className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <label className="text-sm font-medium text-slate-700">
                  {t(setting.key)}
                </label>
                <div className="w-48">
                  {renderSettingInput(setting, 'notifications')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h4 className="text-lg font-semibold text-slate-800">{t('systemInformation')}</h4>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">v1.0.0</div>
              <div className="text-sm text-slate-600">{t('version')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">99.9%</div>
              <div className="text-sm text-slate-600">{t('uptime')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-violet-600">24/7</div>
              <div className="text-sm text-slate-600">{t('support')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfiguration;

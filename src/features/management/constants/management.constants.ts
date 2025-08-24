export const USER_ROLES = [
  { value: 'worker', icon: '👷' },
  { value: 'supervisor', icon: '👨‍💼' },
  { value: 'admin', icon: '👑' }
];

export const LOCATION_STATUSES = [
  { value: 'active', color: 'text-green-600' },
  { value: 'inactive', color: 'text-red-600' }
];

export const COUNTRIES = [
  { value: 'UAE', label: 'United Arab Emirates' },
  { value: 'KSA', label: 'Saudi Arabia' },
  { value: 'Kuwait', label: 'Kuwait' },
  { value: 'Qatar', label: 'Qatar' },
  { value: 'Bahrain', label: 'Bahrain' },
  { value: 'Oman', label: 'Oman' }
];

export const MANAGEMENT_TABS = [
  { id: 'overview', label: 'overview', icon: 'BarChart3' },
  { id: 'users', label: 'userManagement', icon: 'Users' },
  { id: 'locations', label: 'locationManagement', icon: 'MapPin' },
  { id: 'system', label: 'systemConfiguration', icon: 'Cog' }
];

export const QUICK_ACTIONS = [
  {
    title: 'addNewUser',
    description: 'createUserAccounts',
    icon: 'UserPlus',
    color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    action: 'addUser'
  },
  {
    title: 'addLocation',
    description: 'registerNewFacilities',
    icon: 'Plus',
    color: 'bg-gradient-to-r from-emerald-500 to-teal-600',
    action: 'addLocation'
  },
  {
    title: 'systemBackup',
    description: 'createBackupExport',
    icon: 'Download',
    color: 'bg-gradient-to-r from-violet-500 to-purple-600',
    action: 'backup'
  },
  {
    title: 'viewReports',
    description: 'accessDetailedAnalytics',
    icon: 'BarChart3',
    color: 'bg-gradient-to-r from-amber-500 to-orange-500',
    action: 'reports'
  },
  {
    title: 'securitySettings',
    description: 'managePermissionsSecurity',
    icon: 'Shield',
    color: 'bg-gradient-to-r from-red-500 to-pink-600',
    action: 'security'
  },
  {
    title: 'systemNotifications',
    description: 'configureAlertsNotifications',
    icon: 'Bell',
    color: 'bg-gradient-to-r from-indigo-500 to-blue-600',
    action: 'notifications'
  }
];

export const SYSTEM_SETTINGS = {
  general: [
    { key: 'systemName', type: 'text', defaultValue: 'نظام إنتاج كفتان تاليا' },
    { key: 'defaultLanguage', type: 'select', options: ['english', 'arabic'] },
    { key: 'timezone', type: 'select', options: ['gulfStandardTime', 'gmt'] }
  ],
  security: [
    { key: 'twoFactorAuth', type: 'toggle', defaultChecked: true },
    { key: 'sessionTimeout', type: 'select', options: ['thirtyMinutes', 'oneHour', 'twoHours', 'never'] }
  ],
  backup: [
    { key: 'automaticBackups', type: 'toggle', defaultChecked: true },
    { key: 'backupFrequency', type: 'select', options: ['daily', 'weekly', 'monthly'] }
  ],
  notifications: [
    { key: 'emailNotifications', type: 'toggle', defaultChecked: true },
    { key: 'lowStockAlerts', type: 'toggle', defaultChecked: true }
  ]
};
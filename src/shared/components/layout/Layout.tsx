import React from 'react'
import { useAuthStore } from '../../store/authStore'
import { useTranslation } from 'react-i18next'
import { 
  Home, 
  ClipboardList,
  Package,
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Languages,
  Crown,
  Bell,
  User,
  CheckCircle
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

const CaftanTaliaLogo = ({ size = 'normal' }: { size?: 'small' | 'normal' }) => (
  <div className="flex items-center space-x-3">
    <div className={`${size === 'small' ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-10 h-10 sm:w-12 sm:h-12'} bg-white rounded-2xl flex items-center justify-center pulse-glow relative overflow-hidden shadow-lg border-2 border-slate-200`}>
      <img 
        src="/image.png" 
        alt="Caftan Talia Logo" 
        className={`${size === 'small' ? 'w-6 h-6 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-10 sm:h-10'} object-contain relative z-10`}
        onError={(e) => {
          // Fallback to crown icon if image fails to load
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling.style.display = 'block';
        }}
      />
      <Crown className={`${size === 'small' ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-6 w-6 sm:h-7 sm:w-7'} text-blue-600 relative z-10 hidden`} />
    </div>
    <div>
      <h1 className={`${size === 'small' ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} font-bold primary-gradient-text`}>
        Caftan Talia
      </h1>
      {size === 'normal' && (
        <p className="text-xs text-slate-500 font-medium">Production System</p>
      )}
    </div>
  </div>
)

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore()
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  
  const isRTL = i18n.language === 'ar'
  
  const navigation = [
    { name: t('navigation.dashboard'), href: '/', icon: Home, roles: ['worker', 'supervisor', 'admin'], gradient: 'from-orange-500 to-red-500' },
    { name: t('approvals'), href: '/approvals', icon: CheckCircle, roles: ['supervisor', 'admin'], gradient: 'from-teal-500 to-emerald-500' },
    { name: t('navigation.inventory'), href: '/inventory', icon: Package, roles: ['supervisor', 'admin'], gradient: 'from-blue-500 to-cyan-500' },
    { name: t('navigation.logWork'), href: '/log-work', icon: ClipboardList, roles: ['worker'], gradient: 'from-green-500 to-emerald-500' },
    { name: t('navigation.bom'), href: '/bom', icon: FileText, roles: ['admin'], gradient: 'from-purple-500 to-pink-500' },
    { name: t('navigation.payroll'), href: '/payroll', icon: DollarSign, roles: ['supervisor', 'admin'], gradient: 'from-yellow-500 to-orange-500' },
    { name: t('navigation.reports'), href: '/reports', icon: BarChart3, roles: ['supervisor', 'admin'], gradient: 'from-indigo-500 to-purple-500' },
    { name: t('navigation.management'), href: '/management', icon: Settings, roles: ['admin'], gradient: 'from-slate-500 to-gray-500' }
  ]
  
  const filteredNavigation = navigation.filter(item => 
    user && item.roles.includes(user.role)
  )
  
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')
  }
  
  const NavItem = ({ item, mobile = false }: { item: any, mobile?: boolean }) => {
    const isActive = location.pathname === item.href
    
    return (
      <Link
        to={item.href}
        className={`group relative flex items-center px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg transform scale-105'
            : 'text-orange-700 hover:text-orange-900 hover:bg-white/60'
        } ${mobile ? 'mb-2' : 'mb-1'} ${isRTL ? 'flex-row-reverse' : ''}`}
        onClick={() => mobile && setSidebarOpen(false)}
      >
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${isRTL ? 'ml-3' : 'mr-3'} transition-all duration-300 ${
          isActive 
            ? 'bg-white/20 text-white' 
            : 'bg-orange-100 text-orange-600 group-hover:bg-white group-hover:text-orange-700'
        }`}>
          <item.icon className="h-5 w-5" />
        </div>
        <span className="font-semibold arabic-text">{item.name}</span>
        {isActive && (
          <div className={`absolute ${isRTL ? 'left-2' : 'right-2'} w-2 h-2 bg-white rounded-full animate-pulse`}></div>
        )}
      </Link>
    )
  }
  
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 calm-pattern ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <nav className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} z-50 h-full w-72 sm:w-80 glass-card`}>
            <div className="flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 border-b border-slate-200/20">
              <CaftanTaliaLogo size="small" />
              <button 
                onClick={() => setSidebarOpen(false)} 
                className="p-2 rounded-xl hover:bg-white/70 transition-colors"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-2">
              {filteredNavigation.map((item) => (
                <NavItem key={item.name} item={item} mobile />
              ))}
            </div>
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <nav className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 xl:w-80 lg:flex-col ${isRTL ? 'lg:right-0' : 'lg:left-0'}`}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto glass-card m-4 rounded-3xl border-2 border-slate-200/30">
          <div className="flex h-16 xl:h-20 shrink-0 items-center px-4 xl:px-6 border-b border-slate-200/30">
            <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-2xl flex items-center justify-center pulse-glow relative overflow-hidden shadow-lg border-2 border-slate-200">
                <img 
                  src="/image.png" 
                  alt="Caftan Talia Logo" 
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain relative z-10"
                  onError={(e) => {
                    // Fallback to crown icon if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'block';
                  }}
                />
                <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 relative z-10 hidden" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold primary-gradient-text">
                  {t('authentication.appName')}
                </h1>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">{t('authentication.appSubtitle')}</p>
              </div>
            </div>
          </div>
          
          <nav className="flex flex-1 flex-col px-4 xl:px-6">
            <ul className="flex flex-1 flex-col gap-y-2">
              <li>
                <div className="space-y-1">
                  {filteredNavigation.map((item) => (
                    <NavItem key={item.name} item={item} />
                  ))}
                </div>
              </li>
              
              <li className="mt-auto pb-4 xl:pb-6 space-y-2">
                <button
                  onClick={toggleLanguage}
                  className={`flex w-full items-center px-3 xl:px-4 py-2 xl:py-3 rounded-2xl font-medium text-slate-600 hover:text-slate-800 hover:bg-white/70 transition-all duration-300 group ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex items-center justify-center w-8 xl:w-10 h-8 xl:h-10 rounded-xl ${isRTL ? 'ml-2 xl:ml-3' : 'mr-2 xl:mr-3'} bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-slate-700 transition-all duration-300`}>
                    <Languages className="h-5 w-5" />
                  </div>
                  <span className="font-semibold responsive-text">
                    {i18n.language === 'en' ? t('management.arabic') : t('management.english')}
                  </span>
                </button>
                
                <button
                  onClick={logout}
                  className={`flex w-full items-center px-3 xl:px-4 py-2 xl:py-3 rounded-2xl font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300 group ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex items-center justify-center w-8 xl:w-10 h-8 xl:h-10 rounded-xl ${isRTL ? 'ml-2 xl:ml-3' : 'mr-2 xl:mr-3'} bg-slate-100 text-slate-600 group-hover:bg-red-100 group-hover:text-red-600 transition-all duration-300`}>
                    <LogOut className="h-5 w-5" />
                  </div>
                  <span className="font-semibold responsive-text">{t('dashboard.logout')}</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </nav>

      {/* Header */}
      <div className={isRTL ? 'lg:pr-72 xl:pr-80' : 'lg:pl-72 xl:pl-80'}>
        <div className="sticky top-0 z-40 flex h-16 sm:h-20 shrink-0 items-center gap-x-4 glass-card mx-2 sm:mx-4 mt-2 sm:mt-4 rounded-2xl px-4 sm:px-6 shadow-lg border-2 border-slate-200/30">
          <button
            type="button"
            className="p-2 text-slate-600 lg:hidden rounded-xl hover:bg-white/70 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className={`flex flex-1 items-center ${isRTL ? 'justify-start' : 'justify-between'}`}>
              <div className={`flex items-center space-x-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className="responsive-subheading font-bold text-slate-800">
                  {t('dashboard.welcomeBack')}, <span className="primary-gradient-text">{user?.name}</span>
                </div>
              </div>
              
              <div className={`flex items-center gap-x-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button className="p-2 text-slate-600 hover:text-slate-800 rounded-xl hover:bg-white/70 transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></div>
                </button>
                
                <div className={`hidden sm:flex items-center space-x-3 bg-white/70 rounded-2xl px-3 xl:px-4 py-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className="w-6 h-6 xl:w-8 xl:h-8 primary-gradient rounded-xl flex items-center justify-center">
                    <User className="h-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs xl:text-sm font-bold text-slate-800">{user?.name}</div>
                    <div className="text-xs font-medium text-slate-600 uppercase tracking-wider">
                      {user?.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="py-8">
          <div className={`px-4 sm:px-6 lg:px-8 ${isRTL ? 'lg:pr-4 xl:lg:pr-8' : 'lg:pl-4 xl:lg:pl-8'}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
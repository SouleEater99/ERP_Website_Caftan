import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ar',
    debug: false,
    
    resources: {
      ar: {
        translation: {
          // Navigation
          dashboard: 'لوحة التحكم',
          logWork: 'تسجيل العمل',
          inventory: 'المخزون',
          bom: 'قائمة المواد',
          payroll: 'كشف الراتب',
          reports: 'التقارير',
          reportsAnalytics: 'التقارير والتحليلات',
          comprehensiveInsights: 'رؤى شاملة لأداء الإنتاج ومقاييس الأداء',
          totalProduction: 'إجمالي الإنتاج',
          activeWorkers: 'العمال النشطون',
          revenue: 'الإيرادات',
          efficiency: 'الكفاءة',
          productionOverview: 'نظرة عامة على الإنتاج',
          workerPerformance: 'أداء العمال',
          materialUsage: 'استخدام المواد',
          financialSummary: 'الملخص المالي',
          productionTrends: 'اتجاهات الإنتاج',
          lastSixMonths: 'آخر 6 أشهر',
          viewDetails: 'عرض التفاصيل',
          materialUsageDistribution: 'توزيع استخدام المواد',
          currentMonth: 'الشهر الحالي',
          revenueTrends: 'اتجاهات الإيرادات',
          monthlyRevenue: 'الإيرادات الشهرية',
          quickStats: 'إحصائيات سريعة',
          todaysTasks: 'مهام اليوم',
          completionRate: 'معدل الإنجاز',
          recentActivities: 'الأنشطة الأخيرة',
          productionCompleted: 'تم إنجاز الإنتاج',
          qualityCheck: 'فحص الجودة',
          materialRestocked: 'تم تجديد المواد',
          exportReports: 'تصدير التقارير',
          exportAsPDF: 'تصدير كـ PDF',
          exportAsExcel: 'تصدير كـ Excel',
          exportAsCSV: 'تصدير كـ CSV',
          refresh: 'تحديث',
          export: 'تصدير',
          daily: 'يومي',
          weekly: 'أسبوعي',
          monthly: 'شهري',
          yearly: 'سنوي',
          settings: 'الإعدادات',
          logout: 'تسجيل الخروج',
          
          // Authentication
          login: 'تسجيل الدخول',
          email: 'البريد الإلكتروني',
          password: 'كلمة المرور',
          forgotPassword: 'نسيت كلمة المرور؟',
          backToLogin: 'العودة لتسجيل الدخول',
          welcome: 'مرحباً بك في كفتان تاليا',
          appName: 'كفتان تاليا',
          appSubtitle: 'نظام إدارة الإنتاج المتطور',
          
          // Work Logging
          selectProduct: 'اختر المنتج',
          productId: 'رقم المنتج (اختياري)',
          selectTask: 'اختر المهمة',
          quantity: 'الكمية',
          completed: 'تم الإنجاز',
          notes: 'ملاحظات',
          submit: 'تسجيل العمل',
          workLoggedSuccess: 'تم تسجيل العمل بنجاح',
          
          // Tasks
          cutting: 'القص',
          sewing: 'الخياطة',
          finishing: 'التشطيب',
          embroidery: 'التطريز',
          
          // Dashboard
          todayProduction: 'إنتاج اليوم',
          weeklyProduction: 'الإنتاج الأسبوعي',
          pendingPayments: 'المدفوعات المعلقة',
          lowStockAlerts: 'تنبيهات نفاد المخزون',
          totalWorkers: 'إجمالي العمال',
          activeOrders: 'الطلبات النشطة',
          completedTasks: 'المهام المكتملة',
          pendingApprovals: 'الموافقات المعلقة',
          totalEarnings: 'إجمالي الأرباح',
          
          // Inventory
          material: 'المادة',
          currentStock: 'المخزون الحالي',
          unit: 'الوحدة',
          reorderLevel: 'مستوى إعادة الطلب',
          lastUpdated: 'آخر تحديث',
          addStock: 'إضافة مخزون',
          
          // BOM
          product: 'المنتج',
          qtyPerUnit: 'الكمية لكل وحدة',
          wastePercent: 'نسبة الفقد %',
          deductAtStage: 'خصم في مرحلة',
          addBOM: 'إضافة مادة',
          
          // Payroll
          worker: 'العامل',
          period: 'الفترة',
          paymentSchedule: 'جدول الدفع',
          allSchedules: 'جميع الجداول',
          biWeekly: 'كل أسبوعين',
          quarterly: 'ربع سنوي',
          earnings: 'الأرباح',
          status: 'الحالة',
          paid: 'مدفوع',
          pending: 'معلق',
          
          // Management
          management: 'الإدارة',
          managementPanel: 'لوحة الإدارة',
          centralizedControl: 'لوحة تحكم مركزية لإدارة النظام',
          overview: 'نظرة عامة',
          userManagement: 'إدارة المستخدمين',
          locationManagement: 'إدارة المواقع',
          systemConfiguration: 'تكوين النظام',
          totalUsers: 'إجمالي المستخدمين',
          locations: 'المواقع',
          acrossAllLocations: 'عبر جميع المواقع',
          quickActions: 'إجراءات سريعة',
          addNewUser: 'إضافة مستخدم جديد',
          createUserAccounts: 'إنشاء حسابات المستخدمين وتعيين الأدوار',
          addLocation: 'إضافة موقع',
          registerNewFacilities: 'تسجيل مرافق إنتاج جديدة',
          systemBackup: 'نسخ احتياطي للنظام',
          createBackupExport: 'إنشاء نسخة احتياطية وتصدير البيانات',
          viewReports: 'عرض التقارير',
          accessDetailedAnalytics: 'الوصول إلى التحليلات والتقارير التفصيلية',
          securitySettings: 'إعدادات الأمان',
          managePermissionsSecurity: 'إدارة الأذونات والأمان',
          systemNotifications: 'إشعارات النظام',
          configureAlertsNotifications: 'تكوين التنبيهات والإشعارات',
          addUser: 'إضافة مستخدم',
          fullName: 'الاسم الكامل',
          enterFullName: 'أدخل الاسم الكامل',
          emailAddress: 'عنوان البريد الإلكتروني',
          enterEmailAddress: 'أدخل عنوان البريد الإلكتروني',
          role: 'الدور',
          selectRole: 'اختر الدور',
          admin: 'مدير',
          supervisor: 'مشرف',
          selectLocation: 'اختر الموقع',
          locationName: 'اسم الموقع',
          enterLocationName: 'أدخل اسم الموقع',
          city: 'المدينة',
          enterCity: 'أدخل المدينة',
          address: 'العنوان',
          enterFullAddress: 'أدخل العنوان الكامل',
          phone: 'الهاتف',
          enterPhoneNumber: 'أدخل رقم الهاتف',
          enterEmail: 'أدخل البريد الإلكتروني',
          searchUsers: 'البحث عن المستخدمين',
          allRoles: 'جميع الأدوار',
          allStatus: 'جميع الحالات',
          user: 'المستخدم',
          location: 'الموقع',
          lastActive: 'آخر نشاط',
          generalSettings: 'الإعدادات العامة',
          systemName: 'اسم النظام',
          defaultLanguage: 'اللغة الافتراضية',
          english: 'الإنجليزية',
          arabic: 'العربية',
          timezone: 'المنطقة الزمنية',
          gulfStandardTime: 'التوقيت القياسي للخليج',
          gmt: 'توقيت غرينتش',
          twoFactorAuth: 'المصادقة الثنائية',
          require2FA: 'طلب المصادقة الثنائية لحسابات المدير',
          sessionTimeout: 'انتهاء مهلة الجلسة',
          autoLogoutInactivity: 'تسجيل خروج تلقائي بعد عدم النشاط',
          thirtyMinutes: '30 دقيقة',
          oneHour: 'ساعة واحدة',
          twoHours: 'ساعتان',
          never: 'أبداً',
          backupRecovery: 'النسخ الاحتياطي والاستعادة',
          automaticBackups: 'النسخ الاحتياطية التلقائية',
          lastBackup: 'آخر نسخة احتياطية: منذ ساعتين',
          backupNow: 'نسخ احتياطي الآن',
          backupFrequency: 'تكرار النسخ الاحتياطي',
          notifications: 'الإشعارات',
          emailNotifications: 'إشعارات البريد الإلكتروني',
          systemAlertsReports: 'تنبيهات النظام والتقارير',
          inventoryThresholdWarnings: 'تحذيرات عتبة المخزون',
          saveChanges: 'حفظ التغييرات',
          
          // Common
          actions: 'الإجراءات',
          edit: 'تعديل',
          delete: 'حذف',
          save: 'حفظ',
          cancel: 'إلغاء',
          loading: 'جاري التحميل...',
          error: 'خطأ',
          success: 'نجح',
          confirm: 'تأكيد',
          
          // Validation
          required: 'هذا الحقل مطلوب',
          positiveNumber: 'يجب أن يكون رقم موجب',
          invalidEmail: 'عنوان بريد إلكتروني غير صحيح',
          
          // Products (Arabic names)
          caftan: 'كفتان',
          jalabiya: 'جلابية',
          thobe: 'ثوب',
          abaya: 'عباية',
          dress: 'فستان',

          // New Payment Schedule Translations
          workerPaymentSchedules: 'جداول دفع العمال',
          paymentDay: 'يوم الدفع',
          nextPayment: 'الدفع التالي',
          lastPayment: 'آخر دفع',
          dueForPayment: 'مستحق للدفع',

          // New payroll generation keys
          payrollGenerated: 'تم إنشاء كشف الرواتب لـ {success} من أصل {total} عامل',
          errorGeneratingPayroll: 'خطأ في إنشاء كشف الرواتب',
          noWorkersDueForPayment: 'لا يوجد عمال مستحقون للدفع حالياً',
          generatingPayroll: 'جاري إنشاء كشف الرواتب...',
          generatePayrollForDueWorkers: 'إنشاء كشف الرواتب للعمال المستحقين',

          // New payroll period keys
          periodAlreadyExists: 'الفترة "{period}" موجودة بالفعل',
          newPeriodCreated: 'تم إنشاء فترة جديدة: {period}',
          errorCreatingPeriod: 'خطأ في إنشاء الفترة الجديدة',
          creatingPeriod: 'جاري إنشاء الفترة الجديدة...',
          createNewPeriod: 'إنشاء فترة جديدة (الحالية: {current})',
        }
      },
      en: {
        translation: {
          // Navigation
          dashboard: 'Dashboard',
          logWork: 'Log Work',
          inventory: 'Inventory',
          bom: 'Bill of Materials',
          payroll: 'Payroll',
          reports: 'Reports',
          settings: 'Settings',
          logout: 'Logout',
          
          // Authentication
          login: 'Login',
          email: 'Email',
          password: 'Password',
          forgotPassword: 'Forgot Password?',
          backToLogin: 'Back to Login',
          welcome: 'Welcome back',
          appName: 'Caftan Talia',
          appSubtitle: 'Advanced Production System',
          
          // Work Logging
          selectProduct: 'Select Product',
          productId: 'Product ID (Optional)',
          selectTask: 'Select Task',
          quantity: 'Quantity',
          completed: 'Mark as Completed',
          notes: 'Notes',
          submit: 'Submit Work',
          workLoggedSuccess: 'Work logged successfully',
          
          // Tasks
          cutting: 'Cutting',
          sewing: 'Sewing',
          finishing: 'Finishing',
          embroidery: 'Embroidery',
          
          // Dashboard
          todayProduction: "Today's Production",
          weeklyProduction: 'Weekly Production',
          pendingPayments: 'Pending Payments',
          lowStockAlerts: 'Low Stock Alerts',
          totalWorkers: 'Total Workers',
          activeOrders: 'Active Orders',
          completedTasks: 'Completed Tasks',
          pendingApprovals: 'Pending Approvals',
          totalEarnings: 'Total Earnings',
          efficiency: 'Efficiency',
          
          // Inventory
          material: 'Material',
          currentStock: 'Current Stock',
          unit: 'Unit',
          reorderLevel: 'Reorder Level',
          lastUpdated: 'Last Updated',
          addStock: 'Add Stock',
          
          // BOM
          product: 'Product',
          qtyPerUnit: 'Quantity per Unit',
          wastePercent: 'Waste %',
          deductAtStage: 'Deduct at Stage',
          addBOM: 'Add BOM Entry',
          
          // Payroll
          worker: 'Worker',
          period: 'Period',
          paymentSchedule: 'Payment Schedule',
          allSchedules: 'All Schedules',
          biWeekly: 'Bi-Weekly',
          quarterly: 'Quarterly',
          daily: 'Daily',
          weekly: 'Weekly',
          monthly: 'Monthly',
          earnings: 'Earnings',
          status: 'Status',
          paid: 'Paid',
          pending: 'Pending',

          // Common
          actions: 'Actions',
          edit: 'Edit',
          delete: 'Delete',
          save: 'Save',
          cancel: 'Cancel',
          loading: 'Loading...',
          error: 'Error',
          success: 'Success',
          confirm: 'Confirm',
          recentActivities: 'Recent Activities',
          
          // Validation
          required: 'This field is required',
          positiveNumber: 'Must be a positive number',
          invalidEmail: 'Invalid email address',
          
          // Products
          caftan: 'Caftan',
          jalabiya: 'Jalabiya',
          thobe: 'Thobe',
          abaya: 'Abaya',
          dress: 'Dress',

          // New Payment Schedule Translations
          workerPaymentSchedules: 'Worker Payment Schedules',
          paymentDay: 'Payment Day',
          nextPayment: 'Next Payment',
          lastPayment: 'Last Payment',
          dueForPayment: 'Due for Payment',

          // New payroll generation keys
          payrollGenerated: 'Payroll generated for {success} out of {total} workers',
          errorGeneratingPayroll: 'Error generating payroll',
          noWorkersDueForPayment: 'No workers are due for payment currently',
          generatingPayroll: 'Generating payroll...',
          generatePayrollForDueWorkers: 'Generate Payroll for Due Workers',

          // New payroll period keys
          periodAlreadyExists: 'Period "{period}" already exists',
          newPeriodCreated: 'New period created: {period}',
          errorCreatingPeriod: 'Error creating new period',
          creatingPeriod: 'Creating new period...',
          createNewPeriod: 'Create New Period (Current: {current})',
        }
      }
    },
    
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
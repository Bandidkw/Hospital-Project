// src/router/index.ts
import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from 'vue-toastification';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // Routes สำหรับข้อมูลโรงพยาบาล (About)
    { path: '/history', name: 'history', component: () => import('@/views/about/HistoryView.vue') },
    { path: '/vision', name: 'vision', component: () => import('@/views/about/VisionView.vue') },
    { path: '/organization', name: 'organization', component: () => import('@/views/about/OrganizationView.vue') },
    { path: '/personnel', name: 'personnel', component: () => import('@/views/about/PersonnelView.vue') },

    // Routes สำหรับบริการ (Services)
    { path: '/outpatient', name: 'outpatient', component: () => import('@/views/services/OutpatientView.vue') },
    { path: '/inpatient', name: 'inpatient', component: () => import('@/views/services/InpatientView.vue') },
    { path: '/emergency', name: 'emergency', component: () => import('@/views/services/EmergencyView.vue') },

    // Routes อื่นๆ
    { path: '/news', name: 'news', component: () => import('@/views/NewsView.vue') },
    { path: '/contact', name: 'contact', component: () => import('@/views/ContactView.vue') },
    { path: '/ita-documents-public', name: 'ita-documents-public', component: () => import('@/views/ita/ItaPublicView.vue') },
    // ใน router/index.ts
    { path: '/dashboard/ita/topic/:id/edit', name: 'ItaTopicEdit', component: () => import('@/views/dashboard/ItaTopicEditView.vue'),meta: {requiresAuth:true}},

    // **Dashboard และ Nested Routes**
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/staff/DashboardView.vue'), // คอมโพเนนต์หลักของ Dashboard Layout
      // บทบาทที่สามารถเข้าถึง Dashboard หลักได้: user, admin, superadmin
      meta: { requiresAuth: true, roles: ['user', 'admin', 'superadmin'] },
      children: [
        {
          path: '', // /dashboard (หน้าแรกของ Dashboard)
          name: 'dashboard-home',
          component: () => import('../views/dashboard/DashboardHomeView.vue'),
          meta: { requiresAuth: true, roles: ['user', 'admin', 'superadmin'] }
        },
        {
          path: 'news', // /dashboard/news
          name: 'dashboard-news',
          component: () => import('../views/dashboard/DashboardNewsView.vue'),
          meta: { requiresAuth: true, roles: ['admin', 'superadmin'] } // เฉพาะ Admin และ SuperAdmin
        },
        {
          path: 'categories', // /dashboard/categories
          name: 'dashboard-categories',
          component: () => import('../views/dashboard/DashboardCategoriesView.vue'),
          meta: { requiresAuth: true, roles: ['admin', 'superadmin'] } // เฉพาะ Admin และ SuperAdmin
        },
        {
          path: 'ita', // /dashboard/ita
          name: 'dashboard-ita',
          component: () => import('../views/dashboard/ItaDashboardView.vue'),
          meta: { requiresAuth: true, roles: ['user', 'admin', 'superadmin'] } // user, admin, superadmin
        },
        {
          path: 'slides', // /dashboard/slides
          name: 'dashboard-slides',
          component: () => import('../views/dashboard/DashboardSlidesView.vue'),
          meta: { requiresAuth: true, roles: ['admin', 'superadmin'] } // เฉพาะ Admin และ SuperAdmin
        },
        {
          path: 'footer-links', // /dashboard/footer-links
          name: 'dashboard-footer-links',
          component: () => import('../views/dashboard/DashboardFooterLinksView.vue'),
          meta: { requiresAuth: true, roles: ['admin', 'superadmin'] } // เฉพาะ Admin และ SuperAdmin
        },
        {
          path: 'org-structure', // /dashboard/org-structure
          name: 'dashboard-org-structure',
          component: () => import('../views/dashboard/DashboardOrgStructureView.vue'),
          meta: { requiresAuth: true, roles: ['admin', 'superadmin'] } // เฉพาะ Admin และ SuperAdmin
        },
        {
          path: 'media-files', // /dashboard/media-files
          name: 'dashboard-media-files',
          component: () => import('../views/dashboard/DashboardMediaFilesView.vue'),
          meta: { requiresAuth: true, roles: ['superadmin'] } // เฉพาะ SuperAdmin
        },
        {
          path: 'page-images', // /dashboard/page-images
          name: 'dashboard-page-images',
          component: () => import('../views/dashboard/DashboardPageImagesView.vue'),
          meta: { requiresAuth: true, roles: ['superadmin'] } // เฉพาะ SuperAdmin
        },
        {
          path: 'audit-logs', // /dashboard/audit-logs
          name: 'dashboard-audit-logs',
          component: () => import('../views/dashboard/DashboardAuditLogsView.vue'),
          meta: { requiresAuth: true, roles: ['superadmin'] } // เฉพาะ SuperAdmin
        },
        {
          path: 'website-settings', // /dashboard/website-settings
          name: 'dashboard-website-settings',
          component: () => import('../views/dashboard/DashboardWebsiteSettingsView.vue'),
          meta: { requiresAuth: true, roles: ['superadmin'] } // เฉพาะ SuperAdmin
        },
        {
          path: 'reports', // /dashboard/reports
          name: 'dashboard-reports',
          component: () => import('../views/dashboard/DashboardReportsView.vue'),
          meta: { requiresAuth: true, roles: ['admin', 'superadmin'] } // เฉพาะ Admin และ SuperAdmin
        },
        {
          path: 'statistics', // /dashboard/statistics
          name: 'dashboard-statistics',
          component: () => import('../views/dashboard/DashboardStatisticsView.vue'),
          meta: { requiresAuth: true, roles: ['admin', 'superadmin'] } // เฉพาะ Admin และ SuperAdmin
        },
        {
          path: 'profile', // /dashboard/profile
          name: 'dashboard-profile',
          component: () => import('../views/dashboard/DashboardProfileView.vue'),
          meta: { requiresAuth: true, roles: ['user', 'admin', 'superadmin'] } // user, admin, superadmin
        },
        {
          path: 'users', // /dashboard/users
          name: 'dashboard-users',
          component: () => import('../views/dashboard/DashboardUsersView.vue'),
          meta: { requiresAuth: true, roles: ['superadmin'] } // เฉพาะ SuperAdmin
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/LoginModal.vue'), // หรือหน้าที่เป็น Login จริงๆ
    },
    // Routes สำหรับระบบงานภายใน (แยก Login) - ตั้งค่า requiresAuth เป็น false
    {
      path: '/personnel-login',
      name: 'personnel-login',
      component: () => import('@/views/staff/PersonnelLoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/pharmacy-login',
      name: 'pharmacy-login',
      component: () => import('@/views/staff/PharmacyLoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/finance-login',
      name: 'finance-login',
      component: () => import('@/views/staff/FinanceLoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/other-systems-login',
      name: 'other-systems-login',
      component: () => import('@/views/staff/OtherSystemsLoginView.vue'),
      meta: { requiresAuth: false }
    },
  ]
});

// กำหนดตัวแปร loginPages ให้อยู่ในขอบเขตที่เข้าถึงได้
const loginPages = ['login', 'personnel-login', 'pharmacy-login', 'finance-login', 'other-systems-login'];

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next) => {
  const authStore = useAuthStore();
  const toast = useToast();

  // ตรวจสอบว่าผู้ใช้มี Token ใน Local Storage หรือไม่เมื่อโหลดแอปครั้งแรก
  // และยังไม่ได้ Authenticate หรือกำลัง Authenticate อยู่
  if (!authStore.isAuthenticated && !authStore.isAuthenticating && localStorage.getItem('token')) {
    console.log('[Router Guard] User not authenticated, attempting to fetch user from localStorage...');
    await authStore.fetchUser(); // <-- สำคัญมาก: เพิ่ม await ที่นี่
  }

  const isAuthenticated = authStore.getIsAuthenticated; // ใช้ getter ที่เป็น reactive
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth as boolean);
  const requiredRoles = to.meta.roles as string[] | undefined;

  console.log('--- Router Guard Check ---');
  console.log('กำลังนำทางจาก:', from.fullPath, 'ไปยัง:', to.fullPath);
  console.log('ชื่อ Route ปลายทาง:', to.name);
  console.log('Route ต้องการการยืนยันตัวตน (requiresAuth):', requiresAuth);
  console.log('Route ต้องการบทบาท (requiredRoles):', requiredRoles ? requiredRoles.join(', ') : 'None');
  console.log('บทบาทผู้ใช้ปัจจุบัน (authStore.user?.role):', authStore.user?.role || 'None');
  console.log('ผู้ใช้ล็อกอินแล้ว (authStore.isAuthenticated):', isAuthenticated); // ใช้ isAuthenticated ที่ดึงมาจาก getter
  console.log('กำลังตรวจสอบสิทธิ์ (authStore.isAuthenticating):', authStore.isAuthenticating);
  console.log('--------------------------');

  // ถ้าผู้ใช้ไม่ได้ล็อกอิน และกำลังพยายามเข้าถึงหน้า Dashboard หรือหน้า Protected อื่นๆ
  if (!isAuthenticated && requiresAuth) {
    console.log('Guard: เข้าถึงถูกปฏิเสธ. ต้องการการยืนยันตัวตนแต่ยังไม่ได้ล็อกอิน. กำลังนำทางไปหน้า Home.');
    toast.error('กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้านี้');
    next({ name: 'home' }); // นำทางไปหน้า Home (หรือ Login)
  }
  // ถ้าผู้ใช้ล็อกอินแล้ว แต่พยายามเข้าหน้า Login
  else if (isAuthenticated && (to.name === 'login' || loginPages.includes(to.name as string))) {
    console.log('Guard: ผู้ใช้ล็อกอินแล้ว กำลังพยายามเข้าถึงหน้า Login. นำทางไป Dashboard.');
    next({ name: 'dashboard-home' }); // นำทางไป Dashboard แทน
  }
  // จัดการสิทธิ์ตามบทบาท
  else if (isAuthenticated && requiresAuth && requiredRoles && requiredRoles.length > 0) {
    if (authStore.user && requiredRoles.includes(authStore.user.role)) {
      console.log(`Guard: อนุญาต. บทบาทผู้ใช้ '${authStore.user.role}' ตรงกับบทบาทที่ต้องการ.`);
      next();
    } else {
      console.log(`Guard: เข้าถึงถูกปฏิเสธ. บทบาทไม่เพียงพอ. ต้องการ: ${JSON.stringify(requiredRoles)}, บทบาทผู้ใช้: ${authStore.user?.role}`);
      toast.error('คุณไม่มีสิทธิ์เข้าถึงหน้านี้!');
      next({ name: 'home' }); // นำทางกลับไปหน้า Home
    }
  }
  // กรณีอื่นๆ (Public Routes หรือ Protected Routes ที่ผ่านเงื่อนไขแล้ว)
  else {
    console.log('Guard: ดำเนินการต่อ.');
    next();
  }
});

export default router;

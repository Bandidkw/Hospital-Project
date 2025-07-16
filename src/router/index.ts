// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import { useAuthStore } from '@/stores/auth';

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
    { path: '/ita', name: 'ita', component: () => import('@/views/ItaView.vue') },
    { path: '/contact', name: 'contact', component: () => import('@/views/ContactView.vue') },
    {path: '/contact',name: 'contact',component:() => import("@/views/ContactView.vue"),
},

    // **Dashboard และ Nested Routes**
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/staff/DashboardView.vue'),
      meta: { requiresAuth: true, requiredRole: 'admin' }, // กำหนดให้เข้าถึงได้เฉพาะ admin
      children: [
        {
          path: '', // /dashboard
          name: 'dashboard-home',
          component: () => import('../views/dashboard/DashboardHomeView.vue'),
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'news', // /dashboard/news
          name: 'dashboard-news',
          component: () => import('../views/dashboard/DashboardNewsView.vue'),
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'categories', // /dashboard/categories
          name: 'dashboard-categories',
          component: () => import('../views/dashboard/DashboardCategoriesView.vue'), // <--- Component ใหม่
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'ita', // /dashboard/ita
          name: 'dashboard-ita',
          component: () => import('../views/dashboard/DashboardItaView.vue'), // <--- Component ใหม่
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'slides', // /dashboard/slides
          name: 'dashboard-slides',
          component: () => import('../views/dashboard/DashboardSlidesView.vue'), // <--- Component ใหม่
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'footer-links', // /dashboard/footer-links
          name: 'dashboard-footer-links',
          component: () => import('../views/dashboard/DashboardFooterLinksView.vue'), // <--- Component ใหม่
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'org-structure', // /dashboard/org-structure
          name: 'dashboard-org-structure',
          component: () => import('../views/dashboard/DashboardOrgStructureView.vue'), // <--- Component ใหม่
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'media-files', // /dashboard/media-files
          name: 'dashboard-media-files',
          component: () => import('../views/dashboard/DashboardMediaFilesView.vue'), // <--- Component ใหม่
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'page-images', // /dashboard/page-images
          name: 'dashboard-page-images',
          component: () => import('../views/dashboard/DashboardPageImagesView.vue'), // <--- Component ใหม่
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'audit-logs', // /dashboard/audit-logs
          name: 'dashboard-audit-logs',
          component: () => import('../views/dashboard/DashboardAuditLogsView.vue'), // <--- Component ใหม่
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'website-settings', // /dashboard/website-settings
          name: 'dashboard-website-settings',
          component: () => import('../views/dashboard/DashboardWebsiteSettingsView.vue'), // <--- Component ใหม่
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'reports', // /dashboard/reports
          name: 'dashboard-reports',
          component: () => import('../views/dashboard/DashboardReportsView.vue'), // <--- Component ใหม่
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'statistics', // /dashboard/statistics
          name: 'dashboard-statistics',
          component: () => import('../views/dashboard/DashboardStatisticsView.vue'), // <--- Component ใหม่
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'profile', // /dashboard/profile
          name: 'dashboard-profile',
          component: () => import('../views/dashboard/DashboardProfileView.vue'), // <--- Component ใหม่
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'users', // /dashboard/users (เดิมคือ manage_users)
          name: 'dashboard-users',
          component: () => import('../views/dashboard/DashboardUsersView.vue'),
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
      ]
    },

    // Routes อื่นๆ ที่ต้องการ Login (ถ้ามีและยังต้องการแยกหน้า)
    {
      path: '/personnel-login',
      name: 'personnel-login',
      component: () => import('@/views/staff/PersonnelLoginView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/pharmacy-login',
      name: 'pharmacy-login',
      component: () => import('@/views/staff/PharmacyLoginView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/finance-login',
      name: 'finance-login',
      component: () => import('@/views/staff/FinanceLoginView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/other-systems-login',
      name: 'other-systems-login',
      component: () => import('@/views/staff/OtherSystemsLoginView.vue'),
      meta: { requiresAuth: true }
    },
  ]
});

// Global Navigation Guard (เหมือนเดิม)
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      console.log("Access denied. Redirecting to home for login.");
      next('/');
    } else {
      // ตรวจสอบ Role ถ้ามีการกำหนด requiredRole
      if (to.meta.requiredRole && authStore.user?.role !== to.meta.requiredRole) {
        console.log(`Access denied. Insufficient role. Required: ${to.meta.requiredRole}, User role: ${authStore.user?.role}`);
        next('/'); // Redirect ไปหน้าแรกหรือหน้าแจ้งเตือนสิทธิ์ไม่พอ
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;

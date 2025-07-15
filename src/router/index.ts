// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue'; // <--- ต้องใช้ @/views/
import { useAuthStore } from '@/stores/auth'; // <--- ต้องใช้ @/stores/

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // Routes สำหรับข้อมูลโรงพยาบาล (about)
    { path: '/history', name: 'history', component: () => import('@/views/about/HistoryView.vue') },
    { path: '/vision', name: 'vision', component: () => import('@/views/about/VisionView.vue') },
    { path: '/organization', name: 'organization', component: () => import('@/views/about/OrganizationView.vue') },
    { path: '/personnel', name: 'personnel', component: () => import('@/views/about/PersonnelView.vue') },

    // Routes สำหรับบริการ (services)
    { path: '/outpatient', name: 'outpatient', component: () => import('@/views/services/OutpatientView.vue') },
    { path: '/inpatient', name: 'inpatient', component: () => import('@/views/services/InpatientView.vue') },
    { path: '/emergency', name: 'emergency', component: () => import('@/views/services/EmergencyView.vue') },

    // Routes อื่นๆ
    { path: '/news', name: 'news', component: () => import('@/views/NewsView.vue') },
    { path: '/ita', name: 'ita', component: () => import('@/views/ItaView.vue') },
    { path: '/contact', name: 'contact', component: () => import('@/views/ContactView.vue') },

    // **Dashboard และ Nested Routes**
    {
      path: '/dashboard',
      name: 'dashboard',
      // Path การนำเข้าของ DashboardView.vue ที่อยู่ใน src/views/staff/
      component: () => import('@/views/staff/DashboardView.vue'), // <--- ต้องใช้ @/views/staff/
      meta: { requiresAuth: true, requiredRole: 'admin' },
      children: [
        {
          path: '', // Path ว่างเปล่าสำหรับหน้าแรกของ Dashboard (/dashboard)
          name: 'dashboard-home',
          // Path ของ DashboardHomeView.vue ที่อยู่ใน src/views/dashboard/
          component: () => import('@/views/dashboard/DashboardHomeView.vue'), // <--- ต้องใช้ @/views/dashboard/
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'news', // /dashboard/news
          name: 'dashboard-news',
          component: () => import('@/views/dashboard/DashboardNewsView.vue'), // <--- ต้องใช้ @/views/dashboard/
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'hospital-info', // /dashboard/hospital-info
          name: 'dashboard-hospital-info',
          component: () => import('@/views/dashboard/DashboardHospitalInfoView.vue'), // <--- ต้องใช้ @/views/dashboard/
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'services', // /dashboard/services
          name: 'dashboard-services',
          component: () => import('@/views/dashboard/DashboardServicesView.vue'), // <--- ต้องใช้ @/views/dashboard/
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'personnel', // /dashboard/personnel
          name: 'dashboard-personnel',
          component: () => import('@/views/dashboard/DashboardPersonnelView.vue'), // <--- ต้องใช้ @/views/dashboard/
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'equipment', // /dashboard/equipment
          name: 'dashboard-equipment',
          component: () => import('@/views/dashboard/DashboardEquipmentView.vue'), // <--- ต้องใช้ @/views/dashboard/
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        {
          path: 'users', // /dashboard/users (สำหรับจัดการผู้ใช้งานระบบ)
          name: 'dashboard-users',
          component: () => import('@/views/dashboard/DashboardUsersView.vue'), // <--- ต้องใช้ @/views/dashboard/
          meta: { requiresAuth: true, requiredRole: 'admin' }
        },
        // เพิ่มหน้าย่อยอื่นๆ ของ Dashboard ที่นี่
      ]
    },

    // Routes อื่นๆ ในส่วนเจ้าหน้าที่ที่อาจจะยังคงอยู่และต้องการการ Login (ถ้ามี)
    {
      path: '/personnel-login',
      name: 'personnel-login',
      component: () => import('@/views/staff/PersonnelLoginView.vue'), // <--- ต้องใช้ @/views/staff/
      meta: { requiresAuth: true }
    },
    {
      path: '/pharmacy-login',
      name: 'pharmacy-login',
      component: () => import('@/views/staff/PharmacyLoginView.vue'), // <--- ต้องใช้ @/views/staff/
      meta: { requiresAuth: true }
    },
    {
      path: '/finance-login',
      name: 'finance-login',
      component: () => import('@/views/staff/FinanceLoginView.vue'), // <--- ต้องใช้ @/views/staff/
      meta: { requiresAuth: true }
    },
    {
      path: '/other-systems-login',
      name: 'other-systems-login',
      component: () => import('@/views/staff/OtherSystemsLoginView.vue'), // <--- ต้องใช้ @/views/staff/
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
      if (to.meta.requiredRole && authStore.user?.role !== to.meta.requiredRole) {
        console.log(`Access denied. Insufficient role. Required: ${to.meta.requiredRole}, User role: ${authStore.user?.role}`);
        next('/');
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;

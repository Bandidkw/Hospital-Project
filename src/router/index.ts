// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
// import { type RouteLocationNormalized } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // Routes สำหรับข้อมูลโรงพยาบาล (About)
    { path: '/history', name: 'history', component: () => import('@/views/about/HistoryView.vue') },
    { path: '/vision', name: 'vision', component: () => import('@/views/about/VisionView.vue') },
    {
      path: '/organization',
      name: 'organization',
      component: () => import('@/views/about/OrganizationView.vue'),
    },
    {
      path: '/personnel',
      name: 'personnel',
      component: () => import('@/views/about/PersonnelView.vue'),
    },

    // Routes สำหรับบริการ (Services)
    {
      path: '/outpatient',
      name: 'outpatient',
      component: () => import('@/views/services/OutpatientView.vue'),
    },
    {
      path: '/inpatient',
      name: 'inpatient',
      component: () => import('@/views/services/InpatientView.vue'),
    },
    {
      path: '/emergency',
      name: 'emergency',
      component: () => import('@/views/services/EmergencyView.vue'),
    },

    // Routes อื่นๆ
    { path: '/news', name: 'news', component: () => import('@/views/NewsView.vue') },
    { path: '/contact', name: 'contact', component: () => import('@/views/ContactView.vue') },
    {
      path: '/ita-documents-public',
      name: 'ita-documents-public',
      component: () => import('@/views/ita/ItaPublicView.vue'),
    },
    // ใน router/index.ts
    {
      path: '/dashboard/ita/topic/:id/edit',
      name: 'ItaTopicEdit',
      component: () => import('@/views/dashboard/ItaTopicEditView.vue'),
      meta: { requiresAuth: true },
    },

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
          meta: { requiresAuth: true, roles: ['user', 'admin', 'superadmin'] },
        },
        {
          path: 'news', // /dashboard/news
          name: 'dashboard-news',
          component: () => import('../views/dashboard/DashboardNewsView.vue'),
          meta: { requiresAuth: true, roles: ['admin', 'superadmin'] }, // เฉพาะ Admin และ SuperAdmin
        },
        {
          path: 'categories', // /dashboard/categories
          name: 'dashboard-categories',
          component: () => import('../views/dashboard/DashboardCategoriesView.vue'),
          meta: { requiresAuth: true, roles: ['admin', 'superadmin'] }, // เฉพาะ Admin และ SuperAdmin
        },
        {
          path: 'ita', // /dashboard/ita
          name: 'dashboard-ita',
          component: () => import('../views/dashboard/ItaDashboardView.vue'),
          meta: { requiresAuth: true, roles: ['user', 'admin', 'superadmin'] }, // user, admin, superadmin
        },
        {
          path: 'slides', // /dashboard/slides
          name: 'dashboard-slides',
          component: () => import('../views/dashboard/DashboardSlidesView.vue'),
          meta: { requiresAuth: true, roles: ['admin', 'superadmin'] }, // เฉพาะ Admin และ SuperAdmin
        },
        {
          path: 'footer-links', // /dashboard/footer-links
          name: 'dashboard-footer-links',
          component: () => import('../views/dashboard/DashboardFooterLinksView.vue'),
          meta: { requiresAuth: true, roles: ['admin', 'superadmin'] }, // เฉพาะ Admin และ SuperAdmin
        },
        {
          path: 'org-structure', // /dashboard/org-structure
          name: 'dashboard-org-structure',
          component: () => import('../views/dashboard/DashboardOrgStructureView.vue'),
          meta: { requiresAuth: true, roles: ['admin', 'superadmin'] }, // เฉพาะ Admin และ SuperAdmin
        },
        {
          path: 'media-files', // /dashboard/media-files
          name: 'dashboard-media-files',
          component: () => import('../views/dashboard/DashboardMediaFilesView.vue'),
          meta: { requiresAuth: true, roles: ['superadmin'] }, // เฉพาะ SuperAdmin
        },
        {
          path: 'page-images', // /dashboard/page-images
          name: 'dashboard-page-images',
          component: () => import('../views/dashboard/DashboardPageImagesView.vue'),
          meta: { requiresAuth: true, roles: ['superadmin'] }, // เฉพาะ SuperAdmin
        },
        {
          path: 'audit-logs', // /dashboard/audit-logs
          name: 'dashboard-audit-logs',
          component: () => import('../views/dashboard/DashboardAuditLogsView.vue'),
          meta: { requiresAuth: true, roles: ['superadmin'] }, // เฉพาะ SuperAdmin
        },
        {
          path: 'website-settings', // /dashboard/website-settings
          name: 'dashboard-website-settings',
          component: () => import('../views/dashboard/DashboardWebsiteSettingsView.vue'),
          meta: { requiresAuth: true, roles: ['superadmin'] }, // เฉพาะ SuperAdmin
        },
        {
          path: 'reports', // /dashboard/reports
          name: 'dashboard-reports',
          component: () => import('../views/dashboard/DashboardReportsView.vue'),
          meta: { requiresAuth: true, roles: ['admin', 'superadmin'] }, // เฉพาะ Admin และ SuperAdmin
        },
        {
          path: 'statistics', // /dashboard/statistics
          name: 'dashboard-statistics',
          component: () => import('../views/dashboard/DashboardStatisticsView.vue'),
          meta: { requiresAuth: true, roles: ['admin', 'superadmin'] }, // เฉพาะ Admin และ SuperAdmin
        },
        {
          path: 'profile', // /dashboard/profile
          name: 'dashboard-profile',
          component: () => import('../views/dashboard/DashboardProfileView.vue'),
          meta: { requiresAuth: true, roles: ['user', 'admin', 'superadmin'] }, // user, admin, superadmin
        },
        {
          path: 'users', // /dashboard/users
          name: 'dashboard-users',
          component: () => import('../views/dashboard/DashboardUsersView.vue'),
          meta: { requiresAuth: true, roles: ['superadmin'] }, // เฉพาะ SuperAdmin
        },
        {
          // -  path: '/dashboard/ita/year/:yearId/topics', // :yearId คือ parameter
          // -  name: 'ItaTopicList',
          path: 'ita/year/:yearId/topics', // ✅ ทำให้เป็น child จริง ๆ (ไม่ใส่ / นำหน้า)
          name: 'dashboard-ita-topics', // ✅ ชื่อ route ให้ตรงกับที่ลิงก์ใช้
          component: () => import('@/views/dashboard/ita/ItaTopicListView.vue'),
          meta: { requiresAuth: true },
        },
      ],
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
      meta: { requiresAuth: false },
    },
    {
      path: '/pharmacy-login',
      name: 'pharmacy-login',
      component: () => import('@/views/staff/PharmacyLoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/finance-login',
      name: 'finance-login',
      component: () => import('@/views/staff/FinanceLoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/other-systems-login',
      name: 'other-systems-login',
      component: () => import('@/views/staff/OtherSystemsLoginView.vue'),
      meta: { requiresAuth: false },
    },
  ],
})

// กำหนดตัวแปร loginPages ให้อยู่ในขอบเขตที่เข้าถึงได้
const loginPages = [
  'login',
  'personnel-login',
  'pharmacy-login',
  'finance-login',
  'other-systems-login',
]

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const toast = useToast()

  // ส่วน fetchUser ของคุณถูกต้องแล้ว ไม่ต้องแก้ไข
  if (
    !authStore.isAuthenticated &&
    !authStore.isAuthenticating &&
    sessionStorage.getItem('token')
  ) {
    await authStore.fetchUser()
  }

  const isAuthenticated = authStore.getIsAuthenticated
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth as boolean)
  const requiredRoles = to.meta.roles as string[] | undefined

  // --- เพิ่ม Logic ส่วนนี้เข้ามา ---
  const isVipAdmin = authStore.isAdmin || authStore.isSuperAdmin
  const isTryingToLeaveDashboard = !to.path.startsWith('/dashboard')

  // กฎข้อที่ 1: ถ้าเป็น VIP (Admin/SuperAdmin) และพยายามจะออกจากโซน Dashboard
  if (isVipAdmin && isTryingToLeaveDashboard) {
    // console.log('Guard: VIP Admin is trying to leave. Redirecting back to dashboard.')
    // ไม่ต้องไปไหนทั้งนั้น กลับไปที่บ้านของ Dashboard ซะ
    next({ name: 'dashboard-home' })
  }
  // ถ้าไม่เข้ากฎข้อที่ 1 ก็จะมาเช็กกฎข้ออื่นๆ ตามปกติ
  else if (!isAuthenticated && requiresAuth) {
    // console.log('Guard: Access denied. Authentication required. Redirecting to home.')
    toast.error('กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้านี้')
    next({ name: 'home' })
  } else if (isAuthenticated && loginPages.includes(to.name as string)) {
    // console.log(
    //   'Guard: Authenticated user trying to access a login page. Redirecting to dashboard.',
    // )
    next({ name: 'dashboard-home' })
  } else if (isAuthenticated && requiresAuth && requiredRoles && requiredRoles.length > 0) {
    if (authStore.user && requiredRoles.includes(authStore.user.role)) {
      console.log(
        `Guard: Access granted. User role '${authStore.user.role}' matches required roles.`,
      )
      next()
    } else {
      // console.log(
      //   `Guard: Access denied. Insufficient role. Required: ${JSON.stringify(requiredRoles)}, User has: ${authStore.user?.role}`,
      // )
      toast.error('คุณไม่มีสิทธิ์เข้าถึงหน้านี้!')
      next({ name: 'home' })
    }
  } else {
    // console.log('Guard: Proceeding.')
    next()
  }
})

export default router

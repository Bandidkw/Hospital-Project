// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import NewsDetailView from '../views/NewsDetailView.vue'

// ------------------------------------
// Role helpers (ช่วยอ่านง่ายขึ้น)
// ------------------------------------
const ROLES = {
  USER: 'user',
  OPD: 'opd',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
} as const

const ANY_DASHBOARD = [ROLES.USER, ROLES.OPD, ROLES.ADMIN, ROLES.SUPERADMIN]
// const OPD_ONLY = [ROLES.OPD]
const ADMIN_ONLY = [ROLES.ADMIN, ROLES.SUPERADMIN]
const SUPERADMIN_ONLY = [ROLES.SUPERADMIN]
const OPD_SUPERADMIN_ONLY = [ROLES.OPD, ROLES.SUPERADMIN]

// ------------------------------------
// Router
// ------------------------------------
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ---------- Public ----------
    { path: '/', name: 'home', component: HomeView },
    { path: '/history', name: 'history', component: () => import('@/views/about/HistoryView.vue') },
    { path: '/vision', name: 'vision', component: () => import('@/views/about/VisionView.vue') },
    {
      path: '/complaint-form',
      name: 'complaint',
      component: () => import('@/views/ComplaintFormView.vue'),
    },

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
      path: '/status',
      name: 'status',
      component: () => import('@/views/StatusTracker.vue'),
      // component: () => import('@/views/UnderDevelopmentView.vue'),
    },
    {
      path: '/emergency',
      name: 'emergency',
      component: () => import('@/views/services/EmergencyView.vue'),
    },
    {
      path: '/patient-referral',
      name: 'patient-referral',
      component: () => import('@/views/services/PatientReferralView.vue'),
      // component: () => import('@/views/UnderDevelopmentView.vue'),
    },
    {
      path: '/news',
      name: 'public-news',
      component: () => import('@/views/public/NewsView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/news/:id',
      name: 'news-detail',
      component: () => import('@/views/public/NewsDetail.vue'),
    },
    { path: '/contact', name: 'contact', component: () => import('@/views/ContactView.vue') },
    {
      path: '/ita-documents-public',
      name: 'ita-documents-public',
      component: () => import('@/views/ita/ItaPublicView.vue'),
    },
    {
      path: '/news/:id',
      name: 'news-detail',
      component: NewsDetailView,
    },

    // ---------- Dashboard (with Sidebar layout) ----------
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/staff/DashboardView.vue'),
      meta: { requiresAuth: true, roles: ANY_DASHBOARD },
      children: [
        // Home
        {
          path: '',
          name: 'dashboard-home',
          component: () => import('@/views/dashboard/DashboardHomeView.vue'),
          meta: { requiresAuth: true, roles: ANY_DASHBOARD },
        },
        // Content Management
        {
          path: 'news',
          name: 'dashboard-news',
          component: () => import('@/views/dashboard/DashboardNewsView.vue'),
          meta: {
            requiresAuth: true,
            roles: ['admin', 'superadmin'],
          },
        },
        {
          path: 'categories',
          name: 'dashboard-categories',
          // component: () => import('@/views/dashboard/DashboardCategoriesView.vue'),
          component: () => import('@/components/common/UnderDevelopment.vue'),
          meta: { requiresAuth: true, roles: ADMIN_ONLY },
        },
        {
          path: 'ita',
          name: 'dashboard-ita',
          component: () => import('@/views/dashboard/ItaDashboardView.vue'),
          meta: { requiresAuth: true, roles: ANY_DASHBOARD },
        },
        {
          path: 'opd-home',
          name: 'dashboard-opd-home',
          component: () => import('@/views/dashboard/opd/DashboardOpd.vue'), // โหลด Component ที่สร้างขึ้น
          meta: { requiresAuth: true, roles: OPD_SUPERADMIN_ONLY },
        },
        {
          path: 'history-edit',
          name: 'dashboard-history-edit',
          component: () => import('@/views/dashboard/DashboardHistoryEditView.vue'),
          meta: { requiresAuth: true, roles: SUPERADMIN_ONLY },
        },
        {
          path: 'org-structure',
          name: 'dashboard-org-structure',
          component: () => import('@/views/dashboard/DashboardPersonnelView.vue'),
          meta: { requiresAuth: true, roles: ADMIN_ONLY },
        },
        {
          path: 'audit-logs',
          name: 'dashboard-audit-logs',
          // component: () => import('@/views/dashboard/DashboardAuditLogsView.vue'),
          component: () => import('@/components/common/UnderDevelopment.vue'),
          meta: { requiresAuth: true, roles: SUPERADMIN_ONLY },
        },
        {
          path: 'website-settings',
          name: 'dashboard-website-settings',
          component: () => import('@/views/dashboard/DashboardWebsiteSettingsView.vue'),
          meta: { requiresAuth: true, roles: SUPERADMIN_ONLY },
        },
        {
          path: 'website-settings-list',
          name: 'dashboard-website-settings-list',
          component: () => import('@/views/dashboard/DashboardWebsiteSettingsListView.vue'),
          meta: { requiresAuth: true, roles: SUPERADMIN_ONLY },
        },
        // {
        //   path: 'vision-edit',
        //   name: 'dashboard-vision-edit',
        //   component: () => import('@/views/dashboard/DashboardVisionEditView.vue'),
        //   meta: { requiresAuth: true, roles: SUPERADMIN_ONLY },
        // },
        {
          path: 'reports',
          name: 'dashboard-reports',
          // component: () => import('@/views/dashboard/DashboardReportsView.vue'),
          component: () => import('@/components/common/UnderDevelopment.vue'),
          meta: { requiresAuth: true, roles: SUPERADMIN_ONLY },
        },
        {
          path: 'complaints',
          name: 'DashboardComplaints',
          component: () => import('@/views/dashboard/DashboardComplaintView.vue'),
          meta: { requiresAuth: true, roles: SUPERADMIN_ONLY },
        },
        {
          path: 'statistics',
          name: 'dashboard-statistics',
          // component: () => import('@/views/dashboard/DashboardStatisticsView.vue'),
          component: () => import('@/components/common/UnderDevelopment.vue'),
          meta: { requiresAuth: true, roles: SUPERADMIN_ONLY },
        },
        {
          path: 'profile',
          name: 'dashboard-profile',
          component: () => import('@/views/dashboard/DashboardProfileView.vue'),
          meta: { requiresAuth: true, roles: ANY_DASHBOARD },
        },
        {
          path: 'users',
          name: 'dashboard-users',
          component: () => import('@/views/dashboard/DashboardUsersView.vue'),
          meta: { requiresAuth: true, roles: SUPERADMIN_ONLY },
        },
        {
          path: 'ita/year/:yearId/topics',
          name: 'dashboard-ita-topics',
          component: () => import('@/views/dashboard/ita/ItaTopicListView.vue'),
          meta: { requiresAuth: true, roles: ANY_DASHBOARD },
        },
        {
          path: 'ita/topic/:id/edit',
          name: 'ItaTopicEdit',
          component: () => import('@/views/dashboard/ita/ItaTopicEditView.vue'),
          meta: { requiresAuth: true, roles: ANY_DASHBOARD },
        },
      ],
    },

    // ---------- Auth (public) ----------
    { path: '/login', name: 'login', component: () => import('@/components/LoginModal.vue') },
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

// ------------------------------------
// Navigation Guard
// ------------------------------------
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

  // Auto-fetch user if token exists
  if (
    !authStore.isAuthenticated &&
    !authStore.isAuthenticating &&
    sessionStorage.getItem('token')
  ) {
    await authStore.fetchUser()
  }

  const isAuthenticated = authStore.getIsAuthenticated
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth as boolean)
  const requiredRoles = to.meta.roles as string[] | undefined

  // VIP admin guard: ไม่ให้ออกจากโซน /dashboard
  const isVipAdmin = authStore.isOpd || authStore.isAdmin || authStore.isSuperAdmin
  const isTryingToLeaveDashboard = !to.path.startsWith('/dashboard')

  if (isVipAdmin && isTryingToLeaveDashboard) {
    return next({ name: 'dashboard-home' })
  }

  if (!isAuthenticated && requiresAuth) {
    toast.error('กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้านี้')
    return next({ name: 'home' })
  }

  if (isAuthenticated && loginPages.includes(to.name as string)) {
    return next({ name: 'dashboard-home' })
  }

  if (isAuthenticated && requiresAuth && requiredRoles && requiredRoles.length > 0) {
    if (authStore.user && requiredRoles.includes(authStore.user.role)) {
      return next()
    }
    toast.error('คุณไม่มีสิทธิ์เข้าถึงหน้านี้!')
    return next({ name: 'home' })
  }

  return next()
})

export default router

<template>
  <aside class="w-64 bg-gray-800 text-white flex flex-col min-h-screen">
    <div class="p-4 border-b border-gray-700 text-center">
      <h2 class="text-2xl font-bold">Admin Panel</h2>
      <p class="text-sm text-gray-400">
        สวัสดี, {{ authStore.user?.fullName || authStore.user?.username || 'ผู้ใช้งาน' }}
        <span v-if="authStore.user?.role" class="text-xs text-gray-500">
          ({{ authStore.user.role.charAt(0).toUpperCase() + authStore.user.role.slice(1) }})
        </span>
      </p>
    </div>
    <nav class="flex-grow p-4">
      <ul>
        <!-- แดชบอร์ด - ทุกคนเห็นได้ (user, admin, superadmin) -->
        <li class="mb-2">
          <RouterLink
            to="/dashboard"
            class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200"
            active-class="bg-blue-600"
          >
            <i class="fas fa-tachometer-alt mr-3 text-indigo-400"></i>
            <span class="text-gray-300">แดชบอร์ด</span>
          </RouterLink>
        </li>
        <!-- จัดการเนื้อหา - ส่วนหัวข้อ -->
        <!-- แสดงหัวข้อนี้ถ้ามีเมนูย่อยที่ผู้ใช้เห็นได้ในกลุ่มนี้ -->
        <li class="mb-2 mt-4" v-if="authStore.isSuperAdmin">
          <div class="menu-title text-gray-400 text-xs uppercase mb-2 flex items-center">
            <i class="fas fa-folder mr-2"></i> จัดการเนื้อหา
          </div>
        </li>
        <!-- 🟢 ข่าวสาร - เฉพาะ SuperAdmin -->
        <li class="mb-2" v-if="authStore.isSuperAdmin || authStore.isAdmin">
          <RouterLink
            to="/dashboard/news"
            class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200"
            active-class="bg-blue-600"
          >
            <i class="fas fa-newspaper mr-3 text-green-500"></i>
            <span class="text-gray-300">ข่าวสาร</span>
          </RouterLink>
        </li>
        <!-- 🟢 หมวดหมู่ - เฉพาะ SuperAdmin -->
        <!-- <li class="mb-2" v-if="authStore.isSuperAdmin">
          <RouterLink
            to="/dashboard/categories"
            class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200"
            active-class="bg-blue-600"
          >
            <i class="fas fa-tags mr-3 text-yellow-500"></i>
            <span class="text-gray-300">หมวดหมู่</span>
          </RouterLink>
        </li> -->
        <!-- 🟢 ITA - ทุกคนเห็นได้ (user, admin, superadmin) -->
        <li class="mb-2" v-if="authStore.isSuperAdmin || authStore.isAdmin">
          <RouterLink
            to="/dashboard/ita"
            class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200"
            active-class="bg-blue-600"
          >
            <i class="fas fa-file-alt mr-3 text-red-500"></i> <span class="text-gray-300">ITA</span>
          </RouterLink>
        </li>
        <!-- 🟢 หมวดหมู่ - เฉพาะ OPD -->
        <li class="mb-2" v-if="authStore.isSuperAdmin || authStore.isOpd">
          <RouterLink
            to="/dashboard/opd-home"
            class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200"
            active-class="bg-blue-600"
          >
            <i class="fas fa-tags mr-3 text-yellow-500"></i>
            <span class="text-gray-300">ส่งตัวผู้ป่วย</span>
          </RouterLink>
        </li>
        <!-- 🟢 แก้ไขประวัติ รพ. เฉพาะ SuperAdmin -->
        <li class="mb-2" v-if="authStore.isSuperAdmin">
          <RouterLink
            to="/dashboard/history-edit"
            class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200"
            active-class="bg-blue-600"
          >
            <i class="fas fa-file-alt mr-3 text-orange-500"></i>
            <span class="text-gray-300">แก้ไขประวัติ รพ.</span>
          </RouterLink>
        </li>
        <!-- 🟢 แก้ไขวิสัยทัศน์ เฉพาะ SuperAdmin -->
        <!-- <li class="mb-2" v-if="authStore.isSuperAdmin">
          <RouterLink
            to="/dashboard/vision-edit"
            class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200"
            active-class="bg-blue-600"
          >
            <i class="fas fa-lightbulb mr-3 text-indigo-500"></i>
            <span class="text-gray-300">แก้ไขวิสัยทัศน์</span>
          </RouterLink>
        </li> -->
        <!-- 🟢 โครงสร้างองค์กร - เฉพาะ Admin และ SuperAdmin -->
        <li class="mb-2" v-if="authStore.isSuperAdmin || authStore.isAdmin">
          <RouterLink
            to="/dashboard/org-structure"
            class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200"
            active-class="bg-blue-600"
          >
            <i class="fas fa-sitemap mr-3 text-purple-400"></i>
            <span class="text-gray-300">โครงสร้างองค์กร</span>
          </RouterLink>
        </li>

        <!-- 🟢 จัดการระบบ - ส่วนหัวข้อ -->
        <li class="mb-2 mt-4" v-if="authStore.isSuperAdmin">
          <!-- เฉพาะ SuperAdmin -->
          <div class="menu-title text-gray-400 text-xs uppercase mb-2 flex items-center">
            <i class="fas fa-cog mr-2"></i> จัดการระบบ
          </div>
        </li>
        <li class="mb-2" v-if="authStore.isSuperAdmin">
          <RouterLink
            to="/dashboard/audit-logs"
            class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200"
            active-class="bg-blue-600"
          >
            <i class="fas fa-shield-alt mr-3 text-orange-500"></i>
            <span class="text-gray-300">Audit Logs</span>
          </RouterLink>
        </li>
        <!-- 🟢 ตั้งค่าเว็บไซต์ - เฉพาะ SuperAdmin -->
        <li class="mb-2" v-if="authStore.isSuperAdmin">
          <RouterLink
            to="/dashboard/website-settings-list"
            class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200"
            active-class="bg-blue-600"
          >
            <i class="fas fa-sliders-h mr-3 text-teal-500"></i>
            <span class="text-gray-300">ตั้งค่าเว็บไซต์</span>
          </RouterLink>
        </li>
        <!-- 🟢 รายงาน - ส่วนหัวข้อ -->
        <li class="mb-2 mt-4" v-if="authStore.isSuperAdmin">
          <!-- 🟢 เฉพาะ Admin และ SuperAdmin -->
          <div class="menu-title text-gray-400 text-xs uppercase mb-2 flex items-center">
            <i class="fas fa-chart-line mr-2"></i> รายงาน
          </div>
        </li>
        <!-- 🟢 รายงาน - เฉพาะ Admin และ SuperAdmin -->
        <li class="mb-2" v-if="authStore.isSuperAdmin">
          <RouterLink
            to="/dashboard/reports"
            class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200"
            active-class="bg-blue-600"
          >
            <i class="fas fa-chart-line mr-3 text-cyan-500"></i>
            <span class="text-gray-300">รายงาน</span>
          </RouterLink>
        </li>
        <!-- 🟢 ข้อร้องเรียน - เฉพาะ superAdmin -->
        <li class="mb-2" v-if="authStore.isSuperAdmin">
          <RouterLink
            to="/dashboard/complaints"
            class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200"
            active-class="bg-blue-600"
          >
            <i class="fas fa-headset mr-3 text-red-500"></i>
            <span class="text-gray-300">จัดการข้อร้องเรียน</span>
          </RouterLink>
        </li>
        <!-- 🟢 สถิติ - เฉพาะ Admin และ SuperAdmin -->
        <li class="mb-2" v-if="authStore.isSuperAdmin || authStore.isAdmin">
          <RouterLink
            to="/dashboard/statistics"
            class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200"
            active-class="bg-blue-600"
          >
            <i class="fas fa-chart-bar mr-3 text-red-600"></i>
            <span class="text-gray-300">สถิติ</span>
          </RouterLink>
        </li>
        <li class="mb-2 mt-4" v-if="authStore.isSuperAdmin">
          <div class="menu-title text-gray-400 text-xs uppercase mb-2 flex items-center">
            <i class="fas fa-ellipsis-h mr-2"></i> อื่นๆ
          </div>
        </li>
        <!-- 🟢 โปรไฟล์ - ทุกคนเห็นได้ -->
        <li class="mb-2">
          <RouterLink
            to="/dashboard/profile"
            class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200"
            active-class="bg-blue-600"
          >
            <i class="fas fa-user mr-3 text-gray-300"></i>
            <span class="text-gray-300">ข้อมูลส่วนตัว</span>
          </RouterLink>
        </li>
        <!-- 🟢 จัดการผู้ใช้ - เฉพาะ SuperAdmin -->
        <li class="mb-2" v-if="authStore.isSuperAdmin">
          <RouterLink
            to="/dashboard/users"
            class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200"
            active-class="bg-blue-600"
          >
            <i class="fas fa-user-shield mr-3 text-yellow-300"></i>
            <span class="text-gray-300">จัดการผู้ใช้</span>
          </RouterLink>
        </li>
        <!-- 🟢 ดูเว็บไซต์ - ทุกคนเห็นได้ -->
        <li class="mb-2">
          <a
            href="/"
            rel="noopener noreferrer"
            target="_blank"
            class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200"
          >
            <i class="fas fa-globe mr-3 text-green-400"></i>
            <span class="text-gray-300">ดูเว็บไซต์</span>
          </a>
        </li>
      </ul>
    </nav>
    <div class="p-4 border-t border-gray-700">
      <button
        @click="handleLogout"
        class="w-full flex items-center justify-center p-2 rounded-md bg-red-600 hover:bg-red-700 transition duration-200"
      >
        <i class="fas fa-sign-out-alt mr-3"></i>
        <span>ออกจากระบบ</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { watch, onMounted } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

watch(
  () => authStore.isAuthenticated,
  (newVal) => {
    if (!newVal) {
      // console.log('DashboardSidebar: User logged out, redirecting to home.')
      router.push({ name: 'home' })
      toast.info('ออกจากระบบเรียบร้อยแล้ว')
    }
  },
  { immediate: true },
)
onMounted(() => {
  if (!authStore.isAuthenticated) {
    // console.log('DashboardSidebar: On mount, user not authenticated, redirecting to home.')
    router.push({ name: 'home' })
  }
})

const handleLogout = () => {
  console.log('DashboardSidebar: handleLogout called.')
  authStore.logout()
}
</script>

<style scoped>
.menu-title {
  font-weight: bold;
  margin-top: 1rem;
  padding-left: 0.5rem;
}
</style>

<template>
  <aside class="w-64 bg-gray-800 text-white flex flex-col">
    <div class="p-4 border-b border-gray-700 text-center">
      <h2 class="text-2xl font-bold">Admin Panel</h2>
      <p class="text-sm text-gray-400">
        สวัสดี, {{ authStore.user?.username || 'ผู้ใช้งาน' }}
      </p>
    </div>
    <nav class="flex-grow p-4">
      <ul>
        <!-- Dashboard Overview -->
        <li class="mb-2">
          <RouterLink to="/dashboard" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
            <i class="fas fa-tachometer-alt mr-3 text-indigo-400"></i>
            <span class="text-gray-300">แดชบอร์ด</span>
          </RouterLink>
        </li>

        <!-- Content Management -->
        <li class="mb-2 mt-4">
          <div class="menu-title text-gray-400 text-xs uppercase mb-2 flex items-center">
            <i class="fas fa-folder mr-2"></i> จัดการเนื้อหา
          </div>
        </li>
        <li class="mb-2">
          <RouterLink to="/dashboard/news" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
            <i class="fas fa-newspaper mr-3 text-green-500"></i> <span class="text-gray-300">ข่าวสาร</span>
          </RouterLink>
        </li>
        <li class="mb-2">
          <RouterLink to="/dashboard/categories" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
            <i class="fas fa-tags mr-3 text-yellow-500"></i> <span class="text-gray-300">หมวดหมู่</span>
          </RouterLink>
        </li>
        <li class="mb-2">
          <RouterLink to="/dashboard/ita" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
            <i class="fas fa-file-alt mr-3 text-red-500"></i> <span class="text-gray-300">ITA</span>
          </RouterLink>
        </li>
        <li class="mb-2">
          <RouterLink to="/dashboard/slides" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
            <i class="fas fa-images mr-3 text-blue-400"></i> <span class="text-gray-300">สไลด์</span>
          </RouterLink>
        </li>
        <li class="mb-2">
          <RouterLink to="/dashboard/footer-links" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
            <i class="fas fa-link mr-3 text-pink-400"></i> <span class="text-gray-300">ลิงก์ Footer</span>
          </RouterLink>
        </li>
        <li class="mb-2">
          <RouterLink to="/dashboard/org-structure" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
            <i class="fas fa-sitemap mr-3 text-purple-400"></i> <span class="text-gray-300">โครงสร้างองค์กร</span>
          </RouterLink>
        </li>

        <!-- System Management -->
        <li class="mb-2 mt-4">
          <div class="menu-title text-gray-400 text-xs uppercase mb-2 flex items-center">
            <i class="fas fa-cog mr-2"></i> จัดการระบบ
          </div>
        </li>
        <li class="mb-2">
          <RouterLink to="/dashboard/media-files" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
            <i class="fas fa-photo-video mr-3 text-blue-500"></i> <span class="text-gray-300">ไฟล์มีเดีย</span>
          </RouterLink>
        </li>
        <li class="mb-2">
          <RouterLink to="/dashboard/page-images" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
            <i class="fas fa-image mr-3 text-red-400"></i> <span class="text-gray-300">รูปภาพตามหน้า</span>
          </RouterLink>
        </li>
        <!-- Audit Logs และ Website Settings มักจะเป็น Admin-only -->
        <li class="mb-2" v-if="authStore.user?.role === 'admin'">
          <RouterLink to="/dashboard/audit-logs" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
            <i class="fas fa-shield-alt mr-3 text-orange-500"></i> <span class="text-gray-300">Audit Logs</span>
          </RouterLink>
        </li>
        <li class="mb-2" v-if="authStore.user?.role === 'admin'">
          <RouterLink to="/dashboard/website-settings" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
            <i class="fas fa-sliders-h mr-3 text-teal-500"></i> <span class="text-gray-300">ตั้งค่าเว็บไซต์</span>
          </RouterLink>
        </li>

        <!-- Reports -->
        <li class="mb-2 mt-4">
          <div class="menu-title text-gray-400 text-xs uppercase mb-2 flex items-center">
            <i class="fas fa-chart-line mr-2"></i> รายงาน
          </div>
        </li>
        <li class="mb-2">
          <RouterLink to="/dashboard/reports" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
            <i class="fas fa-chart-line mr-3 text-cyan-500"></i> <span class="text-gray-300">รายงาน</span>
          </RouterLink>
        </li>
        <li class="mb-2">
          <RouterLink to="/dashboard/statistics" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
            <i class="fas fa-chart-bar mr-3 text-red-600"></i> <span class="text-gray-300">สถิติ</span>
          </RouterLink>
        </li>

        <!-- Others -->
        <li class="mb-2 mt-4">
          <div class="menu-title text-gray-400 text-xs uppercase mb-2 flex items-center">
            <i class="fas fa-ellipsis-h mr-2"></i> อื่นๆ
          </div>
        </li>
        <li class="mb-2">
          <RouterLink to="/dashboard/profile" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
            <i class="fas fa-user mr-3 text-gray-300"></i> <span class="text-gray-300">โปรไฟล์</span>
          </RouterLink>
        </li>
        <li class="mb-2">
          <!-- ลิงก์ไปหน้าหลักของเว็บไซต์ (เปิดในแท็บใหม่) -->
          <a href="/" rel="noopener noreferrer" target="_blank" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200">
            <i class="fas fa-globe mr-3 text-green-400"></i> <span class="text-gray-300">ดูเว็บไซต์</span>
          </a>
        </li>
        <!-- จัดการผู้ใช้ (Admin-only) -->
        <li class="mb-2" v-if="authStore.user?.role === 'admin'">
          <RouterLink to="/dashboard/users" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
            <i class="fas fa-user-shield mr-3 text-yellow-300"></i> <span class="text-gray-300">จัดการผู้ใช้</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
    <div class="p-4 border-t border-gray-700">
      <button @click="handleLogout" class="w-full flex items-center justify-center p-2 rounded-md bg-red-600 hover:bg-red-700 transition duration-200">
        <i class="fas fa-sign-out-alt mr-3"></i>
        <span>ออกจากระบบ</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Import Pinia Store

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
};
</script>

<style scoped>
/* Custom styles for sidebar titles or active states if needed beyond Tailwind */
.menu-title {
  font-weight: bold;
  margin-top: 1rem;
  padding-left: 0.5rem; /* Adjust as needed */
}
</style>

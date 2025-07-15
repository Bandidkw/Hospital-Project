<!-- src/views/staff/DashboardView.vue -->
<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-800 text-white flex flex-col">
      <div class="p-4 border-b border-gray-700 text-center">
        <h2 class="text-2xl font-bold">Admin Panel</h2>
        <p class="text-sm text-gray-400">
          สวัสดี, {{ authStore.user?.username || 'ผู้ใช้งาน' }}
        </p>
      </div>
      <nav class="flex-grow p-4">
        <ul>
          <li class="mb-2">
            <RouterLink to="/dashboard" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
              <i class="fas fa-tachometer-alt mr-3"></i>
              <span>ภาพรวม</span>
            </RouterLink>
          </li>
          <li class="mb-2">
            <RouterLink to="/dashboard/news" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
              <i class="fas fa-newspaper mr-3"></i>
              <span>จัดการข่าวสาร</span>
            </RouterLink>
          </li>
          <li class="mb-2">
            <RouterLink to="/dashboard/hospital-info" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
              <i class="fas fa-hospital-alt mr-3"></i>
              <span>ข้อมูลโรงพยาบาล</span>
            </RouterLink>
          </li>
          <li class="mb-2">
            <RouterLink to="/dashboard/services" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
              <i class="fas fa-concierge-bell mr-3"></i>
              <span>จัดการบริการ</span>
            </RouterLink>
          </li>
          <li class="mb-2">
            <RouterLink to="/dashboard/personnel" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
              <i class="fas fa-users mr-3"></i>
              <span>จัดการบุคลากร</span>
            </RouterLink>
          </li>
          <li class="mb-2">
            <RouterLink to="/dashboard/equipment" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
              <i class="fas fa-box-open mr-3"></i>
              <span>จัดการครุภัณฑ์</span>
            </RouterLink>
          </li>
          <li class="mb-2">
            <RouterLink to="/dashboard/users" class="flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200" active-class="bg-blue-600">
              <i class="fas fa-user-shield mr-3"></i>
              <span>จัดการผู้ใช้งาน</span>
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

    <!-- Main Content Area -->
    <main class="flex-grow p-6">
      <RouterView /> <!-- เนื้อหาของหน้าย่อยๆ ใน Dashboard จะแสดงตรงนี้ -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
// แก้ไข Path การ Import ของ useAuthStore
import { useAuthStore } from '../../stores/auth'; // <--- แก้ไขตรงนี้: ใช้ ../../ เพื่อย้อนกลับ 2 ระดับจาก src/views/staff/ ไปยัง src/ แล้วเข้า stores/

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
};
</script>

<style scoped>
/* คุณสามารถเพิ่ม CSS เฉพาะ Dashboard layout ได้ที่นี่ */
</style>

<template>
  <div class="flex min-h-screen bg-gray-100">
    <aside class="w-64 bg-gray-800 text-white flex flex-col shrink-0">
      <div class="flex-grow p-4 space-y-2">
        <router-link to="/dashboard/profile" class="block px-4 py-2 rounded-md hover:bg-gray-700">
          <i class="fas fa-user-circle mr-2"></i> โปรไฟล์
        </router-link>
        <router-link to="/dashboard/news" class="block px-4 py-2 rounded-md hover:bg-gray-700">
          <i class="fas fa-newspaper mr-2"></i> จัดการข่าวสาร
        </router-link>
      </div>

      <div class="p-4">
        <button class="bg-red-600 text-white w-full py-2 px-4 rounded-md hover:bg-red-700">
          <i class="fas fa-sign-out-alt mr-2"></i>
          ออกจากระบบ
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col">
      <main class="flex-grow p-6">
        <router-view />
      </main>

      <footer class="text-center py-4 bg-white border-t text-sm text-gray-600">
        © 2025 Hospital Website. All rights reserved.
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
// สามารถเพิ่ม Logic ของ Sidebar ที่นี่ได้ เช่น การเรียกใช้ authStore
</script>

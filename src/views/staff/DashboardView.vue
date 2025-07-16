<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar Component -->
    <DashboardSidebar />

    <!-- Main Content Area -->
    <main class="flex-grow p-6">
      <RouterView /> <!-- เนื้อหาของหน้าย่อยๆ ใน Dashboard จะแสดงตรงนี้ -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
// ตรวจสอบให้แน่ใจว่า Path ตรงนี้เป็น @/components/dashboard/DashboardSidebar.vue
// ไม่มี @components/ หรือการพิมพ์ผิดอื่นๆ
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue';

// No other script logic needed here, as the sidebar handles logout and RouterView handles content
</script>

<style scoped>
/* You can add specific styles for Dashboard layout here if needed */
</style>

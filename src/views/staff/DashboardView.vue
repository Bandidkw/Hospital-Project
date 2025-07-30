<!-- DashboardView.vue -->
<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar Component -->
    <DashboardSidebar />

    <!-- Main Content Area -->
    <main class="flex-grow p-6">
      <RouterView />
      <!-- เนื้อหาของหน้าย่อยๆ ใน Dashboard จะแสดงตรงนี้ -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import DashboardSidebar from '../../components/dashboard/DashboardSidebar.vue'
</script>

<style scoped></style>

<!-- DashboardView.vue -->
<template>
  <div class="flex min-h-screen bg-gray-100">
    <DashboardSidebar />
    <main class="flex-grow p-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue'
</script>

<style scoped></style>

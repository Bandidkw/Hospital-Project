<template>
  <div class="dashboard-opd">
    <h2 class="text-xl font-bold mb-4">
      <i class="fas fa-stethoscope mr-2"></i> Dashboard ผู้ป่วยนอก
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6"></div>

    <div class="card shadow-lg">
      <div class="card-header bg-primary text-white p-3 rounded-t-lg">
        <h3 class="text-lg font-semibold">
          <i class="fas fa-list-ul mr-2"></i> รายการคิวรออนุมัติและรอเรียก
        </h3>
      </div>
      <div class="card-body p-4">
        <OpdQueueList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OpdQueueList from '@/views/dashboard/opd/OpdQueueList.vue' // ปรับ Path ให้ถูกต้องตามโครงสร้าง

// ----------------------------------------------------
// ข้อมูลและ State
// ----------------------------------------------------

// ----------------------------------------------------
// ฟังก์ชันดึงข้อมูล (ถูกลบออกไป)
// ----------------------------------------------------

// ----------------------------------------------------
// Lifecycle Hooks
// ----------------------------------------------------
</script>

<style scoped>
.dashboard-opd {
  padding: 20px;
}
.card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
}
</style>

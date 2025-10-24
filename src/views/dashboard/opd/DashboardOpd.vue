<template>
  <div class="opd-dashboard p-6">
    <h1 class="text-3xl font-bold mb-6 text-indigo-700">OPD Dashboard (แผนกผู้ป่วยนอก)</h1>
    <p class="text-gray-600 mb-8">ข้อมูลสรุปและเครื่องมือสำคัญสำหรับเจ้าหน้าที่แผนกผู้ป่วยนอก</p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
        <p class="text-sm font-medium text-gray-500">คิวปัจจุบัน</p>
        <p class="text-4xl font-extrabold text-blue-600 mt-1">{{ opdStats.queueCount }}</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
        <p class="text-sm font-medium text-gray-500">ผลตรวจรออนุมัติ</p>
        <p class="text-4xl font-extrabold text-yellow-600 mt-1">{{ opdStats.pendingResults }}</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
        <p class="text-sm font-medium text-gray-500">นัดหมายทั้งหมดวันนี้</p>
        <p class="text-4xl font-extrabold text-green-600 mt-1">{{ opdStats.todayAppointments }}</p>
      </div>
    </div>

    <div class="mt-8">
      <h2 class="text-2xl font-semibold mb-4 border-b pb-2">เครื่องมือด่วน</h2>
      <div class="flex space-x-4">
        <button
          class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded transition"
        >
          จัดการคิว
        </button>
        <button
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition"
        >
          ค้นหา HN
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const opdStats = ref({
  queueCount: 45,
  pendingResults: 12,
  todayAppointments: 68,
})
const fetchOpdData = () => {
  console.log('Fetching specific OPD dashboard data...')
  setTimeout(() => {
    opdStats.value.queueCount = Math.floor(Math.random() * 50) + 10
  }, 1000)
}

fetchOpdData()
</script>

<style scoped>
/* สามารถเพิ่ม CSS เฉพาะส่วนนี้ได้ */
.opd-dashboard {
  /* เช่น การตั้งค่าพื้นหลัง */
}
</style>

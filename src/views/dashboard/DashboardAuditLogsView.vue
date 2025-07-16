<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-shield-alt mr-3 text-orange-500"></i> ประวัติการเข้าใช้งาน (Audit Logs)
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้แสดงบันทึกกิจกรรมต่างๆ ของผู้ใช้งานในระบบ เพื่อวัตถุประสงค์ในการตรวจสอบ.</p>

    <!-- Filter and Search Options -->
    <div class="bg-gray-50 p-6 rounded-lg shadow-inner mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label for="filterUser" class="block text-sm font-medium text-gray-700">ผู้ใช้งาน:</label>
        <input type="text" id="filterUser" v-model="filters.user" placeholder="ค้นหาด้วยชื่อผู้ใช้" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
      </div>
      <div>
        <label for="filterAction" class="block text-sm font-medium text-gray-700">กิจกรรม:</label>
        <input type="text" id="filterAction" v-model="filters.action" placeholder="ค้นหาด้วยกิจกรรม" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
      </div>
      <div>
        <label for="filterDate" class="block text-sm font-medium text-gray-700">วันที่:</label>
        <input type="date" id="filterDate" v-model="filters.date" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
      </div>
    </div>

    <!-- Audit Logs Table -->
    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รายการบันทึกกิจกรรม</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">#</th>
              <th class="py-3 px-6 text-left">วันที่และเวลา</th>
              <th class="py-3 px-6 text-left">ผู้ใช้งาน</th>
              <th class="py-3 px-6 text-left">กิจกรรม</th>
              <th class="py-3 px-6 text-left">รายละเอียด</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-for="(log, index) in filteredLogs" :key="log.id" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="py-3 px-6 text-left">{{ index + 1 }}</td>
              <td class="py-3 px-6 text-left">{{ log.timestamp }}</td>
              <td class="py-3 px-6 text-left">{{ log.user }}</td>
              <td class="py-3 px-6 text-left">{{ log.action }}</td>
              <td class="py-3 px-6 text-left truncate max-w-xs">{{ log.details }}</td>
            </tr>
            <tr v-if="filteredLogs.length === 0">
              <td colspan="5" class="py-8 text-center text-gray-500">ไม่พบบันทึกกิจกรรมที่ตรงกับเงื่อนไข.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination (placeholder) -->
      <div class="mt-6 text-center">
        <button class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">โหลดเพิ่มเติม</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

const auditLogs = ref<AuditLog[]>([
  { id: 1, timestamp: '2024-07-16 10:00:00', user: 'admin', action: 'Login', details: 'ผู้ดูแลระบบเข้าสู่ระบบสำเร็จ' },
  { id: 2, timestamp: '2024-07-16 10:05:30', user: 'admin', action: 'Add News', details: 'เพิ่มข่าวสาร: "การฉีดวัคซีนไข้หวัดใหญ่"' },
  { id: 3, timestamp: '2024-07-16 10:15:00', user: 'editor', action: 'Edit ITA Doc', details: 'แก้ไขเอกสาร ITA: "รายงานประจำไตรมาส 1/2568"' },
  { id: 4, timestamp: '2024-07-15 15:30:00', user: 'admin', action: 'Delete Slide', details: 'ลบภาพสไลด์: "สไลด์โปรโมท"' },
  { id: 5, timestamp: '2024-07-14 09:00:00', user: 'user_reg', action: 'User Registration', details: 'ผู้ใช้งานใหม่ลงทะเบียน: "สมชาย ใจดี"' },
]);

const filters = ref({
  user: '',
  action: '',
  date: '',
});

const filteredLogs = computed(() => {
  return auditLogs.value.filter(log => {
    const matchesUser = log.user.toLowerCase().includes(filters.value.user.toLowerCase());
    const matchesAction = log.action.toLowerCase().includes(filters.value.action.toLowerCase());
    const matchesDate = filters.value.date ? log.timestamp.startsWith(filters.value.date) : true;
    return matchesUser && matchesAction && matchesDate;
  });
});

// In a real application, you would fetch logs from an API
// onMounted(() => {
//   fetchAuditLogs();
// });
// const fetchAuditLogs = async () => { /* ... */ };
</script>

<style scoped>
/* Specific styles for this page */
</style>

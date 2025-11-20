<template>
  <div class="p-6 bg-white rounded-lg shadow-2xl border border-gray-100">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-shield-alt mr-3 text-orange-600"></i> ประวัติการเข้าใช้งาน (Audit Logs)
    </h2>
    <p class="text-gray-700 mb-6">
      หน้านี้แสดงบันทึกกิจกรรมที่มีความสำคัญด้านการเข้าถึงและความปลอดภัยของระบบ Dashboard เท่านั้น.
    </p>

    <div class="bg-gray-50 p-6 rounded-xl shadow-inner mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label for="filterUser" class="block text-sm font-medium text-gray-700"
          >ผู้กระทำ (User ID):</label
        >
        <input
          type="text"
          id="filterUser"
          v-model="filters.user"
          placeholder="ค้นหาด้วยรหัสผู้ใช้"
          class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 transition-colors"
        />
      </div>
      <div>
        <label for="filterAction" class="block text-sm font-medium text-gray-700">กิจกรรม:</label>
        <input
          type="text"
          id="filterAction"
          v-model="filters.action"
          placeholder="ค้นหาด้วยกิจกรรม"
          class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 transition-colors"
        />
      </div>
      <div>
        <label for="filterDate" class="block text-sm font-medium text-gray-700">วันที่:</label>
        <input
          type="date"
          id="filterDate"
          v-model="filters.date"
          class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:border-blue-500 focus:ring-blue-500 transition-colors"
        />
      </div>
    </div>

    <div class="card bg-white p-0 rounded-xl shadow-xl">
      <h3 class="text-xl font-semibold text-gray-800 p-4 border-b">
        รายการบันทึกกิจกรรมด้านความปลอดภัย
      </h3>

      <div v-if="isLoading" class="p-12 text-center text-gray-500">
        <i class="fas fa-spinner fa-spin text-2xl mr-2"></i> กำลังโหลดบันทึกกิจกรรม...
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full bg-white rounded-lg">
          <thead>
            <tr class="bg-blue-50 text-left text-blue-800 uppercase text-xs tracking-wider">
              <th class="py-3 px-6 text-left">วันที่และเวลา</th>
              <th class="py-3 px-6 text-left">ผู้กระทำ (Actor)</th>
              <th class="py-3 px-6 text-left">Target/Resource</th>
              <th class="py-3 px-6 text-left">กิจกรรม</th>
              <th class="py-3 px-6 text-left">รายละเอียด</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 text-sm font-medium">
            <tr
              v-for="log in filteredLogs"
              :key="log.id"
              class="border-b border-gray-100 hover:bg-yellow-50/50 transition-colors"
            >
              <td class="py-3 px-6 text-left whitespace-nowrap">
                {{ new Date(log.timestamp).toLocaleString('th-TH') }}
              </td>

              <td class="py-3 px-6 text-left font-mono text-xs">{{ log.userId }}</td>

              <td class="py-3 px-6 text-left font-semibold">
                {{ log.targetId || '-' }}
              </td>

              <td class="py-3 px-6 text-left">
                <span
                  :class="{
                    'bg-green-100 text-green-700':
                      log.action === AuditAction.USER_LOGIN && log.details.status === 'SUCCESS',
                    'bg-red-100 text-red-700':
                      log.action === AuditAction.ACCESS_DENIED ||
                      (log.action === AuditAction.USER_LOGIN && log.details.status !== 'SUCCESS'),
                    'bg-blue-100 text-blue-700': log.action === AuditAction.USER_LOGOUT,
                    'bg-orange-100 text-orange-700': log.action === AuditAction.PASSWORD_RESET,
                  }"
                  class="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                >
                  {{ ACTION_DISPLAY_MAP[log.action] }}
                </span>
              </td>

              <td
                class="py-3 px-6 text-left max-w-lg truncate text-xs text-gray-500"
                :title="formatLogDetails(log)"
              >
                {{ formatLogDetails(log) }}
              </td>
            </tr>
            <tr v-if="filteredLogs.length === 0 && !isLoading">
              <td colspan="5" class="py-8 text-center text-gray-500">
                ไม่พบบันทึกกิจกรรมที่ตรงกับเงื่อนไข.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-6 p-4 text-center border-t border-gray-100">
        <button
          class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          โหลดเพิ่มเติม
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// --- IMPORT TYPES AND SERVICES ---
import { type AuditLog, AuditAction, ACTION_DISPLAY_MAP } from '@/types/auditlog'
import { fetchAuditLogs, formatLogDetails } from '@/services/auditlogService'

// --- STATE ---
const auditLogs = ref<AuditLog[]>([])
const isLoading = ref(true)

const filters = ref({
  user: '',
  action: '',
  date: '',
})

// --- LIFECYCLE HOOKS ---
onMounted(async () => {
  // ใช้งาน Service Layer ที่สร้างขึ้น
  const logs = await fetchAuditLogs()
  auditLogs.value = logs
  isLoading.value = false
})

// --- COMPUTED PROPERTY (Filtering) ---
const filteredLogs = computed(() => {
  return auditLogs.value.filter((log) => {
    // 1. กรองด้วย User ID
    const matchesUser = log.userId.toLowerCase().includes(filters.value.user.toLowerCase())

    // 2. กรองด้วย Action (กรองจาก Display Text)
    // ต้องตรวจสอบว่า action มีอยู่ใน map ก่อนเพื่อป้องกัน error ในกรณีที่ log action ไม่ถูกต้อง
    const actionDisplayText = ACTION_DISPLAY_MAP[log.action] || log.action
    const matchesAction = actionDisplayText
      .toLowerCase()
      .includes(filters.value.action.toLowerCase())

    // 3. กรองด้วย Date
    const matchesDate = filters.value.date ? log.timestamp.startsWith(filters.value.date) : true

    return matchesUser && matchesAction && matchesDate
  })
})
</script>

<style scoped>
/* Specific styles for this page */
</style>

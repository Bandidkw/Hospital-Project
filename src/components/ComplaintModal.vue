<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-8 rounded-lg shadow-2xl max-w-xl w-full">
        <h3 class="text-2xl font-bold text-blue-700 mb-4 flex items-center">
          <i class="fas fa-comment-dots mr-3"></i> รายละเอียดข้อร้องเรียน
        </h3>

        <div class="border p-4 rounded-md bg-gray-50 mb-6">
          <p class="mb-2"><span class="font-semibold">หัวข้อ:</span> {{ complaint.subject }}</p>
          <p class="mb-2 text-sm text-gray-500">
            <span class="font-semibold">ผู้แจ้ง:</span>
            {{ complaint.reporterName || 'ไม่ระบุ' }} (ติดต่อ:
            {{ complaint.reporterContact || '-' }})
          </p>
          <p class="mb-4 text-xs text-gray-500">
            <span class="font-semibold">วันที่แจ้ง:</span> {{ formatDateTime(complaint.createdAt) }}
          </p>

          <div class="p-3 border rounded-md bg-white">
            <p class="font-semibold text-gray-700 mb-1">รายละเอียด:</p>
            <p class="whitespace-pre-wrap text-gray-800">{{ complaint.detail }}</p>
          </div>
        </div>

        <div class="flex items-center space-x-4 mb-8">
          <label for="status" class="font-semibold text-gray-700">อัปเดตสถานะ:</label>
          <select
            id="status"
            v-model="newStatus"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="PENDING">รอดำเนินการ</option>
            <option value="IN_PROGRESS">อยู่ระหว่างตรวจสอบ</option>
            <option value="RESOLVED">แก้ไขแล้ว</option>
          </select>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="updateStatusHandler"
            :disabled="newStatus === complaint.status"
            class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300 disabled:opacity-50"
          >
            <i class="fas fa-check mr-2"></i> บันทึกสถานะ
          </button>
          <button
            @click="$emit('close')"
            class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300"
          >
            <i class="fas fa-times mr-2"></i> ปิด
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

type ComplaintStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED'

interface ComplaintItem {
  id: string
  subject: string
  detail: string
  reporterName?: string
  reporterContact?: string
  status: ComplaintStatus
  createdAt: string
}

const props = defineProps<{
  show: boolean
  complaint: ComplaintItem
}>()

const emit = defineEmits(['close', 'updateStatus'])

const newStatus = ref<ComplaintStatus>(props.complaint.status)

// 💡 Sync newStatus เมื่อ complaint prop เปลี่ยน
watch(
  () => props.complaint.status,
  (newVal) => {
    newStatus.value = newVal
  },
)

const formatDateTime = (isoString: string): string => {
  // ใช้ฟังก์ชันเดียวกับใน DashboardComplaintView
  const date = new Date(isoString)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const updateStatusHandler = () => {
  if (newStatus.value !== props.complaint.status) {
    // 🟢 ส่ง Event กลับไปพร้อมสถานะใหม่
    emit('updateStatus', newStatus.value)
  }
}
</script>

<style scoped>
/* Modal styles here if needed */
</style>

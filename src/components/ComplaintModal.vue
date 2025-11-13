<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-8 rounded-lg shadow-2xl max-w-xl w-full">
        <h3 class="text-2xl font-bold text-red-700 mb-4 flex items-center">
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

        <div v-if="complaint.adminNotes" class="mb-6">
          <p class="font-semibold text-gray-700 mb-2">บันทึกของแอดมิน (เดิม):</p>
          <div class="p-3 border border-gray-300 rounded-md bg-gray-100">
            <p class="whitespace-pre-wrap text-gray-800">{{ complaint.adminNotes }}</p>
          </div>
        </div>

        <div class="space-y-4 mb-8">
          <div>
            <label for="status" class="font-semibold text-gray-700 block mb-1">อัปเดตสถานะ:</label>
            <select
              id="status"
              v-model="newStatus"
              class="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="PENDING">รอดำเนินการ</option>
              <option value="IN_PROGRESS">อยู่ระหว่างตรวจสอบ</option>
              <option value="RESOLVED">แก้ไขแล้ว</option>
              <option value="CLOSED">ปิดเคสแล้ว</option>
            </select>
          </div>

          <div>
            <label for="admin-notes" class="font-semibold text-gray-700 block mb-1"
              >บันทึกของแอดมิน:</label
            >
            <textarea
              id="admin-notes"
              v-model="adminNotes"
              rows="4"
              placeholder="ระบุเหตุผล/มาตรการที่ใช้ในการจัดการข้อร้องเรียนนี้"
              class="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="updateStatusHandler"
            :disabled="!isStatusChanged"
            class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300 disabled:opacity-50"
          >
            <i class="fas fa-check mr-2"></i> บันทึกและอัปเดต
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
import { ref, watch, computed } from 'vue'

// ----------------------------------------------------------------------
// ✅ แก้ไขที่นี่: ลบการประกาศ Type ซ้ำซ้อน และใช้ Import จากไฟล์หลัก
// ----------------------------------------------------------------------
import type { ComplaintItem, ComplaintStatus } from '@/types/complaint'

const props = defineProps<{
  show: boolean
  complaint: ComplaintItem // ใช้ ComplaintItem ที่ Import มา
}>()

// ✅ updateStatus ต้องส่ง status และ adminNotes กลับไป
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updateStatus', data: { status: ComplaintStatus; adminNotes: string }): void
}>()

// ----------------------------------------------------------------------
// State และ Logic
// ----------------------------------------------------------------------

const newStatus = ref<ComplaintStatus>(props.complaint.status)
const adminNotes = ref<string>(props.complaint.adminNotes || '')

// Computed property เพื่อเช็คว่ามีการเปลี่ยนแปลงหรือไม่
const isStatusChanged = computed(() => {
  // ต้องเปลี่ยนสถานะ หรือมีการเปลี่ยน Admin Notes อย่างน้อยหนึ่งอย่าง
  return (
    newStatus.value !== props.complaint.status ||
    adminNotes.value !== (props.complaint.adminNotes || '')
  )
})

// 💡 Sync newStatus และ adminNotes เมื่อ complaint prop เปลี่ยน (เช่น เปิด modal ใหม่)
watch(
  () => props.complaint,
  (newComplaint) => {
    newStatus.value = newComplaint.status
    adminNotes.value = newComplaint.adminNotes || ''
  },
  { deep: true, immediate: true },
)

const formatDateTime = (isoString: string): string => {
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
  if (isStatusChanged.value) {
    // 🟢 ส่ง Event กลับไปพร้อมสถานะใหม่และ Admin Notes
    emit('updateStatus', {
      status: newStatus.value,
      adminNotes: adminNotes.value,
    })
  }
}
</script>

<style scoped>
/* Modal styles here if needed */
</style>

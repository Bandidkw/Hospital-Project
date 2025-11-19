<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
    >
      <div
        class="bg-white p-8 rounded-lg shadow-2xl max-w-xl w-full transform transition-all duration-300"
      >
        <h3 class="text-2xl font-bold text-red-700 mb-4 flex items-center">
          <i class="fas fa-comment-dots mr-3"></i> รายละเอียดข้อร้องเรียน (ID: {{ complaint.code }})
        </h3>

        <div class="border p-4 rounded-md bg-gray-50 mb-6">
          <p class="mb-2"><span class="font-semibold">หัวข้อ:</span> {{ complaint.subject }}</p>
          <p class="mb-2 text-sm text-gray-500">
            <span class="font-semibold">ผู้แจ้ง:</span>
            {{ complaint.complainantName || 'ไม่ระบุ' }} (ติดต่อ:
            {{ complaint.contactInfo || '-' }})
          </p>
          <p class="mb-4 text-xs text-gray-500">
            <span class="font-semibold">วันที่แจ้ง:</span> {{ formatDateTime(complaint.createdAt) }}
          </p>

          <div class="p-3 border rounded-md bg-white">
            <p class="font-semibold text-gray-700 mb-1">รายละเอียด:</p>
            <p class="whitespace-pre-wrap text-gray-800">{{ complaint.description }}</p>
          </div>
        </div>

        <div v-if="complaint.resolutionDetail" class="mb-6">
          <p class="font-semibold text-gray-700 mb-2">รายละเอียดการแก้ไข (เดิม):</p>
          <div class="p-3 border border-gray-300 rounded-md bg-gray-100">
            <p class="whitespace-pre-wrap text-gray-800">{{ complaint.resolutionDetail }}</p>
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
              <option value="pending">รอดำเนินการ</option>
              <option value="in_progress">อยู่ระหว่างตรวจสอบ</option>
              <option value="resolved">แก้ไขแล้ว</option>
              <option value="rejected">ปิดเคสแล้ว</option>
            </select>
          </div>

          <div>
            <label for="resolution-notes" class="font-semibold text-gray-700 block mb-1"
              >รายละเอียดการแก้ไข:</label
            >
            <textarea
              id="resolution-notes"
              v-model="resolutionNotes"
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
import type { ComplaintItem, ComplaintStatus } from '@/types/complaint'

const props = defineProps<{
  show: boolean
  complaint: ComplaintItem
}>()

const emit = defineEmits<{
  (e: 'update-status', data: { status: ComplaintStatus; resolutionDetail: string }): void
  (e: 'close'): void
}>()

// ----------------------------------------------------------------------
// State และ Logic
// ----------------------------------------------------------------------

const newStatus = ref<ComplaintStatus>(props.complaint.status)
const resolutionNotes = ref<string>(props.complaint.resolutionDetail || '')
const isStatusChanged = computed(() => {
  return (
    newStatus.value !== props.complaint.status ||
    resolutionNotes.value !== (props.complaint.resolutionDetail || '')
  )
})

watch(
  () => props.complaint,
  (newComplaint) => {
    newStatus.value = newComplaint.status
    resolutionNotes.value = newComplaint.resolutionDetail || ''
  },
  { immediate: true },
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
    emit('update-status', {
      status: newStatus.value,
      resolutionDetail: resolutionNotes.value, // ✅ Key ที่ถูกต้อง
    })
  }
}
</script>

<style scoped></style>

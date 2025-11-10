<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-headset mr-3 text-red-500"></i> จัดการข้อร้องเรียน
    </h2>
    <p class="text-gray-700 mb-6">
      หน้านี้ใช้สำหรับตรวจสอบและจัดการสถานะข้อร้องเรียนทั้งหมดที่ได้รับจากผู้ใช้งาน.
    </p>

    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รายการข้อร้องเรียน</h3>

      <div v-if="loading" class="text-center py-8">
        <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
        <p class="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>

      <div v-else-if="errorMsg" class="text-center py-8 text-red-600">
        <i class="fas fa-exclamation-triangle text-4xl"></i>
        <p class="mt-2 text-lg">{{ errorMsg }}</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">#</th>
              <th class="py-3 px-6 text-left">วันที่/เวลา</th>
              <th class="py-3 px-6 text-left">หัวข้อ</th>
              <th class="py-3 px-6 text-left">ผู้แจ้ง</th>
              <th class="py-3 px-6 text-center">สถานะ</th>
              <th class="py-3 px-6 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr
              v-for="(complaint, index) in complaintsList"
              :key="complaint.id"
              class="border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="py-3 px-6 text-left">{{ index + 1 }}</td>
              <td class="py-3 px-6 text-left text-xs">
                {{ formatDateTime(complaint.createdAt) }}
              </td>
              <td class="py-3 px-6 text-left font-medium">
                {{ complaint.subject }}
              </td>
              <td class="py-3 px-6 text-left">
                {{ complaint.reporterName || 'ไม่ระบุ' }}
              </td>
              <td class="py-3 px-6 text-center">
                <span :class="getStatusClass(complaint.status)">
                  {{ getStatusText(complaint.status) }}
                </span>
              </td>
              <td class="py-3 px-6 text-center">
                <button
                  @click="viewComplaint(complaint)"
                  class="bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600 transition duration-300 mr-2"
                >
                  <i class="fas fa-search"></i> ดู/จัดการ
                </button>
                <button
                  @click="confirmDeleteComplaint(complaint.id)"
                  class="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition duration-300"
                >
                  <i class="fas fa-trash-alt"></i> ลบ
                </button>
              </td>
            </tr>
            <tr v-if="complaintsList.length === 0">
              <td colspan="6" class="py-8 text-center text-gray-500">
                ไม่พบรายการข้อร้องเรียนในระบบ.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ComplaintModal
      :show="isModalOpen"
      :complaint="currentComplaint"
      @close="closeModal"
      @update-status="handleStatusUpdate"
    />

    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบข้อร้องเรียน</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบข้อร้องเรียนนี้?</p>
        <div class="flex justify-center space-x-4">
          <button
            @click="deleteComplaint"
            class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300"
          >
            <i class="fas fa-trash-alt mr-2"></i> ลบ
          </button>
          <button
            @click="cancelDelete"
            class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300"
          >
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { isAxiosError } from 'axios'
import ComplaintModal from '@/components/ComplaintModal.vue'
import {
  getComplaintList,
  updateComplaintStatus,
  deleteComplaintApi,
} from '@/services/complaintService'

const toast = useToast()

// ------------------------------------------------------------------
// 1. Types & State
// ------------------------------------------------------------------

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

const initialComplaint: ComplaintItem = {
  id: '',
  subject: '',
  detail: '',
  status: 'PENDING',
  createdAt: new Date().toISOString(),
}

const complaintsList = ref<ComplaintItem[]>([])
const currentComplaint = ref<ComplaintItem>({ ...initialComplaint })
const isModalOpen = ref(false)
const showConfirmModal = ref(false)
const complaintToDeleteId = ref<string | null>(null)
const loading = ref(true)
const errorMsg = ref<string | null>(null)

// ------------------------------------------------------------------
// 2. Data Fetching
// ------------------------------------------------------------------

const fetchComplaints = async () => {
  loading.value = true
  errorMsg.value = null
  try {
    // 💡 สมมติว่า Service มีฟังก์ชัน getComplaintList ที่ดึงข้อมูลมา
    const data = await getComplaintList()
    complaintsList.value = data
  } catch (e) {
    errorMsg.value = 'ไม่สามารถโหลดรายการข้อร้องเรียนได้'
    console.error('Fetch complaints failed:', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchComplaints)

// ------------------------------------------------------------------
// 3. Status Display & Formatting
// ------------------------------------------------------------------

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

const getStatusClass = (status: ComplaintStatus): string => {
  switch (status) {
    case 'PENDING':
      return 'inline-block px-3 py-1 text-xs font-semibold leading-none rounded-full text-yellow-800 bg-yellow-200'
    case 'IN_PROGRESS':
      return 'inline-block px-3 py-1 text-xs font-semibold leading-none rounded-full text-blue-800 bg-blue-200'
    case 'RESOLVED':
      return 'inline-block px-3 py-1 text-xs font-semibold leading-none rounded-full text-green-800 bg-green-200'
    default:
      return ''
  }
}

const getStatusText = (status: ComplaintStatus): string => {
  switch (status) {
    case 'PENDING':
      return 'รอดำเนินการ'
    case 'IN_PROGRESS':
      return 'อยู่ระหว่างตรวจสอบ'
    case 'RESOLVED':
      return 'แก้ไขแล้ว'
    default:
      return 'ไม่ระบุสถานะ'
  }
}

// ------------------------------------------------------------------
// 4. Actions (View, Delete, Update)
// ------------------------------------------------------------------

const viewComplaint = (complaint: ComplaintItem) => {
  currentComplaint.value = { ...complaint }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  // อัปเดตรายการเมื่อ Modal ปิด (เพื่อให้แน่ใจว่าข้อมูลล่าสุด)
  fetchComplaints()
}

// 💡 ฟังก์ชันจัดการการอัปเดตสถานะ (ถูกเรียกจาก ComplaintModal)
const handleStatusUpdate = async (newStatus: ComplaintStatus) => {
  try {
    await updateComplaintStatus(currentComplaint.value.id, newStatus)
    toast.success(`อัปเดตสถานะเป็น "${getStatusText(newStatus)}" สำเร็จ`)
    // อัปเดตใน List ทันที (ไม่ต้องรอ fetch ทั้งหมด)
    const index = complaintsList.value.findIndex((c) => c.id === currentComplaint.value.id)
    if (index !== -1) {
      complaintsList.value[index].status = newStatus
    }
    closeModal()
  } catch (e: unknown) {
    const message = isAxiosError(e)
      ? e.response?.data?.message || 'การอัปเดตสถานะล้มเหลว'
      : 'เกิดข้อผิดพลาดในการเชื่อมต่อ'
    toast.error(message)
    console.error('Update status failed:', e)
  }
}

// Delete Logic
const confirmDeleteComplaint = (id: string) => {
  complaintToDeleteId.value = id
  showConfirmModal.value = true
}

const deleteComplaint = async () => {
  if (!complaintToDeleteId.value) return

  try {
    await deleteComplaintApi(complaintToDeleteId.value)
    toast.success('ลบข้อร้องเรียนสำเร็จ!')
    // อัปเดต List
    complaintsList.value = complaintsList.value.filter((c) => c.id !== complaintToDeleteId.value)
  } catch (e: unknown) {
    const message = isAxiosError(e)
      ? e.response?.data?.message || 'การลบข้อมูลล้มเหลว'
      : 'เกิดข้อผิดพลาดในการลบข้อมูล'
    toast.error(message)
    console.error('Delete failed:', e)
  } finally {
    resetDeleteConfirm()
  }
}

const cancelDelete = () => {
  resetDeleteConfirm()
}

const resetDeleteConfirm = () => {
  complaintToDeleteId.value = null
  showConfirmModal.value = false
}
</script>

<style scoped>
/* styles for table or custom elements */
</style>

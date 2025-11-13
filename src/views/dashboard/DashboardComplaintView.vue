<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <h2 class="text-4xl font-extrabold text-gray-900 mb-2 flex items-center">
      <i class="fas fa-inbox mr-4 text-red-600"></i> ศูนย์จัดการข้อร้องเรียน
    </h2>
    <p class="text-gray-600 mb-6 pb-4 border-b">
      รายการข้อร้องเรียนทั้งหมดจากผู้ใช้ (รวม {{ filteredComplaints.length }} รายการ)
    </p>

    <div class="mb-6 flex space-x-4 p-4 bg-white rounded-xl shadow-md border border-gray-200">
      <label
        for="status-filter"
        class="flex items-center text-gray-700 font-medium whitespace-nowrap"
      >
        <i class="fas fa-filter mr-2 text-red-500"></i> กรองสถานะ:
      </label>
      <select
        id="status-filter"
        v-model="filterStatus"
        class="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
      >
        <option value="ALL">— ทั้งหมด —</option>
        <option value="PENDING">รอดำเนินการ</option>
        <option value="IN_PROGRESS">กำลังดำเนินการ</option>
        <option value="RESOLVED">แก้ไขแล้ว</option>
        <option value="CLOSED">ปิดเคสแล้ว</option>
      </select>

      <div class="relative flex-grow">
        <i
          class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        ></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="ค้นหาจากหัวข้อ/รายละเอียด/ผู้แจ้ง..."
          class="w-full pl-10 pr-4 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150"
        />
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-2xl">
      <h3 class="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
        รายการข้อร้องเรียนล่าสุด
      </h3>

      <div v-if="loading" class="text-center py-10">
        <i class="fas fa-spinner fa-spin text-5xl text-red-500"></i>
        <p class="mt-4 text-lg text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>

      <div
        v-else-if="errorMsg"
        class="text-center py-10 text-red-600 border border-red-300 bg-red-50 rounded-lg"
      >
        <i class="fas fa-exclamation-triangle text-4xl"></i>
        <p class="mt-2 text-xl font-medium">{{ errorMsg }}</p>
      </div>

      <div v-else class="overflow-x-auto relative">
        <table class="min-w-full bg-white rounded-lg border-collapse">
          <thead>
            <tr class="bg-red-600 text-white text-left uppercase text-sm leading-normal shadow-md">
              <th class="py-3 px-4 text-left rounded-tl-lg">#ID</th>
              <th class="py-3 px-4 text-left">วันที่/เวลา</th>
              <th class="py-3 px-4 text-left">หัวข้อ</th>
              <th class="py-3 px-4 text-left">ผู้แจ้ง</th>
              <th class="py-3 px-4 text-center">สถานะ</th>
              <th class="py-3 px-4 text-center rounded-tr-lg">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 text-sm font-light">
            <tr
              v-for="complaint in filteredComplaints"
              :key="complaint.id"
              class="border-b border-gray-200 hover:bg-red-50 transition duration-150"
            >
              <td class="py-3 px-4 text-left font-semibold">{{ complaint.id }}</td>
              <td class="py-3 px-4 text-left text-xs">{{ formatDateTime(complaint.createdAt) }}</td>
              <td class="py-3 px-4 text-left font-medium max-w-xs truncate">
                {{ complaint.subject }}
              </td>
              <td class="py-3 px-4 text-left">{{ complaint.reporterName || 'ไม่ระบุ' }}</td>
              <td class="py-3 px-4 text-center">
                <span :class="getStatusClass(complaint.status)">
                  {{ getStatusText(complaint.status) }}
                </span>
              </td>
              <td class="py-3 px-4 text-center whitespace-nowrap">
                <button
                  @click="viewComplaint(complaint)"
                  class="bg-red-500 text-white px-3 py-1 rounded-full text-xs hover:bg-red-600 transition duration-300 mr-2 shadow-sm"
                >
                  <i class="fas fa-search mr-1"></i> ดู/จัดการ
                </button>
                <button
                  @click="confirmDeleteComplaint(complaint.id)"
                  class="bg-gray-400 text-white px-3 py-1 rounded-full text-xs hover:bg-gray-500 transition duration-300 shadow-sm"
                >
                  <i class="fas fa-trash-alt mr-1"></i> ลบ
                </button>
              </td>
            </tr>
            <tr v-if="filteredComplaints.length === 0">
              <td colspan="6" class="py-8 text-center text-gray-500 bg-gray-50">
                <i class="fas fa-info-circle mr-2"></i>
                ไม่พบรายการข้อร้องเรียนที่ตรงกับเงื่อนไขการค้นหา
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ComplaintModal
      v-if="currentComplaint"
      :show="isModalOpen"
      :complaint="currentComplaint!"
      @close="closeModal"
      @update-status="handleStatusUpdate"
    />

    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300"
    >
      <div
        class="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center transform transition-all duration-300 scale-100"
      >
        <i class="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
        <h3 class="text-xl font-bold text-gray-800 mb-2">ยืนยันการลบข้อร้องเรียน</h3>
        <p class="text-gray-600 mb-6">
          คุณแน่ใจหรือไม่ว่าต้องการลบข้อร้องเรียนนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้
        </p>
        <div class="flex justify-center space-x-4">
          <button
            @click="deleteComplaint"
            class="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition duration-300"
          >
            <i class="fas fa-trash-alt mr-2"></i> ยืนยันการลบ
          </button>
          <button
            @click="cancelDelete"
            class="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition duration-300"
          >
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { isAxiosError } from 'axios'

import type { ComplaintItem, ComplaintStatus } from '@/types/complaint'
import ComplaintModal from '@/components/ComplaintModal.vue'
import {
  getComplaintList,
  updateComplaintStatus,
  deleteComplaintApi,
} from '@/services/complaintService'

const toast = useToast()

// [--- STATE, DATA FETCHING, FILTER/SEARCH LOGIC (UNCHANGED) ---]

const complaintsList = ref<ComplaintItem[]>([])
const currentComplaint = ref<ComplaintItem | null>(null)
const isModalOpen = ref(false)
const showConfirmModal = ref(false)
const complaintToDeleteId = ref<string | null>(null)
const loading = ref(true)
const errorMsg = ref<string | null>(null)

const filterStatus = ref<ComplaintStatus | 'ALL'>('ALL')
const searchQuery = ref('')

const fetchComplaints = async () => {
  loading.value = true
  errorMsg.value = null
  try {
    const data = await getComplaintList()
    complaintsList.value = data
  } catch (e) {
    errorMsg.value = 'ไม่สามารถโหลดรายการข้อร้องเรียนได้ (ลองตรวจสอบ Service Log)'
    console.error('Fetch complaints failed:', e)
  } finally {
    loading.value = false
  }
}
onMounted(fetchComplaints)
const filteredComplaints = computed(() => {
  let list = complaintsList.value
  if (filterStatus.value !== 'ALL') {
    list = list.filter((c) => c.status === filterStatus.value)
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(
      (c) =>
        c.subject.toLowerCase().includes(query) ||
        c.detail.toLowerCase().includes(query) ||
        c.reporterName?.toLowerCase().includes(query) ||
        c.reporterContact.toLowerCase().includes(query),
    )
  }
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return list
})

// ------------------------------------------------------------------
// 4. Status Display & Formatting (มีการปรับสีภายใน)
// ------------------------------------------------------------------

const formatDateTime = (isoString: string): string => {
  return new Date(isoString).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 🔴 ปรับ getStatusClass ให้ใช้สีแดงสำหรับสถานะ In Progress
const getStatusClass = (status: ComplaintStatus): string => {
  switch (status) {
    case 'PENDING':
      return 'inline-block px-3 py-1 text-xs font-semibold leading-none rounded-full text-yellow-800 bg-yellow-200'
    case 'IN_PROGRESS':
      // 🔴 เปลี่ยนจาก Blue เป็น Red/Orange เพื่อสื่อถึงความเร่งด่วน/การดำเนินการ
      return 'inline-block px-3 py-1 text-xs font-semibold leading-none rounded-full text-red-800 bg-red-200'
    case 'RESOLVED':
      return 'inline-block px-3 py-1 text-xs font-semibold leading-none rounded-full text-green-800 bg-green-200'
    case 'CLOSED':
      return 'inline-block px-3 py-1 text-xs font-semibold leading-none rounded-full text-gray-800 bg-gray-300'
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
    case 'CLOSED':
      return 'ปิดเคสแล้ว'
    default:
      return 'ไม่ระบุสถานะ'
  }
}

// [--- ACTIONS LOGIC (UNCHANGED) ---]

const viewComplaint = (complaint: ComplaintItem) => {
  currentComplaint.value = JSON.parse(JSON.stringify(complaint)) as ComplaintItem
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
  currentComplaint.value = null
}
const handleStatusUpdate = async (updatedData: { status: ComplaintStatus; adminNotes: string }) => {
  if (!currentComplaint.value) return
  const id = currentComplaint.value.id
  try {
    await updateComplaintStatus(id, updatedData.status, updatedData.adminNotes)
    toast.success(`อัปเดตสถานะเป็น "${getStatusText(updatedData.status)}" สำเร็จ`)
    const index = complaintsList.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      complaintsList.value[index].status = updatedData.status
      complaintsList.value[index].adminNotes = updatedData.adminNotes
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
const confirmDeleteComplaint = (id: string) => {
  complaintToDeleteId.value = id
  showConfirmModal.value = true
}
const deleteComplaint = async () => {
  if (!complaintToDeleteId.value) return
  try {
    await deleteComplaintApi(complaintToDeleteId.value)
    toast.success('ลบข้อร้องเรียนสำเร็จ!')
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

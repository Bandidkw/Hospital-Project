<template>
  <div class="overflow-x-auto">
    <div v-if="loading" class="text-center py-10 text-gray-500">
      <svg
        class="animate-spin h-5 w-5 text-indigo-500 mx-auto mb-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      กำลังโหลดรายการคิว...
    </div>

    <div
      v-else-if="queueItems.length === 0"
      class="text-center py-10 text-gray-500 border border-dashed rounded-lg bg-gray-50"
    >
      <p class="font-semibold text-xl mb-1 text-indigo-500">🎉 ไม่มีรายการคิวที่รออนุมัติ</p>
      <p>ข้อมูลคิวส่งตัวเป็นปัจจุบันแล้ว</p>
      <button
        @click="fetchData"
        class="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition duration-150"
      >
        <i class="fas fa-sync-alt mr-1"></i> คลิกเพื่อดึงข้อมูลใหม่
      </button>
    </div>

    <table
      v-else
      class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden shadow-lg"
    >
      <thead class="bg-indigo-600">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
            <i class="fas fa-user-tag mr-2"></i> HN / ชื่อผู้ป่วย
          </th>

          <th class="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
            <i class="fas fa-clock mr-2"></i> เวลาร้องขอ
          </th>

          <th class="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
            <i class="fas fa-info-circle mr-2"></i> สถานะ
          </th>

          <th class="px-6 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
            <i class="fas fa-cog mr-2"></i> การดำเนินการ
          </th>
        </tr>
      </thead>

      <tbody class="bg-white divide-y divide-gray-100">
        <tr
          v-for="item in queueItems"
          :key="item.id"
          class="hover:bg-indigo-50 transition duration-100"
        >
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {{ item.patientName }} (<span class="text-gray-500">{{ item.hn }}</span
            >)
          </td>

          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            {{ item.referralTime }} น.
          </td>

          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <span
              :class="[
                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm', // 💡 ปรับปรุง: เพิ่ม Shadow-sm
                item.status === 'APPROVED'
                  ? 'bg-green-100 text-green-800'
                  : item.status === 'REJECTED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800',
              ]"
            >
              {{ getStatusLabel(item.status) }}
            </span>

            <p
              v-if="item.status === 'REJECTED' && item.reason"
              class="text-xs text-red-600 mt-1 italic max-w-xs truncate"
              title="เหตุผลการปฏิเสธ"
            >
              เหตุผล: {{ item.reason }}
            </p>
          </td>

          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-2">
            <button
              @click="viewDetails(item)"
              class="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-medium py-1 px-3 rounded-md shadow-sm transition duration-150 text-xs inline-flex items-center"
            >
              <i class="fas fa-eye mr-1"></i> ดูรายละเอียด
            </button>

            <template v-if="item.status === 'PENDING'">
              <button
                @click="approveQueue(item.id)"
                class="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md shadow-md transition duration-150 text-xs"
              >
                อนุมัติ
              </button>

              <button
                @click="openRejectModal(item.id)"
                class="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md shadow-md transition duration-150 text-xs"
              >
                ปฏิเสธ
              </button>
            </template>
            <span v-else class="text-gray-400">-</span>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="showRejectModal"
      class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
    >
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100"
      >
        <div class="px-6 py-4 border-b bg-red-50 rounded-t-xl">
          <h3 class="text-xl font-bold text-red-700">
            <i class="fas fa-ban mr-2"></i> ระบุเหตุผลการปฏิเสธคิว
          </h3>
        </div>

        <div class="p-6">
          <p class="mb-4 text-sm text-gray-600">
            กรุณาระบุเหตุผลที่ปฏิเสธเพื่อแจ้งให้ผู้ป่วยทราบ (รหัสคิว:
            <span class="font-bold text-red-600">{{ rejectingQueueId }}</span
            >)
          </p>

          <div class="mb-4 flex flex-wrap gap-2">
            <button
              v-for="reason in commonReasons"
              :key="reason"
              @click="selectCommonReason(reason)"
              :class="[
                'text-xs py-1 px-2 rounded-full border transition duration-150',
                rejectionReason.includes(reason)
                  ? 'bg-red-600 text-white border-red-600 shadow-sm' // 💡 ปรับปรุง: ใช้สีแดงเป็นสี Active
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200',
              ]"
            >
              {{ reason }}
            </button>
          </div>

          <textarea
            v-model="rejectionReason"
            rows="4"
            placeholder="เช่น เอกสารไม่ครบถ้วน กรุณาแนบไฟล์เพิ่มเติม หรือข้อมูลไม่ตรงกับสิทธิการรักษา..."
            class="w-full border-gray-300 rounded-lg shadow-inner focus:border-red-500 focus:ring-red-500 p-2"
          ></textarea>
        </div>

        <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
          <button
            @click="showRejectModal = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
          >
            ยกเลิก
          </button>

          <button
            @click="confirmReject"
            class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            ยืนยันการปฏิเสธ
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showDetailModal && selectedPatientDetail"
      class="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 border-t-4 border-indigo-600"
      >
        <div class="px-6 py-4 border-b bg-indigo-50 rounded-t-2xl">
          <h3 class="text-2xl font-extrabold text-indigo-700">📄 รายละเอียดใบส่งตัว</h3>
          <p class="text-sm text-indigo-500">
            รหัสติดตาม: <span class="font-bold">{{ selectedPatientDetail.trackingCode }}</span>
          </p>
        </div>

        <div class="p-6 text-gray-700 space-y-6">
          <div class="p-4 bg-indigo-100 border border-indigo-300 rounded-xl shadow-inner">
            <p class="font-extrabold text-xl text-indigo-800 mb-3">
              <i class="fas fa-user-circle mr-2"></i> {{ selectedPatientDetail.patientName }} (<span
                class="font-normal text-base text-gray-700"
                >{{ selectedPatientDetail.hn }}</span
              >)
            </p>

            <div class="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
              <p>
                <strong>HN:</strong>
                <span class="font-semibold text-gray-900">{{ selectedPatientDetail.hn }}</span>
              </p>
              <p>
                <strong>เบอร์โทรศัพท์:</strong>
                <span class="font-bold text-blue-700">{{ selectedPatientDetail.phone }}</span>
              </p>
              <p>
                <strong>เวลาร้องขอ:</strong>
                <span class="font-medium text-gray-800"
                  >{{ selectedPatientDetail.referralTime }} น.</span
                >
              </p>
              <p>
                <strong>สถานะคิว:</strong>
                <span
                  class="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-md"
                  :class="
                    selectedPatientDetail.status === 'PENDING'
                      ? 'bg-yellow-200 text-yellow-900'
                      : selectedPatientDetail.status === 'APPROVED'
                        ? 'bg-green-200 text-green-900'
                        : 'bg-red-200 text-red-900'
                  "
                >
                  {{ getStatusLabel(selectedPatientDetail.status) }}
                </span>
              </p>
            </div>
          </div>

          <div>
            <p class="font-bold text-lg mb-3 text-gray-800 border-b pb-1 flex items-center">
              <i class="fas fa-hospital-alt mr-2 text-blue-600"></i> ข้อมูลการส่งตัว
            </p>
            <div
              class="grid grid-cols-1 gap-3 text-sm bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <p>
                <strong>โรงพยาบาลต้นทาง: </strong>
                <span class="font-medium"> {{ selectedPatientDetail.originHospital }}</span>
              </p>
              <p>
                <strong>โรงพยาบาลปลายทาง: </strong>
                <span class="font-medium">{{ selectedPatientDetail.destinationHospital }}</span>
              </p>
              <p>
                <strong>แผนก/คลินิก:</strong>
                <span class="font-extrabold text-blue-700">{{
                  selectedPatientDetail.destinationClinic
                }}</span>
              </p>
            </div>
          </div>

          <div v-if="selectedPatientDetail.status === 'REJECTED' && selectedPatientDetail.reason">
            <p class="font-bold text-lg mb-2 text-red-700 border-b pb-1 flex items-center">
              <i class="fas fa-exclamation-triangle mr-2"></i> เหตุผลการปฏิเสธ
            </p>
            <div
              class="bg-red-50 p-4 rounded-lg text-red-800 italic text-sm border border-red-300 shadow-sm"
            >
              {{ selectedPatientDetail.reason }}
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-100 flex justify-end rounded-b-2xl border-t border-gray-200">
          <button
            @click="((showDetailModal = false), (selectedPatientDetail = null))"
            class="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-5 rounded-lg transition duration-200 shadow-md"
          >
            <i class="fas fa-times mr-1"></i> ปิด
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

import { fetchPendingQueueList } from '@/services/opdService'
import type { QueueItem, QueueStatus, ReferralQueueItemApi } from '@/types/opd' // ปรับ path ตามจริง

const toast = useToast()

// ----------------------------------------------------
// 1. Types และ Data
// ----------------------------------------------------

const queueItems = ref<QueueItem[]>([])
const loading = ref(true) // สถานะ Loading

// ----------------------------------------------------
// 2. State สำหรับ Modal และ Detail Modal
// ----------------------------------------------------
const showRejectModal = ref(false)
// ID ผู้ป่วยจาก API เป็น string (guid) ตาม ReferralQueueItemApi ที่เรากำหนดไว้
const rejectingQueueId = ref<string | null>(null)
const rejectionReason = ref('')
const commonReasons = [
  'เอกสารส่งตัวไม่ครบถ้วน',
  'ข้อมูลไม่ถูกต้องหรือไม่ชัดเจน',
  'ไม่มีแพทย์/คลินิกที่รับส่งตัว',
  'อื่นๆ (กรุณาระบุเพิ่ม)',
]

const showDetailModal = ref(false)
const selectedPatientDetail = ref<QueueItem | null>(null)

// ----------------------------------------------------
// 3. Logic การจัดการคิว และ ดูรายละเอียด (ปรับปรุง catch block)
// ----------------------------------------------------

// [A] ฟังก์ชันดึงข้อมูลจริงจาก Service
const fetchData = async () => {
  loading.value = true
  try {
    // ใช้ ReferralQueueItemApi ที่ Import มาจาก opd.ts
    const apiData: ReferralQueueItemApi[] = await fetchPendingQueueList() // 1. ทำการ Mapping สถานะภาษาไทยและ Filter ไปพร้อมกัน

    const mappedAndFilteredItems = apiData
      .map((item) => {
        let status: QueueStatus = 'REJECTED'
        if (item.queueStatus === 'รออนุมัติ' || item.queueStatus === 'รอเรียก') {
          status = 'PENDING'
        } else if (item.queueStatus === 'อนุมัติแล้ว') {
          status = 'APPROVED'
        }

        return {
          id: item.id,
          trackingCode: item.trackingCode || item.id,
          hn: item.hospitalNumber,
          patientName: item.fullName,
          phone: item.phoneNumber,
          referralTime: `${item.bookingDate} ${item.bookingTime}`,
          status: status,
          reason: item.reason,
          bookingDate: item.bookingDate,
          destinationClinic: item.department,
          originHospital: item.referralHospital,
          destinationHospital: item.destinationHospital,
        } as QueueItem
      })
      .filter((item) => item.status === 'PENDING')

    queueItems.value = mappedAndFilteredItems

    toast.info(`ดึงรายการคิวรออนุมัติสำเร็จ ${queueItems.value.length} รายการ`)
  } catch (error) {
    console.error('Fetch Queue List Failed:', error)
    toast.error('ไม่สามารถดึงรายการคิวได้')
  } finally {
    loading.value = false
  }
}

// [B] ดูรายละเอียด: เปิด Modal รายละเอียด
const viewDetails = (item: QueueItem) => {
  selectedPatientDetail.value = item
  showDetailModal.value = true
}

// [C] การอนุมัติ (TODO: ต้องเรียก API จริงสำหรับการยืนยัน)
const approveQueue = (id: string) => {
  // id เป็น string (ตาม API)
  const index = queueItems.value.findIndex((item) => item.id === id)
  if (index !== -1 && queueItems.value[index].status === 'PENDING') {
    // ในการทำงานจริง: ต้องเรียก API updateQueueStatus(id, 'APPROVED')
    queueItems.value[index].status = 'APPROVED' // Mock update UI
    toast.success(`✅ อนุมัติคิว [${queueItems.value[index].trackingCode}] เรียบร้อยแล้ว`)
  } else {
    toast.error('❌ ไม่สามารถอนุมัติได้: คิวนี้ได้รับการดำเนินการไปแล้ว')
  }
}

// [D] การปฏิเสธ: เปิด Modal
const openRejectModal = (id: string) => {
  // id เป็น string (ตาม API)
  const item = queueItems.value.find((item) => item.id === id)
  if (item && item.status !== 'PENDING') {
    toast.error('❌ ไม่สามารถปฏิเสธได้: คิวนี้ได้รับการดำเนินการไปแล้ว')
    return
  }
  rejectingQueueId.value = id
  rejectionReason.value = ''
  showRejectModal.value = true
}

// [E] ยืนยันการปฏิเสธใน Modal (TODO: ต้องเรียก API จริงสำหรับการยืนยัน)
const confirmReject = () => {
  const id = rejectingQueueId.value
  const reason = rejectionReason.value.trim()

  if (!id || reason.length < 5) {
    toast.warning('⚠️ กรุณาระบุเหตุผลการปฏิเสธให้ชัดเจน (อย่างน้อย 5 ตัวอักษร)')
    return
  }

  const index = queueItems.value.findIndex((item) => item.id === id)
  if (index !== -1) {
    // ในการทำงานจริง: ต้องเรียก API updateQueueStatus(id, 'REJECTED', reason)
    queueItems.value[index].status = 'REJECTED' // Mock update UI
    queueItems.value[index].reason = reason

    toast.info(
      `🚫 ปฏิเสธคิว [${queueItems.value[index].trackingCode}]: ระบบได้แจ้งเหตุผลให้ผู้ป่วยทราบแล้ว`,
    )
  }

  showRejectModal.value = false
  rejectingQueueId.value = null
}

const selectCommonReason = (reason: string) => {
  if (rejectionReason.value.includes(reason)) {
    rejectionReason.value = rejectionReason.value.replace(reason, '').trim()
  } else {
    rejectionReason.value = (rejectionReason.value + ' ' + reason).trim()
  }
}

// [F] Utility Function สำหรับแปลงสถานะจาก English เป็น Thai (เพื่อความสะอาด)
const getStatusLabel = (status: QueueStatus): string => {
  switch (status) {
    case 'PENDING':
      return 'รออนุมัติ'
    case 'APPROVED':
      return 'อนุมัติแล้ว'
    case 'REJECTED':
      return 'ปฏิเสธ'
    default:
      return 'ไม่ทราบสถานะ'
  }
}

// ----------------------------------------------------
// 4. Lifecycle Hook
// ----------------------------------------------------
onMounted(fetchData)
</script>

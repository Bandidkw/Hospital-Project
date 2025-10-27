<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

// ----------------------------------------------------
// 1. Types และ Data (ปรับปรุงให้มีข้อมูลใบส่งตัวครบถ้วน)
// ----------------------------------------------------
interface QueueItem {
  id: number
  trackingCode: string
  hn: string
  patientName: string
  phone: string // เพิ่มเบอร์โทรศัพท์
  referralTime: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  reason?: string // เหตุผลการปฏิเสธ

  // ข้อมูลใบส่งตัวเต็ม
  originHospital: string
  destinationHospital: string
  destinationClinic: string
}

const queueItems = ref<QueueItem[]>([
  {
    id: 101,
    trackingCode: 'REF-001',
    hn: 'HN001',
    patientName: 'นายสมชาย ใจดี',
    phone: '081-XXX-9999',
    referralTime: '09:00',
    status: 'PENDING',
    originHospital: 'รพ.แม่แตง',
    destinationHospital: 'รพ.นครพิงค์',
    destinationClinic: 'แผนกโรคหัวใจ (Cardiology)',
  },
  {
    id: 102,
    trackingCode: 'REF-002',
    hn: 'HN002',
    patientName: 'นางสาวมานี มีสุข',
    phone: '089-XXX-1111',
    referralTime: '09:15',
    status: 'PENDING',
    originHospital: 'รพ.จอมทอง',
    destinationHospital: 'รพ.มหาราช',
    destinationClinic: 'คลินิกอายุรกรรมทั่วไป',
  },
  {
    id: 103,
    trackingCode: 'REF-003',
    hn: 'HN003',
    patientName: 'เด็กชายธนากร เก่งมาก',
    phone: '090-XXX-2222',
    referralTime: '09:30',
    status: 'PENDING',
    originHospital: 'รพ.แม่แตง',
    destinationHospital: 'รพ.นครพิงค์',
    destinationClinic: 'แผนกศัลยกรรมกระดูก',
  },
  {
    id: 104,
    trackingCode: 'REF-004',
    hn: 'HN004',
    patientName: 'นางสายใจ รักชาติ',
    phone: '098-XXX-3333',
    referralTime: '09:45',
    status: 'APPROVED',
    originHospital: 'รพ.หางดง',
    destinationHospital: 'รพ.นครพิงค์',
    destinationClinic: 'แผนกโรคเบาหวาน',
  },
])

// ----------------------------------------------------
// 2. State สำหรับ Modal และ Detail Modal
// ----------------------------------------------------
const showRejectModal = ref(false)
const rejectingQueueId = ref<number | null>(null)
const rejectionReason = ref('')
const commonReasons = [
  'เอกสารส่งตัวไม่ครบถ้วน',
  'ข้อมูลไม่ถูกต้องหรือไม่ชัดเจน',
  'ไม่มีแพทย์/คลินิกที่รับส่งตัว',
  'อื่นๆ (กรุณาระบุเพิ่ม)',
]

// สถานะสำหรับ Modal ดูรายละเอียดใหม่
const showDetailModal = ref(false)
const selectedPatientDetail = ref<QueueItem | null>(null)

// ----------------------------------------------------
// 3. Logic การจัดการคิว และ ดูรายละเอียด
// ----------------------------------------------------

// [A] ดูรายละเอียด: เปิด Modal รายละเอียด
const viewDetails = (item: QueueItem) => {
  selectedPatientDetail.value = item
  showDetailModal.value = true
}

// [B] การอนุมัติ
const approveQueue = (id: number) => {
  const index = queueItems.value.findIndex((item) => item.id === id)
  if (index !== -1 && queueItems.value[index].status === 'PENDING') {
    queueItems.value[index].status = 'APPROVED'
    toast.success(`✅ อนุมัติคิว [${queueItems.value[index].trackingCode}] เรียบร้อยแล้ว`)
  } else {
    toast.error('❌ ไม่สามารถอนุมัติได้: คิวนี้ได้รับการดำเนินการไปแล้ว')
  }
}

// [C] การปฏิเสธ: เปิด Modal
const openRejectModal = (id: number) => {
  const item = queueItems.value.find((item) => item.id === id)
  if (item && item.status !== 'PENDING') {
    toast.error('❌ ไม่สามารถปฏิเสธได้: คิวนี้ได้รับการดำเนินการไปแล้ว')
    return
  }
  rejectingQueueId.value = id
  rejectionReason.value = ''
  showRejectModal.value = true
}

// [D] ยืนยันการปฏิเสธใน Modal
const confirmReject = () => {
  const id = rejectingQueueId.value
  const reason = rejectionReason.value.trim()

  if (!id || reason.length < 5) {
    toast.warning('⚠️ กรุณาระบุเหตุผลการปฏิเสธให้ชัดเจน (อย่างน้อย 5 ตัวอักษร)')
    return
  }

  const index = queueItems.value.findIndex((item) => item.id === id)
  if (index !== -1) {
    queueItems.value[index].status = 'REJECTED'
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
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            HN / ชื่อผู้ป่วย
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            เวลาร้องขอ
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            สถานะ
          </th>
          <th
            class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            การดำเนินการ
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="item in queueItems" :key="item.id">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            <span class="font-semibold text-indigo-600 mr-2">[{{ item.trackingCode }}]</span>
            {{ item.patientName }} ({{ item.hn }})
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ item.referralTime }} น.
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <span
              :class="[
                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                item.status === 'APPROVED'
                  ? 'bg-green-100 text-green-800'
                  : item.status === 'REJECTED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800',
              ]"
            >
              {{
                item.status === 'PENDING'
                  ? 'รออนุมัติ'
                  : item.status === 'APPROVED'
                    ? 'อนุมัติแล้ว'
                    : 'ปฏิเสธ'
              }}
            </span>
            <p
              v-if="item.status === 'REJECTED' && item.reason"
              class="text-xs text-red-500 mt-1 italic"
            >
              เหตุผล: {{ item.reason }}
            </p>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-2">
            <button
              @click="viewDetails(item)"
              class="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-1 px-3 rounded-md shadow-sm transition duration-150 text-xs"
            >
              ดูรายละเอียด
            </button>

            <template v-if="item.status === 'PENDING'">
              <button
                @click="approveQueue(item.id)"
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-md shadow-sm transition duration-150 text-xs"
              >
                อนุมัติ
              </button>
              <button
                @click="openRejectModal(item.id)"
                class="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md shadow-sm transition duration-150 text-xs"
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
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="px-6 py-4 border-b">
          <h3 class="text-xl font-bold text-red-700">ระบุเหตุผลการปฏิเสธคิว</h3>
        </div>

        <div class="p-6">
          <p class="mb-4 text-sm text-gray-600">
            กรุณาระบุเหตุผลที่ปฏิเสธเพื่อแจ้งให้ผู้ป่วยทราบ (รหัสคิว: {{ rejectingQueueId }})
          </p>

          <div class="mb-4 flex flex-wrap gap-2">
            <button
              v-for="reason in commonReasons"
              :key="reason"
              @click="selectCommonReason(reason)"
              :class="[
                'text-xs py-1 px-2 rounded-full border transition duration-150',
                rejectionReason.includes(reason)
                  ? 'bg-indigo-500 text-white border-indigo-500'
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
            class="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 p-2"
          ></textarea>
        </div>

        <div class="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            @click="showRejectModal = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded transition"
          >
            ยกเลิก
          </button>
          <button
            @click="confirmReject"
            class="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition"
          >
            ยืนยันการปฏิเสธ
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="showDetailModal && selectedPatientDetail"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div class="px-6 py-4 border-b bg-blue-50">
          <h3 class="text-xl font-bold text-blue-700">📄 รายละเอียดใบส่งตัว</h3>
          <p class="text-sm text-blue-500">รหัสติดตาม: {{ selectedPatientDetail.trackingCode }}</p>
        </div>

        <div class="p-6 text-gray-700 space-y-4">
          <div class="pb-3 border-b border-gray-200">
            <p class="font-bold text-lg text-indigo-600 mb-2">
              {{ selectedPatientDetail.patientName }} ({{ selectedPatientDetail.hn }})
            </p>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <p><strong>HN:</strong> {{ selectedPatientDetail.hn }}</p>
              <p><strong>เบอร์โทรศัพท์:</strong> {{ selectedPatientDetail.phone }}</p>
              <p><strong>เวลาร้องขอ:</strong> {{ selectedPatientDetail.referralTime }} น.</p>
              <p>
                <strong>สถานะคิว:</strong>
                <span
                  class="font-medium"
                  :class="
                    selectedPatientDetail.status === 'PENDING'
                      ? 'text-orange-500'
                      : 'text-green-600'
                  "
                >
                  {{
                    selectedPatientDetail.status === 'PENDING'
                      ? 'รออนุมัติ'
                      : selectedPatientDetail.status === 'APPROVED'
                        ? 'อนุมัติแล้ว'
                        : 'ปฏิเสธแล้ว'
                  }}
                </span>
              </p>
            </div>
          </div>

          <div>
            <p class="font-bold text-lg mb-2 text-gray-800">ข้อมูลโรงพยาบาลและแผนก</p>
            <div class="grid grid-cols-1 gap-2 text-sm bg-gray-50 p-3 rounded-md">
              <p><strong>รพ.ต้นทาง:</strong> {{ selectedPatientDetail.originHospital }}</p>
              <p><strong>รพ.ปลายทาง:</strong> {{ selectedPatientDetail.destinationHospital }}</p>
              <p>
                <strong>แผนก/คลินิก:</strong>
                <span class="font-semibold text-blue-700">{{
                  selectedPatientDetail.destinationClinic
                }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            @click="((showDetailModal = false), (selectedPatientDetail = null))"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded transition"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

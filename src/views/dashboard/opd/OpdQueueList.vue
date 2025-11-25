<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

import { fetchPendingQueueList } from '@/services/opdService'
const toast = useToast()

// ----------------------------------------------------
// 1. Types และ Data
// ----------------------------------------------------

// ใช้สถานะเป็นภาษาอังกฤษตาม Backend (PENDING, APPROVED, REJECTED)
type QueueStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

interface QueueItem {
  id: string // ID ควรเป็น string ตาม API
  trackingCode: string
  hn: string // ชื่อสั้นจาก hospitalNumber
  patientName: string // ชื่อสั้นจาก fullName
  phone: string // ชื่อสั้นจาก phoneNumber
  referralTime: string // ชื่อสั้นจาก bookingTime
  status: QueueStatus // ชื่อสั้นจาก queueStatus
  reason?: string
  originHospital: string // ชื่อสั้นจาก referralHospital
  destinationHospital: string
  destinationClinic: string // ชื่อสั้นจาก department
}

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
// 3. Logic การจัดการคิว และ ดูรายละเอียด (ไม่เปลี่ยนแปลง)
// ----------------------------------------------------

// [A] ฟังก์ชันดึงข้อมูลจริงจาก Service
const fetchData = async () => {
  loading.value = true
  try {
    const apiData = await fetchPendingQueueList() // ตอนนี้ได้ข้อมูล "ทั้งหมด" จาก Endpoint ใหม่

    // 1. ทำการ Mapping สถานะภาษาไทยและ Filter ไปพร้อมกัน
    const mappedAndFilteredItems = apiData
      .map((item) => {
        let status: QueueStatus = 'REJECTED' // ตั้งค่าเริ่มต้น

        // 💡 Mapping สถานะ: รวม "รอเรียก" และ "รออนุมัติ" ให้เป็น PENDING
        if (item.queueStatus === 'รออนุมัติ' || item.queueStatus === 'รอเรียก') {
          status = 'PENDING'
        } else if (item.queueStatus === 'อนุมัติแล้ว') {
          status = 'APPROVED'
        }

        // คืนค่าเป็น Local Type (QueueItem)
        return {
          id: item.id,
          trackingCode: item.trackingCode || item.id,
          hn: item.hospitalNumber,
          patientName: item.fullName,
          phone: item.phoneNumber,
          referralTime: item.bookingTime,
          status: status, // ใช้สถานะที่ Mapping แล้ว
          reason: item.reason,
          originHospital: item.referralHospital,
          destinationHospital: item.destinationHospital,
          destinationClinic: item.department,
        }
      })
      // 2. 💡 Filter: คัดกรองรายการที่ต้องการแสดงใน List นี้ (เฉพาะ PENDING)
      .filter((item) => item.status === 'PENDING')

    queueItems.value = mappedAndFilteredItems as QueueItem[]

    toast.info(`ดึงรายการคิวรออนุมัติสำเร็จ ${queueItems.value.length} รายการ`)
  } catch {
    // แสดง Toast Error เมื่อเกิด Server Error ที่ถูกโยนมาจาก service
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
      class="text-center py-10 text-gray-500 border border-dashed rounded-lg"
    >
      <p class="font-semibold text-lg mb-1">🎉 ไม่มีรายการคิวที่รออนุมัติ</p>
      <p>ข้อมูลคิวส่งตัวเป็นปัจจุบันแล้ว</p>
      <button @click="fetchData" class="mt-4 text-indigo-600 hover:text-indigo-800 text-sm">
        คลิกเพื่อดึงข้อมูลใหม่
      </button>
    </div>
    <table v-else class="min-w-full divide-y divide-gray-200">
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
                            {{ getStatusLabel(item.status) }}            
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
                @click="approveQueue(item.id as unknown as string)"
                class="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded-md shadow-sm transition duration-150 text-xs"
              >
                                อนุมัติ              
              </button>
                           
              <button
                @click="openRejectModal(item.id as unknown as string)"
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
                        กรุณาระบุเหตุผลที่ปฏิเสธเพื่อแจ้งให้ผู้ป่วยทราบ (รหัสคิว:
            {{ rejectingQueueId }})          
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
                                    {{ getStatusLabel(selectedPatientDetail.status) }}              
                   
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

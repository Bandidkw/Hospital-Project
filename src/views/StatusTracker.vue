<template>
  <main class="bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto px-4 py-10">
      <header class="mb-10 text-center">
        <h1
          class="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-3"
        >
          <i class="fas fa-tasks text-blue-600"></i>
          <span>ติดตามสถานะการส่งตัว</span>
        </h1>
        <p class="text-gray-600 mt-2">กรอกรหัสที่ได้รับเพื่อตรวจสอบความคืบหน้า</p>
      </header>
      <div class="max-w-2xl mx-auto">
        <div
          class="relative flex items-center bg-white rounded-xl shadow-lg transition-all border border-gray-100 hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-200"
        >
          <div class="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
            <i class="fas fa-search text-gray-400 text-xl"></i>
          </div>

          <input
            v-model="trackingCodeInput"
            @keyup.enter="checkStatus"
            type="text"
            placeholder="กรอกรหัสติดตามสถานะของคุณที่นี่..."
            class="w-full p-5 pl-14 pr-40 bg-transparent border-none focus:ring-0 text-lg text-gray-800 placeholder-gray-400"
          />

          <div class="absolute inset-y-0 right-0 flex items-center py-2 pr-2">
            <button
              @click="checkStatus"
              :disabled="isLoading || !trackingCodeInput"
              class="inline-flex items-center rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-3 text-base font-semibold text-white shadow-md hover:from-emerald-600 hover:to-green-700 transition-all duration-200 ease-in-out disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
            >
              <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
              <span v-else>ตรวจสอบสถานะ</span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="searchPerformed" class="mt-12 max-w-3xl mx-auto">
        <div v-if="isLoading" class="text-center py-10">
          <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
          <p class="mt-4 text-gray-600">กำลังตรวจสอบข้อมูล...</p>
        </div>

        <div v-else-if="!searchResult" class="bg-white p-8 rounded-lg shadow-md text-center">
          <i class="fas fa-exclamation-triangle text-yellow-500 text-5xl mb-4"></i>
          <h3 class="text-2xl font-bold text-gray-800">ไม่พบข้อมูล</h3>
          <p class="text-gray-600 mt-2">
            ไม่พบข้อมูลสำหรับรหัส <strong class="text-red-600">{{ trackingCodeInput }}</strong
            ><br />กรุณาตรวจสอบความถูกต้องแล้วลองใหม่อีกครั้ง
          </p>
        </div>

        <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6 border-b">
            <p class="text-sm text-gray-500">ผลการค้นหาสำหรับรหัส:</p>
            <p class="text-xl font-mono font-bold text-blue-700">{{ searchResult.code }}</p>
            <p class="mt-2"><strong>ผู้ป่วย:</strong> {{ searchResult.patientName }}</p>
          </div>
          <div class="p-6">
            <h4 class="font-bold text-lg mb-6">สถานะ</h4>
            <div class="space-y-8">
              <div class="flex">
                <div class="flex flex-col items-center mr-4">
                  <div>
                    <div
                      class="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full"
                    >
                      <i class="fas fa-check text-white"></i>
                    </div>
                  </div>
                  <div class="w-px h-full bg-gray-300"></div>
                </div>
                <div>
                  <p class="font-semibold text-gray-800">ส่งข้อมูลสำเร็จ</p>
                  <p class="text-sm text-gray-500">{{ formatDate(searchResult.dateCreated) }}</p>
                </div>
              </div>

              <div class="flex">
                <div class="flex flex-col items-center mr-4">
                  <div>
                    <div
                      class="flex items-center justify-center w-10 h-10 rounded-full"
                      :class="statusInfo.pending.bg"
                    >
                      <i
                        class="fas"
                        :class="[statusInfo.pending.icon, statusInfo.pending.textColor]"
                      ></i>
                    </div>
                  </div>
                  <div class="w-px h-full bg-gray-300"></div>
                </div>
                <div>
                  <p class="font-semibold" :class="statusInfo.pending.textColor">
                    เจ้าหน้าที่รับเรื่องแล้ว
                  </p>
                  <p class="text-sm text-gray-500">กำลังรอการตรวจสอบเอกสารและข้อมูล</p>
                </div>
              </div>

              <div class="flex">
                <div class="flex flex-col items-center mr-4">
                  <div>
                    <div
                      class="flex items-center justify-center w-10 h-10 rounded-full"
                      :class="statusInfo.final.bg"
                    >
                      <i
                        class="fas"
                        :class="[statusInfo.final.icon, statusInfo.final.textColor]"
                      ></i>
                    </div>
                  </div>
                </div>
                <div>
                  <p class="font-semibold" :class="statusInfo.final.textColor">
                    {{ statusInfo.final.title }}
                  </p>
                  <p class="text-sm text-gray-500">{{ searchResult.details }}</p>
                  <p v-if="searchResult.dateUpdated" class="text-sm text-gray-500">
                    {{ formatDate(searchResult.dateUpdated) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// --- MOCK DATABASE ---
// ในสถานการณ์จริง ข้อมูลนี้จะมาจากการยิง API ไปที่ Backend
const mockDatabase = [
  {
    code: 'REF-54321-A4B7X1',
    patientName: 'นายสมชาย ใจดี',
    status: 'approved', // 'pending', 'approved', 'rejected'
    details: 'อนุมัติการส่งตัวเรียบร้อยแล้ว',
    dateCreated: '2025-10-15T10:30:00Z',
    dateUpdated: '2025-10-15T14:45:00Z',
  },
  {
    code: 'REF-67890-B2C3D4',
    patientName: 'นางสาวสมศรี มีสุข',
    status: 'pending',
    details: 'เจ้าหน้าที่กำลังตรวจสอบเอกสาร',
    dateCreated: '2025-10-15T11:00:00Z',
    dateUpdated: null,
  },
  {
    code: 'REF-11223-E5F6G7',
    patientName: 'นายประหยัด อดออม',
    status: 'rejected',
    details:
      'เอกสารส่งตัวไม่ชัดเจน กรุณาติดต่อแผนกส่งต่อเพื่อดำเนินการอีกครั้ง โทร 053-XXX-XXXX ต่อ 123',
    dateCreated: '2025-10-14T09:00:00Z',
    dateUpdated: '2025-10-14T16:20:00Z',
  },
]
// --- END MOCK DATABASE ---

// --- Component State ---
const trackingCodeInput = ref('')
const isLoading = ref(false)
const searchPerformed = ref(false)
const searchResult = ref<(typeof mockDatabase)[0] | null>(null)

// --- API Simulation ---
const findReferralStatus = async (code: string) => {
  isLoading.value = true
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
  const result = mockDatabase.find((item) => item.code.toUpperCase() === code.toUpperCase())
  searchResult.value = result || null
  isLoading.value = false
}

// --- Methods ---
const checkStatus = () => {
  if (!trackingCodeInput.value.trim()) return
  searchPerformed.value = true
  findReferralStatus(trackingCodeInput.value.trim())
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return (
    new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' น.'
  )
}

// --- Computed Properties for UI ---
const statusInfo = computed(() => {
  const isPending = searchResult.value?.status === 'pending'
  const isApproved = searchResult.value?.status === 'approved'
  const isRejected = searchResult.value?.status === 'rejected'

  return {
    pending: {
      bg: isPending ? 'bg-yellow-400' : 'bg-green-500',
      icon: isPending ? 'fa-hourglass-half' : 'fa-check',
      textColor: isPending ? 'text-yellow-600' : 'text-green-600',
    },
    final: {
      bg: isApproved ? 'bg-green-500' : isRejected ? 'bg-red-500' : 'bg-gray-300',
      icon: isApproved ? 'fa-check-double' : isRejected ? 'fa-times' : 'fa-question',
      textColor: isApproved ? 'text-green-600' : isRejected ? 'text-red-600' : 'text-gray-600',
      title: isApproved
        ? 'ดำเนินการสำเร็จ'
        : isRejected
          ? 'ถูกปฏิเสธ / ต้องแก้ไข'
          : 'รอการดำเนินการ',
    },
  }
})
</script>

<script setup lang="ts">
import { ref } from 'vue'
import OpdQueueList from '@/views/dashboard/opd/OpdQueueList.vue'
import { useToast } from 'vue-toastification'

// --- ส่วนที่ 1: เปลี่ยนมาใช้ Import Interface แทนการประกาศใหม่ ---
import type { PatientReferralInfo, SearchError } from '@/types/opd'
// ตรวจสอบเส้นทางให้ถูกต้องตามโครงสร้างโปรเจกต์ของคุณ (เช่น '../types/opd' หากอยู่ในโฟลเดอร์เดียวกัน)
// -------------------------------------------------------------

const toast = useToast()

// ข้อมูลสถานะ (Stat Cards)
const opdStats = ref({
  queueCount: 20,
  pendingResults: 12,
  todayAppointments: 68,
})

// ----------------------------------------------------
// Logic สำหรับ Modal ค้นหา HN
// ----------------------------------------------------

const showSearchModal = ref(false)
const searchHN = ref('')
// ใช้ Union Type ที่ Import เข้ามา
const searchResult = ref<PatientReferralInfo | SearchError | null>(null)

const openSearchModal = () => {
  searchHN.value = ''
  searchResult.value = null
  showSearchModal.value = true
}

// ----------------------------------------------------
// Type Guard Function (ใช้ SearchError ที่ Import เข้ามา)
// ----------------------------------------------------
const isSearchError = (result: PatientReferralInfo | SearchError | null): result is SearchError => {
  return result !== null && 'error' in result
}

const performSearch = () => {
  const hn = searchHN.value.trim()
  if (!hn) {
    toast.warning('⚠️ กรุณากรอกหมายเลข HN ที่ต้องการค้นหา')
    return
  }

  console.log(`Searching for HN: ${hn}`)

  // จำลองผลลัพธ์การค้นหา
  if (hn === 'HN001' || hn === '12345') {
    searchResult.value = {
      hn: hn,
      name: 'นายสมชาย ใจดี',
      phone: '081-XXX-9999',
      status: 'รออนุมัติ',
      trackingCode: 'REF-001',
      originHospital: 'รพ.แม่แตง',
      destinationHospital: 'รพ.นครพิงค์',
      destinationClinic: 'แผนกโรคหัวใจ (Cardiology)',
    }
    toast.success(`🔍 พบข้อมูลผู้ป่วย HN: ${hn}`)
  } else {
    // ใช้ SearchError Interface ที่ Import เข้ามา
    searchResult.value = { error: 'ไม่พบข้อมูลผู้ป่วยด้วย HN นี้' }
    toast.error(`❌ ไม่พบ HN: ${hn}`)
  }
}

const closeSearchModal = () => {
  showSearchModal.value = false
  searchResult.value = null
  searchHN.value = ''
}
</script>

<template>
  <div class="opd-dashboard p-8">
    <h1 class="text-3xl font-bold mb-2 text-gray-800">OPD Dashboard (แผนกผู้ป่วยนอก)</h1>
    <p class="text-base text-gray-500 mb-8">
      ข้อมูลสรุปและเครื่องมือสำคัญสำหรับเจ้าหน้าที่ประจำแผนกผู้ป่วยนอก
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div
        class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600 h-32 flex flex-col justify-center"
      >
        <p class="text-sm font-semibold text-gray-500 mb-1">คิวปัจจุบัน</p>
        <p class="text-4xl font-extrabold text-blue-600">{{ opdStats.queueCount }}</p>
      </div>
      <div
        class="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500 h-32 flex flex-col justify-center"
      >
        <p class="text-sm font-semibold text-gray-500 mb-1">ผลตรวจรออนุมัติ</p>
        <p class="text-4xl font-extrabold text-orange-500">{{ opdStats.pendingResults }}</p>
      </div>
      <div
        class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600 h-32 flex flex-col justify-center"
      >
        <p class="text-sm font-semibold text-gray-500 mb-1">นัดหมายทั้งหมดวันนี้</p>
        <p class="text-4xl font-extrabold text-green-600">{{ opdStats.todayAppointments }}</p>
      </div>
    </div>

    <div class="mt-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">เครื่องมือด่วน</h2>
      <div class="flex space-x-3 pb-8 border-b border-gray-200 mb-6">
        <button
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition duration-150 shadow-md"
        >
          จัดการคิว
        </button>
        <button
          @click="openSearchModal"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-150 shadow-sm"
        >
          ค้นหา HN
        </button>
      </div>

      <h3 class="text-xl font-semibold mb-4 text-gray-800">รายการคิวส่งตัวที่รอการอนุมัติ</h3>
      <OpdQueueList />
    </div>
  </div>

  <div
    v-if="showSearchModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg">
      <div class="px-6 py-4 border-b">
        <h3 class="text-xl font-bold text-indigo-700">🔍 ค้นหาข้อมูลผู้ป่วยด้วย HN</h3>
      </div>

      <div class="p-6">
        <label for="hn-input" class="block text-sm font-medium text-gray-700 mb-2">
          หมายเลข HN:
        </label>
        <div class="flex space-x-2">
          <input
            id="hn-input"
            v-model="searchHN"
            type="text"
            placeholder="กรอก HN (เช่น 12345)"
            class="flex-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
            @keyup.enter="performSearch"
          />
          <button
            @click="performSearch"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition"
          >
            ค้นหา
          </button>
        </div>

        <div
          v-if="searchResult"
          class="mt-6 p-4 border rounded-md"
          :class="{
            'bg-red-50 border-red-300': isSearchError(searchResult),
            'bg-green-50 border-green-300': !isSearchError(searchResult),
          }"
        >
          <p v-if="isSearchError(searchResult)" class="text-red-700 font-semibold">
            {{ searchResult.error }}
          </p>

          <div v-else class="text-gray-700 space-y-4">
            <div class="pb-3 border-b border-gray-200">
              <p class="font-bold text-xl text-indigo-600 mb-2">{{ searchResult.name }}</p>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <p><strong>HN:</strong> {{ searchResult.hn }}</p>
                <p><strong>เบอร์โทรศัพท์:</strong> {{ searchResult.phone }}</p>
                <p>
                  <strong>สถานะล่าสุด:</strong>
                  <span
                    class="font-medium"
                    :class="
                      searchResult.status === 'รออนุมัติ' ? 'text-orange-500' : 'text-green-600'
                    "
                    >{{ searchResult.status }}</span
                  >
                </p>
                <p>
                  <strong>รหัสติดตาม:</strong>
                  <span class="font-semibold">{{ searchResult.trackingCode }}</span>
                </p>
              </div>
            </div>

            <div>
              <p class="font-bold text-lg mb-2 text-gray-800">ข้อมูลใบส่งตัว</p>
              <div class="grid grid-cols-1 gap-2 text-sm bg-gray-50 p-3 rounded-md">
                <p><strong>รพ.ต้นทาง:</strong> {{ searchResult.originHospital }}</p>
                <p><strong>รพ.ปลายทาง:</strong> {{ searchResult.destinationHospital }}</p>
                <p>
                  <strong>แผนก/คลินิก:</strong>
                  <span class="font-semibold text-blue-700">{{
                    searchResult.destinationClinic
                  }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-6 py-4 bg-gray-50 flex justify-end">
        <button
          @click="closeSearchModal"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded transition"
        >
          ปิด
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.opd-dashboard {
  background-color: #f5f7fa;
  min-height: 100vh;
}
</style>

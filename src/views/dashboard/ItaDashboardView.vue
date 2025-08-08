<template>
  <div class="container mx-auto p-8 bg-white rounded-lg shadow-xl">
    <div class="flex justify-between items-center mb-8 border-b-4 border-blue-500 pb-4">
      <div>
        <h1 class="text-4xl font-extrabold text-blue-800">Dashboard: จัดการปีงบประมาณ ITA</h1>
        <p class="text-gray-600 mt-2 text-lg">สร้างหรือจัดการปีงบประมาณสำหรับเอกสาร ITA</p>
      </div>
      <button
        @click="openCreateYearModal"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-lg flex items-center"
      >
        <i class="fas fa-plus mr-2"></i>
        สร้างปีใหม่
      </button>
    </div>

    <div v-if="loading" class="text-center py-16">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
      <p class="mt-4 text-xl text-gray-600">กำลังโหลดรายการปีงบประมาณ...</p>
    </div>
    <div v-else-if="error" class="text-center py-16 bg-red-50 p-8 rounded-lg">
      <p class="text-xl text-red-600">เกิดข้อผิดพลาด: {{ error }}</p>
    </div>
    <div v-else class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-blue-100">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              ปีงบประมาณ (พ.ศ.)
            </th>
            <th
              class="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              การจัดการ
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="availableYears.length === 0">
            <td colspan="3" class="px-6 py-4 text-center text-gray-500">
              ยังไม่มีปีงบประมาณในระบบ
            </td>
          </tr>
          <tr v-for="year in availableYears" :key="year.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ year.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">{{ year.year }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
              <button
                @click="manageTopicsForYear(year.id)"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                จัดการหัวข้อ
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="isCreateYearModalOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">สร้างปีงบประมาณใหม่</h2>
        <form @submit.prevent="handleCreateYearSubmit">
          <div>
            <label for="new-year" class="block text-gray-700 font-bold mb-2"
              >ปีงบประมาณ (พ.ศ.):</label
            >
            <input
              id="new-year"
              type="number"
              v-model="newYearData.year"
              placeholder="เช่น 2568"
              class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="flex justify-end space-x-4 pt-6 mt-4 border-t">
            <button
              type="button"
              @click="isCreateYearModalOpen = false"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-full"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { itaService } from '@/services/itaService'
import type { YearIta } from '@/types/ita'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

const availableYears = ref<YearIta[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// --- State ใหม่สำหรับ Modal ---
const isCreateYearModalOpen = ref(false)
const newYearData = ref({
  year: new Date().getFullYear() + 543, // ค่าเริ่มต้นเป็นปี พ.ศ. ปัจจุบัน
})

// --- ดึงข้อมูลปีทั้งหมด ---
const fetchYears = async () => {
  loading.value = true
  error.value = null
  try {
    availableYears.value = await itaService.getYears()
  } catch (err: any) {
    error.value = err.message || 'ไม่สามารถดึงข้อมูลปีได้'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

// --- ฟังก์ชัน `createNewYear` เดิมจะเปลี่ยนเป็นแค่ "เปิด Modal" ---
const openCreateYearModal = () => {
  // รีเซ็ตค่าในฟอร์มทุกครั้งที่เปิด
  newYearData.value.year = new Date().getFullYear() + 543
  isCreateYearModalOpen.value = true
}

// --- ฟังก์ชันใหม่สำหรับจัดการการ Submit ของ Modal ---
const handleCreateYearSubmit = async () => {
  if (!newYearData.value.year) {
    toast.error('กรุณาระบุปีงบประมาณ')
    return
  }

  try {
    const newYearNumber = newYearData.value.year
    toast.info(`กำลังสร้างปีงบประมาณ ${newYearNumber}...`)
    await itaService.createYear({ year: newYearNumber })

    isCreateYearModalOpen.value = false // ปิด Modal
    toast.success(`สร้างปี ${newYearNumber} สำเร็จ!`)
    fetchYears() // ดึงข้อมูลปีมาใหม่เพื่ออัปเดตตาราง
  } catch (err: any) {
    toast.error(err.message || 'ไม่สามารถสร้างปีใหม่ได้')
  }
}

// --- ไปยังหน้าจัดการหัวข้อของปีนั้นๆ ---
const manageTopicsForYear = (yearId: string | number) => {
  router.push(`/dashboard/ita/year/${yearId}/topics`)
}

onMounted(() => {
  fetchYears()
})
</script>

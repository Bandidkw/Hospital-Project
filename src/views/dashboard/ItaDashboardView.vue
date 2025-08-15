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
              ปี
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              ปีงบประมาณ (พ.ศ.)
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              รายละเอียดปี
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
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ year.year }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">
              {{ year.title }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">
              {{ year.description }}
            </td>
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
        <form @submit.prevent="handleCreateYearSubmit" class="space-y-4">
          <div>
            <label for="new-year" class="block text-gray-700 font-bold mb-2"
              >ปีงบประมาณ (พ.ศ.):*</label
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

          <div>
            <label for="new-year-title" class="block text-gray-700 font-bold mb-2"
              >ชื่อเรื่อง (Title):*</label
            >
            <input
              id="new-year-title"
              type="text"
              v-model="newYearData.title"
              placeholder="เช่น ปีงบประมาณ 2568"
              class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label for="new-year-desc" class="block text-gray-700 font-bold mb-2"
              >คำอธิบาย (Description):</label
            >
            <textarea
              id="new-year-desc"
              v-model="newYearData.description"
              rows="3"
              placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)"
              class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
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

interface NewYearFormData {
  year: number
  title: string
  description: string
}

const router = useRouter()
const toast = useToast()

const availableYears = ref<YearIta[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const isCreateYearModalOpen = ref(false)
const newYearData = ref<NewYearFormData>({
  year: new Date().getFullYear() + 543,
  title: '',
  description: '',
})

const fetchYears = async () => {
  loading.value = true
  error.value = null
  try {
    availableYears.value = await itaService.getYears()
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
    }
    toast.error(error.value || 'ไม่สามารถดึงข้อมูลปีได้')
  } finally {
    loading.value = false
  }
}

const openCreateYearModal = () => {
  const currentYear = new Date().getFullYear() + 543
  newYearData.value = {
    year: currentYear,
    title: `ปีงบประมาณ ${currentYear}`,
    description: `รายละเอียดข้อมูล ITA ประจำปีงบประมาณ ${currentYear}`,
  }
  isCreateYearModalOpen.value = true
}

const handleCreateYearSubmit = async () => {
  if (!newYearData.value.year || !newYearData.value.title) {
    toast.error('กรุณากรอกปีและชื่อเรื่องให้ครบถ้วน')
    return
  }

  try {
    const payload = {
      year: String(newYearData.value.year),
      title: newYearData.value.title,
      description: newYearData.value.description || '',
    }
    toast.info(`กำลังสร้างปีงบประมาณ ${payload.year}...`)
    await itaService.createYear(payload)
    isCreateYearModalOpen.value = false
    toast.success(`สร้างปี ${payload.year} สำเร็จ!`)
    fetchYears()
  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error(err.message)
    } else {
      toast.error('ไม่สามารถสร้างปีใหม่ได้: เกิดข้อผิดพลาดที่ไม่คาดคิด')
    }
  }
}

const manageTopicsForYear = (yearId: string | number) => {
  router.push(`/dashboard/ita/year/${yearId}/topics`)
}

onMounted(() => {
  fetchYears()
})
</script>

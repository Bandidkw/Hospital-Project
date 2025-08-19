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
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-1/6"
            >
              ปีงบประมาณ (พ.ศ.)
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-2/5"
            >
              ชื่อเรื่อง (Title)
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-2/5"
            >
              คำอธิบาย (Description)
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
            <td colspan="4" class="px-6 py-4 text-center text-gray-500">
              ยังไม่มีปีงบประมาณในระบบ
            </td>
          </tr>
          <tr v-for="year in availableYears" :key="year.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">{{ year.year }}</td>
            <td class="px-6 py-4 text-gray-700">{{ year.title }}</td>
            <td class="px-6 py-4 text-gray-500 italic">{{ year.description || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
              <button
                @click="manageTopicsForYear(year.id)"
                class="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <i class="fas fa-folder-open mr-2"></i>
                จัดการหัวข้อ
              </button>

              <button
                @click="openEditYearModal(year)"
                class="inline-flex items-center px-4 py-2 bg-yellow-400 text-gray-700 text-sm font-medium rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-200"
              >
                <i class="fas fa-pencil-alt mr-2"></i>
                แก้ไข
              </button>

              <button
                @click="deleteYear(year.id)"
                class="inline-flex items-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <i class="fas fa-trash-alt mr-2"></i>
                ลบ
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          {{ isEditing ? 'แก้ไขปีงบประมาณ' : 'สร้างปีงบประมาณใหม่' }}
        </h2>
        <form @submit.prevent="handleFormSubmit" class="space-y-4">
          <div>
            <label for="year-input" class="block text-gray-700 font-bold mb-2"
              >ปีงบประมาณ (พ.ศ.):*</label
            >
            <input
              id="year-input"
              type="number"
              v-model="formData.year"
              placeholder="เช่น 2568"
              class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700"
              :disabled="isEditing"
              required
            />
          </div>
          <div>
            <label for="year-title" class="block text-gray-700 font-bold mb-2"
              >ชื่อเรื่อง (Title):*</label
            >
            <input
              id="year-title"
              type="text"
              v-model="formData.title"
              class="shadow rounded-lg w-full py-3 px-4"
              required
            />
          </div>
          <div>
            <label for="year-desc" class="block text-gray-700 font-bold mb-2"
              >คำอธิบาย (Description):</label
            >
            <textarea
              id="year-desc"
              v-model="formData.description"
              rows="3"
              class="shadow rounded-lg w-full py-3 px-4"
            ></textarea>
          </div>
          <div class="flex justify-end space-x-4 pt-6 mt-4 border-t">
            <button
              type="button"
              @click="closeModal"
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

// --- รวม State ของ Modal ไว้ที่เดียว ---
const isModalOpen = ref(false)
const isEditing = ref(false)
const editingYearId = ref<string | number | null>(null)
const formData = ref({
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

// --- ฟังก์ชันสำหรับเปิด Modal (ใช้ได้ทั้งสร้างและแก้ไข) ---
const openCreateYearModal = () => {
  isEditing.value = false
  const currentYear = new Date().getFullYear() + 543
  formData.value = {
    year: currentYear,
    title: `ปีงบประมาณ ${currentYear}`,
    description: `รายละเอียดข้อมูล ITA ประจำปีงบประมาณ ${currentYear}`,
  }
  isModalOpen.value = true
}

const openEditYearModal = (yearToEdit: YearIta) => {
  isEditing.value = true
  editingYearId.value = yearToEdit.id
  formData.value = {
    year: parseInt(yearToEdit.year),
    title: yearToEdit.title || '',
    description: yearToEdit.description || '',
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// --- ฟังก์ชัน Submit ที่จัดการได้ทั้งสร้างและแก้ไข ---
const handleFormSubmit = async () => {
  if (!formData.value.year || !formData.value.title) {
    toast.error('กรุณากรอกปีและชื่อเรื่องให้ครบถ้วน')
    return
  }

  try {
    if (isEditing.value && editingYearId.value) {
      // --- โหมดแก้ไข ---
      const payload = {
        title: formData.value.title,
        description: formData.value.description || '',
      }
      toast.info(`กำลังอัปเดตข้อมูลปี ${formData.value.year}...`)
      await itaService.updateYear(editingYearId.value, payload)
      toast.success(`อัปเดตข้อมูลปี ${formData.value.year} สำเร็จ!`)
    } else {
      // --- โหมดสร้างใหม่ ---
      const payload = {
        year: String(formData.value.year),
        title: formData.value.title,
        description: formData.value.description || '',
      }
      toast.info(`กำลังสร้างปีงบประมาณ ${payload.year}...`)
      await itaService.createYear(payload)
      toast.success(`สร้างปี ${payload.year} สำเร็จ!`)
    }

    closeModal()
    fetchYears() // ดึงข้อมูลใหม่
  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error(err.message)
    } else {
      toast.error('เกิดข้อผิดพลาดที่ไม่คาดคิด')
    }
  }
}

// --- เพิ่มฟังก์ชัน deleteYear เข้ามา ---
const deleteYear = async (yearId: string | number) => {
  if (
    confirm(
      `คุณแน่ใจหรือไม่ว่าต้องการลบปีงบประมาณ ID: ${yearId}? การกระทำนี้จะลบหัวข้อและเอกสารทั้งหมดที่อยู่ภายในปีนี้ด้วย และไม่สามารถกู้คืนได้!`,
    )
  ) {
    try {
      toast.info(`กำลังลบปี ID: ${yearId}...`)
      await itaService.deleteYear(yearId)
      toast.success(`ลบปี ID: ${yearId} สำเร็จ!`)
      fetchYears()
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('เกิดข้อผิดพลาดในการลบปีงบประมาณ')
      }
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

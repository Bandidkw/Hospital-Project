<template>
  <div class="p-6 bg-white rounded-xl shadow-lg">
    <h2 class="text-3xl font-bold text-gray-800 mb-6 flex items-center border-b pb-2">
      <i class="fas fa-users mr-3 text-purple-600"></i> จัดการบุคลากร
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับเพิ่ม, แก้ไข, และลบข้อมูลบุคลากรของโรงพยาบาล.</p>

    <div class="mb-6 flex justify-end">
      <button @click="openCreateModal" class="btn-primary">
        <i class="fas fa-plus mr-2"></i> เพิ่มบุคลากรใหม่
      </button>
    </div>

    <PersonnelFormModal
      :is-open="showFormModal"
      :personnel-data="currentPersonnel"
      :editing="editingPersonnel"
      :is-saving="isSaving"
      @close="closeFormModal"
      @save="savePersonnel"
    />

    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รายการบุคลากร</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">#</th>
              <th class="py-3 px-6 text-left">รูปภาพ</th>
              <th class="py-3 px-6 text-left">ชื่อ-นามสกุล</th>
              <th class="py-3 px-6 text-left">ตำแหน่ง</th>
              <th class="py-3 px-6 text-left">ความเชี่ยวชาญ</th>
              <th class="py-3 px-6 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-if="loading">
              <td colspan="6" class="py-8 text-center text-gray-500">
                <i class="fas fa-spinner fa-spin mr-2"></i>กำลังโหลดข้อมูล...
              </td>
            </tr>
            <tr v-else-if="errorMsg">
              <td colspan="6" class="py-8 text-center text-red-500">{{ errorMsg }}</td>
            </tr>
            <tr v-else-if="personnelList.length === 0">
              <td colspan="6" class="py-8 text-center text-gray-500">ยังไม่มีข้อมูลบุคลากร.</td>
            </tr>

            <tr
              v-else
              v-for="(personnel, index) in personnelList"
              :key="personnel.id"
              class="border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="py-3 px-6 text-left">{{ index + 1 }}</td>
              <td class="py-3 px-6 text-left">
                <img
                  :src="
                    personnel.imageUrl
                      ? absoluteImage(personnel.imageUrl)
                      : 'https://placehold.co/50x50/e0e0e0/333333?text=N/A'
                  "
                  alt="Personnel Image"
                  class="w-12 h-12 object-cover rounded-full"
                />
              </td>
              <td class="py-3 px-6 text-left">
                {{ personnel.name }}
                <span v-if="personnel.isDirector" class="ml-2 text-xs font-bold text-purple-600"
                  >(Director)</span
                >
              </td>
              <td class="py-3 px-6 text-left">{{ personnel.position }}</td>
              <td class="py-3 px-6 text-left">{{ personnel.specialty }}</td>
              <td class="py-3 px-6 text-center">
                <button @click="editPersonnel(personnel)" class="btn-action-edit mr-2">
                  <i class="fas fa-edit"></i> แก้ไข
                </button>
                <button @click="confirmDeletePersonnel(personnel.id)" class="btn-action-delete">
                  <i class="fas fa-trash-alt"></i> ลบ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลบุคลากรนี้?</p>
        <div class="flex justify-center space-x-4">
          <button @click="deletePersonnel" class="btn-confirm-delete">
            <i class="fas fa-trash-alt mr-2"></i> ลบ
          </button>
          <button @click="cancelDelete" class="btn-secondary">
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
import type { PersonnelItem } from '@/types/personnel'
import {
  getAdminPersonnelList,
  createPersonnel,
  updatePersonnel,
  deletePersonnel as deletePersonnelApi,
} from '@/services/personnelService'
import { isAxiosError } from '@/services/apiService'
import PersonnelFormModal from '@/components/dashboard/PersonnelFormModal.vue'

const toast = useToast()

const personnelList = ref<PersonnelItem[]>([])
const loading = ref(true)
const errorMsg = ref<string | null>(null)

const showFormModal = ref(false)
const isSaving = ref(false)

// 💡 Type สำหรับ Form Data
type PersonnelFormType = PersonnelItem & { imageFile: File | null }

const initialPersonnel: PersonnelFormType = {
  // 💡 แก้ Type ให้เป็น PersonnelFormType
  id: '',
  name: '',
  position: '',
  specialty: undefined,
  tel: undefined,
  imageUrl: null,
  isDirector: false,
  imageFile: null, // ✅ กำหนดให้ชัดเจน
}

const currentPersonnel = ref<PersonnelFormType>({ ...initialPersonnel }) // 💡 แก้ Type ให้เป็น PersonnelFormType
const editingPersonnel = ref(false)

const personnelToDeleteId = ref<string | null>(null)
const showConfirmModal = ref(false)

// ------------------------------------------------------------------
// READ (Load Data on Mount)
// ------------------------------------------------------------------

const fetchPersonnel = async () => {
  loading.value = true
  errorMsg.value = null
  try {
    const data = await getAdminPersonnelList()
    personnelList.value = data
  } catch (e) {
    console.error('Failed to fetch personnel:', e)
    errorMsg.value = 'ไม่สามารถโหลดข้อมูลบุคลากรได้ (โปรดตรวจสอบการเชื่อมต่อ API/สิทธิ์)'
  } finally {
    loading.value = false
  }
}

onMounted(fetchPersonnel)

// ------------------------------------------------------------------
// MODAL MANAGEMENT / CREATE / UPDATE (Save)
// ------------------------------------------------------------------

const openCreateModal = () => {
  currentPersonnel.value = { ...initialPersonnel }
  editingPersonnel.value = false
  showFormModal.value = true
}

const editPersonnel = (personnel: PersonnelItem) => {
  currentPersonnel.value = {
    ...personnel,
    imageFile: null, // ต้องรีเซ็ตไฟล์เมื่อเปิด Modal
  } as PersonnelFormType
  editingPersonnel.value = true
  showFormModal.value = true
}

const savePersonnel = async (data: PersonnelFormType) => {
  isSaving.value = true

  try {
    if (editingPersonnel.value) {
      // UPDATE
      if (!data.id) throw new Error('Personnel ID is missing for update.')
      // 💡 ส่ง data ที่มาจาก Modal ไป update
      await updatePersonnel(data.id, data)
      toast.success('แก้ไขข้อมูลบุคลากรสำเร็จ!')
    } else {
      // CREATE
      // 💡 ส่ง data ที่มาจาก Modal ไป create
      await createPersonnel(data)
      toast.success('เพิ่มบุคลากรสำเร็จ!')
    }

    await fetchPersonnel()
    closeFormModal()
  } catch (e) {
    let message = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
    if (isAxiosError(e) && e.response?.data) {
      const errorData = e.response.data as { message?: string }
      message = errorData.message || 'การบันทึกข้อมูลล้มเหลว'
    }
    toast.error(message)
    console.error('Save failed:', e)
  } finally {
    isSaving.value = false
  }
}

const closeFormModal = () => {
  showFormModal.value = false
  // 5. ล้างค่าใน input type="file" (ใช้ DOM API เพราะเราย้าย component ออกไปแล้ว)
  const fileInput = document.getElementById('personnelImage') as HTMLInputElement
  if (fileInput) fileInput.value = ''
  resetFormState()
}

// ------------------------------------------------------------------
// DELETE
// ------------------------------------------------------------------

const confirmDeletePersonnel = (id: string) => {
  personnelToDeleteId.value = id
  showConfirmModal.value = true
}

const deletePersonnel = async () => {
  if (!personnelToDeleteId.value) {
    resetDeleteConfirm()
    return
  }

  try {
    await deletePersonnelApi(personnelToDeleteId.value)
    toast.success('ลบข้อมูลบุคลากรสำเร็จ!')
    await fetchPersonnel()
  } catch (e) {
    let message = 'เกิดข้อผิดพลาดในการลบข้อมูล'
    if (isAxiosError(e) && e.response?.data) {
      const errorData = e.response.data as { message?: string }
      message = errorData.message || 'การลบข้อมูลล้มเหลว'
    }
    toast.error(message)
    console.error('Delete failed:', e)
  } finally {
    resetDeleteConfirm()
  }
}

// ------------------------------------------------------------------
// UTILITIES / STATE RESET
// ------------------------------------------------------------------

const resetFormState = () => {
  // 💡 เปลี่ยนชื่อจาก resetForm เป็น resetFormState
  currentPersonnel.value = { ...initialPersonnel }
  editingPersonnel.value = false
}

const resetDeleteConfirm = () => {
  personnelToDeleteId.value = null
  showConfirmModal.value = false
}

const cancelDelete = () => {
  resetDeleteConfirm()
}

// 💡 นำฟังก์ชัน absoluteImage กลับมาไว้ที่นี่ สำหรับใช้ในการแสดงผลตาราง
function absoluteImage(u?: string | null): string {
  if (!u) return 'https://placehold.co/100x100/e0e0e0/333333?text=N/A'
  if (/^https?:\/\//i.test(u)) return u
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
  const root = base.replace(/\/api(\/v\d+)?$/i, '')
  return `${root}/${String(u).replace(/^\/+/, '')}`
}
</script>

<style scoped>
/* Tailwind CSS Helper Classes (คงไว้เหมือนเดิม) */
.input-field {
  @apply mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500;
}
.btn-primary {
  @apply bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300;
}
.btn-secondary {
  @apply bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300;
}
.btn-action-edit {
  @apply bg-yellow-500 text-white px-3 py-1 rounded-md text-xs hover:bg-yellow-600 transition duration-300;
}
.btn-action-delete {
  @apply bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition duration-300;
}
.btn-confirm-delete {
  @apply bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300;
}
</style>

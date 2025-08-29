<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div v-if="moit" class="mb-8">
      <!-- ปุ่มกลับไปหน้ารายการหัวข้อของปี -->
      <router-link
        v-if="yearId"
        :to="{ name: 'dashboard-ita-topics', params: { yearId } }"
        class="text-blue-600 hover:underline text-lg mb-4 inline-block"
      >
        <i class="fas fa-arrow-left mr-2"></i>กลับไปหน้ารายการหัวข้อ
      </router-link>
      <div class="bg-white p-6 rounded-lg shadow-md border-l-8 border-blue-500">
        <h1 class="text-3xl font-extrabold text-blue-800">
          <span class="text-gray-500 font-normal">จัดการเอกสารในหัวข้อ:</span><br />
          {{ moit.title }}
        </h1>
        <p v-if="moit?.year_ita" class="text-gray-600 mt-2 text-lg">
          ปีงบประมาณ: <span class="font-semibold">{{ moit.year_ita?.year ?? '-' }}</span>
        </p>
      </div>
    </div>

    <!-- Loading / Error -->
    <div v-if="loading" class="text-center py-16">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
      <p class="mt-4 text-xl text-gray-600">กำลังโหลดข้อมูลหัวข้อ...</p>
    </div>

    <div v-else-if="error" class="text-center py-16 bg-red-50 p-8 rounded-lg">
      <p class="text-xl text-red-600">เกิดข้อผิดพลาด: {{ error }}</p>
    </div>

    <!-- Content -->
    <div v-else-if="moit">
      <!-- Form เอกสาร -->
      <DocumentForm
        :is-editing="editingDocument"
        :document-data="currentDocument"
        @save="saveDocument"
        @cancel="cancelEdit"
        @update:file="updateSelectedFile"
      />

      <!-- ตารางเอกสาร -->
      <DocumentTable :documents="documents" @edit="editDocument" @delete="confirmDeleteDocument" />
    </div>

    <!-- Modal ยืนยันลบ -->
    <div
      v-if="isDeleteConfirmationOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 class="text-lg font-bold text-gray-800 mb-4">ยืนยันการลบ</h2>
        <p class="text-gray-700 mb-4">
          คุณแน่ใจหรือไม่ว่าต้องการลบเอกสาร "{{ deleteDocumentTitle }}"?
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="isDeleteConfirmationOpen = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md"
          >
            ยกเลิก
          </button>
          <button
            @click="handleConfirmDelete"
            class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { itaService } from '@/services/itaService'
import type { MoitWithYear, Moit, ItaDocument } from '@/types/ita'
import { getMoitYearId } from '@/types/ita'
import { useToast } from 'vue-toastification'
import DocumentForm from '@/views/dashboard/ita/DocumentForm.vue'
import DocumentTable from '@/views/dashboard/ita/DocumentTable.vue'

/* -----------------------------
 * Setup
 * --------------------------- */
const route = useRoute()
const toast = useToast()

// รองรับทั้ง :moitId และ :id (กันเคส router ต่างชื่อ)
const moitId = (route.params.moitId ?? route.params.id) as string | undefined

/* -----------------------------
 * State
 * --------------------------- */
const moit = ref<MoitWithYear | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const editingDocument = ref(false)
const currentDocument = ref<Partial<ItaDocument>>({})
const selectedFile = ref<File | null>(null)

const isDeleteConfirmationOpen = ref(false)
const deleteDocumentId = ref<string | null>(null)
const deleteDocumentTitle = ref('')

/* -----------------------------
 * Computed
 * --------------------------- */
// yearId ปลอดภัย (รองรับทั้ง year_ita_id / year_ita.id)
const yearId = computed(() => (moit.value ? getMoitYearId(moit.value) : undefined))

// เอกสารส่งให้ตารางเป็นอาเรย์เสมอ
const documents = computed<ItaDocument[]>(() => moit.value?.documents ?? [])

/* -----------------------------
 * Helpers
 * --------------------------- */
// แปลง Moit ดิบ -> MoitWithYear ให้พร้อมใช้เสมอ
function toMoitWithYear(raw: Moit): MoitWithYear {
  return {
    ...raw,
    year_ita: raw.year_ita ?? (raw.year_ita_id ? { id: raw.year_ita_id } : null),
    documents: raw.documents ?? [],
  }
}

/* -----------------------------
 * API Calls
 * --------------------------- */
const fetchTopicDetails = async () => {
  if (!moitId) {
    error.value = 'ไม่พบ ID ของหัวข้อ'
    loading.value = false
    return
  }
  loading.value = true
  error.value = null
  try {
    const data = await itaService.getMoitById(moitId)
    moit.value = toMoitWithYear(data)
    resetForm() // เคลียร์ฟอร์มเมื่อโหลดข้อมูลสำเร็จ
  } catch (err: unknown) {
    console.error('An error occurred during fetchTopicDetails:', err)
    error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
    toast.error(error.value || 'ไม่สามารถดึงข้อมูลหัวข้อได้')
  } finally {
    loading.value = false
  }
}

const saveDocument = async (documentData: Partial<ItaDocument>) => {
  // validate ขั้นพื้นฐาน
  const isTitleInvalid = !documentData.title?.trim()
  const isSubTopicInvalid = !documentData.sub_topic?.trim()
  const isFileRequired = !editingDocument.value && !selectedFile.value

  if (isTitleInvalid || isSubTopicInvalid || isFileRequired) {
    toast.error('กรุณากรอกข้อมูลในช่องที่มีเครื่องหมาย * ให้ครบถ้วน')
    return
  }

  // สร้าง FormData
  const formData = new FormData()
  formData.append('title', documentData.title!)
  formData.append('sub_topic', documentData.sub_topic!)
  formData.append('quarter', String(documentData.quarter ?? 1)) // เป็น string เสมอ
  if (documentData.description) formData.append('description', documentData.description)
  if (selectedFile.value) formData.append('file', selectedFile.value)

  try {
    toast.info('กำลังบันทึกข้อมูลเอกสาร...')

    if (editingDocument.value && documentData.id) {
      await itaService.updateDocument(documentData.id, formData)
      toast.success('แก้ไขเอกสารสำเร็จ!')
    } else {
      if (!moit.value?.id) {
        toast.error('ไม่พบข้อมูลหัวข้อ (moit)')
        return
      }
      // service จะ set('moit_id', ...) ให้เอง
      await itaService.createDocument(String(moit.value.id), formData)
      toast.success('เพิ่มเอกสารใหม่สำเร็จ!')
    }

    await fetchTopicDetails() // refresh
    resetForm()
    selectedFile.value = null
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
  }
}

const deleteDocument = async (docId: string) => {
  isDeleteConfirmationOpen.value = false
  try {
    toast.info(`กำลังลบเอกสาร ID: ${docId}...`)
    await itaService.deleteDocument(docId)
    toast.success(`ลบเอกสาร ID: ${docId} สำเร็จ!`)
    await fetchTopicDetails()
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบเอกสาร')
  }
}

/* -----------------------------
 * UI Handlers
 * --------------------------- */
const updateSelectedFile = (file: File | null) => {
  selectedFile.value = file
}

const editDocument = (doc: ItaDocument) => {
  editingDocument.value = true
  currentDocument.value = { ...doc }
  selectedFile.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const confirmDeleteDocument = (doc: ItaDocument) => {
  deleteDocumentId.value = doc.id
  deleteDocumentTitle.value = doc.title
  isDeleteConfirmationOpen.value = true
}

const handleConfirmDelete = () => {
  if (deleteDocumentId.value !== null) deleteDocument(deleteDocumentId.value)
}

const resetForm = () => {
  editingDocument.value = false
  currentDocument.value = {
    title: '',
    sub_topic: '',
    quarter: '',
    description: '',
  }
  selectedFile.value = null
}

const cancelEdit = () => {
  resetForm()
  toast.info('ยกเลิกการแก้ไข')
}

/* -----------------------------
 * Lifecycle
 * --------------------------- */
onMounted(() => {
  fetchTopicDetails()
})
</script>

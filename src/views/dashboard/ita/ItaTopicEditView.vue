<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <div v-if="moit" class="mb-8">
      <router-link
        v-if="moit?.year_ita?.id"
        :to="{ name: 'dashboard-ita-topics', params: { yearId: moit.year_ita!.id } }"
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
          ปีงบประมาณ: <span class="font-semibold">{{ moit?.year_ita?.year ?? '-' }}</span>
        </p>
      </div>
    </div>

    <div v-if="loading" class="text-center py-16">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
      <p class="mt-4 text-xl text-gray-600">กำลังโหลดข้อมูลหัวข้อ...</p>
    </div>
    <div v-else-if="error" class="text-center py-16 bg-red-50 p-8 rounded-lg">
      <p class="text-xl text-red-600">เกิดข้อผิดพลาด: {{ error }}</p>
    </div>

    <div v-else-if="moit">
      <DocumentForm
        :is-editing="editingDocument"
        :document-data="currentDocument"
        @save="saveDocument"
        @cancel="cancelEdit"
        @update:file="updateSelectedFile"
      />

      <DocumentTable
        :documents="moit.documents"
        @edit="editDocument"
        @delete="confirmDeleteDocument"
      />
    </div>

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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { itaService, type MoitWithYear } from '@/services/itaService'
// import { computed } from 'vue'
import type { ItaDocument } from '@/types/ita'
import { useToast } from 'vue-toastification'
import DocumentForm from '@/views/dashboard/ita/DocumentForm.vue'
import DocumentTable from '@/views/dashboard/ita/DocumentTable.vue'

// --- Setup ---
const route = useRoute()
// const router = useRouter()
const toast = useToast()

const moitId = route.params.id as string

// --- State (หน้านี้เป็น "ศูนย์กลางควบคุม" ทั้งหมด) ---
const moit = ref<MoitWithYear | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const editingDocument = ref(false)
const currentDocument = ref<Partial<ItaDocument>>({})
const selectedFile = ref<File | null>(null)

const isDeleteConfirmationOpen = ref(false)
const deleteDocumentId = ref<string | null>(null)
const deleteDocumentTitle = ref('')

// --- Data Fetching and Mutations (ฟังก์ชันที่ติดต่อกับ API) ---

const fetchTopicDetails = async () => {
  if (!moitId) {
    error.value = 'ไม่พบ ID ของหัวข้อ'
    loading.value = false
    return
  }
  loading.value = true
  error.value = null
  try {
    moit.value = await itaService.getTopicById(moitId)
    resetForm() // เคลียร์ฟอร์มเมื่อโหลดข้อมูลสำเร็จ
  } catch (err: unknown) {
    console.error('An error occurred during fetchTopicDetails:', err)
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
    }
    toast.error(error.value || 'ไม่สามารถดึงข้อมูลหัวข้อได้')
  } finally {
    loading.value = false
  }
}

const saveDocument = async (documentData: Partial<ItaDocument>) => {
  if (!documentData.title || !documentData.sub_topic) {
    toast.error('กรุณากรอกชื่อเอกสารและหัวข้อย่อยให้ครบถ้วน')
    return
  }
  if (!editingDocument.value && !selectedFile.value) {
    toast.error('กรุณาแนบไฟล์ PDF สำหรับเอกสารใหม่')
    return
  }

  // สร้าง FormData object เพื่อส่งไฟล์และข้อมูล
  const formData = new FormData()
  formData.append('title', documentData.title)
  formData.append('sub_topic', documentData.sub_topic)
  formData.append('quarter', String(documentData.quarter || 1))
  if (documentData.description) {
    formData.append('description', documentData.description)
  }
  if (selectedFile.value) {
    formData.append('file', selectedFile.value)
  }

  try {
    toast.info('กำลังบันทึกข้อมูลเอกสาร...')
    if (editingDocument.value && documentData.id) {
      await itaService.updateDocument(documentData.id, formData)
      toast.success('แก้ไขเอกสารสำเร็จ!')
    } else {
      await itaService.createDocument(moitId, formData)
      toast.success('เพิ่มเอกสารใหม่สำเร็จ!')
    }
    await fetchTopicDetails() // Refresh ข้อมูล
    resetForm()
  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error(err.message)
    } else {
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    }
  }
}

const deleteDocument = async (docId: string) => {
  isDeleteConfirmationOpen.value = false
  try {
    toast.info(`กำลังลบเอกสาร ID: ${docId}...`)
    await itaService.deleteDocument(docId)
    toast.success(`ลบเอกสาร ID: ${docId} สำเร็จ!`)
    await fetchTopicDetails() // Refresh ข้อมูล
  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error(err.message)
    } else {
      toast.error('เกิดข้อผิดพลาดในการลบเอกสาร')
    }
  }
}

// --- UI Control Functions (ฟังก์ชันที่ถูกเรียกจาก Component ลูก) ---
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
  if (deleteDocumentId.value !== null) {
    deleteDocument(deleteDocumentId.value)
  }
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

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchTopicDetails()
})
</script>

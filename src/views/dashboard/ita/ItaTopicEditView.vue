<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <div v-if="moit" class="mb-8">
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

      <div class="flex justify-end mt-6 mb-4">
        <button
          @click="openCreateModal"
          class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition duration-200 flex items-center"
        >
          <i class="fas fa-plus-circle mr-2"></i> เพิ่มเอกสารใหม่
        </button>
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
      <DocumentTable
        :documents="moit?.documents ?? []"
        @edit="editDocument"
        @delete="confirmDeleteDocument"
      />
    </div>

    <div
      v-if="isFormModalOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
      >
        <div
          class="sticky top-0 px-6 py-4 border-b bg-blue-600 text-white rounded-t-xl z-10 shadow-md"
        >
          <h2 class="text-xl font-bold">
            <i class="fas fa-file-alt mr-2"></i>
            {{ editingDocument ? 'แก้ไขเอกสาร' : 'เพิ่มเอกสารใหม่' }}
          </h2>
        </div>

        <div class="p-6">
          <DocumentForm
            :is-editing="editingDocument"
            :document-data="currentDocument"
            @save="saveDocument"
            @cancel="cancelEdit"
            @update:file="updateSelectedFile"
          />
        </div>
      </div>
    </div>

    <div
      v-if="isDeleteConfirmationOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 class="text-xl font-bold text-red-700 mb-4 flex items-center">
          <i class="fas fa-exclamation-triangle mr-2"></i> ยืนยันการลบ
        </h2>
        <p class="text-gray-700 mb-6">
          คุณแน่ใจหรือไม่ว่าต้องการลบเอกสาร "<span class="font-semibold text-red-600">{{
            deleteDocumentTitle
          }}</span
          >" นี้? การกระทำนี้ไม่สามารถยกเลิกได้
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="isDeleteConfirmationOpen = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
          >
            ยกเลิก
          </button>
          <button
            @click="handleConfirmDelete"
            class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
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

const route = useRoute()
const toast = useToast()

const isFormModalOpen = ref(false)

// รองรับทั้ง :id และ :moitId ใน router (กันพังถ้าชื่อ param ไม่ตรง)
const moitId = (route.params.moitId ?? route.params.id) as string | undefined

const moit = ref<MoitWithYear | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const editingDocument = ref(false)
const currentDocument = ref<Partial<ItaDocument>>({})
const selectedFile = ref<File | null>(null)

const isDeleteConfirmationOpen = ref(false)
const deleteDocumentId = ref<string | null>(null)
const deleteDocumentTitle = ref('')

// ✅ yearId จาก helper (กัน undefined โดยไม่อ้าง field ตรง ๆ)
const yearId = computed(() => (moit.value ? getMoitYearId(moit.value) : undefined))

// แปลง Moit ดิบ -> MoitWithYear (ให้ year_ita & documents พร้อมใช้เสมอ)
function toMoitWithYear(raw: Moit): MoitWithYear {
  return {
    ...raw,
    year_ita: raw.year_ita ?? (raw.year_ita_id ? { id: raw.year_ita_id } : null),
    documents: raw.documents ?? [],
  }
}

const fetchTopicDetails = async () => {
  if (!moitId) {
    error.value = 'ไม่พบ ID ของหัวข้อ'
    loading.value = false
    return
  }
  loading.value = true
  error.value = null
  try {
    const [moitRaw, docs] = await Promise.all([
      itaService.getMoitById(moitId),
      itaService.getDocumentsByMoitId(moitId), // ← ดึงทั้งหมดแล้วกรอง
    ])

    moit.value = {
      ...toMoitWithYear(moitRaw),
      documents: docs ?? [],
    }

    resetForm()
  } catch (err: unknown) {
    console.error('An error occurred during fetchTopicDetails:', err)
    error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
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

  if (selectedFile.value && selectedFile.value.size > 20 * 1024 * 1024) {
    toast.error('ไฟล์มีขนาดเกิน 20MB กรุณาบีบอัดหรือแบ่งไฟล์ก่อนอัปโหลด')
    return
  }

  const formData = new FormData()
  formData.append('title', documentData.title)
  formData.append('sub_topic', documentData.sub_topic)
  formData.append('quarter', String(documentData.quarter ?? 1))
  if (documentData.description) formData.append('description', documentData.description)
  if (selectedFile.value) formData.append('file', selectedFile.value)

  try {
    toast.info('กำลังบันทึกข้อมูลเอกสาร...')
    if (editingDocument.value && documentData.id) {
      await itaService.updateDocument(documentData.id, formData)
      toast.success('แก้ไขเอกสารสำเร็จ!')
    } else {
      const targetMoitId = moit.value?.id ?? moitId
      if (!targetMoitId) {
        toast.error('ไม่พบรหัสหัวข้อ (moitId) สำหรับเพิ่มเอกสาร')
        return
      }
      await itaService.createDocument(String(targetMoitId), formData) // บังคับเป็น string ชัดเจน
      toast.success('เพิ่มเอกสารใหม่สำเร็จ!')
    }

    await fetchTopicDetails()
    resetForm()
    selectedFile.value = null
    isFormModalOpen.value = false // 💡 ปิด Modal หลังจากบันทึกสำเร็จ
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
  isFormModalOpen.value = true
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
  isFormModalOpen.value = false // 💡 ปิด Modal เมื่อยกเลิก
  toast.info('ยกเลิกการแก้ไข')
}
// 💡 ฟังก์ชันใหม่: เปิด Modal สำหรับเพิ่มเอกสารใหม่
const openCreateModal = () => {
  resetForm()
  editingDocument.value = false // ยืนยันว่าเป็นโหมดสร้าง
  isFormModalOpen.value = true
}

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchTopicDetails()
})
</script>

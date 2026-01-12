<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50/50">
    <!-- Header Section -->
    <div v-if="moit" class="mb-8 animate-fade-in-down">
      <router-link
        v-if="yearId"
        :to="{ name: 'dashboard-ita-topics', params: { yearId } }"
        class="group inline-flex items-center text-slate-500 hover:text-indigo-600 font-medium mb-6 transition-colors duration-200"
      >
        <span
          class="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200 text-sm border border-slate-100"
        >
          <i class="fas fa-arrow-left"></i>
        </span>
        กลับไปหน้ารายการหัวข้อ
      </router-link>

      <div
        class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative group"
      >
        <div class="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
        <div class="p-8 relative z-10">
          <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span
                  class="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wide uppercase"
                >
                  ITA {{ moit.year_ita?.year ?? 'Unknown' }}
                </span>
                <span class="text-slate-400 text-sm flex items-center gap-1">
                  <i class="fas fa-folder-open text-xs"></i>
                  <span>{{ moit.documents?.length ?? 0 }} เอกสาร</span>
                </span>
              </div>
              <h1 class="text-2xl md:text-3xl font-bold text-slate-800 leading-relaxed max-w-4xl">
                {{ moit.title }}
              </h1>
            </div>

            <button
              @click="openCreateModal"
              class="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-200 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 flex items-center justify-center gap-2"
            >
              <i class="fas fa-plus-circle text-lg"></i>
              <span>เพิ่มเอกสารใหม่</span>
            </button>
          </div>
        </div>
        <!-- Decorative background pattern -->
        <div
          class="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none"
        ></div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 animate-pulse">
      <div
        class="w-16 h-16 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-slate-500 text-lg font-medium">กำลังโหลดข้อมูล...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="max-w-xl mx-auto text-center py-16 bg-white rounded-2xl shadow-sm border border-red-100 p-8 animate-fade-in"
    >
      <div
        class="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h3 class="text-xl font-bold text-slate-800 mb-2">เกิดข้อผิดพลาด</h3>
      <p class="text-slate-500 mb-6">{{ error }}</p>
      <button
        @click="fetchTopicDetails"
        class="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline"
      >
        ลองใหม่อีกครั้ง
      </button>
    </div>

    <!-- Content -->
    <div v-else-if="moit" class="animate-fade-in-up">
      <DocumentTable
        :documents="moit?.documents ?? []"
        @edit="editDocument"
        @delete="confirmDeleteDocument"
      />
    </div>

    <!-- Form Modal with Enhanced UI -->
    <transition name="modal-backdrop">
      <div
        v-if="isFormModalOpen"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
        @click.self="cancelEdit"
      >
        <transition name="modal-scale">
          <div
            v-if="isFormModalOpen"
            class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden relative"
          >
            <!-- Modal Header -->
            <div
              class="relative bg-white pt-6 px-6 pb-2 z-10 flex-shrink-0 flex items-center justify-between"
            >
              <div>
                <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg shadow-sm"
                  >
                    <i class="fas" :class="editingDocument ? 'fa-edit' : 'fa-file-medical'"></i>
                  </div>
                  {{ editingDocument ? 'แก้ไขเอกสาร' : 'เพิ่มเอกสารใหม่' }}
                </h2>
                <p class="text-slate-500 text-sm ml-[3.25rem] mt-1">
                  กรอกข้อมูลเอกสารด้านล่างให้ครบถ้วน
                </p>
              </div>

              <button
                @click="cancelEdit"
                class="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center transition-colors"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <!-- Modal Content (Scrollable) -->
            <div class="p-6 overflow-y-auto custom-scrollbar">
              <DocumentForm
                :is-editing="editingDocument"
                :document-data="currentDocument"
                @save="saveDocument"
                @cancel="cancelEdit"
                @update:file="updateSelectedFile"
              />
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition name="modal-backdrop">
      <div
        v-if="isDeleteConfirmationOpen"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
        @click.self="isDeleteConfirmationOpen = false"
      >
        <transition name="modal-bounce">
          <div
            v-if="isDeleteConfirmationOpen"
            class="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-md overflow-hidden"
          >
            <div class="p-8 text-center">
              <div
                class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm"
              >
                <i class="fas fa-trash-alt"></i>
              </div>
              <h3 class="text-2xl font-bold text-slate-800 mb-2">ยืนยันการลบ?</h3>
              <p class="text-slate-500 mb-8 leading-relaxed">
                คุณแน่ใจหรือไม่ว่าต้องการลบเอกสาร <br />
                "<span class="font-semibold text-slate-700">{{ deleteDocumentTitle }}</span
                >" <br />
                การกระทำนี้ไม่สามารถยกเลิกได้
              </p>
              <div class="flex gap-3 justify-center">
                <button
                  @click="isDeleteConfirmationOpen = false"
                  class="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  @click="handleConfirmDelete"
                  class="px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold shadow-lg shadow-red-200 hover:bg-red-700 hover:-translate-y-0.5 transition-all"
                >
                  ยืนยันลบ
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
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

const yearId = computed(() => (moit.value ? getMoitYearId(moit.value) : undefined))

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
      itaService.getDocumentsByMoitId(moitId),
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
    if (editingDocument.value && documentData.id) {
      await itaService.updateDocument(documentData.id, formData)
      toast.success('แก้ไขเอกสารสำเร็จ!')
    } else {
      const targetMoitId = moit.value?.id ?? moitId
      if (!targetMoitId) {
        toast.error('ไม่พบรหัสหัวข้อ (moitId) สำหรับเพิ่มเอกสาร')
        return
      }
      await itaService.createDocument(String(targetMoitId), formData)
      toast.success('เพิ่มเอกสารใหม่สำเร็จ!')
    }

    await fetchTopicDetails()
    resetForm()
    selectedFile.value = null
    isFormModalOpen.value = false
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
  }
}

const deleteDocument = async (docId: string) => {
  isDeleteConfirmationOpen.value = false
  try {
    await itaService.deleteDocument(docId)
    toast.success(`ลบเอกสาร ID: ${docId} สำเร็จ!`)
    await fetchTopicDetails()
  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error(err.message)
    } else {
      toast.error('เกิดข้อผิดพลาดในการลบเอกสาร')
    }
  }
}

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
  isFormModalOpen.value = false
  toast.info('ยกเลิกแล้ว')
}

const openCreateModal = () => {
  resetForm()
  editingDocument.value = false
  isFormModalOpen.value = true
}

onMounted(() => {
  fetchTopicDetails()
})
</script>

<style scoped>
/* Page Animations */
.animate-fade-in-down {
  animation: fadeInDown 0.6s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Modal Transitions */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.modal-bounce-enter-active {
  animation: bounce-in 0.4s;
}
.modal-bounce-leave-active {
  transition: all 0.2s ease-in;
  opacity: 0;
  transform: scale(0.9);
}

@keyframes bounce-in {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  50% {
    transform: scale(1.03);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>

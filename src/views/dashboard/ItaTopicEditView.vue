<!-- ItaTopicEditView.vue -->
<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <div v-if="moit" class="mb-8">
      <router-link
        :to="`/dashboard/ita/year/${moit.ita_topic_id}/topics`"
        class="text-blue-600 hover:underline text-lg mb-4 inline-block"
      >
        <i class="fas fa-arrow-left mr-2"></i>กลับไปหน้ารายการหัวข้อ
      </router-link>
      <div class="bg-white p-6 rounded-lg shadow-md border-l-8 border-blue-500">
        <h1 class="text-3xl font-extrabold text-blue-800">
          <span class="text-gray-500 font-normal">จัดการเอกสารในหัวข้อ:</span><br />
          {{ moit.title }}
        </h1>
        <p class="text-gray-600 mt-2 text-lg">
          ปีงบประมาณ: <span class="font-semibold">{{ moit.yearData.year }}</span>
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
      <div class="bg-white p-6 rounded-lg shadow-xl mb-8">
        <h2 class="text-2xl font-semibold text-blue-700 mb-6 border-b pb-4">
          <i class="fas" :class="editingDocument ? 'fa-edit' : 'fa-plus-circle'"></i>
          {{ editingDocument ? 'แก้ไขเอกสาร' : 'เพิ่มเอกสารใหม่' }}
        </h2>
        <form @submit.prevent="saveDocument" class="space-y-6">
          <div>
            <label for="docTitle" class="block text-gray-700 font-bold mb-2"
              >ชื่อเอกสาร (Title):*</label
            >
            <input
              id="docTitle"
              type="text"
              v-model.trim="currentDocument.title"
              placeholder="ระบุชื่อเอกสารให้ชัดเจน"
              class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': isTitleInvalid }"
            />
            <p v-if="isTitleInvalid" class="text-red-500 text-sm mt-1">กรุณาระบุชื่อเอกสาร</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="docSubTopic" class="block text-gray-700 font-bold mb-2"
                >หัวข้อย่อย (Sub-topic):*</label
              >
              <input
                id="docSubTopic"
                type="text"
                v-model.trim="currentDocument.sub_topic"
                placeholder="เช่น ประกาศ, รายงานผล"
                class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': isSubTopicInvalid }"
              />
              <p v-if="isSubTopicInvalid" class="text-red-500 text-sm mt-1">กรุณาระบุหัวข้อย่อย</p>
            </div>
            <div>
              <label for="docQuarter" class="block text-gray-700 font-bold mb-2"
                >ไตรมาส (Quarter):*</label
              >
              <select
                id="docQuarter"
                v-model="currentDocument.quarter"
                class="shadow border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option :value="1">ไตรมาส 1</option>
                <option :value="2">ไตรมาส 2</option>
                <option :value="3">ไตรมาส 3</option>
                <option :value="4">ไตรมาส 4</option>
              </select>
            </div>
          </div>
          <div>
            <label for="docDesc" class="block text-gray-700 font-bold mb-2"
              >คำอธิบาย (Description):</label
            >
            <textarea
              id="docDesc"
              v-model.trim="currentDocument.description"
              rows="3"
              placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับเอกสารนี้"
              class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div>
            <label for="docFile" class="block text-gray-700 font-bold mb-2"
              >ไฟล์เอกสาร (PDF):*</label
            >
            <input
              id="docFile"
              type="file"
              @change="handleFileUpload"
              accept=".pdf"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
              :class="{ 'border-red-500': isFileRequired }"
            />
            <p v-if="isFileRequired" class="text-red-500 text-sm mt-1">กรุณาแนบไฟล์ PDF</p>
            <p v-if="selectedFile" class="text-sm text-gray-600 mt-2">
              ไฟล์ที่เลือก: <span class="font-medium text-blue-800">{{ selectedFile.name }}</span>
            </p>
            <p v-else-if="currentDocument.fileUrl" class="text-sm text-gray-600 mt-2">
              ไฟล์ปัจจุบัน:
              <a
                :href="currentDocument.fileUrl"
                target="_blank"
                class="font-medium text-blue-800 hover:underline"
                >{{ currentDocument.fileName || 'ดูไฟล์' }}</a
              >
            </p>
          </div>
          <div class="flex items-center justify-end space-x-4 pt-4 border-t">
            <button
              v-if="editingDocument"
              type="button"
              @click="cancelEdit"
              class="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-full transition duration-300"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300"
            >
              <i class="fas fa-save mr-2"></i>
              {{ editingDocument ? 'บันทึกการแก้ไข' : 'เพิ่มเอกสาร' }}
            </button>
          </div>
        </form>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-xl mt-12">
        <h2 class="text-2xl font-semibold text-blue-700 mb-6">รายการเอกสารทั้งหมดในหัวข้อนี้</h2>
        <div class="overflow-x-auto rounded-lg border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-blue-100">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  ชื่อเอกสาร
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  หัวข้อย่อย
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  ไตรมาส
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="!moit.documents || moit.documents.length === 0">
                <td colspan="4" class="px-6 py-10 text-center text-gray-500">
                  ยังไม่มีเอกสารในหัวข้อนี้
                </td>
              </tr>
              <tr v-for="doc in moit.documents" :key="doc.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <a
                    :href="doc.fileUrl"
                    target="_blank"
                    class="font-medium text-blue-600 hover:underline"
                    >{{ doc.title }}</a
                  >
                  <p v-if="doc.description" class="text-sm text-gray-500 mt-1">
                    {{ doc.description }}
                  </p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ doc.sub_topic }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-gray-700">
                  {{ doc.quarter || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    @click="editDocument(doc)"
                    class="text-indigo-600 hover:text-indigo-900 p-2"
                    title="แก้ไข"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="confirmDeleteDocument(doc.id, doc.title)"
                    class="text-red-600 hover:text-red-900 p-2 ml-2"
                    title="ลบ"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
import { useRoute, useRouter } from 'vue-router'
import { itaService, type MoitWithYear } from '@/services/itaService'
import type { ItaDocument } from '@/types/ita'
import { useToast } from 'vue-toastification'

const route = useRoute()
// const router = useRouter()
const toast = useToast()
const moitId = route.params.id as string

const moit = ref<MoitWithYear | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const editingDocument = ref(false)
const currentDocument = ref<Partial<ItaDocument>>({
  title: '',
  sub_topic: '',
  quarter: 1,
  description: '',
})
const selectedFile = ref<File | null>(null)

const isTitleInvalid = ref(false)
const isSubTopicInvalid = ref(false)
const isFileRequired = ref(false)

const isDeleteConfirmationOpen = ref(false)
const deleteDocumentId = ref<string | null>(null)
const deleteDocumentTitle = ref('')

const fetchTopicDetails = async () => {
  if (!moitId) {
    error.value = 'ไม่พบ ID ของหัวข้อ'
    loading.value = false
    return
  }
  loading.value = true
  error.value = null
  try {
    // *** TODO: เมื่อ API พร้อม ให้เปิดใช้งานบรรทัดนี้ ***
    // moit.value = await itaService.getTopicById(moitId);

    // 2. ข้อมูลจำลองที่สมบูรณ์และถูกต้อง 100%
    toast.info(`(จำลอง) กำลังโหลดข้อมูลสำหรับ Topic ID: ${moitId}`)
    moit.value = {
      id: moitId,
      ita_topic_id: 'year-123',
      moit_name: 'MOIT 1',
      title: `MOIT 1: หน่วยงานมีการวางระบบโดยการกำหนดมาตรการ...`,
      description: 'คำอธิบายเพิ่มเติมของหัวข้อ MOIT (ถ้ามี)',
      documents: [
        {
          id: '101',
          topic_id: moitId,
          title: 'คำสั่งแต่งตั้งคณะทำงาน ITA 2567',
          sub_topic: 'คำสั่ง',
          quarter: 1,
          fileUrl: '#',
          fileName: 'cmd-ita-2567.pdf',
          description: 'คำสั่งแต่งตั้งคณะทำงานอย่างเป็นทางการ',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '102',
          topic_id: moitId,
          title: 'ประกาศช่องทางการเผยแพร่ข้อมูล',
          sub_topic: 'ประกาศ',
          quarter: 1,
          fileUrl: '#',
          fileName: 'announce-channel.pdf',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      yearData: {
        id: 'year-123',
        year: '2567',
        moits: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }
    resetForm()
  } catch (err: unknown) {
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

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
  } else {
    selectedFile.value = null
  }
}

const saveDocument = async () => {
  isTitleInvalid.value = !currentDocument.value.title?.trim()
  isSubTopicInvalid.value = !currentDocument.value.sub_topic?.trim()
  isFileRequired.value = !editingDocument.value && !selectedFile.value

  if (isTitleInvalid.value || isSubTopicInvalid.value || isFileRequired.value) {
    toast.error('กรุณากรอกข้อมูลในช่องที่มีเครื่องหมาย * ให้ครบถ้วน')
    return
  }

  toast.info(`(จำลอง) กำลังบันทึกข้อมูลเอกสาร...`)
  // *** TODO: สร้าง FormData object และเรียกใช้ itaService ***

  if (editingDocument.value) {
    // await itaService.updateDocument(currentDocument.value.id, formData);
    toast.success('แก้ไขเอกสารสำเร็จ!')
  } else {
    // await itaService.createDocument(moitId, formData);
    toast.success('เพิ่มเอกสารใหม่สำเร็จ!')
  }
  fetchTopicDetails()
  resetForm()
}

const editDocument = (doc: ItaDocument) => {
  editingDocument.value = true
  currentDocument.value = { ...doc }
  selectedFile.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const confirmDeleteDocument = (docId: string, docTitle: string) => {
  deleteDocumentId.value = docId
  deleteDocumentTitle.value = docTitle
  isDeleteConfirmationOpen.value = true
}

const handleConfirmDelete = () => {
  if (deleteDocumentId.value !== null) {
    deleteDocument(deleteDocumentId.value)
  } else {
    toast.error('เกิดข้อผิดพลาด: ไม่พบ ID ของเอกสารที่จะลบ')
    isDeleteConfirmationOpen.value = false
  }
}

const deleteDocument = async (docId: string) => {
  if (!isDeleteConfirmationOpen.value) return

  isDeleteConfirmationOpen.value = false
  toast.info(`(จำลอง) กำลังลบเอกสาร ID: ${docId}`)
  // await itaService.deleteDocument(docId);
  toast.success(`(จำลอง) ลบเอกสาร ID: ${docId} สำเร็จ!`)
  fetchTopicDetails()
}

const resetForm = () => {
  editingDocument.value = false
  currentDocument.value = {
    title: '',
    sub_topic: '',
    quarter: 1,
    description: '',
  }
  selectedFile.value = null
  const fileInput = document.getElementById('docFile') as HTMLInputElement
  if (fileInput) fileInput.value = ''
}

const cancelEdit = () => {
  resetForm()
  toast.info('ยกเลิกการแก้ไข')
}

onMounted(() => {
  fetchTopicDetails()
})
</script>

<!-- AddEditItaModal.vue -->
<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
      <h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
        {{ documentToEdit ? 'แก้ไขเอกสาร' : 'เพิ่มเอกสารใหม่' }}
      </h2>
      <form @submit.prevent="saveDocument" class="space-y-6">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2"
            >ชื่อเอกสาร (Title):*</label
          >
          <input
            type="text"
            id="title"
            v-model="currentDocument.title"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="sub_topic" class="block text-sm font-medium text-gray-700 mb-2"
              >หัวข้อย่อย (Sub-topic):*</label
            >
            <input
              type="text"
              id="sub_topic"
              v-model="currentDocument.sub_topic"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label for="quarter" class="block text-sm font-medium text-gray-700 mb-2"
              >ไตรมาส (Quarter):*</label
            >
            <select
              id="quarter"
              v-model.number="currentDocument.quarter"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option :value="1">ไตรมาส 1</option>
              <option :value="2">ไตรมาส 2</option>
              <option :value="3">ไตรมาส 3</option>
              <option :value="4">ไตรมาส 4</option>
            </select>
          </div>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2"
            >คำอธิบาย (Description):</label
          >
          <textarea
            id="description"
            v-model="currentDocument.description"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <div>
          <label for="fileUpload" class="block text-sm font-medium text-gray-700 mb-2"
            >ไฟล์เอกสาร (PDF):*</label
          >
          <input
            type="file"
            id="fileUpload"
            @change="handleFileSelect"
            accept=".pdf"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
          <p v-if="selectedFile" class="text-sm text-gray-600 mt-2">
            ไฟล์ที่เลือก: <span class="font-medium text-blue-800">{{ selectedFile.name }}</span>
          </p>
          <p v-else-if="documentToEdit?.fileUrl" class="text-sm text-gray-600 mt-2">
            ไฟล์ปัจจุบัน:
            <a
              :href="documentToEdit.fileUrl"
              target="_blank"
              class="font-medium text-blue-800 hover:underline"
              >{{ documentToEdit.fileName || 'ดูไฟล์' }}</a
            >
          </p>
        </div>

        <div class="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ItaDocument } from '@/types/ita'

// Props ที่รับเข้ามา: isOpen เพื่อเปิด/ปิด, documentToEdit สำหรับการแก้ไข
const props = defineProps<{
  isOpen: boolean
  documentToEdit: ItaDocument | null
}>()

// Events ที่ส่งออกไป: close เพื่อปิด, save เพื่อส่งข้อมูลไปบันทึก
const emit = defineEmits(['close', 'save'])

// State ภายในของฟอร์ม
const currentDocument = ref<Partial<ItaDocument>>({})
const selectedFile = ref<File | null>(null)

// Watcher: คอยจับตาดูเมื่อ props.documentToEdit เปลี่ยนแปลง
watch(
  () => props.isOpen,
  (newIsOpen) => {
    if (newIsOpen) {
      // ถ้าเป็นการแก้ไข (มี documentToEdit ส่งมา)
      if (props.documentToEdit) {
        currentDocument.value = { ...props.documentToEdit }
      }
      // ถ้าเป็นการเพิ่มใหม่
      else {
        currentDocument.value = {
          title: '',
          sub_topic: '',
          quarter: '',
          description: '',
        }
      }
      selectedFile.value = null // รีเซ็ตไฟล์ที่เลือกทุกครั้งที่เปิด
    }
  },
)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
  } else {
    selectedFile.value = null
  }
}

const closeModal = () => {
  emit('close')
}

const saveDocument = () => {
  // ส่งข้อมูลในฟอร์ม และไฟล์ที่เลือก (ถ้ามี) กลับไปให้ Parent Component จัดการ
  emit('save', {
    documentData: currentDocument.value,
    file: selectedFile.value,
  })
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-xl mb-8">
    <h2 class="text-2xl font-semibold text-blue-700 mb-6 border-b pb-4 flex items-center gap-2">
      <i class="fas" :class="isEditing ? 'fa-edit' : 'fa-plus-circle'"></i>
      {{ isEditing ? 'แก้ไขเอกสาร' : 'เพิ่มเอกสารใหม่' }}
    </h2>

    <!-- Error summary (accessibility) -->
    <div
      v-if="errors.title || errors.sub_topic || errors.quarter || errors.file"
      class="mb-4 rounded-md border border-red-200 bg-red-50 text-red-700 p-3 text-sm"
      role="alert"
      aria-live="assertive"
    >
      <p class="font-semibold mb-1">กรุณาตรวจสอบข้อมูลที่กรอก:</p>
      <ul class="list-disc pl-5 space-y-1">
        <li v-if="errors.title">{{ errors.title }}</li>
        <li v-if="errors.sub_topic">{{ errors.sub_topic }}</li>
        <li v-if="errors.quarter">{{ errors.quarter }}</li>
        <li v-if="errors.file">{{ errors.file }}</li>
      </ul>
    </div>

    <form @submit.prevent="submitForm" class="space-y-6" novalidate>
      <!-- Title -->
      <div>
        <label for="docTitle" class="block text-gray-700 font-semibold mb-1"
          >ชื่อเอกสาร (Title):<span class="text-red-500">*</span></label
        >
        <div class="relative">
          <span
            class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400"
          >
            <i class="fas fa-file-alt"></i>
          </span>
          <input
            id="docTitle"
            type="text"
            v-model.trim="editableDocument.title"
            @blur="validateTitle"
            :aria-invalid="Boolean(errors.title)"
            :aria-describedby="errors.title ? 'err-title' : undefined"
            placeholder="ระบุชื่อเอกสารให้ชัดเจน"
            class="shadow appearance-none border rounded-lg w-full py-3 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2"
            :class="errors.title ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-500'"
            :disabled="isSubmitting"
            autocomplete="off"
          />
        </div>
        <p v-if="errors.title" id="err-title" class="text-red-500 text-sm mt-1">
          {{ errors.title }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Sub-topic -->
        <div>
          <label for="docSubTopic" class="block text-gray-700 font-semibold mb-1"
            >หัวข้อย่อย (Sub-topic):<span class="text-red-500">*</span></label
          >
          <div class="relative">
            <span
              class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400"
            >
              <i class="fas fa-list"></i>
            </span>
            <input
              id="docSubTopic"
              type="text"
              v-model.trim="editableDocument.sub_topic"
              @blur="validateSubTopic"
              :aria-invalid="Boolean(errors.sub_topic)"
              :aria-describedby="errors.sub_topic ? 'err-subtopic' : undefined"
              placeholder="เช่น ประกาศ, รายงานผล"
              class="shadow appearance-none border rounded-lg w-full py-3 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2"
              :class="
                errors.sub_topic ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-500'
              "
              :disabled="isSubmitting"
              autocomplete="off"
            />
          </div>
          <p v-if="errors.sub_topic" id="err-subtopic" class="text-red-500 text-sm mt-1">
            {{ errors.sub_topic }}
          </p>
        </div>

        <!-- Quarter -->
        <div>
          <label for="docQuarter" class="block text-gray-700 font-semibold mb-1"
            >ไตรมาส (Quarter):<span class="text-red-500">*</span></label
          >
          <div class="relative">
            <span
              class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400"
            >
              <i class="fas fa-calendar-alt"></i>
            </span>
            <select
              id="docQuarter"
              v-model="editableDocument.quarter"
              @change="validateQuarter"
              :aria-invalid="Boolean(errors.quarter)"
              :aria-describedby="errors.quarter ? 'err-quarter' : undefined"
              class="shadow border rounded-lg w-full py-3 pl-10 pr-8 text-gray-700 focus:outline-none focus:ring-2 appearance-none bg-white"
              :class="errors.quarter ? 'border-red-500 focus:ring-red-300' : 'focus:ring-blue-500'"
              :disabled="isSubmitting"
            >
              <option value="1">ไตรมาส 1</option>
              <option value="2">ไตรมาส 2</option>
              <option value="3">ไตรมาส 3</option>
              <option value="4">ไตรมาส 4</option>
            </select>
            <span
              class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              <i class="fas fa-chevron-down"></i>
            </span>
          </div>
          <p v-if="errors.quarter" id="err-quarter" class="text-red-500 text-sm mt-1">
            {{ errors.quarter }}
          </p>
        </div>
      </div>

      <!-- File (Dropzone style) -->
      <div>
        <label class="block text-gray-700 font-semibold mb-1">
          ไฟล์เอกสาร (PDF):<span class="text-red-500" v-if="!isEditing">*</span>
        </label>
        <input
          id="docFile"
          type="file"
          class="sr-only"
          @change="handleFileSelect"
          accept="application/pdf,.pdf"
          :aria-invalid="Boolean(errors.file)"
          :aria-describedby="errors.file ? 'err-file' : 'file-hint'"
          :disabled="isSubmitting"
        />
        <label
          for="docFile"
          class="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl p-6 cursor-pointer transition hover:bg-blue-50"
          :class="errors.file ? 'border-red-400 bg-red-50/50' : 'border-gray-300'"
          title="คลิกเพื่อเลือกไฟล์ PDF หรือวางไฟล์ลงที่นี่"
        >
          <i
            class="fas fa-file-pdf text-3xl mb-2"
            :class="errors.file ? 'text-red-500' : 'text-blue-500'"
          ></i>
          <span class="text-sm text-gray-700"
            >ลากไฟล์ PDF มาวาง หรือ
            <span class="text-blue-700 underline">คลิกเพื่อเลือก</span></span
          >
          <span id="file-hint" class="text-xs text-gray-500 mt-1"
            >รองรับเฉพาะ PDF ขนาดไม่เกิน {{ MAX_FILE_MB }}MB</span
          >
        </label>
        <p v-if="errors.file" id="err-file" class="text-red-500 text-sm mt-2">{{ errors.file }}</p>

        <div v-if="selectedFile" class="flex items-center gap-3 text-sm text-gray-600 mt-3">
          <i class="fas fa-paperclip"></i>
          <span
            >ไฟล์ที่เลือก:
            <span class="font-medium text-blue-800">{{ selectedFile.name }}</span> ({{
              prettySize(selectedFile.size)
            }})</span
          >
          <button
            type="button"
            class="text-red-600 hover:underline"
            @click="removeFile"
            :disabled="isSubmitting"
          >
            ล้างไฟล์
          </button>
        </div>

        <p v-else-if="editableDocument.fileUrl" class="text-sm text-gray-600 mt-3">
          ไฟล์ปัจจุบัน:
          <a
            :href="editableDocument.fileUrl"
            target="_blank"
            class="font-medium text-blue-800 hover:underline"
            >{{ editableDocument.fileName || 'ดูไฟล์' }}</a
          >
        </p>
      </div>

      <!-- Submit -->
      <div class="flex items-center justify-end gap-3 pt-4 border-t">
        <button
          v-if="isEditing"
          type="button"
          @click="cancel"
          class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-5 rounded-full"
          :disabled="isSubmitting"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          :disabled="isSubmitting || !isValid"
        >
          <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-save"></i>
          {{
            isEditing
              ? isSubmitting
                ? 'กำลังบันทึก...'
                : 'บันทึกการแก้ไข'
              : isSubmitting
                ? 'กำลังเพิ่ม...'
                : 'เพิ่มเอกสาร'
          }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRefs, reactive, computed } from 'vue'
import type { ItaDocument } from '@/types/ita'

// Props
const props = defineProps<{
  isEditing: boolean
  documentData: Partial<ItaDocument>
  isSubmitting?: boolean
}>()

// Emits (typed)
const emit = defineEmits<{
  (e: 'save', payload: Partial<ItaDocument>): void
  (e: 'cancel'): void
  (e: 'update:file', file: File | null): void
}>()

// Constants
const MAX_FILE_MB = 10
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024

// Local state (quarter เป็น string ให้ตรงกับ API)
const editableDocument = ref<Partial<ItaDocument>>({
  title: '',
  sub_topic: '',
  quarter: '1',
  description: '',
})
const selectedFile = ref<File | null>(null)

// Errors
const errors = reactive<{ title: string; sub_topic: string; quarter: string; file: string }>({
  title: '',
  sub_topic: '',
  quarter: '',
  file: '',
})

const { documentData } = toRefs(props)

// Sync props -> local state
watch(
  documentData,
  (doc) => {
    const d = doc ?? {}
    editableDocument.value = {
      id: d.id,
      title: d.title ?? '',
      sub_topic: d.sub_topic ?? '',
      quarter: d.quarter ? String(d.quarter) : '1',
      description: d.description ?? '',
      fileUrl: d.fileUrl,
      fileName: d.fileName,
    }
    selectedFile.value = null
    // reset errors when doc changes
    errors.title = errors.sub_topic = errors.quarter = errors.file = ''
  },
  { immediate: true, deep: true },
)

// Validation helpers
const validateTitle = () =>
  (errors.title = editableDocument.value.title?.trim() ? '' : 'กรุณาระบุชื่อเอกสาร')

const validateSubTopic = () =>
  (errors.sub_topic = editableDocument.value.sub_topic?.trim() ? '' : 'กรุณาระบุหัวข้อย่อย')

const validateQuarter = () => {
  const q = String(editableDocument.value.quarter ?? '')
  errors.quarter = ['1', '2', '3', '4'].includes(q) ? '' : 'กรุณาเลือกไตรมาส 1–4'
}

const validateFile = () => {
  if (!props.isEditing && !selectedFile.value && !editableDocument.value.fileUrl) {
    errors.file = 'กรุณาแนบไฟล์ PDF'
  } else {
    errors.file = ''
  }
}

const validateAll = () => {
  validateTitle()
  validateSubTopic()
  validateQuarter()
  validateFile()
  return !errors.title && !errors.sub_topic && !errors.quarter && !errors.file
}

const isValid = computed(() => {
  // ใช้คุม disabled ของปุ่ม submit
  const q = String(editableDocument.value.quarter ?? '')
  return Boolean(
    editableDocument.value.title?.trim() &&
      editableDocument.value.sub_topic?.trim() &&
      ['1', '2', '3', '4'].includes(q) &&
      (props.isEditing || !!selectedFile.value || !!editableDocument.value.fileUrl),
  )
})

// Utils
const prettySize = (bytes: number) => {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return bytes + ' B'
}

// Handlers
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files && target.files.length > 0 ? target.files[0] : null

  if (file) {
    if (file.size > MAX_FILE_BYTES) {
      selectedFile.value = null
      errors.file = `ไฟล์มีขนาดเกิน ${MAX_FILE_MB}MB`
      emit('update:file', null)
      return
    }
    // type check เบา ๆ เผื่อบาง browser ไม่ลงท้าย application/pdf
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      selectedFile.value = null
      errors.file = 'รองรับเฉพาะไฟล์ .pdf เท่านั้น'
      emit('update:file', null)
      return
    }
  }

  selectedFile.value = file
  errors.file = ''
  emit('update:file', file)
}

const removeFile = () => {
  selectedFile.value = null
  errors.file = props.isEditing || editableDocument.value.fileUrl ? '' : 'กรุณาแนบไฟล์ PDF'
  emit('update:file', null)
  const input = document.getElementById('docFile') as HTMLInputElement | null
  if (input) input.value = ''
}

const submitForm = () => {
  if (!validateAll()) return
  emit('save', { ...editableDocument.value })
}

const cancel = () => emit('cancel')
</script>

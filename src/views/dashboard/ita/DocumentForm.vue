<template>
  <div class="document-form-container">
    <div
      v-if="errors.title || errors.sub_topic || errors.quarter || errors.file"
      class="mb-6 p-4 rounded-xl border border-red-100 bg-red-50/50 backdrop-blur-sm text-red-700 text-sm animate-shake"
      role="alert"
    >
      <div class="flex items-center gap-2 font-bold mb-2">
        <i class="fas fa-exclamation-circle"></i>
        <span>กรุณาตรวจสอบข้อมูล:</span>
      </div>
      <ul class="list-disc pl-5 space-y-1 opacity-90">
        <li v-if="errors.title">{{ errors.title }}</li>
        <li v-if="errors.sub_topic">{{ errors.sub_topic }}</li>
        <li v-if="errors.quarter">{{ errors.quarter }}</li>
        <li v-if="errors.file">{{ errors.file }}</li>
      </ul>
    </div>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Title -->
      <div class="form-group">
        <label for="docTitle" class="form-label">
          ชื่อเอกสาร <span class="text-indigo-500">*</span>
        </label>
        <div class="relative group">
          <span class="input-icon">
            <i class="fas fa-file-signature"></i>
          </span>
          <input
            id="docTitle"
            type="text"
            v-model.trim="editableDocument.title"
            @blur="validateTitle"
            placeholder="ระบุชื่อเอกสารให้ชัดเจน..."
            class="premium-input pl-10"
            :class="{ 'input-error': errors.title }"
            :disabled="isSubmitting"
          />
        </div>
        <transition name="fade">
          <p v-if="errors.title" class="error-text">{{ errors.title }}</p>
        </transition>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Sub-topic -->
        <div class="form-group">
          <label for="docSubTopic" class="form-label">
            หัวข้อย่อย <span class="text-indigo-500">*</span>
          </label>
          <div class="relative group">
            <span class="input-icon">
              <i class="fas fa-tags"></i>
            </span>
            <input
              id="docSubTopic"
              type="text"
              v-model.trim="editableDocument.sub_topic"
              @blur="validateSubTopic"
              placeholder="เช่น ประกาศ, รายงานผล..."
              class="premium-input pl-10"
              :class="{ 'input-error': errors.sub_topic }"
              :disabled="isSubmitting"
            />
          </div>
          <transition name="fade">
            <p v-if="errors.sub_topic" class="error-text">{{ errors.sub_topic }}</p>
          </transition>
        </div>

        <!-- Quarter -->
        <div class="form-group">
          <label for="docQuarter" class="form-label">
            ไตรมาส <span class="text-indigo-500">*</span>
          </label>
          <div class="relative">
            <span class="input-icon">
              <i class="fas fa-calendar-check"></i>
            </span>
            <select
              id="docQuarter"
              v-model="editableDocument.quarter"
              class="premium-input pl-10 appearance-none bg-white"
              :class="{ 'input-error': errors.quarter }"
              :disabled="isSubmitting"
            >
              <option value="1">ไตรมาส 1</option>
              <option value="2">ไตรมาส 2</option>
              <option value="3">ไตรมาส 3</option>
              <option value="4">ไตรมาส 4</option>
            </select>
            <span
              class="absolute right-4 inset-y-0 flex items-center pointer-events-none text-slate-400"
            >
              <i class="fas fa-chevron-down text-xs"></i>
            </span>
          </div>
          <transition name="fade">
            <p v-if="errors.quarter" class="error-text">{{ errors.quarter }}</p>
          </transition>
        </div>
      </div>

      <!-- File Upload -->
      <div class="form-group">
        <label class="form-label">
          ไฟล์ไฟล์ PDF <span class="text-indigo-500" v-if="!isEditing">*</span>
        </label>

        <div
          class="file-dropzone"
          :class="{ 'dropzone-error': errors.file, 'dropzone-active': selectedFile }"
        >
          <input
            id="docFile"
            type="file"
            class="hidden-input"
            @change="handleFileSelect"
            accept=".pdf"
            :disabled="isSubmitting"
          />
          <label for="docFile" class="dropzone-label">
            <div class="icon-container">
              <i
                class="fas fa-cloud-upload-alt text-4xl mb-3 transition-transform group-hover:-translate-y-1"
              ></i>
            </div>
            <div class="text-center">
              <span class="block text-slate-700 font-semibold"
                >ลากและวางไฟล์ หรือคลิกเพื่อค้นหา</span
              >
              <span class="block text-slate-400 text-xs mt-1"
                >เฉพาะ PDF (สูงสุด {{ MAX_FILE_MB }}MB)</span
              >
            </div>
          </label>
        </div>

        <transition name="slide-up">
          <div v-if="selectedFile" class="selected-file-info">
            <div class="flex items-center gap-3 overflow-hidden">
              <div class="file-icon">
                <i class="fas fa-file-pdf"></i>
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="text-sm font-medium text-slate-700 truncate">{{ selectedFile.name }}</p>
                <p class="text-[10px] text-slate-400 uppercase tracking-wider">
                  {{ prettySize(selectedFile.size) }}
                </p>
              </div>
            </div>
            <button
              type="button"
              class="remove-file-btn"
              @click="removeFile"
              :disabled="isSubmitting"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div v-else-if="editableDocument.fileUrl" class="selected-file-info existing">
            <div class="flex items-center gap-3 overflow-hidden">
              <div class="file-icon bg-indigo-50 text-indigo-500">
                <i class="fas fa-link"></i>
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="text-sm font-medium text-slate-700 truncate">ไฟล์ปัจจุบัน</p>
                <a
                  :href="editableDocument.fileUrl"
                  target="_blank"
                  class="text-[10px] text-indigo-500 hover:underline"
                >
                  คลิกเพื่อดูเอกสาร
                </a>
              </div>
            </div>
          </div>
        </transition>
        <transition name="fade">
          <p v-if="errors.file" class="error-text">{{ errors.file }}</p>
        </transition>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
        <button type="button" @click="cancel" class="secondary-btn" :disabled="isSubmitting">
          ยกเลิก
        </button>
        <button type="submit" class="primary-btn" :disabled="isSubmitting || !isValid">
          <i v-if="isSubmitting" class="fas fa-circle-notch fa-spin mr-2"></i>
          <i v-else class="fas fa-check-circle mr-2"></i>
          <span>{{ isEditing ? 'บันทึกการแก้ไข' : 'ยืนยันเพิ่มเอกสาร' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRefs, reactive, computed } from 'vue'
import type { ItaDocument } from '@/types/ita'

const props = defineProps<{
  isEditing: boolean
  documentData: Partial<ItaDocument>
  isSubmitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'save', payload: Partial<ItaDocument>): void
  (e: 'cancel'): void
  (e: 'update:file', file: File | null): void
}>()

const MAX_FILE_MB = 20
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024

const editableDocument = ref<Partial<ItaDocument>>({
  title: '',
  sub_topic: '',
  quarter: '1',
  description: '',
})
const selectedFile = ref<File | null>(null)

const errors = reactive({
  title: '',
  sub_topic: '',
  quarter: '',
  file: '',
})

const { documentData } = toRefs(props)

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
    errors.title = errors.sub_topic = errors.quarter = errors.file = ''
  },
  { immediate: true, deep: true },
)

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
  const q = String(editableDocument.value.quarter ?? '')
  return Boolean(
    editableDocument.value.title?.trim() &&
      editableDocument.value.sub_topic?.trim() &&
      ['1', '2', '3', '4'].includes(q) &&
      (props.isEditing || !!selectedFile.value || !!editableDocument.value.fileUrl),
  )
})

const prettySize = (bytes: number) => {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return bytes + ' B'
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] || null

  if (file) {
    if (file.size > MAX_FILE_BYTES) {
      errors.file = `ไฟล์ขนาดเกิน ${MAX_FILE_MB}MB`
      selectedFile.value = null
      emit('update:file', null)
      return
    }
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      errors.file = 'รองรับเฉพาะไฟล์ .pdf เท่านั้น'
      selectedFile.value = null
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

<style scoped>
.document-form-container {
  @apply bg-transparent;
}

.form-group {
  @apply flex flex-col gap-1.5;
}

.form-label {
  @apply text-slate-600 text-sm font-semibold tracking-wide ml-1;
}

.premium-input {
  @apply w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700
         transition-all duration-300 outline-none
         hover:border-slate-300 hover:bg-white
         focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10;
}

.input-icon {
  @apply absolute left-3.5 inset-y-0 flex items-center text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300;
}

.input-error {
  @apply border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-red-500/10;
}

.error-text {
  @apply text-red-500 text-[11px] font-medium ml-1 mt-0.5;
}

.file-dropzone {
  @apply relative overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50/50
         rounded-2xl p-8 transition-all duration-300
         hover:bg-indigo-50/30 hover:border-indigo-300 group;
}

.dropzone-label {
  @apply flex flex-col items-center justify-center cursor-pointer;
}

.icon-container {
  @apply w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4
         text-slate-400 transition-all duration-300 group-hover:scale-110 group-hover:text-indigo-500;
}

.dropzone-error {
  @apply border-red-200 bg-red-50/30 hover:border-red-300 hover:bg-red-50/50;
}

.dropzone-active {
  @apply border-indigo-400 bg-indigo-50/50;
}

.hidden-input {
  @apply absolute inset-0 opacity-0 cursor-pointer w-full h-full;
}

.selected-file-info {
  @apply mt-4 p-3 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center justify-between;
}

.file-icon {
  @apply w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center text-lg;
}

.remove-file-btn {
  @apply w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all;
}

.primary-btn {
  @apply inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-600/20
         transition-all duration-300 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0
         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0;
}

.secondary-btn {
  @apply px-6 py-2.5 text-slate-500 font-semibold rounded-full transition-all hover:bg-slate-100 hover:text-slate-700;
}

/* Animations */
.animate-shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

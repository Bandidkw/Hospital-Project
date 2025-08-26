<template>
  <div class="bg-white p-6 rounded-lg shadow-xl mb-8">
    <h2 class="text-2xl font-semibold text-blue-700 mb-6 border-b pb-4">
      <i class="fas" :class="isEditing ? 'fa-edit' : 'fa-plus-circle'"></i>
      {{ isEditing ? 'แก้ไขเอกสาร' : 'เพิ่มเอกสารใหม่' }}
    </h2>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div>
        <label for="docTitle" class="block text-gray-700 font-bold mb-2"
          >ชื่อเอกสาร (Title):*</label
        >
        <input
          id="docTitle"
          type="text"
          v-model="editableDocument.title"
          placeholder="ระบุชื่อเอกสารให้ชัดเจน"
          class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="docSubTopic" class="block text-gray-700 font-bold mb-2"
            >หัวข้อย่อย (Sub-topic):*</label
          >
          <input
            id="docSubTopic"
            type="text"
            v-model="editableDocument.sub_topic"
            placeholder="เช่น ประกาศ, รายงานผล"
            class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700"
          />
        </div>
        <div>
          <label for="docQuarter" class="block text-gray-700 font-bold mb-2"
            >ไตรมาส (Quarter):*</label
          >
          <select
            id="docQuarter"
            v-model="editableDocument.quarter"
            class="shadow border rounded-lg w-full py-3 px-4 text-gray-700"
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
          v-model="editableDocument.description"
          rows="3"
          placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับเอกสารนี้"
          class="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700"
        ></textarea>
      </div>

      <div>
        <label for="docFile" class="block text-gray-700 font-bold mb-2">ไฟล์เอกสาร (PDF):*</label>
        <input
          id="docFile"
          type="file"
          @change="handleFileSelect"
          accept=".pdf"
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
        />
        <p v-if="selectedFile" class="text-sm text-gray-600 mt-2">
          ไฟล์ที่เลือก: <span class="font-medium text-blue-800">{{ selectedFile.name }}</span>
        </p>
        <p v-else-if="editableDocument.fileUrl" class="text-sm text-gray-600 mt-2">
          ไฟล์ปัจจุบัน:
          <a
            :href="editableDocument.fileUrl"
            target="_blank"
            class="font-medium text-blue-800 hover:underline"
            >{{ editableDocument.fileName || 'ดูไฟล์' }}</a
          >
        </p>
      </div>

      <div class="flex items-center justify-end space-x-4 pt-4 border-t">
        <button
          v-if="isEditing"
          type="button"
          @click="cancel"
          class="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-full"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
        >
          <i class="fas fa-save mr-2"></i>
          {{ isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มเอกสาร' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRefs } from 'vue'
import type { ItaDocument } from '@/types/ita'

// --- Props (รับ "สายไฟ" มาจากข้างนอก) ---
const props = defineProps<{
  isEditing: boolean
  documentData: Partial<ItaDocument>
}>()

// --- Emits (ส่ง "สัญญาณ" กลับไป) ---
const emit = defineEmits(['save', 'cancel', 'update:file'])

// --- Internal State ---
const editableDocument = ref<Partial<ItaDocument>>({})
const selectedFile = ref<File | null>(null)

// toRefs: ทำให้ props reactive และสามารถใช้ใน watch ได้
const { documentData } = toRefs(props)

// Watcher: คอยจับตาดูเมื่อข้อมูลจากข้างนอกเปลี่ยน
watch(
  documentData,
  (newDoc) => {
    editableDocument.value = { ...newDoc }
    selectedFile.value = null // รีเซ็ตไฟล์ทุกครั้งที่ข้อมูลเปลี่ยน
  },
  { immediate: true, deep: true },
)

// --- Functions ---
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    emit('update:file', selectedFile.value)
  } else {
    selectedFile.value = null
    emit('update:file', null)
  }
}

const submitForm = () => {
  emit('save', editableDocument.value)
}

const cancel = () => {
  emit('cancel')
}
</script>

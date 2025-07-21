<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeModal">
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">{{ documentToEdit ? 'แก้ไขเอกสาร ITA' : 'เพิ่มเอกสาร ITA ใหม่' }}</h2>
      <form @submit.prevent="saveDocument">
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">ชื่อเอกสาร:</label>
          <input
            type="text"
            id="title"
            v-model="currentDocument.title"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div class="mb-4">
          <label for="category" class="block text-sm font-medium text-gray-700 mb-2">ประเภท:</label>
          <input
            type="text"
            id="category"
            v-model="currentDocument.category"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div class="mb-4">
          <label for="year" class="block text-sm font-medium text-gray-700 mb-2">ปี:</label>
          <input
            type="number"
            id="year"
            v-model.number="currentDocument.year"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div class="mb-4">
          <label for="fileName" class="block text-sm font-medium text-gray-700 mb-2">ชื่อไฟล์:</label>
          <input
            type="text"
            id="fileName"
            v-model="currentDocument.fileName"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div class="mb-6">
          <label for="fileUrl" class="block text-sm font-medium text-gray-700 mb-2">URL ไฟล์:</label>
          <input
            type="url"
            id="fileUrl"
            v-model="currentDocument.fileUrl"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { ItaDocument } from '@/types/ItaDocument'; // Import the type

const props = defineProps<{
  isOpen: boolean;
  documentToEdit: ItaDocument | null;
}>();

const emit = defineEmits(['close', 'save']);

const defaultDocument: ItaDocument = {
  id: 0, // Will be assigned by backend/mock API for new documents
  title: '',
  category: '',
  year: new Date().getFullYear(), // Default to current year
  fileName: '',
  fileUrl: '',
};

const currentDocument = ref<ItaDocument>({ ...defaultDocument });

// Watch for changes in documentToEdit prop to populate the form
watch(() => props.documentToEdit, (newDoc) => {
  if (newDoc) {
    currentDocument.value = { ...newDoc }; // Copy existing document for editing
  } else {
    currentDocument.value = { ...defaultDocument }; // Reset for new document
  }
}, { immediate: true }); // Run immediately on component mount

const closeModal = () => {
  emit('close');
};

const saveDocument = () => {
  emit('save', currentDocument.value);
};
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>

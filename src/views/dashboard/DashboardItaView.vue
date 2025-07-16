<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-file-alt mr-3 text-red-500"></i> จัดการเอกสาร ITA
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับอัปโหลด, ดู, และลบเอกสาร PDF ที่เกี่ยวข้องกับการประเมินคุณธรรมและความโปร่งใส (ITA).</p>

    <!-- Form for Uploading PDF -->
    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">อัปโหลดไฟล์ PDF</h3>
      <form @submit.prevent="uploadPdf" enctype="multipart/form-data" class="space-y-4">
        <div>
          <label for="docTitle" class="block text-sm font-medium text-gray-700">ชื่อเอกสาร / หัวข้อ:</label>
          <input type="text" id="docTitle" v-model="uploadForm.title" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="docCategory" class="block text-sm font-medium text-gray-700">หมวดหมู่:</label>
          <select id="docCategory" v-model="uploadForm.category" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
        <div>
          <label for="pdfFile" class="block text-sm font-medium text-gray-700">เลือกไฟล์ PDF:</label>
          <input type="file" id="pdfFile" @change="handleFileUpload" accept=".pdf" class="mt-1 block w-full text-gray-700" required>
          <p class="text-xs text-gray-500 mt-1">รองรับเฉพาะไฟล์ .pdf เท่านั้น (สูงสุด 10MB)</p>
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            <i class="fas fa-upload mr-2"></i> อัปโหลด
          </button>
        </div>
      </form>
    </div>

    <!-- List of Documents -->
    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รายการเอกสาร PDF</h3>
      <div class="mb-4 text-right">
        จัดเรียงตาม:
        <button @click="sortBy('category')" class="btn-sort">
          หมวดหมู่ <i :class="getSortIcon('category')"></i>
        </button>
        <button @click="sortBy('title')" class="btn-sort">
          ชื่อเอกสาร <i :class="getSortIcon('title')"></i>
        </button>
        <button @click="sortBy('uploaded_at')" class="btn-sort">
          วันที่อัปโหลด <i :class="getSortIcon('uploaded_at')"></i>
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">#</th>
              <th class="py-3 px-6 text-left">ชื่อเอกสาร</th>
              <th class="py-3 px-6 text-left">หมวดหมู่</th>
              <th class="py-3 px-6 text-left">อัปโหลดโดย</th>
              <th class="py-3 px-6 text-center">วันที่อัปโหลด</th>
              <th class="py-3 px-6 text-center">ไฟล์</th>
              <th class="py-3 px-6 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-for="(doc, index) in sortedDocuments" :key="doc.id" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="py-3 px-6 text-left">{{ index + 1 }}</td>
              <td class="py-3 px-6 text-left">{{ doc.title }}</td>
              <td class="py-3 px-6 text-left">{{ doc.category }}</td>
              <td class="py-3 px-6 text-left">{{ doc.uploaded_by }}</td>
              <td class="py-3 px-6 text-center">{{ doc.uploaded_at }}</td>
              <td class="py-3 px-6 text-center">
                <a :href="doc.file_path" target="_blank" class="text-blue-600 hover:underline flex items-center justify-center">
                  <i class="fas fa-file-pdf mr-2"></i> ดูไฟล์
                </a>
              </td>
              <td class="py-3 px-6 text-center">
                <button disabled class="bg-yellow-300 text-white px-3 py-1 rounded-md text-xs cursor-not-allowed mr-2">
                  <i class="fas fa-edit"></i> แก้ไข
                </button>
                <button @click="confirmDeleteDoc(doc.id)" class="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition duration-300">
                  <i class="fas fa-trash-alt"></i> ลบ
                </button>
              </td>
            </tr>
            <tr v-if="documents.length === 0">
              <td colspan="7" class="py-8 text-center text-gray-500">ยังไม่มีเอกสาร PDF ในฐานข้อมูล.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Custom Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบเอกสารนี้?</p>
        <div class="flex justify-center space-x-4">
          <button @click="deleteDocument" class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300">
            <i class="fas fa-trash-alt mr-2"></i> ลบ
          </button>
          <button @click="cancelDelete" class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300">
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface DocumentItem {
  id: number;
  title: string;
  category: string;
  uploaded_by: string;
  uploaded_at: string;
  file_path: string;
}

const uploadForm = ref({
  title: '',
  category: 'ข่าวประชาสัมพันธ์',
  pdfFile: null as File | null,
});

const categories = [
  'ข่าวประชาสัมพันธ์',
  'ระเบียบและข้อบังคับ',
  'รายงานประจำไตรมาส',
  'รายงานประจำปี',
  'แบบฟอร์ม',
  'อื่น ๆ'
];

const documents = ref<DocumentItem[]>([
  { id: 1, title: 'รายงาน ITA ปี 2567', category: 'รายงานประจำปี', uploaded_by: 'admin', uploaded_at: '2024-01-15', file_path: 'https://www.africau.edu/images/default/sample.pdf' },
  { id: 2, title: 'ระเบียบการลาป่วย', category: 'ระเบียบและข้อบังคับ', uploaded_by: 'staff1', uploaded_at: '2023-11-20', file_path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
]);

const sortColumn = ref('uploaded_at');
const sortDirection = ref<'asc' | 'desc'>('desc');
const docToDeleteId = ref<number | null>(null);
const showConfirmModal = ref(false);

const sortedDocuments = computed(() => {
  const sorted = [...documents.value].sort((a, b) => {
    const aValue = (a as any)[sortColumn.value];
    const bValue = (b as any)[sortColumn.value];

    if (sortDirection.value === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
  return sorted;
});

const getSortIcon = (column: string) => {
  if (sortColumn.value === column) {
    return sortDirection.value === 'asc' ? 'fas fa-caret-up' : 'fas fa-caret-down';
  }
  return '';
};

const sortBy = (column: string) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc'; // Default to ascending when changing column
  }
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    uploadForm.value.pdfFile = input.files[0];
  }
};

const uploadPdf = () => {
  if (!uploadForm.value.pdfFile) {
    alert('กรุณาเลือกไฟล์ PDF ที่จะอัปโหลด!');
    return;
  }
  if (!uploadForm.value.title.trim()) {
    alert('กรุณากรอกชื่อเอกสาร / หัวข้อ!');
    return;
  }

  // In a real application, you would send this to your backend API
  // using FormData and fetch/axios.
  console.log('Uploading:', uploadForm.value.title, uploadForm.value.category, uploadForm.value.pdfFile.name);

  // Simulate upload success
  const newDoc: DocumentItem = {
    id: documents.value.length > 0 ? Math.max(...documents.value.map(d => d.id)) + 1 : 1,
    title: uploadForm.value.title,
    category: uploadForm.value.category,
    uploaded_by: 'current_user', // Replace with actual logged-in user
    uploaded_at: new Date().toISOString().split('T')[0],
    file_path: URL.createObjectURL(uploadForm.value.pdfFile), // For local preview
  };
  documents.value.push(newDoc);
  alert('ไฟล์อัปโหลดสำเร็จแล้ว!');
  resetUploadForm();
};

const confirmDeleteDoc = (id: number) => {
  docToDeleteId.value = id;
  showConfirmModal.value = true;
};

const deleteDocument = () => {
  if (docToDeleteId.value !== null) {
    documents.value = documents.value.filter(doc => doc.id !== docToDeleteId.value);
    alert('เอกสารถูกลบเรียบร้อยแล้ว!');
  }
  resetDeleteConfirm();
};

const cancelDelete = () => {
  resetDeleteConfirm();
};

const resetUploadForm = () => {
  uploadForm.value = { title: '', category: 'ข่าวประชาสัมพันธ์', pdfFile: null };
  const fileInput = document.getElementById('pdfFile') as HTMLInputElement;
  if (fileInput) fileInput.value = ''; // Clear file input
};

const resetDeleteConfirm = () => {
  docToDeleteId.value = null;
  showConfirmModal.value = false;
};

// In a real application, you would fetch initial documents from an API on mount
// onMounted(() => {
//   fetchDocuments();
// });
// const fetchDocuments = async () => { /* ... */ };
</script>

<style scoped>
.btn-sort {
  @apply bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-xs hover:bg-gray-300 transition duration-300 ml-2;
}
</style>

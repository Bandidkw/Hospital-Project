<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-award mr-3 text-emerald-500"></i> จัดการเอกสาร ITA
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับเพิ่ม, แก้ไข, และลบเอกสารการประเมินคุณธรรมและความโปร่งใส (ITA).</p>

    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ editingDocument ? 'แก้ไขเอกสาร ITA' : 'เพิ่มเอกสาร ITA ใหม่' }}</h3>
      <form @submit.prevent="saveITADocument" class="space-y-4">
        <div>
          <label for="documentTitle" class="block text-sm font-medium text-gray-700">ชื่อเอกสาร:</label>
          <input type="text" id="documentTitle" v-model="currentDocument.title" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="documentYear" class="block text-sm font-medium text-gray-700">ปีงบประมาณ:</label>
            <select id="documentYear" v-model="currentDocument.year" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
              <option value="">-- เลือกปี --</option>
              <option v-for="year in getYearsList()" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          <div>
            <label for="documentQuarter" class="block text-sm font-medium text-gray-700">ไตรมาส:</label>
            <select id="documentQuarter" v-model="currentDocument.quarter" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
              <option value="">-- เลือกไตรมาส --</option>
              <option value="Q1">Q1</option>
              <option value="Q2">Q2</option>
              <option value="Q3">Q3</option>
              <option value="Q4">Q4</option>
            </select>
          </div>
        </div>
        <div>
          <label for="documentTopic" class="block text-sm font-medium text-gray-700">หัวข้อ ITA:</label>
          <input type="text" id="documentTopic" v-model="currentDocument.topic" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="เช่น ข้อมูลพื้นฐาน, การจัดซื้อจัดจ้าง" required>
        </div>
        <div>
          <label for="documentDescription" class="block text-sm font-medium text-gray-700">คำอธิบาย (Optional):</label>
          <textarea id="documentDescription" v-model="currentDocument.description" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div>
          <label for="documentUrl" class="block text-sm font-medium text-gray-700">URL ไฟล์เอกสาร (PDF/Doc):</label>
          <input type="url" id="documentUrl" v-model="currentDocument.url" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="เช่น https://example.com/document.pdf" required>
          <p class="text-xs text-gray-500 mt-1">สำหรับตอนนี้ใช้ URL ตรงๆ เมื่อมี Backend จะเปลี่ยนเป็นระบบอัปโหลดไฟล์</p>
        </div>
        <div class="flex justify-end space-x-3">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            <i class="fas fa-save mr-2"></i> {{ editingDocument ? 'บันทึกการแก้ไข' : 'เพิ่มเอกสาร' }}
          </button>
          <button v-if="editingDocument" type="button" @click="cancelEdit" class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300">
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </form>
    </div>

    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รายการเอกสาร ITA</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">ชื่อเอกสาร</th>
              <th class="py-3 px-6 text-left">ปี</th>
              <th class="py-3 px-6 text-left">ไตรมาส</th>
              <th class="py-3 px-6 text-left">หัวข้อ</th>
              <th class="py-3 px-6 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-for="doc in sortedITADocuments" :key="doc.id" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="py-3 px-6 text-left">
                <a :href="doc.url" target="_blank" class="text-blue-600 hover:underline flex items-center">
                  <i class="fas fa-file-alt mr-2"></i> {{ doc.title }}
                </a>
              </td>
              <td class="py-3 px-6 text-left">{{ doc.year }}</td>
              <td class="py-3 px-6 text-left">{{ doc.quarter }}</td>
              <td class="py-3 px-6 text-left">{{ doc.topic }}</td>
              <td class="py-3 px-6 text-center">
                <button @click="editITADocument(doc)" class="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs hover:bg-yellow-600 transition duration-300 mr-2">
                  <i class="fas fa-edit"></i> แก้ไข
                </button>
                <button @click="confirmDeleteITADocument(doc.id)" class="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition duration-300">
                  <i class="fas fa-trash-alt"></i> ลบ
                </button>
              </td>
            </tr>
            <tr v-if="itaDocuments.length === 0">
              <td colspan="5" class="py-8 text-center text-gray-500">ยังไม่มีเอกสาร ITA ในระบบ.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบเอกสาร ITA นี้?</p>
        <div class="flex justify-center space-x-4">
          <button @click="deleteITADocument" class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300">
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
import { useToast } from 'vue-toastification';

const toast = useToast();

interface ITADocument {
  id: number;
  title: string;
  year: number;
  quarter: string;
  topic: string; // e.g., 'ข้อมูลพื้นฐาน', 'การจัดซื้อจัดจ้าง'
  description?: string;
  url: string; // URL to the actual document file
}

// Mock data for ITA Documents (admin view)
const itaDocuments = ref<ITADocument[]>([
  { id: 1, title: 'เอกสารโครงสร้างองค์กร 2567', year: 2567, quarter: 'Q1', topic: 'ข้อมูลพื้นฐาน', description: 'เอกสารโครงสร้างองค์กรล่าสุด', url: 'https://www.africau.edu/images/default/sample.pdf' },
  { id: 2, title: 'แผนการจัดซื้อจัดจ้าง 2567', year: 2567, quarter: 'Q1', topic: 'การจัดซื้อจัดจ้าง', description: 'แผนการจัดซื้อจัดจ้างประจำปี', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 3, title: 'รายงานผลการดำเนินงาน Q2 2567', year: 2567, quarter: 'Q2', topic: 'การดำเนินงานและงบประมาณ', description: 'รายงานผลการดำเนินงานไตรมาส 2', url: 'https://www.africau.edu/images/default/sample.pdf' },
  { id: 4, title: 'นโยบาย No Gift Policy 2566', year: 2566, quarter: 'Q1', topic: 'การป้องกันการทุจริต', description: 'นโยบายไม่รับของขวัญปี 2566', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 5, title: 'งบประมาณรายรับ-รายจ่าย 2565', year: 2565, quarter: 'Q3', topic: 'การดำเนินงานและงบประมาณ', description: 'สรุปงบประมาณปี 2565', url: 'https://www.africau.edu/images/default/sample.pdf' },
]);

const currentDocument = ref<ITADocument>({
  id: 0,
  title: '',
  year: new Date().getFullYear() + 543, // Default to current Thai year
  quarter: 'Q1',
  topic: '',
  description: '',
  url: '',
});
const editingDocument = ref(false);
const documentToDeleteId = ref<number | null>(null);
const showConfirmModal = ref(false);

// Generate a list of years (current year + 2 years back/forward for example)
const getYearsList = () => {
  const currentYear = new Date().getFullYear() + 543; // Thai year
  const years = [];
  for (let i = currentYear + 2; i >= currentYear - 5; i--) { // Adjust range as needed
    years.push(i);
  }
  return years;
};

// Sort documents by year (descending) and then quarter
const sortedITADocuments = computed(() => {
  const quarterOrder = { 'Q1': 1, 'Q2': 2, 'Q3': 3, 'Q4': 4 };
  return [...itaDocuments.value].sort((a, b) => {
    if (b.year !== a.year) {
      return b.year - a.year; // Sort by year descending
    }
    return quarterOrder[a.quarter] - quarterOrder[b.quarter]; // Then by quarter ascending
  });
});

const saveITADocument = () => {
  if (editingDocument.value) {
    const index = itaDocuments.value.findIndex(doc => doc.id === currentDocument.value.id);
    if (index !== -1) {
      itaDocuments.value[index] = { ...currentDocument.value };
    }
    toast.success('แก้ไขเอกสาร ITA สำเร็จ!');
  } else {
    currentDocument.value.id = itaDocuments.value.length > 0 ? Math.max(...itaDocuments.value.map(doc => doc.id)) + 1 : 1;
    itaDocuments.value.push({ ...currentDocument.value });
    toast.success('เพิ่มเอกสาร ITA ใหม่สำเร็จ!');
  }
  resetForm();
};

const editITADocument = (doc: ITADocument) => {
  currentDocument.value = { ...doc };
  editingDocument.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const confirmDeleteITADocument = (id: number) => {
  documentToDeleteId.value = id;
  showConfirmModal.value = true;
};

const deleteITADocument = () => {
  if (documentToDeleteId.value !== null) {
    itaDocuments.value = itaDocuments.value.filter(doc => doc.id !== documentToDeleteId.value);
    toast.success('ลบเอกสาร ITA สำเร็จ!');
  }
  resetDeleteConfirm();
};

const cancelDelete = () => {
  resetDeleteConfirm();
};

const resetForm = () => {
  currentDocument.value = {
    id: 0,
    title: '',
    year: new Date().getFullYear() + 543,
    quarter: 'Q1',
    topic: '',
    description: '',
    url: '',
  };
  editingDocument.value = false;
};

const resetDeleteConfirm = () => {
  documentToDeleteId.value = null;
  showConfirmModal.value = false;
};

// In a real application, you would fetch initial documents from an API on mount
// onMounted(() => {
//   fetchITADocuments();
// });
// const fetchITADocuments = async () => { /* ... */ };
</script>

<style scoped>
/* Specific styles for this page */
</style>

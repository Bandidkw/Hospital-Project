<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-file-alt mr-3 text-green-500"></i> จัดการเอกสาร ITA
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับอัปโหลด, แก้ไข, และลบเอกสารที่เกี่ยวข้องกับการประเมิน ITA.</p>

    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ editingDocument ? 'แก้ไขเอกสาร' : 'อัปโหลดเอกสารใหม่' }}</h3>
      <form @submit.prevent="saveDocument" class="space-y-4">
        <div>
          <label for="docTitle" class="block text-sm font-medium text-gray-700">ชื่อเอกสาร:</label>
          <input type="text" id="docTitle" v-model="currentDocument.title" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="docCategory" class="block text-sm font-medium text-gray-700">หมวดหมู่:</label>
          <select id="docCategory" v-model="currentDocument.category" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
            <option value="">-- เลือกหมวดหมู่ --</option>
            <option value="รายงานผล">รายงานผล</option>
            <option value="แผนการดำเนินงาน">แผนการดำเนินงาน</option>
            <option value="ข้อมูลสาธารณะ">ข้อมูลสาธารณะ</option>
            </select>
        </div>
        <div>
          <label for="uploadDate" class="block text-sm font-medium text-gray-700">วันที่อัปโหลด:</label>
          <input type="date" id="uploadDate" v-model="currentDocument.uploadDate" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="docFile" class="block text-sm font-medium text-gray-700">ไฟล์เอกสาร (PDF/Word):</label>
          <input type="file" id="docFile" @change="handleFileUpload" accept=".pdf,.doc,.docx" class="mt-1 block w-full text-gray-700" :required="!editingDocument">
          <p v-if="currentDocument.fileUrl" class="text-sm text-gray-500 mt-2">ไฟล์ปัจจุบัน: <a :href="currentDocument.fileUrl" target="_blank" class="text-blue-500 hover:underline">ดูไฟล์</a></p>
        </div>
        <div class="flex justify-end space-x-3">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            <i class="fas fa-save mr-2"></i> {{ editingDocument ? 'บันทึกการแก้ไข' : 'อัปโหลดเอกสาร' }}
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
              <th class="py-3 px-6 text-left">#</th>
              <th class="py-3 px-6 text-left">ชื่อเอกสาร</th>
              <th class="py-3 px-6 text-left">หมวดหมู่</th>
              <th class="py-3 px-6 text-left">วันที่อัปโหลด</th>
              <th class="py-3 px-6 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-for="(doc, index) in documentsList" :key="doc.id" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="py-3 px-6 text-left">{{ index + 1 }}</td>
              <td class="py-3 px-6 text-left">
                <a :href="doc.fileUrl" target="_blank" class="text-blue-600 hover:underline">
                  {{ doc.title }}
                </a>
              </td>
              <td class="py-3 px-6 text-left">{{ doc.category }}</td>
              <td class="py-3 px-6 text-left">{{ doc.uploadDate }}</td>
              <td class="py-3 px-6 text-center">
                <button @click="editDocument(doc)" class="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs hover:bg-yellow-600 transition duration-300 mr-2">
                  <i class="fas fa-edit"></i> แก้ไข
                </button>
                <button @click="confirmDeleteDocument(doc.id)" class="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition duration-300">
                  <i class="fas fa-trash-alt"></i> ลบ
                </button>
              </td>
            </tr>
            <tr v-if="documentsList.length === 0">
              <td colspan="5" class="py-8 text-center text-gray-500">ยังไม่มีเอกสารในระบบ.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

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
import { ref } from 'vue';
import { useToast } from 'vue-toastification'; // นำเข้า useToast

const toast = useToast(); // สร้าง instance ของ toast

interface DocumentItem {
  id: number;
  title: string;
  category: string;
  uploadDate: string;
  fileUrl: string;
}

const documentsList = ref<DocumentItem[]>([
  { id: 1, title: 'รายงานผลการดำเนินงาน 2566', category: 'รายงานผล', uploadDate: '2024-01-15', fileUrl: 'https://www.africau.edu/images/default/sample.pdf' },
  { id: 2, title: 'แผนปฏิบัติการป้องกันทุจริต 2567', category: 'แผนการดำเนินงาน', uploadDate: '2024-03-01', fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
]);

const currentDocument = ref<DocumentItem>({
  id: 0,
  title: '',
  category: '',
  uploadDate: new Date().toISOString().split('T')[0],
  fileUrl: '',
});
const editingDocument = ref(false);
const documentToDeleteId = ref<number | null>(null);
const showConfirmModal = ref(false);

const saveDocument = () => {
  if (editingDocument.value) {
    const index = documentsList.value.findIndex(d => d.id === currentDocument.value.id);
    if (index !== -1) {
      documentsList.value[index] = { ...currentDocument.value };
    }
    toast.success('แก้ไขเอกสารสำเร็จ!'); // เปลี่ยนจาก alert เป็น toast.success
  } else {
    if (!currentDocument.value.fileUrl) {
      toast.error('กรุณาอัปโหลดไฟล์เอกสาร!'); // ใช้ toast.error สำหรับการตรวจสอบ
      return;
    }
    currentDocument.value.id = documentsList.value.length > 0 ? Math.max(...documentsList.value.map(d => d.id)) + 1 : 1;
    documentsList.value.push({ ...currentDocument.value });
    toast.success('อัปโหลดเอกสารใหม่สำเร็จ!'); // เปลี่ยนจาก alert เป็น toast.success
  }
  resetForm();
};

const editDocument = (doc: DocumentItem) => {
  currentDocument.value = { ...doc };
  editingDocument.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const confirmDeleteDocument = (id: number) => {
  documentToDeleteId.value = id;
  showConfirmModal.value = true;
};

const deleteDocument = () => {
  if (documentToDeleteId.value !== null) {
    documentsList.value = documentsList.value.filter(d => d.id !== documentToDeleteId.value);
    toast.success('ลบเอกสารสำเร็จ!'); // เปลี่ยนจาก alert เป็น toast.success
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
    category: '',
    uploadDate: new Date().toISOString().split('T')[0],
    fileUrl: '',
  };
  editingDocument.value = false;
  const fileInput = document.getElementById('docFile') as HTMLInputElement;
  if (fileInput) fileInput.value = ''; // Clear file input
};

const resetDeleteConfirm = () => {
  documentToDeleteId.value = null;
  showConfirmModal.value = false;
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    // In a real app, you'd upload this file to a server and get a URL back.
    // For now, we'll simulate a URL.
    const file = input.files[0];
    currentDocument.value.fileUrl = URL.createObjectURL(file); // Temporary URL for display
    toast.info(`ไฟล์ "${file.name}" ถูกเลือกแล้ว.`); // แจ้งเตือนเมื่อเลือกไฟล์
  }
};
</script>

<style scoped>
/* Specific styles for this page */
</style>

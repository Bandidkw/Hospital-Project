<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-file-image mr-3 text-red-400"></i> จัดการรูปภาพตามหน้า
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับกำหนดและจัดการรูปภาพเฉพาะสำหรับแต่ละหน้าของเว็บไซต์.</p>

    <!-- Form for Assigning/Uploading Page Images -->
    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">กำหนดรูปภาพสำหรับหน้า</h3>
      <form @submit.prevent="assignImageToPage" class="space-y-4">
        <div>
          <label for="selectPage" class="block text-sm font-medium text-gray-700">เลือกหน้า:</label>
          <select id="selectPage" v-model="assignForm.page" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
            <option value="">-- เลือกหน้า --</option>
            <option v-for="page in availablePages" :key="page.value" :value="page.value">{{ page.text }}</option>
          </select>
        </div>
        <div>
          <label for="pageImageUpload" class="block text-sm font-medium text-gray-700">อัปโหลดรูปภาพใหม่ (ถ้ามี)</label>
          <input type="file" id="pageImageUpload" @change="handleFileUpload" accept="image/*" class="mt-1 block w-full text-gray-700">
          <p class="text-xs text-gray-500 mt-1">รูปภาพสำหรับหน้าหลัก, แบนเนอร์, หรือรูปภาพเฉพาะส่วน</p>
        </div>
        <div v-if="assignForm.imageUrl" class="mt-4">
          <p class="text-sm font-medium text-gray-700">รูปภาพปัจจุบันสำหรับหน้านี้:</p>
          <img :src="assignForm.imageUrl" alt="Current Page Image" class="w-32 h-auto rounded-md shadow-sm mt-2">
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            <i class="fas fa-check-circle mr-2"></i> บันทึกรูปภาพ
          </button>
        </div>
      </form>
    </div>

    <!-- List of Assigned Page Images -->
    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รูปภาพที่กำหนดสำหรับแต่ละหน้า</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">หน้า</th>
              <th class="py-3 px-6 text-center">รูปภาพ</th>
              <th class="py-3 px-6 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-for="pageImage in pageImagesList" :key="pageImage.page" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="py-3 px-6 text-left">{{ getPageName(pageImage.page) }}</td>
              <td class="py-3 px-6 text-center">
                <img :src="pageImage.imageUrl" alt="Page Image" class="w-24 h-auto object-cover rounded-md mx-auto">
              </td>
              <td class="py-3 px-6 text-center">
                <button @click="editPageImage(pageImage)" class="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs hover:bg-yellow-600 transition duration-300 mr-2">
                  <i class="fas fa-edit"></i> แก้ไข
                </button>
                <button @click="confirmDeletePageImage(pageImage.page)" class="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition duration-300">
                  <i class="fas fa-trash-alt"></i> ลบ
                </button>
              </td>
            </tr>
            <tr v-if="pageImagesList.length === 0">
              <td colspan="3" class="py-8 text-center text-gray-500">ยังไม่มีรูปภาพที่กำหนดสำหรับหน้าใดๆ.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Custom Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพสำหรับหน้านี้?</p>
        <div class="flex justify-center space-x-4">
          <button @click="deletePageImage" class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300">
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
import { ref, watch } from 'vue';

interface PageImage {
  page: string; // e.g., 'home', 'about', 'services/outpatient'
  imageUrl: string;
}

const availablePages = ref([
  { value: 'home', text: 'หน้าแรก' },
  { value: 'about', text: 'เกี่ยวกับโรงพยาบาล' },
  { value: 'services/outpatient', text: 'บริการ: ผู้ป่วยนอก' },
  { value: 'news', text: 'ข่าวสาร' },
  // Add more pages as needed
]);

const pageImagesList = ref<PageImage[]>([
  { page: 'home', imageUrl: 'https://placehold.co/200x100/c0c0c0/333333?text=HomeBanner' },
  { page: 'news', imageUrl: 'https://placehold.co/200x100/d0d0d0/333333?text=NewsHeader' },
]);

const assignForm = ref({
  page: '',
  file: null as File | null,
  imageUrl: '', // To display current image when page is selected
});

const pageToDelete = ref<string | null>(null);
const showConfirmModal = ref(false);

const getPageName = (pageValue: string) => {
  const page = availablePages.value.find(p => p.value === pageValue);
  return page ? page.text : pageValue;
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    assignForm.value.file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      assignForm.value.imageUrl = e.target?.result as string; // Preview the new image
    };
    reader.readAsDataURL(input.files[0]);
  }
};

const assignImageToPage = () => {
  if (!assignForm.value.page) {
    alert('กรุณาเลือกหน้า!');
    return;
  }
  if (!assignForm.value.file && !assignForm.value.imageUrl) {
    alert('กรุณาอัปโหลดรูปภาพหรือเลือกรูปภาพที่มีอยู่!');
    return;
  }

  console.log('Assigning image to page:', assignForm.value.page, assignForm.value.file?.name || 'existing image');

  const existingIndex = pageImagesList.value.findIndex(pi => pi.page === assignForm.value.page);
  if (existingIndex !== -1) {
    pageImagesList.value[existingIndex].imageUrl = assignForm.value.imageUrl;
    alert('อัปเดตรูปภาพสำหรับหน้าสำเร็จ!');
  } else {
    pageImagesList.value.push({
      page: assignForm.value.page,
      imageUrl: assignForm.value.imageUrl,
    });
    alert('กำหนดรูปภาพสำหรับหน้าสำเร็จ!');
  }
  resetForm();
};

const editPageImage = (pageImage: PageImage) => {
  assignForm.value.page = pageImage.page;
  assignForm.value.imageUrl = pageImage.imageUrl;
  assignForm.value.file = null; // Clear file input
};

const confirmDeletePageImage = (page: string) => {
  pageToDelete.value = page;
  showConfirmModal.value = true;
};

const deletePageImage = () => {
  if (pageToDelete.value !== null) {
    pageImagesList.value = pageImagesList.value.filter(pi => pi.page !== pageToDelete.value);
    alert('ลบรูปภาพสำหรับหน้าเรียบร้อยแล้ว!');
  }
  resetDeleteConfirm();
};

const cancelDelete = () => {
  resetDeleteConfirm();
};

const resetForm = () => {
  assignForm.value = { page: '', file: null, imageUrl: '' };
  const fileInput = document.getElementById('pageImageUpload') as HTMLInputElement;
  if (fileInput) fileInput.value = '';
};

const resetDeleteConfirm = () => {
  pageToDelete.value = null;
  showConfirmModal.value = false;
};

// When page selection changes, update the preview image
watch(() => assignForm.value.page, (newPage) => {
  const existingImage = pageImagesList.value.find(pi => pi.page === newPage);
  if (existingImage) {
    assignForm.value.imageUrl = existingImage.imageUrl;
  } else {
    assignForm.value.imageUrl = '';
  }
  assignForm.value.file = null; // Clear file input when page changes
  const fileInput = document.getElementById('pageImageUpload') as HTMLInputElement;
  if (fileInput) fileInput.value = '';
});
</script>

<style scoped>
/* Specific styles for this page */
</style>

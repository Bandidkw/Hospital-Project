<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-sitemap mr-3 text-purple-400"></i> จัดการโครงสร้างองค์กร
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับอัปโหลดและจัดการแผนผังโครงสร้างองค์กรของโรงพยาบาล.</p>

    <!-- Form for Uploading Org Chart Image -->
    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">อัปโหลดแผนผังโครงสร้างองค์กร</h3>
      <form @submit.prevent="uploadOrgChart" class="space-y-4">
        <div>
          <label for="orgChartImage" class="block text-sm font-medium text-gray-700">เลือกไฟล์รูปภาพแผนผัง (JPG, PNG)</label>
          <input type="file" id="orgChartImage" @change="handleImageUpload" accept="image/jpeg, image/png" class="mt-1 block w-full text-gray-700" required>
          <p class="text-xs text-gray-500 mt-1">ขนาดที่แนะนำ: กว้าง 1200px / สูง 800px</p>
        </div>
        <div>
          <label for="imageTitle" class="block text-sm font-medium text-gray-700">ชื่อแผนผัง (ไม่บังคับ)</label>
          <input type="text" id="imageTitle" v-model="imageTitle" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            <i class="fas fa-upload mr-2"></i> อัปโหลด
          </button>
        </div>
      </form>
    </div>

    <!-- Current Org Chart Display -->
    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">แผนผังโครงสร้างองค์กรปัจจุบัน</h3>
      <div v-if="currentOrgChart.imageUrl" class="text-center">
        <img :src="currentOrgChart.imageUrl" :alt="currentOrgChart.title" class="max-w-full h-auto rounded-lg shadow-lg mx-auto mb-4">
        <p class="text-gray-600 mb-4">{{ currentOrgChart.title || 'แผนผังโครงสร้างองค์กร' }} (อัปเดตล่าสุด: {{ currentOrgChart.uploadedDate }})</p>
        <button @click="confirmDeleteOrgChart" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">
          <i class="fas fa-trash-alt mr-2"></i> ลบแผนผังปัจจุบัน
        </button>
      </div>
      <div v-else class="text-center text-gray-500 py-8">
        <p>ยังไม่มีแผนผังโครงสร้างองค์กรอัปโหลด.</p>
      </div>
    </div>

    <!-- Custom Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบแผนผังโครงสร้างองค์กรปัจจุบัน?</p>
        <div class="flex justify-center space-x-4">
          <button @click="deleteOrgChart" class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300">
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

interface OrgChart {
  imageUrl: string;
  title: string;
  uploadedDate: string;
}

const currentOrgChart = ref<OrgChart>({
  imageUrl: 'https://placehold.co/1200x800/d0d0d0/333333?text=Organization+Chart+Placeholder', // Example placeholder
  title: 'แผนผังโครงสร้างองค์กร 2568',
  uploadedDate: '2024-06-01',
});

const imageFile = ref<File | null>(null);
const imageTitle = ref('');
const showConfirmModal = ref(false);

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    imageFile.value = input.files[0];
  }
};

const uploadOrgChart = () => {
  if (!imageFile.value) {
    alert('กรุณาเลือกไฟล์รูปภาพแผนผัง!');
    return;
  }

  // In a real application, you would send this to your backend API
  // using FormData and fetch/axios.
  console.log('Uploading Org Chart:', imageTitle.value, imageFile.value.name);

  // Simulate upload success
  currentOrgChart.value = {
    imageUrl: URL.createObjectURL(imageFile.value),
    title: imageTitle.value || 'แผนผังโครงสร้างองค์กร',
    uploadedDate: new Date().toISOString().split('T')[0],
  };
  alert('อัปโหลดแผนผังโครงสร้างองค์กรสำเร็จ!');
  resetUploadForm();
};

const confirmDeleteOrgChart = () => {
  showConfirmModal.value = true;
};

const deleteOrgChart = () => {
  currentOrgChart.value = { imageUrl: '', title: '', uploadedDate: '' };
  alert('ลบแผนผังโครงสร้างองค์กรเรียบร้อยแล้ว!');
  resetDeleteConfirm();
};

const cancelDelete = () => {
  resetDeleteConfirm();
};

const resetUploadForm = () => {
  imageFile.value = null;
  imageTitle.value = '';
  const fileInput = document.getElementById('orgChartImage') as HTMLInputElement;
  if (fileInput) fileInput.value = '';
};

const resetDeleteConfirm = () => {
  showConfirmModal.value = false;
};
</script>

<style scoped>
/* Specific styles for this page */
</style>

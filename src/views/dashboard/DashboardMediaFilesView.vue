<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-photo-video mr-3 text-blue-500"></i> จัดการไฟล์มีเดีย
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับอัปโหลด, จัดการ, และลบไฟล์รูปภาพและวิดีโอสำหรับใช้งานในเว็บไซต์.</p>

    <!-- Form for Uploading Media -->
    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">อัปโหลดไฟล์มีเดีย</h3>
      <form @submit.prevent="uploadMedia" class="space-y-4">
        <div>
          <label for="mediaFile" class="block text-sm font-medium text-gray-700">เลือกไฟล์ (รูปภาพ/วิดีโอ)</label>
          <input type="file" id="mediaFile" @change="handleFileUpload" accept="image/*,video/*" class="mt-1 block w-full text-gray-700" required>
          <p class="text-xs text-gray-500 mt-1">รองรับไฟล์รูปภาพ (JPG, PNG, GIF) และวิดีโอ (MP4, WebM)</p>
        </div>
        <div>
          <label for="mediaCaption" class="block text-sm font-medium text-gray-700">คำบรรยาย (ไม่บังคับ)</label>
          <input type="text" id="mediaCaption" v-model="uploadForm.caption" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            <i class="fas fa-upload mr-2"></i> อัปโหลด
          </button>
        </div>
      </form>
    </div>

    <!-- Media Gallery/List -->
    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">คลังไฟล์มีเดีย</h3>
      <div v-if="mediaList.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="media in mediaList" :key="media.id" class="relative group bg-gray-100 rounded-lg shadow-sm overflow-hidden">
          <img v-if="media.type === 'image'" :src="media.url" :alt="media.caption" class="w-full h-32 object-cover">
          <video v-else-if="media.type === 'video'" :src="media.url" controls class="w-full h-32 object-cover"></video>
          <div class="p-3">
            <p class="text-sm font-medium text-gray-700 truncate">{{ media.caption || media.name }}</p>
            <p class="text-xs text-gray-500">{{ media.type.toUpperCase() }} | {{ media.uploadedDate }}</p>
          </div>
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button @click="confirmDeleteMedia(media.id)" class="bg-red-500 text-white p-2 rounded-full text-xs hover:bg-red-600 transition duration-300">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 py-8">
        <p>ยังไม่มีไฟล์มีเดียในคลัง.</p>
      </div>
    </div>

    <!-- Custom Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบไฟล์มีเดียนี้?</p>
        <div class="flex justify-center space-x-4">
          <button @click="deleteMedia" class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300">
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

interface MediaItem {
  id: number;
  name: string;
  caption: string;
  url: string;
  type: 'image' | 'video';
  uploadedDate: string;
}

const uploadForm = ref({
  file: null as File | null,
  caption: '',
});

const mediaList = ref<MediaItem[]>([
  { id: 1, name: 'hospital_exterior.jpg', caption: 'ภาพภายนอกโรงพยาบาล', url: 'https://placehold.co/150x150/e0e0e0/333333?text=Image1', type: 'image', uploadedDate: '2024-07-01' },
  { id: 2, name: 'promo_video.mp4', caption: 'วิดีโอแนะนำบริการ', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', type: 'video', uploadedDate: '2024-06-20' },
]);

const mediaToDeleteId = ref<number | null>(null);
const showConfirmModal = ref(false);

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    uploadForm.value.file = input.files[0];
  }
};

const uploadMedia = () => {
  if (!uploadForm.value.file) {
    alert('กรุณาเลือกไฟล์มีเดีย!');
    return;
  }

  console.log('Uploading:', uploadForm.value.file.name, uploadForm.value.caption);

  const fileType = uploadForm.value.file.type.startsWith('image/') ? 'image' : (uploadForm.value.file.type.startsWith('video/') ? 'video' : 'unknown');
  if (fileType === 'unknown') {
    alert('ไม่รองรับประเภทไฟล์นี้!');
    return;
  }

  const newMedia: MediaItem = {
    id: mediaList.value.length > 0 ? Math.max(...mediaList.value.map(m => m.id)) + 1 : 1,
    name: uploadForm.value.file.name,
    caption: uploadForm.value.caption,
    url: URL.createObjectURL(uploadForm.value.file), // For local preview
    type: fileType,
    uploadedDate: new Date().toISOString().split('T')[0],
  };
  mediaList.value.push(newMedia);
  alert('ไฟล์มีเดียอัปโหลดสำเร็จ!');
  resetUploadForm();
};

const confirmDeleteMedia = (id: number) => {
  mediaToDeleteId.value = id;
  showConfirmModal.value = true;
};

const deleteMedia = () => {
  if (mediaToDeleteId.value !== null) {
    mediaList.value = mediaList.value.filter(m => m.id !== mediaToDeleteId.value);
    alert('ลบไฟล์มีเดียสำเร็จ!');
  }
  resetDeleteConfirm();
};

const cancelDelete = () => {
  resetDeleteConfirm();
};

const resetUploadForm = () => {
  uploadForm.value = { file: null, caption: '' };
  const fileInput = document.getElementById('mediaFile') as HTMLInputElement;
  if (fileInput) fileInput.value = '';
};

const resetDeleteConfirm = () => {
  mediaToDeleteId.value = null;
  showConfirmModal.value = false;
};
</script>

<style scoped>
/* Specific styles for this page */
</style>

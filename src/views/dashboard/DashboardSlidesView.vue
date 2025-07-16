<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-images mr-3 text-blue-400"></i> จัดการภาพสไลด์
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับเพิ่ม, แก้ไข, และลบภาพสไลด์ที่แสดงบนหน้าแรกของเว็บไซต์.</p>

    <!-- Form for Adding/Editing Slide -->
    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ editingSlide ? 'แก้ไขภาพสไลด์' : 'เพิ่มภาพสไลด์ใหม่' }}</h3>
      <form @submit.prevent="saveSlide" class="space-y-4">
        <div>
          <label for="slideTitle" class="block text-sm font-medium text-gray-700">หัวข้อสไลด์ (ไม่บังคับ)</label>
          <input type="text" id="slideTitle" v-model="currentSlide.title" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="slideDescription" class="block text-sm font-medium text-gray-700">คำอธิบาย (ไม่บังคับ)</label>
          <textarea id="slideDescription" v-model="currentSlide.description" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div>
          <label for="slideImage" class="block text-sm font-medium text-gray-700">รูปภาพสไลด์</label>
          <input type="file" id="slideImage" @change="handleImageUpload" accept="image/*" class="mt-1 block w-full text-gray-700" :required="!editingSlide">
          <p v-if="currentSlide.imageUrl" class="text-sm text-gray-500 mt-2">รูปภาพปัจจุบัน: <a :href="currentSlide.imageUrl" target="_blank" class="text-blue-500 hover:underline">ดูรูป</a></p>
        </div>
        <div>
          <label for="slideOrder" class="block text-sm font-medium text-gray-700">ลำดับการแสดงผล</label>
          <input type="number" id="slideOrder" v-model.number="currentSlide.order" class="mt-1 block w-24 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="flex justify-end space-x-3">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            <i class="fas fa-save mr-2"></i> {{ editingSlide ? 'บันทึกการแก้ไข' : 'เพิ่มสไลด์' }}
          </button>
          <button v-if="editingSlide" type="button" @click="cancelEdit" class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300">
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </form>
    </div>

    <!-- List of Slides -->
    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รายการภาพสไลด์</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">#</th>
              <th class="py-3 px-6 text-left">รูปภาพ</th>
              <th class="py-3 px-6 text-left">หัวข้อ</th>
              <th class="py-3 px-6 text-left">คำอธิบาย</th>
              <th class="py-3 px-6 text-center">ลำดับ</th>
              <th class="py-3 px-6 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-for="(slide, index) in slidesList" :key="slide.id" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="py-3 px-6 text-left">{{ index + 1 }}</td>
              <td class="py-3 px-6 text-left">
                <img :src="slide.imageUrl" alt="Slide Image" class="w-16 h-12 object-cover rounded-md">
              </td>
              <td class="py-3 px-6 text-left">{{ slide.title || '-' }}</td>
              <td class="py-3 px-6 text-left truncate max-w-xs">{{ slide.description || '-' }}</td>
              <td class="py-3 px-6 text-center">{{ slide.order }}</td>
              <td class="py-3 px-6 text-center">
                <button @click="editSlide(slide)" class="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs hover:bg-yellow-600 transition duration-300 mr-2">
                  <i class="fas fa-edit"></i> แก้ไข
                </button>
                <button @click="confirmDeleteSlide(slide.id)" class="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition duration-300">
                  <i class="fas fa-trash-alt"></i> ลบ
                </button>
              </td>
            </tr>
            <tr v-if="slidesList.length === 0">
              <td colspan="6" class="py-8 text-center text-gray-500">ยังไม่มีภาพสไลด์ในขณะนี้.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Custom Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบภาพสไลด์นี้?</p>
        <div class="flex justify-center space-x-4">
          <button @click="deleteSlide" class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300">
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

interface SlideItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
}

const slidesList = ref<SlideItem[]>([
  { id: 1, title: 'สไลด์ 1', description: 'คำอธิบายสไลด์ 1', imageUrl: 'https://placehold.co/100x100/a0a0a0/ffffff?text=Slide1', order: 1 },
  { id: 2, title: 'สไลด์ 2', description: 'คำอธิบายสไลด์ 2', imageUrl: 'https://placehold.co/100x100/b0b0b0/ffffff?text=Slide2', order: 2 },
]);

const currentSlide = ref<SlideItem>({
  id: 0,
  title: '',
  description: '',
  imageUrl: '',
  order: 0,
});
const editingSlide = ref(false);
const slideToDeleteId = ref<number | null>(null);
const showConfirmModal = ref(false);

const saveSlide = () => {
  if (editingSlide.value) {
    const index = slidesList.value.findIndex(s => s.id === currentSlide.value.id);
    if (index !== -1) {
      slidesList.value[index] = { ...currentSlide.value };
    }
    alert('แก้ไขภาพสไลด์สำเร็จ!');
  } else {
    currentSlide.value.id = slidesList.value.length > 0 ? Math.max(...slidesList.value.map(s => s.id)) + 1 : 1;
    slidesList.value.push({ ...currentSlide.value });
    alert('เพิ่มภาพสไลด์สำเร็จ!');
  }
  resetForm();
};

const editSlide = (slide: SlideItem) => {
  currentSlide.value = { ...slide };
  editingSlide.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const confirmDeleteSlide = (id: number) => {
  slideToDeleteId.value = id;
  showConfirmModal.value = true;
};

const deleteSlide = () => {
  if (slideToDeleteId.value !== null) {
    slidesList.value = slidesList.value.filter(s => s.id !== slideToDeleteId.value);
    alert('ลบภาพสไลด์สำเร็จ!');
  }
  resetDeleteConfirm();
};

const cancelDelete = () => {
  resetDeleteConfirm();
};

const resetForm = () => {
  currentSlide.value = { id: 0, title: '', description: '', imageUrl: '', order: 0 };
  editingSlide.value = false;
  const fileInput = document.getElementById('slideImage') as HTMLInputElement;
  if (fileInput) fileInput.value = '';
};

const resetDeleteConfirm = () => {
  slideToDeleteId.value = null;
  showConfirmModal.value = false;
};

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      currentSlide.value.imageUrl = e.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }
};
</script>

<style scoped>
/* Specific styles for this page */
</style>

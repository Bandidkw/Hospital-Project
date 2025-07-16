<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-images mr-3 text-fuchsia-500"></i> จัดการสไลด์ / แบนเนอร์
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับเพิ่ม, แก้ไข, และจัดลำดับสไลด์บนหน้าแรกของเว็บไซต์.</p>


    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ editingSlide ? 'แก้ไขสไลด์' : 'เพิ่มสไลด์ใหม่' }}</h3>
      <form @submit.prevent="saveSlide" class="space-y-4">
        <div>
          <label for="slideImageUrl" class="block text-sm font-medium text-gray-700">URL รูปภาพสไลด์:</label>
          <input type="url" id="slideImageUrl" v-model="currentSlide.imageUrl" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="เช่น https://example.com/slide1.jpg" required>
        </div>
        <div>
          <label for="slideTitle" class="block text-sm font-medium text-gray-700">หัวข้อสไลด์ (Optional):</label>
          <input type="text" id="slideTitle" v-model="currentSlide.title" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="slideDescription" class="block text-sm font-medium text-gray-700">คำอธิบาย (Optional):</label>
          <textarea id="slideDescription" v-model="currentSlide.description" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div>
          <label for="slideLink" class="block text-sm font-medium text-gray-700">ลิงก์ (Optional):</label>
          <input type="url" id="slideLink" v-model="currentSlide.link" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="เช่น https://www.maetaenghospital.com/news/123">
          <p class="text-xs text-gray-500 mt-1">เมื่อคลิกสไลด์จะนำไปยังลิงก์นี้</p>
        </div>
        <div class="flex items-center">
          <input id="slideIsActive" type="checkbox" v-model="currentSlide.isActive" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
          <label for="slideIsActive" class="ml-2 block text-sm text-gray-900">ใช้งานอยู่</label>
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


    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รายการสไลด์</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">รูปภาพ</th>
              <th class="py-3 px-6 text-left">หัวข้อ</th>
              <th class="py-3 px-6 text-left">สถานะ</th>
              <th class="py-3 px-6 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-for="slide in slidesList" :key="slide.id" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="py-3 px-6 text-left">
                <img :src="slide.imageUrl" alt="Slide Image" class="w-20 h-12 object-cover rounded-md shadow-sm">
              </td>
              <td class="py-3 px-6 text-left">{{ slide.title || '-' }}</td>
              <td class="py-3 px-6 text-left">
                <span :class="{'bg-green-200 text-green-800': slide.isActive, 'bg-red-200 text-red-800': !slide.isActive}" class="py-1 px-3 rounded-full text-xs">
                  {{ slide.isActive ? 'ใช้งาน' : 'ไม่ใช้งาน' }}
                </span>
              </td>
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
              <td colspan="4" class="py-8 text-center text-gray-500">ยังไม่มีสไลด์ในระบบ.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบสไลด์นี้?</p>
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
import { useToast } from 'vue-toastification';

const toast = useToast();

interface SlideItem {
  id: number;
  imageUrl: string;
  title?: string;
  description?: string;
  link?: string;
  isActive: boolean;
}

const slidesList = ref<SlideItem[]>([
  { id: 1, imageUrl: 'https://via.placeholder.com/800x300/4F46E5/FFFFFF?text=Slide+1', title: 'ยินดีต้อนรับสู่โรงพยาบาลแม่แตง', description: 'บริการทางการแพทย์ครบวงจร', link: '/about', isActive: true },
  { id: 2, imageUrl: 'https://via.placeholder.com/800x300/10B981/FFFFFF?text=Slide+2', title: 'ตรวจสุขภาพประจำปี', description: 'โปรโมชั่นพิเศษสำหรับคุณ', link: '/services/checkup', isActive: true },
  { id: 3, imageUrl: 'https://via.placeholder.com/800x300/EF4444/FFFFFF?text=Slide+3', title: 'รับสมัครบุคลากร', description: 'ร่วมเป็นส่วนหนึ่งของเรา', link: '/personnel/careers', isActive: false },
]);

const currentSlide = ref<SlideItem>({
  id: 0,
  imageUrl: '',
  title: '',
  description: '',
  link: '',
  isActive: true,
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
    toast.success('แก้ไขสไลด์สำเร็จ!');
  } else {
    currentSlide.value.id = slidesList.value.length > 0 ? Math.max(...slidesList.value.map(s => s.id)) + 1 : 1;
    slidesList.value.push({ ...currentSlide.value });
    toast.success('เพิ่มสไลด์ใหม่สำเร็จ!');
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
    toast.success('ลบสไลด์สำเร็จ!');
  }
  resetDeleteConfirm();
};

const cancelDelete = () => {
  resetDeleteConfirm();
};

const resetForm = () => {
  currentSlide.value = {
    id: 0,
    imageUrl: '',
    title: '',
    description: '',
    link: '',
    isActive: true,
  };
  editingSlide.value = false;
};

const resetDeleteConfirm = () => {
  slideToDeleteId.value = null;
  showConfirmModal.value = false;
};

// In a real application, you would fetch initial slides from an API on mount
// onMounted(() => {
//   fetchSlides();
// });
// const fetchSlides = async () => { /* ... */ };
</script>

<style scoped>
/* Specific styles for this page */
</style>

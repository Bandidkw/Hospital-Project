<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-newspaper mr-3 text-green-500"></i> จัดการข่าวสาร
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับเพิ่ม, แก้ไข, และลบข่าวสารและประกาศของโรงพยาบาล.</p>

    <!-- Form for Adding/Editing News -->
    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ editingNews ? 'แก้ไขข่าวสาร' : 'เพิ่มข่าวสารใหม่' }}</h3>
      <form @submit.prevent="saveNews" class="space-y-4">
        <div>
          <label for="newsTitle" class="block text-sm font-medium text-gray-700">หัวข้อข่าวสาร</label>
          <input type="text" id="newsTitle" v-model="currentNews.title" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="newsSummary" class="block text-sm font-medium text-gray-700">สรุปข่าวสาร (ย่อ)</label>
          <textarea id="newsSummary" v-model="currentNews.summary" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div>
          <label for="newsContent" class="block text-sm font-medium text-gray-700">เนื้อหาข่าวสาร</label>
          <textarea id="newsContent" v-model="currentNews.content" rows="6" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required></textarea>
        </div>
        <div>
          <label for="newsImage" class="block text-sm font-medium text-gray-700">รูปภาพประกอบ</label>
          <input type="file" id="newsImage" @change="handleImageUpload" class="mt-1 block w-full text-gray-700">
          <p v-if="currentNews.imageUrl" class="text-sm text-gray-500 mt-2">รูปภาพปัจจุบัน: <a :href="currentNews.imageUrl" target="_blank" class="text-blue-500 hover:underline">ดูรูป</a></p>
        </div>
        <div class="flex justify-end space-x-3">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            <i class="fas fa-save mr-2"></i> {{ editingNews ? 'บันทึกการแก้ไข' : 'เพิ่มข่าวสาร' }}
          </button>
          <button v-if="editingNews" type="button" @click="cancelEdit" class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300">
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </form>
    </div>

    <!-- List of News Articles -->
    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รายการข่าวสาร</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">#</th>
              <th class="py-3 px-6 text-left">หัวข้อ</th>
              <th class="py-3 px-6 text-left">สรุป</th>
              <th class="py-3 px-6 text-center">วันที่เผยแพร่</th>
              <th class="py-3 px-6 text-center">รูปภาพ</th>
              <th class="py-3 px-6 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-for="(newsItem, index) in newsList" :key="newsItem.id" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="py-3 px-6 text-left">{{ index + 1 }}</td>
              <td class="py-3 px-6 text-left">{{ newsItem.title }}</td>
              <td class="py-3 px-6 text-left truncate max-w-xs">{{ newsItem.summary }}</td>
              <td class="py-3 px-6 text-center">{{ newsItem.date }}</td>
              <td class="py-3 px-6 text-center">
                <img v-if="newsItem.imageUrl" :src="newsItem.imageUrl" alt="News Image" class="w-12 h-12 object-cover rounded-md mx-auto">
                <span v-else>-</span>
              </td>
              <td class="py-3 px-6 text-center">
                <button @click="editNews(newsItem)" class="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs hover:bg-yellow-600 transition duration-300 mr-2">
                  <i class="fas fa-edit"></i> แก้ไข
                </button>
                <button @click="confirmDeleteNews(newsItem.id)" class="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition duration-300">
                  <i class="fas fa-trash-alt"></i> ลบ
                </button>
              </td>
            </tr>
            <tr v-if="newsList.length === 0">
              <td colspan="6" class="py-8 text-center text-gray-500">ยังไม่มีข่าวสารในขณะนี้.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Custom Confirmation Modal (instead of alert/confirm) -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบข่าวสารนี้?</p>
        <div class="flex justify-center space-x-4">
          <button @click="deleteNews" class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300">
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

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content: string;
  date: string;
  imageUrl: string;
}

const newsList = ref<NewsItem[]>([
  { id: 1, title: 'ข่าวสารทดสอบ 1', summary: 'สรุปข่าวสารทดสอบ 1...', content: 'เนื้อหาเต็มของข่าวสารทดสอบ 1.', date: '2024-07-16', imageUrl: 'https://placehold.co/100x100/e0e0e0/333333?text=News1' },
  { id: 2, title: 'ข่าวสารทดสอบ 2', summary: 'สรุปข่าวสารทดสอบ 2...', content: 'เนื้อหาเต็มของข่าวสารทดสอบ 2.', date: '2024-07-15', imageUrl: 'https://placehold.co/100x100/e0e0e0/333333?text=News2' },
]);

const currentNews = ref<NewsItem>({
  id: 0,
  title: '',
  summary: '',
  content: '',
  date: '',
  imageUrl: '',
});
const editingNews = ref(false);
const newsToDeleteId = ref<number | null>(null);
const showConfirmModal = ref(false);

const saveNews = () => {
  if (editingNews.value) {
    // Logic for updating existing news
    const index = newsList.value.findIndex(n => n.id === currentNews.value.id);
    if (index !== -1) {
      newsList.value[index] = { ...currentNews.value };
    }
    alert('แก้ไขข่าวสารสำเร็จ!');
  } else {
    // Logic for adding new news
    currentNews.value.id = newsList.value.length > 0 ? Math.max(...newsList.value.map(n => n.id)) + 1 : 1;
    currentNews.value.date = new Date().toISOString().split('T')[0]; // Current date
    newsList.value.push({ ...currentNews.value });
    alert('เพิ่มข่าวสารสำเร็จ!');
  }
  resetForm();
};

const editNews = (newsItem: NewsItem) => {
  currentNews.value = { ...newsItem };
  editingNews.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const confirmDeleteNews = (id: number) => {
  newsToDeleteId.value = id;
  showConfirmModal.value = true;
};

const deleteNews = () => {
  if (newsToDeleteId.value !== null) {
    newsList.value = newsList.value.filter(n => n.id !== newsToDeleteId.value);
    alert('ลบข่าวสารสำเร็จ!');
  }
  resetDeleteConfirm();
};

const cancelDelete = () => {
  resetDeleteConfirm();
};

const resetForm = () => {
  currentNews.value = { id: 0, title: '', summary: '', content: '', date: '', imageUrl: '' };
  editingNews.value = false;
};

const resetDeleteConfirm = () => {
  newsToDeleteId.value = null;
  showConfirmModal.value = false;
};

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      currentNews.value.imageUrl = e.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }
};

// In a real application, you would fetch/send data to your backend API
// onMounted(() => {
//   fetchNews();
// });
// const fetchNews = async () => { /* ... */ };
</script>

<style scoped>
/* Specific styles for this page */
</style>

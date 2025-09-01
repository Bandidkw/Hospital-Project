<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-newspaper mr-3 text-blue-500"></i> จัดการข่าวสาร
    </h2>
    <p class="text-gray-700 mb-6">
      หน้านี้ใช้สำหรับเพิ่ม, แก้ไข, และลบข่าวสารและประกาศของโรงพยาบาล.
    </p>

    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">
        {{ editingNews ? 'แก้ไขข่าวสาร' : 'เพิ่มข่าวสารใหม่' }}
      </h3>
      <form @submit.prevent="saveNews" class="space-y-4">
        <div>
          <label for="newsTitle" class="block text-sm font-medium text-gray-700"
            >หัวข้อข่าวสาร:</label
          >
          <input
            type="text"
            id="newsTitle"
            v-model="currentNews.title"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label for="newsContent" class="block text-sm font-medium text-gray-700"
            >เนื้อหาข่าวสาร:</label
          >
          <textarea
            id="newsContent"
            v-model="currentNews.content"
            rows="6"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
        </div>
        <div>
          <label for="newsDate" class="block text-sm font-medium text-gray-700"
            >วันที่เผยแพร่:</label
          >
          <input
            type="date"
            id="newsDate"
            v-model="currentNews.date"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label for="newsImage" class="block text-sm font-medium text-gray-700"
            >รูปภาพประกอบ (URL):</label
          >
          <input
            type="text"
            id="newsImage"
            v-model="currentNews.imageUrl"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p class="text-xs text-gray-500 mt-1">สามารถใส่ URL รูปภาพ หรือเว้นว่างไว้</p>
        </div>
        <div class="flex items-center">
          <input
            id="isPublished"
            type="checkbox"
            v-model="currentNews.isPublished"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label for="isPublished" class="ml-2 block text-sm text-gray-900">เผยแพร่ทันที</label>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            type="submit"
            class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            <i class="fas fa-save mr-2"></i> {{ editingNews ? 'บันทึกการแก้ไข' : 'เพิ่มข่าวสาร' }}
          </button>
          <button
            v-if="editingNews"
            type="button"
            @click="cancelEdit"
            class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300"
          >
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </form>
    </div>

    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รายการข่าวสาร</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">#</th>
              <th class="py-3 px-6 text-left">หัวข้อ</th>
              <th class="py-3 px-6 text-left">วันที่</th>
              <th class="py-3 px-6 text-left">สถานะ</th>
              <th class="py-3 px-6 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr
              v-for="(news, index) in newsList"
              :key="news.id"
              class="border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="py-3 px-6 text-left">{{ index + 1 }}</td>
              <td class="py-3 px-6 text-left">{{ news.title }}</td>
              <td class="py-3 px-6 text-left">{{ news.date }}</td>
              <td class="py-3 px-6 text-left">
                <span
                  :class="{
                    'bg-green-200 text-green-800': news.isPublished,
                    'bg-red-200 text-red-800': !news.isPublished,
                  }"
                  class="py-1 px-3 rounded-full text-xs"
                >
                  {{ news.isPublished ? 'เผยแพร่แล้ว' : 'ฉบับร่าง' }}
                </span>
              </td>
              <td class="py-3 px-6 text-center">
                <button
                  @click="editNews(news)"
                  class="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs hover:bg-yellow-600 transition duration-300 mr-2"
                >
                  <i class="fas fa-edit"></i> แก้ไข
                </button>
                <button
                  @click="confirmDeleteNews(news.id)"
                  class="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition duration-300"
                >
                  <i class="fas fa-trash-alt"></i> ลบ
                </button>
              </td>
            </tr>
            <tr v-if="newsList.length === 0">
              <td colspan="5" class="py-8 text-center text-gray-500">ยังไม่มีข่าวสารในระบบ.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบข่าวสารนี้?</p>
        <div class="flex justify-center space-x-4">
          <button
            @click="deleteNews"
            class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300"
          >
            <i class="fas fa-trash-alt mr-2"></i> ลบ
          </button>
          <button
            @click="cancelDelete"
            class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300"
          >
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification' // นำเข้า useToast

const toast = useToast() // สร้าง instance ของ toast

interface NewsItem {
  id: number
  title: string
  content: string
  date: string
  imageUrl?: string
  isPublished: boolean
}

const newsList = ref<NewsItem[]>([
  {
    id: 1,
    title: 'ประกาศวันหยุดราชการ',
    content: 'เนื่องในวัน...',
    date: '2024-07-28',
    isPublished: true,
    imageUrl: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    title: 'ข่าวรับสมัครบุคลากร',
    content: 'โรงพยาบาล...',
    date: '2024-07-20',
    isPublished: false,
    imageUrl: '',
  },
])

const currentNews = ref<NewsItem>({
  id: 0,
  title: '',
  content: '',
  date: new Date().toISOString().split('T')[0],
  imageUrl: '',
  isPublished: false,
})
const editingNews = ref(false)
const newsToDeleteId = ref<number | null>(null)
const showConfirmModal = ref(false)

const saveNews = () => {
  if (editingNews.value) {
    const index = newsList.value.findIndex((n) => n.id === currentNews.value.id)
    if (index !== -1) {
      newsList.value[index] = { ...currentNews.value }
    }
    toast.success('แก้ไขข่าวสารสำเร็จ!') // เปลี่ยนจาก alert เป็น toast.success
  } else {
    currentNews.value.id =
      newsList.value.length > 0 ? Math.max(...newsList.value.map((n) => n.id)) + 1 : 1
    newsList.value.push({ ...currentNews.value })
    toast.success('เพิ่มข่าวสารใหม่สำเร็จ!') // เปลี่ยนจาก alert เป็น toast.success
  }
  resetForm()
}

const editNews = (news: NewsItem) => {
  currentNews.value = { ...news }
  editingNews.value = true
}

const cancelEdit = () => {
  resetForm()
}

const confirmDeleteNews = (id: number) => {
  newsToDeleteId.value = id
  showConfirmModal.value = true
}

const deleteNews = () => {
  if (newsToDeleteId.value !== null) {
    newsList.value = newsList.value.filter((n) => n.id !== newsToDeleteId.value)
    toast.success('ลบข่าวสารสำเร็จ!') // เปลี่ยนจาก alert เป็น toast.success
  }
  resetDeleteConfirm()
}

const cancelDelete = () => {
  resetDeleteConfirm()
}

const resetForm = () => {
  currentNews.value = {
    id: 0,
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    isPublished: false,
  }
  editingNews.value = false
}

const resetDeleteConfirm = () => {
  newsToDeleteId.value = null
  showConfirmModal.value = false
}

// In a real application, you would fetch initial news from an API on mount
// onMounted(() => {
//   fetchNews();
// });
// const fetchNews = async () => { /* ... */ };
</script>

<style scoped>
/* Specific styles for this page */
</style>

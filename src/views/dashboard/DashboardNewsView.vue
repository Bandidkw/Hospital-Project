<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 flex items-center">
          <i class="fas fa-newspaper mr-3 text-blue-500"></i>
          จัดการข่าวสาร
        </h2>
        <p class="text-gray-600 mt-1">เพิ่ม / แก้ไข / ลบข่าวสาร และตั้งค่าการเผยแพร่</p>
      </div>
      <button
        v-if="editingNews"
        @click="cancelEdit"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
      >
        <i class="fas fa-times"></i>
        ยกเลิกการแก้ไข
      </button>
    </div>

    <!-- Form Card -->
    <div class="bg-gray-50 border border-gray-200 p-6 rounded-xl mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-gray-900">
          {{ editingNews ? 'แก้ไขข่าวสาร' : 'เพิ่มข่าวสารใหม่' }}
        </h3>
        <span
          v-if="editingNews"
          class="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800"
        >
          <i class="fas fa-edit"></i>
          โหมดแก้ไข
        </span>
      </div>

      <form @submit.prevent="saveNews" class="grid md:grid-cols-5 gap-5">
        <!-- Left column -->
        <div class="md:col-span-3 space-y-4">
          <!-- Title -->
          <div>
            <label for="newsTitle" class="block text-sm font-medium text-gray-700"
              >หัวข้อข่าวสาร *</label
            >
            <input
              id="newsTitle"
              type="text"
              v-model.trim="currentNews.title"
              @blur="validateTitle"
              maxlength="150"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-400': errors.title }"
              placeholder="พิมพ์หัวข้อข่าวสาร"
              required
            />
            <div class="flex justify-between text-xs mt-1">
              <p class="text-red-600" v-if="errors.title">{{ errors.title }}</p>
              <p class="text-gray-400 ml-auto">{{ currentNews.title.length }}/150</p>
            </div>
          </div>

          <!-- Content -->
          <div>
            <label for="newsContent" class="block text-sm font-medium text-gray-700"
              >เนื้อหาข่าวสาร *</label
            >
            <textarea
              id="newsContent"
              v-model.trim="currentNews.content"
              @blur="validateContent"
              rows="8"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-400': errors.content }"
              placeholder="พิมพ์รายละเอียดข่าวสาร"
              required
            />
            <p class="text-xs text-red-600 mt-1" v-if="errors.content">{{ errors.content }}</p>
          </div>
        </div>

        <!-- Right column -->
        <div class="md:col-span-2 space-y-4">
          <!-- Date -->
          <div>
            <label for="newsDate" class="block text-sm font-medium text-gray-700"
              >วันที่เผยแพร่ *</label
            >
            <input
              id="newsDate"
              type="date"
              v-model="currentNews.date"
              @blur="validateDate"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-400': errors.date }"
              required
            />
            <p class="text-xs text-red-600 mt-1" v-if="errors.date">{{ errors.date }}</p>
          </div>

          <!-- Image URL -->
          <div>
            <label for="newsImage" class="block text-sm font-medium text-gray-700"
              >รูปภาพประกอบ (URL)</label
            >
            <input
              id="newsImage"
              type="url"
              v-model.trim="currentNews.imageUrl"
              @input="updateImagePreview"
              placeholder="https://example.com/image.jpg"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p class="text-xs text-gray-500 mt-1">ใส่ URL รูปภาพ หรือเว้นว่างไว้</p>

            <!-- Preview -->
            <div
              v-if="imagePreviewUrl"
              class="mt-3 relative rounded-lg overflow-hidden border border-gray-200 bg-white"
            >
              <img
                :src="imagePreviewUrl"
                alt="ตัวอย่างรูปภาพ"
                class="w-full h-36 object-cover"
                @error="onImageError"
              />
              <button
                type="button"
                class="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-700 px-2 py-1 rounded-md text-xs shadow"
                @click="clearImage"
                title="ลบรูป"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>

          <!-- Published -->
          <div class="flex items-center">
            <input
              id="isPublished"
              type="checkbox"
              v-model="currentNews.isPublished"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="isPublished" class="ml-2 block text-sm text-gray-900">เผยแพร่ทันที</label>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              v-if="editingNews"
              @click="cancelEdit"
              class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
            >
              <i class="fas fa-undo mr-2"></i> ยกเลิก
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="!formValid"
            >
              <i class="fas fa-save"></i>
              {{ editingNews ? 'บันทึกการแก้ไข' : 'เพิ่มข่าวสาร' }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Toolbar: Search / Filter / Sort -->
    <div class="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
      <div class="flex items-center gap-2 w-full md:w-auto">
        <div class="relative flex-1 md:w-80">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            v-model.trim="search"
            placeholder="ค้นหาหัวข้อข่าว..."
            class="pl-9 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          title="กรองสถานะ"
        >
          <option value="all">ทั้งหมด</option>
          <option value="published">เผยแพร่แล้ว</option>
          <option value="draft">ฉบับร่าง</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">เรียงตาม:</label>
        <select
          v-model="sortKey"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="date">วันที่</option>
          <option value="title">หัวข้อ</option>
        </select>
        <button
          class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          @click="toggleSortDir"
          :title="sortDir === 'desc' ? 'เรียงใหม่ → เก่า' : 'เรียงเก่า → ใหม่'"
        >
          <i :class="sortDir === 'desc' ? 'fas fa-sort-amount-down' : 'fas fa-sort-amount-up'"></i>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-100 text-left text-gray-600 uppercase text-xs">
          <tr>
            <th class="py-3 px-6 w-14">#</th>
            <th class="py-3 px-6">หัวข้อ</th>
            <th class="py-3 px-6 w-32">วันที่</th>
            <th class="py-3 px-6 w-36">สถานะ</th>
            <th class="py-3 px-6 w-40 text-center">การจัดการ</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 text-sm">
          <!-- Loading skeleton (สั้น ๆ) -->
          <tr v-if="loading">
            <td colspan="5" class="py-8 px-6">
              <div class="animate-pulse space-y-2">
                <div class="h-4 bg-gray-200 rounded w-1/5"></div>
                <div class="h-4 bg-gray-200 rounded w-3/5"></div>
                <div class="h-4 bg-gray-200 rounded w-2/5"></div>
              </div>
            </td>
          </tr>

          <tr
            v-for="(news, index) in pagedNews"
            :key="news.id"
            class="border-t border-gray-100 hover:bg-gray-50"
          >
            <td class="py-3 px-6">{{ (page - 1) * pageSize + index + 1 }}</td>
            <td class="py-3 px-6">
              <div class="flex items-center gap-3">
                <img
                  v-if="news.imageUrl"
                  :src="news.imageUrl"
                  alt=""
                  class="w-12 h-12 rounded object-cover border border-gray-200"
                />
                <div>
                  <div class="font-medium line-clamp-1">{{ news.title }}</div>
                  <div class="text-xs text-gray-500 line-clamp-1">{{ news.content }}</div>
                </div>
              </div>
            </td>
            <td class="py-3 px-6">
              <div class="text-sm">{{ formatDate(news.date) }}</div>
            </td>
            <td class="py-3 px-6">
              <button
                class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs transition"
                :class="
                  news.isPublished
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                "
                @click="togglePublish(news)"
                :title="news.isPublished ? 'คลิกเพื่อเปลี่ยนเป็นฉบับร่าง' : 'คลิกเพื่อเผยแพร่'"
              >
                <i :class="news.isPublished ? 'fas fa-check-circle' : 'fas fa-minus-circle'"></i>
                {{ news.isPublished ? 'เผยแพร่แล้ว' : 'ฉบับร่าง' }}
              </button>
            </td>
            <td class="py-3 px-6 text-center">
              <div class="inline-flex gap-2">
                <button
                  @click="editNews(news)"
                  class="px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-xs transition inline-flex items-center gap-2"
                >
                  <i class="fas fa-edit"></i> แก้ไข
                </button>
                <button
                  @click="confirmDeleteNews(news.id)"
                  class="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs transition inline-flex items-center gap-2"
                >
                  <i class="fas fa-trash-alt"></i> ลบ
                </button>
              </div>
            </td>
          </tr>

          <!-- Empty state -->
          <tr v-if="!loading && pagedNews.length === 0">
            <td colspan="5" class="py-10 px-6 text-center text-gray-500">
              <div class="flex flex-col items-center gap-2">
                <i class="fas fa-inbox text-3xl"></i>
                <p>ยังไม่มีข่าวสารที่ตรงกับเงื่อนไข</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex items-center justify-between p-4 border-t border-gray-100">
        <div class="text-sm text-gray-500">
          แสดง
          <span class="font-medium">{{ pagedStart + 1 }}</span> –
          <span class="font-medium">{{ pagedEnd }}</span>
          จาก
          <span class="font-medium">{{ filteredSortedNews.length }}</span>
          รายการ
        </div>
        <div class="flex items-center gap-2">
          <button
            class="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            :disabled="page === 1"
            @click="page--"
          >
            ก่อนหน้า
          </button>
          <div class="text-sm text-gray-700">
            หน้า <span class="font-semibold">{{ page }}</span> / {{ totalPages }}
          </div>
          <button
            class="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            :disabled="page === totalPages"
            @click="page++"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Modal -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div class="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">
          คุณแน่ใจหรือไม่ว่าต้องการลบข่าวสารนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="cancelDelete"
            class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
          >
            ยกเลิก
          </button>
          <button
            @click="deleteNews"
            class="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition inline-flex items-center gap-2"
          >
            <i class="fas fa-trash-alt"></i> ลบ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

// ---------------- Types ----------------
interface NewsItem {
  id: number
  title: string
  content: string
  date: string // ISO (YYYY-MM-DD)
  imageUrl?: string
  isPublished: boolean
}

// ---------------- State (mock data ตอนนี้; ภายหลังค่อยเชื่อม API) ----------------
const newsList = ref<NewsItem[]>([
  {
    id: 1,
    title: 'ประกาศวันหยุดราชการ',
    content: 'เนื่องในวัน... (ตัวอย่าง)',
    date: '2024-07-28',
    isPublished: true,
    imageUrl: 'https://via.placeholder.com/300x200',
  },
  {
    id: 2,
    title: 'ข่าวรับสมัครบุคลากร',
    content: 'โรงพยาบาล... (ตัวอย่าง)',
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
const loading = ref(false)

// ---------------- Form helpers ----------------
const errors = ref<{ title: string; content: string; date: string }>({
  title: '',
  content: '',
  date: '',
})

const imagePreviewUrl = ref<string>('')

// validation
const validateTitle = () => {
  errors.value.title = currentNews.value.title.trim() ? '' : 'กรุณาระบุหัวข้อข่าวสาร'
}
const validateContent = () => {
  errors.value.content = currentNews.value.content.trim() ? '' : 'กรุณาระบุเนื้อหาข่าวสาร'
}
const validateDate = () => {
  errors.value.date = currentNews.value.date ? '' : 'กรุณาเลือกวันที่เผยแพร่'
}
const formValid = computed(() => {
  return (
    currentNews.value.title.trim().length > 0 &&
    currentNews.value.content.trim().length > 0 &&
    !!currentNews.value.date
  )
})

// image preview
const isValidUrl = (u: string) => {
  try {
    new URL(u)
    return true
  } catch {
    return false
  }
}
const updateImagePreview = () => {
  const u = currentNews.value.imageUrl?.trim()
  imagePreviewUrl.value = u && isValidUrl(u) ? u : ''
}
const onImageError = () => {
  imagePreviewUrl.value = ''
}
const clearImage = () => {
  currentNews.value.imageUrl = ''
  imagePreviewUrl.value = ''
}

// ---------------- Actions ----------------
const saveNews = () => {
  validateTitle()
  validateContent()
  validateDate()
  if (!formValid.value) {
    toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
    return
  }

  if (editingNews.value) {
    const idx = newsList.value.findIndex((n) => n.id === currentNews.value.id)
    if (idx !== -1) {
      newsList.value[idx] = { ...currentNews.value }
    }
    toast.success('บันทึกการแก้ไขสำเร็จ')
  } else {
    const nextId = newsList.value.length > 0 ? Math.max(...newsList.value.map((n) => n.id)) + 1 : 1
    newsList.value.push({ ...currentNews.value, id: nextId })
    toast.success('เพิ่มข่าวสารใหม่สำเร็จ')
  }
  resetForm()
}

const editNews = (news: NewsItem) => {
  currentNews.value = { ...news }
  editingNews.value = true
  updateImagePreview()
}

const cancelEdit = () => {
  resetForm()
  toast.info('ยกเลิกการแก้ไข')
}

const confirmDeleteNews = (id: number) => {
  newsToDeleteId.value = id
  showConfirmModal.value = true
}
const deleteNews = () => {
  if (newsToDeleteId.value !== null) {
    newsList.value = newsList.value.filter((n) => n.id !== newsToDeleteId.value)
    toast.success('ลบข่าวสารสำเร็จ')
  }
  resetDeleteConfirm()
}
const cancelDelete = () => resetDeleteConfirm()

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
  errors.value = { title: '', content: '', date: '' }
  imagePreviewUrl.value = ''
}
const resetDeleteConfirm = () => {
  newsToDeleteId.value = null
  showConfirmModal.value = false
}

// toggle publish
const togglePublish = (news: NewsItem) => {
  news.isPublished = !news.isPublished
  toast.success(news.isPublished ? 'เผยแพร่ข่าวแล้ว' : 'เปลี่ยนเป็นฉบับร่างแล้ว')
}

// ---------------- Toolbar: search/filter/sort/pagination ----------------
const search = ref('')
const statusFilter = ref<'all' | 'published' | 'draft'>('all')
const sortKey = ref<'date' | 'title'>('date')
const sortDir = ref<'asc' | 'desc'>('desc')

const filteredSortedNews = computed(() => {
  let data = [...newsList.value]

  // search
  const q = search.value.trim().toLowerCase()
  if (q) {
    data = data.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q),
    )
  }

  // filter by status
  if (statusFilter.value !== 'all') {
    data = data.filter((n) => (statusFilter.value === 'published' ? n.isPublished : !n.isPublished))
  }

  // sort
  data.sort((a, b) => {
    if (sortKey.value === 'title') {
      return sortDir.value === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    }
    // sort by date (string YYYY-MM-DD)
    return sortDir.value === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
  })

  return data
})

const page = ref(1)
const pageSize = ref(10)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredSortedNews.value.length / pageSize.value)),
)
const pagedStart = computed(() => (page.value - 1) * pageSize.value)
const pagedEnd = computed(() =>
  Math.min(filteredSortedNews.value.length, pagedStart.value + pageSize.value),
)
const pagedNews = computed(() => filteredSortedNews.value.slice(pagedStart.value, pagedEnd.value))

watch([search, statusFilter, sortKey, sortDir, pageSize], () => {
  page.value = 1
})

const toggleSortDir = () => {
  sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
}

// ---------------- Utils ----------------
const formatDate = (iso: string) => {
  // แสดงแบบ 28 ก.ค. 2024
  try {
    const [y, m, d] = iso.split('-').map((s) => parseInt(s, 10))
    const dt = new Date(y, m - 1, d)
    return new Intl.DateTimeFormat('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(dt)
  } catch {
    return iso
  }
}
</script>

<!-- <style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
</style> -->

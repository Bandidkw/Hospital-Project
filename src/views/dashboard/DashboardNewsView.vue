<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <header class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-2 flex items-center">
        <i class="fas fa-newspaper mr-3 text-blue-500"></i>
        จัดการข่าวสาร <span class="sr-only">(News Management)</span>
      </h2>
      <p class="text-gray-600">
        หน้านี้ใช้สำหรับเพิ่ม, แก้ไข, และลบข่าวสารและประกาศของโรงพยาบาล
        <!-- <span class="text-gray-400">(Add, edit, delete hospital news & announcements)</span> -->
      </p>
    </header>

    <!-- FORM CARD -->
    <section class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-gray-800">
          {{ editingNews ? 'แก้ไขข่าวสาร (Edit News)' : 'เพิ่มข่าวสารใหม่ (Add News)' }}
        </h3>

        <!-- Quick actions -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-white transition"
            @click="resetForm"
            :disabled="saving"
            title="ล้างฟอร์ม (Reset form)"
          >
            <i class="fas fa-undo-alt mr-2"></i> เคลียร์
          </button>
        </div>
      </div>

      <form @submit.prevent="onSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left column: inputs -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Title -->
          <div>
            <label for="newsTitle" class="block text-sm font-medium text-gray-700">
              หัวข้อข่าวสาร (Title) <span class="text-red-500">*</span>
            </label>
            <div class="mt-1 relative">
              <input
                type="text"
                id="newsTitle"
                v-model.trim="currentNews.title"
                @input="validateField('title')"
                :class="inputClass('title')"
                placeholder="เช่น ประกาศวันหยุดราชการ"
                maxlength="120"
                required
                aria-required="true"
              />
              <div class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {{ currentNews.title.length }}/120
              </div>
            </div>
            <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
            <p v-else class="mt-1 text-xs text-gray-500">
              หัวข้อสั้น กระชับ อ่านเข้าใจในบรรทัดเดียว
              <span class="text-gray-400">(Keep title concise)</span>
            </p>
          </div>

          <!-- Content -->
          <div>
            <label for="newsContent" class="block text-sm font-medium text-gray-700">
              เนื้อหาข่าวสาร (Content) <span class="text-red-500">*</span>
            </label>
            <textarea
              id="newsContent"
              v-model.trim="currentNews.content"
              @input="validateField('content')"
              :class="textareaClass('content')"
              rows="6"
              placeholder="เนื้อหาข่าวสารโดยย่อ…"
              maxlength="2000"
              required
              aria-required="true"
            ></textarea>
            <div class="flex justify-between mt-1">
              <p v-if="errors.content" class="text-sm text-red-600">{{ errors.content }}</p>
              <p v-else class="text-xs text-gray-500">
                ควรมีสรุปใจความสำคัญ 1–3 บรรทัด
                <span class="text-gray-400">(Summarize key points in 1–3 lines)</span>
              </p>
              <span class="text-xs text-gray-400">{{ currentNews.content.length }}/2000</span>
            </div>
          </div>

          <!-- Date -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="newsDate" class="block text-sm font-medium text-gray-700">
                วันที่เผยแพร่ (Publish date) <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="newsDate"
                v-model="currentNews.date"
                @change="validateField('date')"
                :class="inputClass('date')"
                :min="minDate"
                required
                aria-required="true"
              />
              <p v-if="errors.date" class="mt-1 text-sm text-red-600">{{ errors.date }}</p>
              <p v-else class="mt-1 text-xs text-gray-500">
                หากเลือกวันที่อนาคต ระบบจะแสดงเป็น “ประกาศล่วงหน้า”
                <span class="text-gray-400">(future-dated = scheduled look)</span>
              </p>
            </div>

            <!-- Publish switch -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                สถานะการเผยแพร่ (Publish status)
              </label>
              <button
                type="button"
                class="inline-flex items-center px-3 py-2 rounded-md border transition select-none"
                :class="
                  currentNews.isPublished
                    ? 'bg-green-50 border-green-300 text-green-800'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                "
                role="switch"
                :aria-checked="currentNews.isPublished"
                @click="currentNews.isPublished = !currentNews.isPublished"
              >
                <i
                  class="fas mr-2"
                  :class="currentNews.isPublished ? 'fa-toggle-on' : 'fa-toggle-off'"
                  aria-hidden="true"
                ></i>
                {{ currentNews.isPublished ? 'เผยแพร่ทันที (Published)' : 'ฉบับร่าง (Draft)' }}
              </button>
              <p class="mt-1 text-xs text-gray-500">
                สลับเพื่อกำหนดสถานะข่าว
                <span class="text-gray-400">(toggle publish/draft)</span>
              </p>
            </div>
          </div>

          <!-- Image URL -->
          <div>
            <label for="newsImage" class="block text-sm font-medium text-gray-700">
              รูปภาพประกอบ (Image URL)
            </label>
            <input
              type="url"
              id="newsImage"
              v-model.trim="currentNews.imageUrl"
              :class="inputBase"
              placeholder="https://…"
              inputmode="url"
              @change="touchImagePreview()"
            />
            <p class="mt-1 text-xs text-gray-500">
              ใส่ URL รูปภาพ หรือเว้นว่าง
              <span class="text-gray-400">(optional image URL)</span>
            </p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!isValid || saving"
            >
              <i class="fas fa-save mr-2"></i>
              {{ editingNews ? 'บันทึกการแก้ไข (Save changes)' : 'เพิ่มข่าวสาร (Add news)' }}
            </button>

            <button
              v-if="editingNews"
              type="button"
              @click="cancelEdit"
              class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition"
            >
              <i class="fas fa-times mr-2"></i> ยกเลิก (Cancel)
            </button>
          </div>
        </div>

        <!-- Right column: live preview -->
        <aside class="lg:col-span-1">
          <div class="bg-white border rounded-lg p-4 shadow-sm">
            <h4 class="font-semibold text-gray-800 mb-3">พรีวิว (Preview)</h4>
            <div class="space-y-2">
              <div
                class="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center"
              >
                <img
                  v-if="previewImageOk && currentNews.imageUrl"
                  :src="currentNews.imageUrl"
                  alt="รูปภาพประกอบข่าว"
                  class="w-full h-full object-cover"
                  @error="previewImageOk = false"
                />
                <div v-else class="text-gray-400 text-sm flex flex-col items-center">
                  <i class="far fa-image text-3xl mb-2"></i>
                  ไม่มีรูปภาพ (No image)
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">{{ prettyDate(currentNews.date) }}</span>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full"
                    :class="
                      currentNews.isPublished
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-200 text-gray-700'
                    "
                  >
                    {{ currentNews.isPublished ? 'เผยแพร่แล้ว' : 'ฉบับร่าง' }}
                  </span>
                </div>
                <h5 class="font-semibold mt-1 text-gray-800 line-clamp-2">
                  {{ currentNews.title || 'หัวข้อข่าว…' }}
                </h5>
                <p class="text-gray-600 text-sm mt-1 line-clamp-3">
                  {{ currentNews.content || 'พิมพ์เนื้อหาข่าวสั้น ๆ เพื่อพรีวิวได้ทันที…' }}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </section>

    <!-- LIST CARD -->
    <section class="card bg-white p-6 rounded-lg shadow-md">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-gray-800">รายการข่าวสาร (News List)</h3>
        <div class="flex gap-2">
          <div class="relative">
            <input
              type="search"
              v-model.trim="query"
              :class="inputBase"
              placeholder="ค้นหาจากหัวข้อ… (Search by title)"
              aria-label="ค้นหาข่าว"
            />
            <i class="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <select v-model="sortKey" :class="inputBase" aria-label="เรียงลำดับตาม">
            <option value="date">วันที่ (Date)</option>
            <option value="title">หัวข้อ (Title)</option>
            <option value="status">สถานะ (Status)</option>
          </select>
          <button
            class="px-3 py-2 border rounded-md hover:bg-gray-50"
            @click="sortAsc = !sortAsc"
            :title="sortAsc ? 'เรียง น้อย→มาก' : 'เรียง มาก→น้อย'"
            aria-label="สลับทิศทางการเรียง"
          >
            <i :class="sortAsc ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
          </button>
        </div>
      </div>

      <!-- Responsive table -->
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">#</th>
              <th class="py-3 px-6 text-left">หัวข้อ (Title)</th>
              <th class="py-3 px-6 text-left">วันที่ (Date)</th>
              <th class="py-3 px-6 text-left">สถานะ (Status)</th>
              <th class="py-3 px-6 text-center">การจัดการ (Actions)</th>
            </tr>
          </thead>
          <tbody class="text-gray-700 text-sm">
            <tr
              v-for="(news, index) in sortedNews"
              :key="news.id"
              class="border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="py-3 px-6">{{ index + 1 }}</td>
              <td class="py-3 px-6">
                <div class="flex items-center gap-2">
                  <img
                    v-if="news.imageUrl"
                    :src="news.imageUrl"
                    alt=""
                    class="w-8 h-8 rounded object-cover border"
                    @error="news.imageUrl = ''"
                  />
                  <span class="font-medium line-clamp-1" :title="news.title">{{ news.title }}</span>
                </div>
              </td>
              <td class="py-3 px-6">{{ prettyDate(news.date) }}</td>
              <td class="py-3 px-6">
                <span
                  :class="
                    news.isPublished ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  "
                  class="py-1 px-3 rounded-full text-xs"
                >
                  {{ news.isPublished ? 'เผยแพร่แล้ว' : 'ฉบับร่าง' }}
                </span>
              </td>
              <td class="py-3 px-6 text-center whitespace-nowrap">
                <button
                  @click="editNews(news)"
                  class="inline-flex items-center bg-amber-500 text-white px-3 py-1 rounded-md text-xs hover:bg-amber-600 transition mr-2"
                  title="แก้ไข (Edit)"
                >
                  <i class="fas fa-edit mr-1"></i> แก้ไข
                </button>
                <button
                  @click="confirmDeleteNews(news.id)"
                  class="inline-flex items-center bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition"
                  title="ลบ (Delete)"
                >
                  <i class="fas fa-trash-alt mr-1"></i> ลบ
                </button>
              </td>
            </tr>
            <tr v-if="sortedNews.length === 0">
              <td colspan="5" class="py-8 text-center text-gray-500">
                ไม่พบข่าวที่ตรงกับการค้นหา <span class="text-gray-400">(No results)</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- CONFIRM DELETE MODAL -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-gray-700 bg-opacity-50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmTitle"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 id="confirmTitle" class="text-xl font-bold text-gray-800 mb-3">
          ยืนยันการลบ (Confirm delete)
        </h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบข่าวสารนี้?</p>
        <div class="flex justify-center gap-3">
          <button
            @click="deleteNews"
            class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
          >
            <i class="fas fa-trash-alt mr-2"></i> ลบ
          </button>
          <button
            @click="cancelDelete"
            class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition"
          >
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

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
    imageUrl: 'https://via.placeholder.com/300x180',
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
const saving = ref(false)
const newsToDeleteId = ref<number | null>(null)
const showConfirmModal = ref(false)

const errors = ref<Record<string, string | null>>({
  title: null,
  content: null,
  date: null,
})

const query = ref('')
const sortKey = ref<'date' | 'title' | 'status'>('date')
const sortAsc = ref(false)

const previewImageOk = ref(true)
function touchImagePreview() {
  previewImageOk.value = true
}

// ---------- Validation ----------
function validateField(field: 'title' | 'content' | 'date') {
  const v = currentNews.value
  if (field === 'title') {
    errors.value.title = !v.title.trim()
      ? 'กรุณากรอกหัวข้อ'
      : v.title.length < 4
        ? 'หัวข้อควรยาวอย่างน้อย 4 ตัวอักษร'
        : null
  }
  if (field === 'content') {
    errors.value.content = !v.content.trim()
      ? 'กรุณากรอกเนื้อหา'
      : v.content.length < 10
        ? 'เนื้อหาควรยาวอย่างน้อย 10 ตัวอักษร'
        : null
  }
  if (field === 'date') {
    errors.value.date = !v.date ? 'กรุณาเลือกวันที่เผยแพร่' : null
  }
}

const isValid = computed(() => {
  validateField('title')
  validateField('content')
  validateField('date')
  return !errors.value.title && !errors.value.content && !errors.value.date
})

// ---------- Styles helpers ----------
const inputBase =
  'mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500'
function inputClass(field: 'title' | 'date') {
  return `${inputBase} ${errors.value[field] ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : ''}`
}
function textareaClass(field: 'content') {
  return `${inputBase} ${errors.value[field] ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : ''}`
}

// ---------- Save / Edit / Delete ----------
async function onSubmit() {
  if (!isValid.value || saving.value) return
  saving.value = true
  try {
    if (editingNews.value) {
      const index = newsList.value.findIndex((n) => n.id === currentNews.value.id)
      if (index !== -1) newsList.value[index] = { ...currentNews.value }
      toast.success('แก้ไขข่าวสารสำเร็จ! (Updated)')
    } else {
      currentNews.value.id =
        newsList.value.length > 0 ? Math.max(...newsList.value.map((n) => n.id)) + 1 : 1
      newsList.value.unshift({ ...currentNews.value })
      toast.success('เพิ่มข่าวสารใหม่สำเร็จ! (Created)')
    }
    resetForm()
  } finally {
    saving.value = false
  }
}

function editNews(news: NewsItem) {
  currentNews.value = { ...news }
  editingNews.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  resetForm()
}

function confirmDeleteNews(id: number) {
  newsToDeleteId.value = id
  showConfirmModal.value = true
}

function deleteNews() {
  if (newsToDeleteId.value !== null) {
    newsList.value = newsList.value.filter((n) => n.id !== newsToDeleteId.value)
    toast.success('ลบข่าวสารสำเร็จ! (Deleted)')
  }
  resetDeleteConfirm()
}

function cancelDelete() {
  resetDeleteConfirm()
}

function resetForm() {
  currentNews.value = {
    id: 0,
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    isPublished: false,
  }
  editingNews.value = false
  errors.value = { title: null, content: null, date: null }
  previewImageOk.value = true
}

function resetDeleteConfirm() {
  newsToDeleteId.value = null
  showConfirmModal.value = false
}

// ---------- List helpers ----------
const filteredNews = computed(() => {
  const q = query.value.toLowerCase()
  return q ? newsList.value.filter((n) => n.title.toLowerCase().includes(q)) : newsList.value
})

const sortedNews = computed(() => {
  const list = [...filteredNews.value]
  const dir = sortAsc.value ? 1 : -1
  if (sortKey.value === 'date') {
    list.sort((a, b) => (a.date > b.date ? 1 : -1) * dir)
  } else if (sortKey.value === 'title') {
    list.sort((a, b) => a.title.localeCompare(b.title) * dir)
  } else {
    // status: published first if descending
    list.sort((a, b) => (Number(a.isPublished) - Number(b.isPublished)) * dir)
  }
  return list
})

// ---------- Utils ----------
function prettyDate(d: string) {
  if (!d) return '-'
  try {
    return new Date(d).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return d
  }
}
const minDate = new Date(2000, 0, 1).toISOString().split('T')[0]
</script>

<style scoped>
/* Small helpers */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

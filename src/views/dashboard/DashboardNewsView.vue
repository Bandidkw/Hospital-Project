<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <!-- Header -->
    <header class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-2 flex items-center">
        <i class="fas fa-newspaper mr-3 text-blue-500"></i>
        จัดการข่าวสาร (News Management)
      </h2>
      <p class="text-gray-600">เพิ่ม / แก้ไข / ลบข่าวสาร และสลับสถานะเผยแพร่</p>
    </header>

    <!-- Error banner -->
    <div
      v-if="errorMsg"
      class="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700 flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <i class="fas fa-exclamation-triangle"></i>
        <span>{{ errorMsg }}</span>
      </div>
      <button
        @click="fetchNews"
        class="px-3 py-1 rounded-md border border-red-300 hover:bg-white text-sm"
      >
        ลองใหม่
      </button>
    </div>

    <!-- FORM + PREVIEW -->
    <section class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-gray-800">
          {{ editingNews ? 'แก้ไขข่าวสาร (Edit News)' : 'เพิ่มข่าวสารใหม่ (Add News)' }}
        </h3>
        <button
          type="button"
          class="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-white transition"
          @click="resetForm"
          :disabled="saving"
          title="ล้างฟอร์ม"
        >
          <i class="fas fa-undo-alt mr-2"></i> เคลียร์
        </button>
      </div>

      <form @submit.prevent="onSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Inputs -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Title -->
          <div>
            <label for="newsTitle" class="block text-sm font-medium text-gray-700">
              หัวข้อข่าวสาร <span class="text-red-500">*</span>
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
          </div>

          <!-- Content -->
          <div>
            <label for="newsContent" class="block text-sm font-medium text-gray-700">
              เนื้อหาข่าวสาร <span class="text-red-500">*</span>
            </label>
            <textarea
              id="newsContent"
              v-model.trim="currentNews.content"
              @input="validateField('content')"
              :class="textareaClass('content')"
              rows="6"
              placeholder="เนื้อหาข่าวโดยย่อ…"
              maxlength="2000"
              required
              aria-required="true"
            ></textarea>
            <div class="flex justify-between mt-1">
              <p v-if="errors.content" class="text-sm text-red-600">{{ errors.content }}</p>
              <span class="text-xs text-gray-400">{{ currentNews.content.length }}/2000</span>
            </div>
          </div>

          <!-- Date + Publish -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="newsDate" class="block text-sm font-medium text-gray-700">
                วันที่เผยแพร่ <span class="text-red-500">*</span>
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
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> สถานะการเผยแพร่ </label>
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
                {{ currentNews.isPublished ? 'เผยแพร่แล้ว' : 'ฉบับร่าง' }}
              </button>
            </div>
          </div>

          <!-- Image URL -->
          <div>
            <label for="newsImage" class="block text-sm font-medium text-gray-700">
              รูปภาพประกอบ (URL)
            </label>
            <input
              type="url"
              id="newsImage"
              v-model.trim="currentNews.imageUrl"
              :class="inputBase"
              placeholder="https://…"
              inputmode="url"
              @change="touchImagePreview"
            />
            <p class="mt-1 text-xs text-gray-500">ใส่ URL รูปภาพ หรือเว้นว่าง</p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!isValid || saving"
            >
              <i class="fas fa-save mr-2"></i>
              {{ editingNews ? 'บันทึกการแก้ไข' : 'เพิ่มข่าวสาร' }}
            </button>

            <button
              v-if="editingNews"
              type="button"
              @click="cancelEdit"
              class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition"
            >
              <i class="fas fa-times mr-2"></i> ยกเลิก
            </button>
          </div>
        </div>

        <!-- Preview -->
        <aside class="lg:col-span-1">
          <div class="bg-white border rounded-lg p-4 shadow-sm">
            <h4 class="font-semibold text-gray-800 mb-3">พรีวิว</h4>
            <div class="space-y-2">
              <div
                class="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center"
              >
                <img
                  v-if="previewImageOk && currentNews.imageUrl"
                  :src="currentNews.imageUrl"
                  alt="รูปภาพประกอบข่าว"
                  class="w-full h-full object-cover"
                  @error="onImgError"
                />
                <div v-else class="text-gray-400 text-sm flex flex-col items-center">
                  <i class="far fa-image text-3xl mb-2"></i>
                  ไม่มีรูปภาพ
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

    <!-- LIST + CONTROLS -->
    <section class="card bg-white p-6 rounded-lg shadow-md">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-gray-800">รายการข่าวสาร</h3>
        <div class="flex gap-2 items-center">
          <div class="relative">
            <input
              type="search"
              v-model.trim="query"
              :class="inputBase"
              placeholder="ค้นหาจากหัวข้อ…"
              aria-label="ค้นหาข่าว"
            />
            <i class="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
          <select v-model="sortKey" :class="inputBase" aria-label="เรียงลำดับตาม">
            <option value="date">วันที่</option>
            <option value="title">หัวข้อ</option>
            <option value="status">สถานะ</option>
          </select>
          <button
            class="px-3 py-2 border rounded-md hover:bg-gray-50"
            @click="sortAsc = !sortAsc"
            :title="sortAsc ? 'เรียง น้อย→มาก' : 'เรียง มาก→น้อย'"
            aria-label="สลับทิศทางการเรียง"
          >
            <i :class="sortAsc ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
          </button>
          <div class="hidden sm:flex items-center gap-2">
            <label class="text-sm text-gray-600">แสดง</label>
            <select v-model.number="pageSize" class="border rounded-md p-1">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
            </select>
            <span class="text-sm text-gray-500">ต่อหน้า</span>
          </div>
        </div>
      </div>

      <!-- Table -->
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
          <tbody class="text-gray-700 text-sm">
            <tr
              v-for="(news, index) in pagedSortedNews"
              :key="news.id"
              class="border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="py-3 px-6">{{ (page - 1) * pageSize + index + 1 }}</td>
              <td class="py-3 px-6">
                <div class="flex items-center gap-2">
                  <img
                    v-if="news.imageUrl"
                    :src="news.imageUrl ?? undefined"
                    alt=""
                    class="w-8 h-8 rounded object-cover border"
                    @error="onImgError"
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
                  @click="togglePublish(news)"
                  class="inline-flex items-center bg-indigo-600 text-white px-3 py-1 rounded-md text-xs hover:bg-indigo-700 transition mr-2"
                  title="สลับเผยแพร่"
                >
                  <i class="fas fa-bullhorn mr-1"></i>
                  {{ news.isPublished ? 'Unpublish' : 'Publish' }}
                </button>
                <button
                  @click="editNews(news)"
                  class="inline-flex items-center bg-amber-500 text-white px-3 py-1 rounded-md text-xs hover:bg-amber-600 transition mr-2"
                  title="แก้ไข"
                >
                  <i class="fas fa-edit mr-1"></i> แก้ไข
                </button>
                <button
                  @click="confirmDeleteNews(news.id)"
                  class="inline-flex items-center bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition"
                  title="ลบ"
                >
                  <i class="fas fa-trash-alt mr-1"></i> ลบ
                </button>
              </td>
            </tr>

            <tr v-if="pagedSortedNews.length === 0">
              <td colspan="5" class="py-8 text-center text-gray-500">ไม่พบข่าวที่ตรงกับการค้นหา</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between mt-4">
        <p class="text-sm text-gray-600">
          แสดง {{ (page - 1) * pageSize + 1 }}–
          {{ Math.min(page * pageSize, sortedNews.length) }} จาก {{ sortedNews.length }} รายการ
        </p>
        <div class="flex items-center gap-2">
          <button
            class="px-3 py-1.5 border rounded-md disabled:opacity-50"
            :disabled="page <= 1"
            @click="page--"
          >
            ก่อนหน้า
          </button>
          <span class="text-sm">หน้า {{ page }}</span>
          <button
            class="px-3 py-1.5 border rounded-md disabled:opacity-50"
            :disabled="page * pageSize >= sortedNews.length"
            @click="page++"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </section>

    <!-- Confirm Delete Modal -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-gray-700 bg-opacity-50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmTitle"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 id="confirmTitle" class="text-xl font-bold text-gray-800 mb-3">ยืนยันการลบ</h3>
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

    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-white/40 backdrop-blur-[1px] z-40 flex items-center justify-center"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        class="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-500"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { isAxiosError } from '@/services/apiService'
import {
  getAdminNewsList,
  createNews,
  updateNews,
  deleteNews as apiDeleteNews,
  publishNews,
  type NewsItem as ServiceNewsItem,
  type PaginatedResponse,
} from '@/services/newsService'

/** ใช้ชนิดจาก service ตรง ๆ เพื่อไม่เกิด mismatch */
type NewsItem = ServiceNewsItem

/** ---------- State ---------- */
const toast = useToast()

const newsList = ref<NewsItem[]>([])
const loading = ref(false)
const errorMsg = ref<string | null>(null)

const currentNews = ref<NewsItem>({
  id: '',
  title: '',
  content: '',
  date: new Date().toISOString().split('T')[0],
  imageUrl: '',
  isPublished: false,
})
const editingNews = ref(false)
const saving = ref(false)

const newsToDeleteId = ref<string | null>(null)
const showConfirmModal = ref(false)

/** ---------- Validation ---------- */
const errors = ref<Record<'title' | 'content' | 'date', string | null>>({
  title: null,
  content: null,
  date: null,
})

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

/** ---------- Filters / Sort / Pagination (client-side) ---------- */
const query = ref('')
const sortKey = ref<'date' | 'title' | 'status'>('date')
const sortAsc = ref(false)

const page = ref(1)
const pageSize = ref(10)

const filteredNews = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? newsList.value.filter((n) => n.title.toLowerCase().includes(q)) : newsList.value
})

const sortedNews = computed(() => {
  const list = [...filteredNews.value]
  const dir = sortAsc.value ? 1 : -1
  if (sortKey.value === 'date') list.sort((a, b) => (a.date > b.date ? 1 : -1) * dir)
  else if (sortKey.value === 'title') list.sort((a, b) => a.title.localeCompare(b.title) * dir)
  else list.sort((a, b) => (Number(a.isPublished) - Number(b.isPublished)) * dir)
  return list
})

const pagedSortedNews = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return sortedNews.value.slice(start, start + pageSize.value)
})

watch([page, pageSize], () => {
  /* ถ้าจะทำ server-side pagination ค่อยเรียก fetchNews() ตรงนี้ */
})

/** ---------- Image Helpers ---------- */
const previewImageOk = ref(true)
function touchImagePreview() {
  previewImageOk.value = true
}
function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  const fallback =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
         <rect width="100%" height="100%" fill="#e5e7eb"/>
         <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
               font-family="sans-serif" font-size="18" fill="#4b5563">
           Image unavailable
         </text>
       </svg>`,
    )
  if (el && el.src !== fallback) el.src = fallback
}

/** ---------- CRUD ---------- */
async function fetchNews() {
  loading.value = true
  errorMsg.value = null
  try {
    // backend ส่ง data เป็น array → service แปลง normalized ให้แล้ว
    const { items }: PaginatedResponse<ServiceNewsItem> = await getAdminNewsList(1, 100)
    newsList.value = items
  } catch (e) {
    if (isAxiosError(e)) errorMsg.value = e.message ?? 'ไม่สามารถดึงรายการข่าวได้'
    else errorMsg.value = 'ไม่สามารถดึงรายการข่าวได้'
  } finally {
    loading.value = false
  }
}

onMounted(fetchNews)

async function onSubmit() {
  if (!isValid.value || saving.value) return
  saving.value = true
  try {
    if (editingNews.value) {
      const id = currentNews.value.id
      const updated = await updateNews(id, {
        title: currentNews.value.title,
        content: currentNews.value.content,
        date: currentNews.value.date,
        imageUrl: currentNews.value.imageUrl || null,
        isPublished: currentNews.value.isPublished,
      })
      const idx = newsList.value.findIndex((n) => n.id === id)
      if (idx !== -1) newsList.value[idx] = { ...newsList.value[idx], ...updated }
      toast.success('แก้ไขข่าวสารสำเร็จ!')
    } else {
      const created = await createNews({
        title: currentNews.value.title,
        content: currentNews.value.content,
        date: currentNews.value.date,
        imageUrl: currentNews.value.imageUrl || null,
        isPublished: currentNews.value.isPublished,
      })
      newsList.value.unshift(created)
      toast.success('เพิ่มข่าวสารใหม่สำเร็จ!')
    }
    resetForm()
  } catch (e) {
    if (isAxiosError(e)) toast.error(e.message ?? 'บันทึกข่าวสารไม่สำเร็จ')
    else toast.error('บันทึกข่าวสารไม่สำเร็จ')
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

function confirmDeleteNews(id: string) {
  newsToDeleteId.value = id
  showConfirmModal.value = true
}

async function deleteNews() {
  if (!newsToDeleteId.value) return
  const id = newsToDeleteId.value

  const snapshot = [...newsList.value]
  newsList.value = newsList.value.filter((n) => n.id !== id)

  try {
    await apiDeleteNews(id)
    toast.success('ลบข่าวสารสำเร็จ!')
  } catch (e) {
    newsList.value = snapshot
    if (isAxiosError(e)) toast.error(e.message ?? 'ลบข่าวสารไม่สำเร็จ')
    else toast.error('ลบข่าวสารไม่สำเร็จ')
  } finally {
    resetDeleteConfirm()
  }
}

async function togglePublish(news: NewsItem) {
  const id = news.id
  const next = !news.isPublished
  const prev = news.isPublished

  // optimistic
  news.isPublished = next

  try {
    await publishNews(id, next)
    toast.success(next ? 'เผยแพร่ข่าวแล้ว' : 'ยกเลิกเผยแพร่แล้ว')
  } catch (e) {
    news.isPublished = prev
    if (isAxiosError(e)) toast.error(e.message ?? 'เปลี่ยนสถานะไม่สำเร็จ')
    else toast.error('เปลี่ยนสถานะไม่สำเร็จ')
  }
}

function cancelDelete() {
  resetDeleteConfirm()
}

function resetForm() {
  currentNews.value = {
    id: '',
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

/** ---------- Utils ---------- */
const inputBase =
  'mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500'
function inputClass(field: 'title' | 'date') {
  return `${inputBase} ${errors.value[field] ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : ''}`
}
function textareaClass(field: 'content') {
  return `${inputBase} ${errors.value[field] ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : ''}`
}
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
.aspect-video {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
}
.aspect-video > img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

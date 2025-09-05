<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <!-- Header -->
    <header class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-2 flex items-center">
        <i class="fas fa-newspaper mr-3 text-blue-500"></i>
        จัดการข่าวสาร (News Management)
      </h2>
      <p class="text-gray-600">เพิ่ม / แก้ไข / สลับสถานะเผยแพร่ข่าวสาร</p>
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
                @input="touched.title && validateField('title')"
                @blur="touch('title')"
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
            <p v-if="touched.title && errors.title" class="mt-1 text-sm text-red-600">
              {{ errors.title }}
            </p>
          </div>

          <!-- Content -->
          <div>
            <label for="newsContent" class="block text-sm font-medium text-gray-700">
              เนื้อหาข่าวสาร <span class="text-red-500">*</span>
            </label>
            <textarea
              id="newsContent"
              v-model.trim="currentNews.content"
              @input="touched.content && validateField('content')"
              @blur="touch('content')"
              :class="textareaClass('content')"
              rows="6"
              placeholder="เนื้อหาข่าวโดยย่อ…"
              maxlength="2000"
              required
              aria-required="true"
            ></textarea>
            <div class="flex justify-between mt-1">
              <p v-if="touched.content && errors.content" class="text-sm text-red-600">
                {{ errors.content }}
              </p>
              <span class="text-xs text-gray-400">{{ currentNews.content.length }}/2000</span>
            </div>
          </div>

          <!-- Excerpt (optional, จะถูกเติมอัตโนมัติถ้าเว้นว่าง) -->
          <div>
            <label for="newsExcerpt" class="block text-sm font-medium text-gray-700">
              คำโปรย (ถ้าเว้นว่าง ระบบจะสร้างให้อัตโนมัติ)
            </label>
            <input
              id="newsExcerpt"
              type="text"
              v-model.trim="currentNews.excerpt"
              :class="inputBase"
              placeholder="ข้อความสั้น ๆ สรุปข่าว"
              maxlength="200"
            />
            <div class="flex justify-between mt-1 text-xs text-gray-500">
              <span>{{ (currentNews.excerpt ?? '').length }}/200</span>
              <span>ระบบจะจำกัดความยาวอัตโนมัติ</span>
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
                @change="touch('date')"
                :class="inputClass('date')"
                :min="minDate"
                required
                aria-required="true"
              />
              <p v-if="touched.date && errors.date" class="mt-1 text-sm text-red-600">
                {{ errors.date }}
              </p>
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

          <!-- Image (file) -->
          <div>
            <label for="newsImageFile" class="block text-sm font-medium text-gray-700">
              รูปภาพประกอบ (อัปโหลดไฟล์)
            </label>
            <input
              id="newsImageFile"
              type="file"
              accept="image/*"
              @change="onFileChange"
              class="mt-1 block w-full text-sm"
            />
            <p class="mt-1 text-xs text-gray-500">
              รองรับไฟล์ภาพ; ระบบจะอัปโหลดผ่าน multipart/form-data
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
                  :alt="currentNews.title || 'รูปภาพประกอบข่าว'"
                  class="w-full h-full object-cover"
                  @error="onImgError"
                />
                <div
                  v-else
                  class="w-full h-full text-gray-400 text-sm flex flex-col items-center justify-center"
                >
                  <i class="far fa-image text-3xl mb-2"></i>
                  ไม่มีรูปภาพ
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">{{ prettyDate(currentNews.date) }}</span>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
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
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <i class="fas fa-list text-blue-500"></i>
          รายการข่าวสาร
        </h3>

        <div class="flex items-center gap-2">
          <div class="relative">
            <input
              type="search"
              v-model.trim="query"
              placeholder="ค้นหาหัวข้อข่าว..."
              class="pl-9 pr-3 py-1.5 text-sm rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <i
              class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
            ></i>
          </div>

          <select
            v-model="sortKey"
            class="border rounded-md text-sm py-1.5 px-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="updated">อัปเดตล่าสุด</option>
            <option value="date">วันที่</option>
            <option value="title">หัวข้อ</option>
            <option value="status">สถานะ</option>
          </select>

          <button
            class="p-2 border rounded-md hover:bg-gray-50"
            @click="sortAsc = !sortAsc"
            :title="sortAsc ? 'เรียง น้อย→มาก' : 'เรียง มาก→น้อย'"
          >
            <i :class="sortAsc ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
          </button>
        </div>
      </div>

      <div class="overflow-x-auto rounded-lg border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50 text-gray-600 uppercase text-xs font-medium">
            <tr>
              <th class="px-4 py-3 text-left w-12">#</th>
              <th class="px-4 py-3 text-left">หัวข้อ</th>
              <th class="px-4 py-3 text-left w-32">วันที่</th>
              <th class="px-4 py-3 text-left w-28">สถานะ</th>
              <th class="px-4 py-3 text-center w-40">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(news, index) in pagedSortedNews"
              :key="news.id"
              class="hover:bg-blue-50/40 transition"
            >
              <td class="px-4 py-3 text-gray-500">{{ (page - 1) * pageSize + index + 1 }}</td>

              <td class="px-4 py-3">
                <div class="flex items-center gap-3 max-w-xs">
                  <img
                    v-if="news.imageUrl"
                    :src="absoluteImage(news.imageUrl)"
                    :alt="news.title"
                    class="w-10 h-10 rounded object-cover border"
                    @error="onImgError"
                  />
                  <div
                    v-else
                    class="w-10 h-10 flex items-center justify-center bg-gray-100 rounded text-gray-400"
                  >
                    <i class="far fa-image"></i>
                  </div>
                  <span class="font-medium text-gray-800 truncate" :title="news.title">
                    {{ news.title }}
                  </span>
                </div>
              </td>

              <td class="px-4 py-3 text-gray-600 whitespace-nowrap">
                {{ prettyDate(news.date) }}
              </td>

              <td class="px-4 py-3">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                  :class="
                    news.isPublished
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  "
                >
                  {{ news.isPublished ? 'เผยแพร่แล้ว' : 'ฉบับร่าง' }}
                </span>
              </td>

              <td class="px-4 py-3 text-center">
                <div class="flex justify-center gap-2">
                  <button
                    @click="togglePublishStatus(news)"
                    class="p-2 rounded-md hover:bg-indigo-50 text-indigo-600"
                    :title="news.isPublished ? 'ยกเลิกเผยแพร่' : 'เผยแพร่'"
                  >
                    <i class="fas fa-bullhorn"></i>
                  </button>
                  <button
                    @click="editNews(news)"
                    class="p-2 rounded-md hover:bg-amber-50 text-amber-600"
                    title="แก้ไข"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="confirmDeleteNews(news.id)"
                    class="p-2 rounded-md hover:bg-red-50 text-red-600"
                    title="ลบ"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="pagedSortedNews.length === 0">
              <td colspan="5" class="py-10 text-center text-gray-500">
                <i class="fas fa-info-circle mr-2"></i> ไม่พบข่าวสาร
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between mt-4 text-sm text-gray-600">
        <p>
          แสดง {{ (page - 1) * pageSize + 1 }} –
          {{ Math.min(page * pageSize, sortedNews.length) }}
          จาก {{ sortedNews.length }} รายการ
        </p>
        <div class="flex items-center gap-2">
          <button
            class="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            :disabled="page <= 1"
            @click="page--"
          >
            ก่อนหน้า
          </button>
          <span>หน้า {{ page }}</span>
          <button
            class="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50"
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
  getAllNews,
  createNews,
  updateNews,
  togglePublish,
  deleteNews as apiDeleteNews,
  type NewsItem as ServiceNewsItem,
} from '@/services/newsService'

type NewsItem = ServiceNewsItem

// ฟอร์มฝั่งหน้า (ไม่บังคับ createdAt/updatedAt)
type NewsForm = {
  id: string
  title: string
  content: string
  excerpt?: string
  date: string
  imageUrl: string
  isPublished: boolean
}

const toast = useToast()

/* ---------------- Helpers: sort by updatedAt desc ---------------- */
function sortByUpdatedDesc<T extends { updatedAt?: string; createdAt?: string; date?: string }>(
  arr: T[],
): T[] {
  return [...arr].sort((a, b) => getSortTime(b) - getSortTime(a))
}

/* ---------------- State ---------------- */
const newsList = ref<NewsItem[]>([])
const loading = ref(false)
const errorMsg = ref<string | null>(null)

const currentNews = ref<NewsForm>({
  id: '',
  title: '',
  content: '',
  excerpt: '',
  date: new Date().toISOString().split('T')[0],
  imageUrl: '',
  isPublished: false,
})
const imageFile = ref<File | null>(null)

const editingNews = ref(false)
const saving = ref(false)
const newsToDeleteId = ref<string | null>(null)
const showConfirmModal = ref(false)

/* ---------------- Validation (touched) ---------------- */
const errors = ref<Record<'title' | 'content' | 'date', string | null>>({
  title: null,
  content: null,
  date: null,
})
const touched = ref<Record<'title' | 'content' | 'date', boolean>>({
  title: false,
  content: false,
  date: false,
})

function validateField(field: 'title' | 'content' | 'date') {
  const v = currentNews.value
  if (field === 'title') {
    errors.value.title = !v.title.trim()
      ? 'กรุณากรอกหัวข้อ'
      : v.title.length < 4
        ? 'หัวข้อควรยาวอย่างน้อย 4 ตัวอักษร'
        : null
  } else if (field === 'content') {
    errors.value.content = !v.content.trim()
      ? 'กรุณากรอกเนื้อหา'
      : v.content.length < 10
        ? 'เนื้อหาควรยาวอย่างน้อย 10 ตัวอักษร'
        : null
  } else if (field === 'date') {
    errors.value.date = !v.date ? 'กรุณาเลือกวันที่เผยแพร่' : null
  }
}
function touch(field: 'title' | 'content' | 'date') {
  touched.value[field] = true
  validateField(field)
}

const isValid = computed(() => {
  const v = currentNews.value
  return v.title.trim().length >= 4 && v.content.trim().length >= 10 && !!v.date
})

/* ---------------- Filters / Sort UI (ฝั่ง client) ---------------- */
const query = ref('')
const sortKey = ref<'updated' | 'date' | 'title' | 'status'>('updated') // ค่าเริ่มต้น: อัปเดตล่าสุด
const sortAsc = ref(false)

const page = ref(1)
const pageSize = ref(10)

const filteredNews = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? newsList.value.filter((n) => n.title.toLowerCase().includes(q)) : newsList.value
})

function getSortTime(n: { updatedAt?: string; createdAt?: string; date?: string }) {
  return new Date(n.updatedAt || n.createdAt || n.date || 0).getTime()
}

const sortedNews = computed(() => {
  const list = [...filteredNews.value]
  const dir = sortAsc.value ? 1 : -1

  if (sortKey.value === 'updated') {
    list.sort((a, b) => (getSortTime(a) - getSortTime(b)) * dir) // เริ่มต้น: อัปเดตล่าสุด
  } else if (sortKey.value === 'date') {
    list.sort((a, b) => (a.date > b.date ? 1 : -1) * dir)
  } else if (sortKey.value === 'title') {
    list.sort((a, b) => a.title.localeCompare(b.title) * dir)
  } else {
    list.sort((a, b) => (Number(a.isPublished) - Number(b.isPublished)) * dir)
  }
  return list
})

const pagedSortedNews = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return sortedNews.value.slice(start, start + pageSize.value)
})

watch([page, pageSize], () => {
  /* ถ้าจะทำ server-side pagination ให้เรียก fetchNews() ที่นี่ */
})

/* ---------------- Image helpers ---------------- */
const previewImageOk = ref(true)
function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  imageFile.value = file
  if (file) {
    currentNews.value.imageUrl = URL.createObjectURL(file)
    previewImageOk.value = true
  }
}
function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  if (!el) return
  const fallback =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
         <rect width="100%" height="100%" fill="#e5e7eb"/>
         <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
               font-family="sans-serif" font-size="18" fill="#4b5563">Image unavailable</text>
       </svg>`,
    )
  if (el.src !== fallback) el.src = fallback
}

/* ---------------- Excerpt helper ---------------- */
function stripHtml(input: string): string {
  const div = document.createElement('div')
  div.innerHTML = input
  return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim()
}
function makeExcerpt(title: string, content: string, max = 200): string {
  const t = stripHtml(title)
  const c = stripHtml(content)
  const base = (t ? `${t} — ` : '') + c
  const clean = base.trim()
  if (!clean) return ''
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  const clipped = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim()
  return clipped + '…'
}

/* ---------------- CRUD ---------------- */
function resort() {
  newsList.value = sortByUpdatedDesc(newsList.value)
}

async function fetchNews() {
  // ...
  const items = await getAllNews()
  newsList.value = sortByUpdatedDesc(items) // ✅ โหลดมาปุ๊บ เรียงล่าสุดก่อน
  // ...
}

// ใน onSubmit / togglePublishStatus / deleteNews หลังอัปเดต state เสร็จ
resort()
onMounted(fetchNews)

function toForm(n: NewsItem): NewsForm {
  return {
    id: n.id,
    title: n.title,
    content: n.content,
    excerpt: n.excerpt ?? '',
    date: n.date,
    imageUrl: n.imageUrl ?? '',
    isPublished: n.isPublished,
  }
}

async function onSubmit() {
  ;(['title', 'content', 'date'] as const).forEach((f) => {
    touched.value[f] = true
    validateField(f)
  })
  if (!isValid.value || saving.value) return

  saving.value = true
  try {
    const base = {
      title: currentNews.value.title.trim(),
      content: currentNews.value.content.trim(),
      excerpt: (
        currentNews.value.excerpt?.trim() ||
        makeExcerpt(currentNews.value.title, currentNews.value.content)
      ).slice(0, 200),
      date: currentNews.value.date,
    }
    currentNews.value.excerpt = base.excerpt

    if (editingNews.value) {
      const id = String(currentNews.value.id)
      const updated = await updateNews(id, {
        ...base,
        isPublished: currentNews.value.isPublished,
        image: imageFile.value ?? null,
      })
      const idx = newsList.value.findIndex((n) => String(n.id) === id)
      if (idx !== -1) newsList.value[idx] = { ...newsList.value[idx], ...updated }
      toast.success('แก้ไขข่าวสารสำเร็จ!')
      resort()
    } else {
      const created = await createNews({
        ...base,
        image: imageFile.value ?? null,
      })
      const existIdx = newsList.value.findIndex((n) => String(n.id) === String(created.id))
      if (existIdx >= 0) newsList.value[existIdx] = { ...newsList.value[existIdx], ...created }
      else newsList.value.unshift(created)
      page.value = 1
      toast.success('เพิ่มข่าวสารใหม่สำเร็จ!')
      resort()
    }

    resetForm()
    imageFile.value = null
  } catch (e) {
    const msg = isAxiosError(e)
      ? ((e.response?.data as { message?: string } | undefined)?.message ?? e.message)
      : 'บันทึกข่าวสารไม่สำเร็จ'
    toast.error(msg)
  } finally {
    saving.value = false
  }
}

function editNews(news: NewsItem) {
  currentNews.value = toForm(news)
  imageFile.value = null
  editingNews.value = true
  touched.value = { title: false, content: false, date: false }
  errors.value = { title: null, content: null, date: null }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  resetForm()
}
function absoluteImage(u?: string | null): string {
  return u ?? ''
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
    resort() // (เผื่อ updatedAt เปลี่ยนหลังลบ/ดึงใหม่ในอนาคต)
  } catch (e) {
    newsList.value = snapshot
    const msg = isAxiosError(e)
      ? ((e.response?.data as { message?: string } | undefined)?.message ?? e.message)
      : 'ลบข่าวสารไม่สำเร็จ'
    toast.error(msg)
  } finally {
    resetDeleteConfirm()
  }
}
function cancelDelete() {
  resetDeleteConfirm()
}

async function togglePublishStatus(news: NewsItem) {
  const id = news.id
  const prev = news.isPublished
  const next = !prev
  news.isPublished = next // optimistic
  try {
    const updated = await togglePublish(id, next)
    Object.assign(news, updated)
    toast.success(next ? 'เผยแพร่ข่าวแล้ว' : 'ยกเลิกเผยแพร่แล้ว')
    resort() // ✅ หลังเปลี่ยนสถานะให้รายการขยับตาม updatedAt
  } catch (e) {
    news.isPublished = prev
    const msg = isAxiosError(e)
      ? ((e.response?.data as { message?: string } | undefined)?.message ?? e.message)
      : 'เปลี่ยนสถานะไม่สำเร็จ'
    toast.error(msg)
  }
}

/* ---------------- Reset / Utils ---------------- */
function resetForm() {
  currentNews.value = {
    id: '',
    title: '',
    content: '',
    excerpt: '',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    isPublished: false,
  }
  imageFile.value = null
  editingNews.value = false
  errors.value = { title: null, content: null, date: null }
  touched.value = { title: false, content: false, date: false }
  previewImageOk.value = true
}

function resetDeleteConfirm() {
  newsToDeleteId.value = null
  showConfirmModal.value = false
}

/* ---------------- UI Utils ---------------- */
const inputBase =
  'mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500'
function inputClass(field: 'title' | 'date') {
  const hasError = touched.value[field] && !!errors.value[field]
  return `${inputBase} ${hasError ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : ''}`
}
function textareaClass(field: 'content') {
  const hasError = touched.value[field] && !!errors.value[field]
  return `${inputBase} ${hasError ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : ''}`
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

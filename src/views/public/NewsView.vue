<template>
  <main class="max-w-6xl mx-auto px-4 py-10">
    <header class="mb-8 text-center md:text-left">
      <h1
        class="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center justify-center md:justify-start gap-3"
      >
        <i class="fas fa-bullhorn text-teal-600"></i>
        <span>ข่าวสารและประกาศ</span>
        <span v-if="activeCategoryLabel" class="text-2xl text-teal-600 font-medium">
          - {{ activeCategoryLabel }}
        </span>
      </h1>
      <p class="text-gray-600 mt-1">อัปเดตข่าวสารล่าสุดของโรงพยาบาล</p>
    </header>

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-10">
      <div class="relative w-full sm:max-w-xs">
        <input
          type="search"
          v-model.trim="query"
          placeholder="ค้นหาหัวข้อข่าว..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-4 focus:ring-teal-100 focus:border-teal-500 shadow-lg transition-all"
        />
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700">เรียงตาม</label>
        <!-- Custom Dropdown -->
        <div class="relative">
          <button
            type="button"
            @click="isSortDropdownOpen = !isSortDropdownOpen"
            @blur="onBlurSort"
            class="sort-dropdown-button"
          >
            <span class="flex items-center">
              <i :class="getSortIcon(sortKey)" class="mr-2 text-teal-600"></i>
              {{ getSortLabel(sortKey) }}
            </span>
            <i
              class="fas fa-chevron-down text-gray-400 ml-2 transition-transform duration-200"
              :class="{ 'rotate-180': isSortDropdownOpen }"
            ></i>
          </button>

          <!-- Dropdown Menu -->
          <div v-if="isSortDropdownOpen" class="sort-dropdown-menu">
            <div
              v-for="option in sortOptions"
              :key="option.value"
              @mousedown.prevent="selectSort(option.value)"
              class="sort-dropdown-item"
            >
              <div class="flex items-center">
                <span
                  class="w-2 h-2 rounded-full mr-3 transition-colors duration-200"
                  :class="sortKey === option.value ? 'bg-teal-500' : 'bg-gray-300'"
                ></span>
                <i :class="option.icon" class="mr-2 text-gray-600"></i>
                <span class="text-gray-700">{{ option.label }}</span>
              </div>
              <i v-if="sortKey === option.value" class="fas fa-check text-teal-600"></i>
            </div>
          </div>
        </div>

        <button
          class="p-2 border border-gray-300 rounded-xl bg-white hover:bg-teal-50 hover:border-teal-500 transition-all text-gray-600 hover:text-teal-600 shadow-sm"
          @click="sortAsc = !sortAsc"
          :title="sortAsc ? 'เรียง น้อย→มาก' : 'เรียง มาก→น้อย'"
        >
          <i :class="sortAsc ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
        </button>
      </div>
    </div>

    <div
      v-if="errorMsg"
      class="mb-8 rounded-xl border border-red-300 bg-red-50 p-4 text-red-700 flex items-center justify-between shadow-lg"
      role="alert"
    >
      <div class="flex items-center gap-2">
        <i class="fas fa-exclamation-triangle"></i>
        <span>{{ errorMsg }}</span>
      </div>
      <button
        @click="fetchNews"
        class="px-4 py-1.5 rounded-lg border border-red-300 bg-white hover:bg-red-100 text-sm font-medium transition-colors shadow-sm"
      >
        ลองใหม่
      </button>
    </div>

    <section :aria-busy="loading ? 'true' : 'false'">
      <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="i in 6"
          :key="i"
          class="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-lg animate-pulse"
          aria-hidden="true"
        >
          <div class="h-56 bg-gray-100"></div>
          <div class="p-5 space-y-3">
            <div class="h-5 bg-gray-200 rounded w-4/5"></div>
            <div class="h-3 bg-gray-100 rounded w-full"></div>
            <div class="h-3 bg-gray-100 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="n in pagedSortedNews"
          :key="n.id"
          class="group rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-xl hover:shadow-2xl hover:border-teal-400 hover:scale-[1.01] transition-all duration-300 ease-in-out transform relative z-0"
        >
          <div class="relative h-56 md:h-64 bg-gray-100 overflow-hidden rounded-t-2xl">
            <img
              v-if="n.imageUrl && !isPdf(n.imageUrl)"
              :src="absoluteImage(n.imageUrl)"
              :alt="n.title"
              class="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
              @error="onImgError"
            />
            <a
              v-else-if="n.imageUrl && isPdf(n.imageUrl)"
              :href="absoluteImage(n.imageUrl)"
              target="_blank"
              class="w-full h-full flex items-center justify-center text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <i class="far fa-file-pdf text-6xl"></i>
              <span class="sr-only">เปิดไฟล์ PDF</span>
            </a>
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <i class="far fa-image text-4xl"></i>
            </div>
            <div
              class="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent"
            ></div>
            <div class="absolute left-3 bottom-3">
              <span
                class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-white/95 text-gray-800 backdrop-blur-sm shadow-md"
              >
                <i class="far fa-calendar"></i>{{ prettyDate(n.date) }}
              </span>
            </div>
          </div>

          <div class="p-5">
            <h2
              class="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-teal-600 transition-colors"
              :title="n.title"
            >
              {{ n.title }}
            </h2>
            <p class="text-sm text-gray-600 mt-2 line-clamp-3 leading-relaxed">
              {{ n.excerpt || n.content }}
            </p>
            <div class="mt-5 pt-3 border-t border-gray-100 flex items-center justify-end">
              <a
                v-if="n.imageUrl && isPdf(n.imageUrl)"
                :href="absoluteImage(n.imageUrl)"
                target="_blank"
                class="text-teal-600 text-sm font-semibold inline-flex items-center gap-1 hover:text-teal-700 transition-colors"
              >
                เปิดไฟล์แนบ <i class="fas fa-file-download text-[11px]"></i>
              </a>
              <RouterLink
                v-else
                :to="{ name: 'news-detail', params: { id: n.id } }"
                class="text-teal-600 text-sm font-semibold inline-flex items-center gap-1 hover:text-teal-700 transition-colors"
              >
                อ่านต่อ
                <i class="fas fa-arrow-right text-[11px] group-hover:translate-x-1 transition"></i>
              </RouterLink>
            </div>
          </div>
        </article>

        <div
          v-if="!pagedSortedNews.length && !loading"
          class="col-span-full text-center py-20 text-gray-400 border border-dashed rounded-xl bg-gray-50"
        >
          <i class="fas fa-inbox text-4xl mb-3"></i>
          <p class="text-lg">ไม่พบข่าวสารที่ตรงกับเงื่อนไข</p>
          <p class="text-sm mt-1">ลองใช้คำค้นหาอื่น หรือเลือกหมวดหมู่ใหม่</p>
        </div>
      </div>
    </section>

    <div
      class="flex items-center justify-center sm:justify-between mt-12 text-sm text-gray-600 flex-wrap gap-4"
      v-if="sortedNews.length > pageSize"
    >
      <p class="hidden sm:block">
        แสดง <span class="font-bold text-gray-800">{{ (page - 1) * pageSize + 1 }}</span> –
        <span class="font-bold text-gray-800">{{
          Math.min(page * pageSize, sortedNews.length)
        }}</span>
        จากทั้งหมด <span class="font-bold text-teal-600">{{ sortedNews.length }}</span> รายการ
      </p>
      <div class="flex items-center gap-2">
        <button
          class="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-teal-50 hover:border-teal-500 disabled:opacity-50 disabled:bg-gray-100 transition-colors shadow-sm text-sm font-medium"
          :disabled="page <= 1"
          @click="page--"
        >
          <i class="fas fa-chevron-left mr-1 text-[10px]"></i> ก่อนหน้า
        </button>
        <span
          class="font-bold text-teal-600 px-3 py-1.5 rounded-full bg-teal-50 shadow-inner text-xs"
        >
          หน้า {{ page }}
        </span>
        <button
          class="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-teal-50 hover:border-teal-500 disabled:opacity-50 disabled:bg-gray-100 transition-colors shadow-sm text-sm font-medium"
          :disabled="page * pageSize >= sortedNews.length"
          @click="page++"
        >
          ถัดไป <i class="fas fa-chevron-right ml-1 text-[10px]"></i>
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { isAxiosError } from '@/services/apiService'
import { getPublicNews, type PublicNewsEx } from '@/services/newsService'
import { attachCategory, CATEGORY_LIST } from '@/features/news/categories'

/* ---------- Types ---------- */

/* ---------- State ---------- */
const loading = ref(false)
const errorMsg = ref<string | null>(null)
const itemsAll = ref<PublicNewsEx[]>([])
const route = useRoute()
const query = ref('')
const sortKey = ref<'date' | 'title'>('date')
const sortAsc = ref(false)
const page = ref(1)
const pageSize = ref(9)

// Custom dropdown state
const isSortDropdownOpen = ref(false)

// Sort options
const sortOptions = [
  { value: 'date' as const, label: 'วันที่', icon: 'fas fa-calendar-alt' },
  { value: 'title' as const, label: 'หัวข้อ', icon: 'fas fa-heading' },
]

// ฟังก์ชันสำหรับเลือกการเรียงลำดับ
const selectSort = (value: 'date' | 'title') => {
  sortKey.value = value
  isSortDropdownOpen.value = false
}

// ฟังก์ชันจัดการเมื่อ blur จาก dropdown
const onBlurSort = () => {
  setTimeout(() => {
    isSortDropdownOpen.value = false
  }, 200)
}

// ฟังก์ชันสำหรับแสดง label
const getSortLabel = (value: 'date' | 'title') => {
  const option = sortOptions.find((opt) => opt.value === value)
  return option ? option.label : value
}

// ฟังก์ชันสำหรับแสดงไอคอน
const getSortIcon = (value: 'date' | 'title') => {
  const option = sortOptions.find((opt) => opt.value === value)
  return option ? option.icon : 'fas fa-sort'
}

/* ---------- Utils ---------- */
const categoryLabels = computed(() =>
  Object.fromEntries(CATEGORY_LIST.map(({ key, label }) => [key, label])),
)

function prettyDate(d: string) {
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
function absoluteImage(u?: string | null): string {
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
  const root = base.replace(/\/api(\/v\d+)?$/i, '')
  return `${root}/${String(u).replace(/^\/+/, '')}`
}
function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  const fallback =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#4b5563">Image unavailable</text></svg>`,
    )
  if (el && el.src !== fallback) el.src = fallback
}
function getSortTime(n: { date: string; updatedAt?: string; createdAt?: string }) {
  return new Date(n.updatedAt || n.createdAt || n.date).getTime()
}

/* ---------- Derived State ---------- */
const activeCategoryLabel = computed(() => {
  const categoryKey = route.query.category as string
  if (!categoryKey) return ''
  return categoryLabels.value[categoryKey] || categoryKey
})

const itemsPublished = computed(() => itemsAll.value.filter((n) => n.isPublished !== false))

const filtered = computed(() => {
  const category = route.query.category as string | undefined
  const q = query.value.trim().toLowerCase()
  let result = itemsPublished.value

  if (category) {
    result = result.filter((news) => news.category === category)
  }
  if (q) {
    result = result.filter((n) => n.title.toLowerCase().includes(q))
  }
  return result
})

const sortedNews = computed(() => {
  const list = [...filtered.value]
  const dir = sortAsc.value ? 1 : -1
  if (sortKey.value === 'date') list.sort((a, b) => (getSortTime(a) - getSortTime(b)) * dir)
  else list.sort((a, b) => a.title.localeCompare(b.title) * dir)
  return list
})

const pagedSortedNews = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return sortedNews.value.slice(start, start + pageSize.value)
})

/* ---------- Watchers ---------- */
watch([query, sortKey, sortAsc, () => route.query.category], () => {
  page.value = 1
})

/* ---------- Data Fetching ---------- */
async function fetchNews() {
  loading.value = true
  errorMsg.value = null
  try {
    const data = await getPublicNews()
    itemsAll.value = attachCategory((data ?? []) as PublicNewsEx[])
  } catch (err) {
    const msg = isAxiosError(err)
      ? ((err.response?.data as { message?: string } | undefined)?.message ?? err.message)
      : 'ไม่สามารถโหลดข่าวสารได้'
    errorMsg.value = msg
  } finally {
    loading.value = false
  }
}

/* ---------- Event Handlers ---------- */
function isPdf(url?: string | null): boolean {
  if (!url) return false
  return url.toLowerCase().endsWith('.pdf')
}

onMounted(() => {
  fetchNews()
})
</script>

<style scoped>
/* line-clamp helpers */
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

/* Custom Sort Dropdown */
.sort-dropdown-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 140px;
  padding: 0.625rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  background-color: #ffffff;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.sort-dropdown-button:hover {
  border-color: #14b8a6;
  background-color: #f0fdfa;
}

.sort-dropdown-button:focus {
  outline: none;
  border-color: #14b8a6;
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
}

.sort-dropdown-menu {
  position: absolute;
  z-index: 10;
  width: 100%;
  min-width: 180px;
  margin-top: 0.25rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  animation: scaleIn 0.15s ease-out;
}

.sort-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.sort-dropdown-item:first-child {
  border-radius: 0.75rem 0.75rem 0 0;
}

.sort-dropdown-item:last-child {
  border-radius: 0 0 0.75rem 0.75rem;
}

.sort-dropdown-item:hover {
  background-color: #f0fdfa;
}

.sort-dropdown-item:hover .text-gray-700 {
  color: #14b8a6;
}

.sort-dropdown-item:hover .text-gray-600 {
  color: #14b8a6;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

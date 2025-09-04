<template>
  <main class="max-w-6xl mx-auto px-4 py-8">
    <!-- Header -->
    <header class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
        <i class="fas fa-bullhorn text-blue-600"></i>
        ข่าวสารและประกาศ
      </h1>
      <p class="text-gray-600 mt-1">อัปเดตข่าวสารล่าสุดของโรงพยาบาล</p>
    </header>

    <!-- Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div class="relative w-full sm:max-w-xs">
        <input
          type="search"
          v-model.trim="query"
          placeholder="ค้นหาหัวข้อข่าว..."
          class="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>

      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">เรียงตาม</label>
        <select
          v-model="sortKey"
          class="border rounded-md text-sm py-2 px-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="date">วันที่</option>
          <option value="title">หัวข้อ</option>
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

    <!-- Error -->
    <div
      v-if="errorMsg"
      class="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-red-700 flex items-center justify-between"
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

    <!-- Grid -->
    <section>
      <!-- Loading skeleton -->
      <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="rounded-lg border overflow-hidden">
          <div class="animate-pulse h-40 bg-gray-200"></div>
          <div class="p-4 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-full"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      <!-- Cards -->
      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="n in pagedSortedNews"
          :key="n.id"
          class="group rounded-lg border overflow-hidden bg-white hover:shadow-md transition"
        >
          <div class="relative h-44 bg-gray-100 overflow-hidden">
            <img
              v-if="n.imageUrl"
              :src="absoluteImage(n.imageUrl)"
              alt=""
              class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
              @error="onImgError"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <i class="far fa-image text-3xl"></i>
            </div>
          </div>

          <div class="p-4">
            <time class="text-xs text-gray-500">{{ prettyDate(n.date) }}</time>
            <h2 class="mt-1 font-semibold text-gray-900 line-clamp-2">{{ n.title }}</h2>
            <p class="text-sm text-gray-600 mt-1 line-clamp-3">{{ n.excerpt || n.content }}</p>

            <div class="flex items-center justify-between mt-3">
              <button class="text-blue-600 text-sm hover:underline" @click="openQuickView(n)">
                อ่านต่อ
              </button>
            </div>
          </div>
        </article>

        <!-- Empty -->
        <div
          v-if="!pagedSortedNews.length && !loading"
          class="col-span-full text-center text-gray-500 py-12"
        >
          <i class="fas fa-info-circle mr-2"></i> ไม่พบข่าวสาร
        </div>
      </div>
    </section>

    <!-- Pagination -->
    <div
      class="flex items-center justify-between mt-8 text-sm text-gray-600"
      v-if="sortedNews.length"
    >
      <p>
        แสดง {{ (page - 1) * pageSize + 1 }} –
        {{ Math.min(page * pageSize, sortedNews.length) }} จาก {{ sortedNews.length }} รายการ
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

    <!-- Quick View Modal -->
    <div
      v-if="quickView"
      class="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div class="bg-white max-w-2xl w-full rounded-lg overflow-hidden shadow-xl">
        <div class="relative h-56 bg-gray-100">
          <img
            v-if="quickView.imageUrl"
            :src="absoluteImage(quickView.imageUrl)"
            class="w-full h-full object-cover"
            @error="onImgError"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <i class="far fa-image text-3xl"></i>
          </div>
          <button
            class="absolute top-3 right-3 bg-white/90 hover:bg-white border rounded-full w-9 h-9 flex items-center justify-center"
            @click="quickView = null"
            aria-label="ปิดหน้าต่าง"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-5">
          <time class="text-xs text-gray-500">{{
            quickView ? prettyDate(quickView.date) : ''
          }}</time>
          <h3 class="text-xl font-semibold text-gray-900 mt-1">{{ quickView?.title }}</h3>
          <p class="text-gray-700 mt-3 leading-relaxed whitespace-pre-line">
            {{ quickView?.content || quickView?.excerpt }}
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { isAxiosError } from '@/services/apiService'
import { getPublicNews, type PublicNewsItem } from '@/services/newsService'

/** ---------- State ---------- */
const loading = ref(false)
const errorMsg = ref<string | null>(null)
const items = ref<PublicNewsItem[]>([])

const query = ref('')
const sortKey = ref<'date' | 'title'>('date')
const sortAsc = ref(false)

const page = ref(1)
const pageSize = ref(9)

const quickView = ref<PublicNewsItem | null>(null)

/** ---------- Utils ---------- */
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
  const root = base.replace(/\/api(\/v\d+)?$/i, '') // ตัด /api/v1 ออก → ใช้ /uploads
  return `${root}/${String(u).replace(/^\/+/, '')}`
}

function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
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

function openQuickView(n: PublicNewsItem) {
  quickView.value = n
}

/** ---------- Derived ---------- */
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? items.value.filter((n) => n.title.toLowerCase().includes(q)) : items.value
})

const sortedNews = computed(() => {
  const list = [...filtered.value]
  const dir = sortAsc.value ? 1 : -1
  if (sortKey.value === 'date') list.sort((a, b) => (a.date > b.date ? 1 : -1) * dir)
  else list.sort((a, b) => a.title.localeCompare(b.title) * dir)
  return list
})

const pagedSortedNews = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return sortedNews.value.slice(start, start + pageSize.value)
})

/** ---------- Fetch ---------- */
async function fetchNews() {
  loading.value = true
  errorMsg.value = null
  try {
    items.value = await getPublicNews()
    page.value = 1
  } catch (e) {
    const msg = isAxiosError(e)
      ? ((e.response?.data as { message?: string } | undefined)?.message ?? e.message)
      : 'ไม่สามารถโหลดข่าวสารได้'
    errorMsg.value = msg
  } finally {
    loading.value = false
  }
}

onMounted(fetchNews)
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
</style>

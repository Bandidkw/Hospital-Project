<template>
  <main class="max-w-6xl mx-auto px-4 py-10">
    <header class="mb-8 text-center md:text-left">
      <h1
        class="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center justify-center md:justify-start gap-3"
      >
        <i class="fas fa-bullhorn text-blue-600"></i>
        <span>ข่าวสารและประกาศ</span>
        <span v-if="activeCategoryLabel" class="text-2xl text-blue-600 font-medium">
          - {{ activeCategoryLabel }}
        </span>
      </h1>
      <p class="text-gray-600 mt-1">อัปเดตข่าวสารล่าสุดของโรงพยาบาล</p>
    </header>

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
      <div class="relative w-full sm:max-w-xs">
        <input
          type="search"
          v-model.trim="query"
          placeholder="ค้นหาหัวข้อข่าว..."
          class="w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        />
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">เรียงตาม</label>
        <select
          v-model="sortKey"
          class="border rounded-md text-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="date">วันที่</option>
          <option value="title">หัวข้อ</option>
        </select>
        <button
          class="p-2 border rounded-md hover:bg-gray-100 transition"
          @click="sortAsc = !sortAsc"
          :title="sortAsc ? 'เรียง น้อย→มาก' : 'เรียง มาก→น้อย'"
        >
          <i :class="sortAsc ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
        </button>
      </div>
    </div>

    <div
      v-if="errorMsg"
      class="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 flex items-center justify-between"
      role="alert"
    >
      <div class="flex items-center gap-2">
        <i class="fas fa-exclamation-triangle"></i>
        <span>{{ errorMsg }}</span>
      </div>
      <button
        @click="fetchNews"
        class="px-4 py-1.5 rounded-md border border-red-300 hover:bg-white text-sm font-medium"
      >
        ลองใหม่
      </button>
    </div>

    <section :aria-busy="loading ? 'true' : 'false'">
      <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="i in 6"
          :key="i"
          class="rounded-xl border overflow-hidden bg-white shadow-sm"
          aria-hidden="true"
        >
          <div class="animate-pulse h-56 bg-gray-200"></div>
          <div class="p-4 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-full"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="n in pagedSortedNews"
          :key="n.id"
          class="group rounded-2xl border overflow-hidden bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <div class="relative h-56 md:h-64 bg-gray-100 overflow-hidden">
            <img
              v-if="n.imageUrl && !isPdf(n.imageUrl)"
              :src="absoluteImage(n.imageUrl)"
              :alt="n.title"
              class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              @error="onImgError"
            />
            <a
              v-else-if="n.imageUrl && isPdf(n.imageUrl)"
              :href="absoluteImage(n.imageUrl)"
              target="_blank"
              class="w-full h-full flex items-center justify-center text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <i class="far fa-file-pdf text-5xl"></i>
              <!-- <span class="mt-2 text-sm font-semibold">เปิดไฟล์ PDF</span> -->
            </a>
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <i class="far fa-image text-3xl"></i>
            </div>
            <div
              class="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent"
            ></div>
            <div class="absolute left-3 bottom-3">
              <span
                class="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-white/90 text-gray-800 backdrop-blur"
              >
                <i class="far fa-calendar"></i>{{ prettyDate(n.date) }}
              </span>
            </div>
          </div>

          <div class="p-5">
            <h2
              class="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors"
              :title="n.title"
            >
              {{ n.title }}
            </h2>
            <p class="text-sm text-gray-600 mt-2 line-clamp-3">{{ n.excerpt || n.content }}</p>
            <div class="mt-4 flex items-center justify-between">
              <a
                v-if="n.imageUrl && isPdf(n.imageUrl)"
                :href="absoluteImage(n.imageUrl)"
                target="_blank"
                class="text-blue-600 text-sm font-medium inline-flex items-center gap-1 hover:underline"
              >
                เปิดไฟล์แนบ <i class="fas fa-external-link-alt text-[11px]"></i>
              </a>
              <RouterLink
                v-else
                :to="{ name: 'news-detail', params: { id: n.id } }"
                class="text-blue-600 text-sm font-medium inline-flex items-center gap-1 hover:underline"
              >
                อ่านต่อ <i class="fas fa-arrow-right text-[11px]"></i>
              </RouterLink>
            </div>
          </div>
        </article>
        <div
          v-if="!pagedSortedNews.length && !loading"
          class="col-span-full text-center py-20 text-gray-400"
        >
          <i class="fas fa-info-circle text-2xl mb-2"></i>
          <p>ไม่พบข่าวสารที่ตรงกับเงื่อนไข</p>
        </div>
      </div>
    </section>

    <div
      class="flex items-center justify-between mt-10 text-sm text-gray-600"
      v-if="sortedNews.length > pageSize"
    >
      <p>
        แสดง {{ (page - 1) * pageSize + 1 }} –
        {{ Math.min(page * pageSize, sortedNews.length) }} จาก {{ sortedNews.length }} รายการ
      </p>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1.5 rounded-full border hover:bg-gray-100 disabled:opacity-50"
          :disabled="page <= 1"
          @click="page--"
        >
          ก่อนหน้า
        </button>
        <span class="font-medium">หน้า {{ page }}</span>
        <button
          class="px-3 py-1.5 rounded-full border hover:bg-gray-100 disabled:opacity-50"
          :disabled="page * pageSize >= sortedNews.length"
          @click="page++"
        >
          ถัดไป
        </button>
      </div>
    </div>

    <!-- <div
      v-if="quickView"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="รายละเอียดข่าว"
      @keydown.esc="quickView = null"
    >
      <div
        class="w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5"
      >
        <div class="relative">
          <div class="relative h-[42vh] md:h-[55vh] bg-gray-100">
            <img
              v-if="quickView.imageUrl"
              :src="absoluteImage(quickView.imageUrl)"
              :alt="quickView.title"
              class="absolute inset-0 w-full h-full object-cover"
              @error="onImgError"
            />
            <div
              v-else
              class="absolute inset-0 flex items-center justify-center text-gray-400"
              aria-hidden="true"
            >
              <i class="far fa-image text-4xl"></i>
            </div>
            <div
              class="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/65 to-transparent"
            ></div>
          </div>
          <div class="absolute top-4 right-4 flex gap-2">
            <button
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow"
              @click="shareNews(quickView)"
              title="แชร์ข่าวนี้"
            >
              <i class="fas fa-share-alt text-gray-700"></i>
            </button>
            <button
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow"
              @click="copyLink(quickView)"
              :title="copied ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์'"
            >
              <i
                :class="copied ? 'fas fa-check text-emerald-600' : 'fas fa-link text-gray-700'"
              ></i>
            </button>
            <button
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow"
              @click="quickView = null"
              aria-label="ปิดหน้าต่าง"
              title="ปิด"
            >
              <i class="fas fa-times text-gray-700"></i>
            </button>
          </div>
          <div class="absolute inset-x-0 -bottom-3 px-4 sm:px-6">
            <div
              class="mx-auto max-w-5xl rounded-xl bg-white/95 backdrop-blur px-4 sm:px-5 py-3 shadow ring-1 ring-black/5"
            >
              <div class="flex items-center gap-3 text-[13px] text-gray-600">
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700"
                >
                  <i class="far fa-calendar"></i>
                  {{ prettyDate(quickView.date) }}
                </span>
              </div>
              <h2
                class="mt-2 text-xl md:text-2xl font-extrabold tracking-tight text-gray-900 leading-snug"
              >
                {{ quickView.title }}
              </h2>
            </div>
          </div>
        </div>
        <div class="px-4 sm:px-6 pt-6 pb-7 max-h-[30vh] overflow-y-auto">
          <div class="grid md:grid-cols-5 gap-6">
            <aside class="md:col-span-2 order-2 md:order-1">
              <div class="rounded-lg border bg-gray-50 p-4 space-y-3">
                <div class="text-xs uppercase tracking-wide text-gray-500">การกระทำด่วน</div>
                <div class="flex gap-2">
                  <button
                    class="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md border hover:bg-gray-100"
                    @click="copyLink(quickView)"
                  >
                    <i
                      :class="
                        copied ? 'fas fa-check text-emerald-600' : 'fas fa-link text-gray-700'
                      "
                    ></i>
                    {{ copied ? 'คัดลอกลิงก์แล้ว' : 'คัดลอกลิงก์' }}
                  </button>
                  <RouterLink
                    :to="{ path: '/news', query: route.query }"
                    class="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50"
                    @click="quickView = null"
                  >
                    <i class="fas fa-list"></i>
                    ดูทั้งหมด
                  </RouterLink>
                </div>
              </div>
            </aside>
            <article class="md:col-span-3 order-1 md:order-2">
              <div class="prose prose-sm sm:prose md:prose-lg max-w-none text-gray-800">
                <p
                  v-for="(p, i) in normalizeParagraphs(
                    quickView.content || quickView.excerpt || '',
                  )"
                  :key="i"
                  class="leading-relaxed"
                >
                  {{ p }}
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div> -->
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
</style>

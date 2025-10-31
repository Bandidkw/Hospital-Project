<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight mb-10">
        ข่าวสารและกิจกรรมล่าสุด
      </h2>

      <div class="mb-8 flex justify-center">
        <label class="sr-only" for="newsCategory">หมวดข่าว</label>
        <select
          id="newsCategory"
          v-model="selectedCategory"
          class="rounded-md border px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="all">ทั้งหมด</option>
          <option v-for="opt in categoryOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <div
        v-if="errorMsg"
        class="mb-6 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/80 px-3 py-2 text-red-700"
        role="alert"
      >
        <i class="fas fa-exclamation-triangle"></i>
        <span>{{ errorMsg }}</span>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse"
        >
          <div class="w-full h-56 md:h-60 lg:h-64 bg-gray-200"></div>
          <div class="p-6 text-left">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <component
          v-for="n in latestNews"
          :key="n.id"
          :is="getCardTag(n)"
          :href="getArticleLink(n)"
          :target="isPdfUrl(n.imageUrl) ? '_blank' : '_self'"
          :class="getCardClasses(n)"
          class="group block bg-white rounded-2xl shadow-sm overflow-hidden text-left ring-1 ring-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <div class="relative w-full h-56 md:h-60 lg:h-64 bg-gray-100">
            <img
              v-if="isImageUrl(n.imageUrl)"
              :src="absoluteImage(n.imageUrl)"
              :alt="n.title"
              class="absolute inset-0 w-full h-full object-cover"
              @error="onImgError"
            />

            <div
              v-else-if="isPdfUrl(n.imageUrl)"
              class="absolute inset-0 flex flex-col items-center justify-center text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <i class="far fa-file-pdf text-5xl"></i>
              <span class="mt-2 text-sm font-semibold">เปิดไฟล์ PDF</span>
            </div>

            <div v-else class="absolute inset-0 flex items-center justify-center text-gray-400">
              <i class="far fa-image text-3xl"></i>
            </div>

            <div class="absolute left-3 bottom-3">
              <span
                class="inline-flex items-center gap-1 text-xs md:text-[13px] font-medium px-2.5 py-1 rounded-full bg-white/90 text-gray-800 backdrop-blur"
              >
                <i class="far fa-calendar"></i>
                {{ formatDate(n.date) }}
              </span>
            </div>
          </div>

          <div class="p-6">
            <h3
              class="text-lg md:text-xl font-semibold text-gray-900 leading-snug line-clamp-2"
              :title="n.title"
            >
              {{ n.title }}
            </h3>
            <p class="mt-2 text-gray-600 text-sm line-clamp-3">
              {{ n.excerpt || n.content || '' }}
            </p>
          </div>
        </component>

        <div v-if="!latestNews.length" class="col-span-full text-gray-500 py-10">
          <i class="fas fa-info-circle mr-2"></i> ยังไม่มีข่าวสาร
        </div>
      </div>

      <div class="mt-12">
        <RouterLink
          :to="
            selectedCategory === 'all'
              ? { name: 'public-news' } // <-- แก้จาก 'news' เป็น 'public-news'
              : { name: 'public-news', query: { category: selectedCategory } } // <-- แก้ตรงนี้ด้วย
          "
          class="inline-flex items-center gap-2 text-blue-600 hover:text-white hover:bg-blue-700 font-bold py-2.5 px-6 rounded-full border-2 border-blue-500 transition-colors"
          @click="rememberScroll()"
        >
          ดูข่าวสารทั้งหมด
          <i class="fas fa-newspaper text-[13px]"></i>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { getPublicNews, type PublicNewsItem } from '@/services/newsService'
import { isAxiosError } from '@/services/apiService'

type CategoryKey = 'general' | 'activity' | 'procurement' | 'recruitment' | 'forms' | 'staff'
type Selected = CategoryKey | 'all'

type ApiPublicNews = PublicNewsItem & {
  excerpt?: string | null
  isPublished?: boolean
  createdAt?: string
  updatedAt?: string
  category?: string
}
type NewsWithCategory = Omit<ApiPublicNews, 'excerpt'> & {
  excerpt?: string
  category: CategoryKey
}

const HIDE_DRAFTS = true
const STORAGE_KEY = 'homeNewsCategory'

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  general: 'ข่าวทั่วไป',
  activity: 'กิจกรรม',
  procurement: 'จัดซื้อ/จัดจ้าง',
  recruitment: 'รับสมัคร',
  forms: 'แบบฟอร์ม',
  staff: 'บุคลากร',
}

function categoryFromTitle(title: string): CategoryKey {
  const t = title.toLowerCase()
  if (t.includes('กิจกรรม')) return 'activity'
  if (
    t.includes('ประกวดราคา') ||
    t.includes('จัดซื้อ') ||
    t.includes('จัดจ้าง') ||
    t.includes('ราคากลาง')
  )
    return 'procurement'
  if (t.includes('รับสมัคร') || t.includes('สรรหา')) return 'recruitment'
  if (t.includes('แบบฟอร์ม') || t.includes('ฟอร์ม')) return 'forms'
  if (t.includes('บุคลากร') || t.includes('เจ้าหน้าที่') || t.includes('พนักงาน')) return 'staff'
  return 'general'
}

function absoluteImage(u?: string | null): string {
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
  const root = base.replace(/\/api(\/v\d+)?$/i, '')
  return `${root}/${String(u).replace(/^\/+/, '')}`
}
function getSortTime(n: { updatedAt?: string; createdAt?: string; date: string }) {
  return new Date(n.updatedAt || n.createdAt || n.date).getTime()
}
function normalizeExcerpt(excerpt?: string | null, fallback?: string): string {
  const base = (excerpt ?? fallback ?? '').trim()
  return base.length <= 200 ? base : base.slice(0, 200).trim() + '…'
}

/* ---------- State ---------- */
const items = ref<NewsWithCategory[]>([])
const loading = ref(false)
const errorMsg = ref<string | null>(null)

const selectedCategory = ref<Selected>((sessionStorage.getItem(STORAGE_KEY) as Selected) || 'all')

watch(selectedCategory, (v) => sessionStorage.setItem(STORAGE_KEY, v))

const categoryOptions = computed(() =>
  (Object.keys(CATEGORY_LABELS) as CategoryKey[])
    .filter((key) => key !== 'general')
    .map((k) => ({
      value: k,
      label: CATEGORY_LABELS[k],
    })),
)

/* ---------- Fetch ---------- */
onMounted(fetchNews)
async function fetchNews() {
  loading.value = true
  errorMsg.value = null
  try {
    const data = await getPublicNews()
    const raw = (Array.isArray(data) ? data : []) as ApiPublicNews[]
    const mapped: NewsWithCategory[] = raw.map((n) => ({
      ...n,
      excerpt: normalizeExcerpt(n.excerpt, n.content),
      category: n.category ? (n.category as CategoryKey) : categoryFromTitle(n.title),
    }))

    const publishedOnly = HIDE_DRAFTS ? mapped.filter((n) => n.isPublished !== false) : mapped
    items.value = publishedOnly.sort((a, b) => getSortTime(b) - getSortTime(a))
  } catch (e) {
    errorMsg.value = isAxiosError(e)
      ? ((e.response?.data as { message?: string } | undefined)?.message ?? e.message)
      : 'ไม่สามารถโหลดข่าวสารได้'
  } finally {
    loading.value = false
  }
}
/* ---------- Derived ---------- */
const filteredByCategory = computed(() =>
  selectedCategory.value === 'all'
    ? items.value
    : items.value.filter((n) => n.category === selectedCategory.value),
)

const latestNews = computed(() => filteredByCategory.value.slice(0, 3))

/* ---------- UI helpers ---------- */
function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  const fallback =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#4b5563">Image unavailable</text></svg>`,
    )
  if (el && el.src !== fallback) el.src = fallback
}
function rememberScroll() {
  sessionStorage.setItem('homeScrollY', String(window.scrollY || 0))
}
function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return d
  }
}
/**
 * ตรวจสอบว่า URL เป็นไฟล์รูปภาพหรือไม่
 * @param url - ลิงก์ที่ต้องการตรวจสอบ
 */
function isImageUrl(url?: string | null): boolean {
  if (!url) return false
  // ตรวจสอบว่าลงท้ายด้วยนามสกุลรูปภาพที่รู้จักหรือไม่ (ไม่สนตัวพิมพ์เล็ก/ใหญ่)
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)
}

/**
 * ตรวจสอบว่า URL เป็นไฟล์ PDF หรือไม่
 * @param url - ลิงก์ที่ต้องการตรวจสอบ
 */
function isPdfUrl(url?: string | null): boolean {
  if (!url) return false
  return url.toLowerCase().endsWith('.pdf')
}

/**
 * สร้างลิงก์สำหรับการ์ดข่าว
 * @param newsItem - ข้อมูลข่าว
 */
function getArticleLink(newsItem: PublicNewsItem): string {
  const url = newsItem.imageUrl
  if (isPdfUrl(url)) {
    return absoluteImage(url)
  }
  return `/news/${newsItem.id}`
}

function getCardTag(newsItem: PublicNewsItem): 'a' | 'div' {
  const isPDF = isPdfUrl(newsItem.imageUrl)
  const isImage = isImageUrl(newsItem.imageUrl)
  if (isPDF) {
    return 'a'
  }
  if (isImage) {
    return 'div'
  }
  return 'a'
}

function getCardClasses(newsItem: PublicNewsItem): string {
  if (getCardTag(newsItem) === 'a') {
    return 'hover:shadow-lg hover:-translate-y-0.5'
  }
  // หากเป็น div (คลิกไม่ได้)
  return 'cursor-default'
}
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

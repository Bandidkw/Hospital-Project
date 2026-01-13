<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Header Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <button
            @click="goBackToNews"
            class="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
          >
            <i class="fas fa-arrow-left text-sm"></i>
            <span class="hidden sm:inline">กลับสู่หน้าข่าวสารทั้งหมด</span>
            <span class="sm:hidden">กลับ</span>
          </button>

          <div class="flex items-center gap-4">
            <button
              @click="shareNews"
              class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
              title="แชร์ข่าวนี้"
            >
              <i class="fas fa-share-alt"></i>
            </button>
            <button
              @click="printNews"
              class="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200"
              title="พิมพ์ข่าว"
            >
              <i class="fas fa-print"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 py-8">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="animate-pulse">
          <div class="h-64 md:h-96 bg-gray-200"></div>
          <div class="p-6 md:p-8">
            <div class="h-8 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div class="space-y-3">
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              <div class="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMsg" class="max-w-4xl mx-auto px-4 py-16">
      <div class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div
          class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h2>
        <p class="text-gray-600 mb-6">{{ errorMsg }}</p>
        <button
          @click="fetchNewsDetail"
          class="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          <i class="fas fa-redo text-sm"></i>
          ลองใหม่อีกครั้ง
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main v-else-if="newsItem" class="max-w-4xl mx-auto px-4 py-8">
      <article class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Hero Image Section -->
        <div class="relative">
          <div class="aspect-video md:aspect-[21/9] overflow-hidden bg-gray-100">
            <img
              v-if="newsItem.imageUrl && isImageUrl(newsItem.imageUrl)"
              :src="getImageUrl(newsItem.imageUrl)"
              :alt="newsItem.title"
              class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              @error="onImageError"
              @load="onImageLoad"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
            >
              <div class="text-center text-gray-500">
                <i class="fas fa-image text-4xl mb-2"></i>
                <p class="text-sm">ไม่มีรูปภาพ</p>
              </div>
            </div>
          </div>

          <!-- Image Overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
          ></div>

          <!-- Category Badge -->
          <div
            v-if="newsItem.category"
            class="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
          >
            {{ newsItem.category }}
          </div>
        </div>

        <!-- Content Section -->
        <div class="p-6 md:p-8 lg:p-10">
          <!-- Article Header -->
          <header class="mb-8">
            <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {{ newsItem.title }}
            </h1>

            <!-- Meta Information -->
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div class="flex items-center gap-2">
                <i class="far fa-calendar-alt text-blue-500"></i>
                <span>{{ formatDate(newsItem.date) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="far fa-clock text-green-500"></i>
                <span>{{ getReadingTime(newsItem.content) }} นาที</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="far fa-eye text-purple-500"></i>
                <span>{{ formatViews(newsItem.views || 0) }} ครั้ง</span>
              </div>
            </div>
          </header>

          <!-- Article Content -->
          <div class="prose prose-lg max-w-none">
            <div
              v-if="newsItem.content"
              class="text-gray-800 leading-relaxed space-y-4"
              v-html="sanitizeHtml(formatContent(newsItem.content))"
            ></div>
            <div v-else class="text-gray-500 italic text-center py-8">ไม่มีเนื้อหารายละเอียด</div>
          </div>

          <!-- PDF Download Section -->
          <div
            v-if="newsItem.pdfUrl || (newsItem.imageUrl && isPdfUrl(newsItem.imageUrl))"
            class="mt-10 p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <i class="fas fa-file-pdf text-red-600 text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 mb-1">เอกสารแนบ</h3>
                <p class="text-sm text-gray-600">ดาวน์โหลดเอกสาร PDF เพื่อดูรายละเอียดเพิ่มเติม</p>
              </div>
              <a
                :href="newsItem.pdfUrl || getImageUrl(newsItem.imageUrl)"
                target="_blank"
                class="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                <i class="fas fa-download"></i>
                <span class="hidden sm:inline">ดาวน์โหลด</span>
              </a>
            </div>
          </div>

          <!-- Tags Section -->
          <div v-if="newsItem.tags && newsItem.tags.length > 0" class="mt-8">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">แท็ก:</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in newsItem.tags"
                :key="tag"
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <footer class="px-6 md:px-8 lg:px-10 py-6 bg-gray-50 border-t border-gray-100">
          <div class="flex items-center justify-center gap-6">
            <button
              @click="shareNews"
              class="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <i class="fas fa-share-alt"></i>
              <span>แชร์</span>
            </button>
            <button
              @click="printNews"
              class="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors duration-200"
            >
              <i class="fas fa-print"></i>
              <span>พิมพ์</span>
            </button>
          </div>
        </footer>
      </article>

      <!-- Related News Section (Optional) -->
      <section v-if="relatedNews.length > 0" class="mt-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">ข่าวที่เกี่ยวข้อง</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article
            v-for="related in relatedNews"
            :key="related.id"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div class="aspect-video overflow-hidden bg-gray-100">
              <img
                v-if="related.imageUrl"
                :src="getImageUrl(related.imageUrl)"
                :alt="related.title"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">{{ related.title }}</h3>
              <p class="text-sm text-gray-600">{{ formatDate(related.date) }}</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getNewsPublicById } from '@/services/newsService'
import type { NewsDetailItem } from '@/types/new'
import { isAxiosError } from '@/services/apiService'
import { sanitizeHtml } from '@/utils/sanitize'

// ===== State Management =====
const route = useRoute()
const router = useRouter()
const newsItem = ref<NewsDetailItem | null>(null)
const loading = ref(true)
const errorMsg = ref<string | null>(null)
const relatedNews = ref<NewsDetailItem[]>([])
const newsId = computed(() => route.params.id as string)

// ===== Helper Functions =====
function isImageUrl(url?: string | null): boolean {
  if (!url) return false
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url.toLowerCase())
}

function isPdfUrl(url?: string | null): boolean {
  if (!url) return false
  return url.toLowerCase().endsWith('.pdf')
}

function getImageUrl(url?: string | null): string {
  if (!url) return ''
  if (url.startsWith('http')) return url

  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  const cleanBaseUrl = baseUrl.replace(/\/api.*$/, '').replace(/\/$/, '')
  return `${cleanBaseUrl}/${url.replace(/^\//, '')}`
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  } catch {
    return dateString
  }
}

function formatContent(content: string): string {
  if (!content) return ''

  // แปลง line breaks เป็น paragraphs
  return content
    .split('\n\n')
    .map((paragraph) => `<p class="mb-4">${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('')
}

function getReadingTime(content?: string): number {
  if (!content) return 1
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

function formatViews(views: number): string {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M'
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K'
  }
  return views.toString()
}

// ===== Event Handlers =====
function onImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src =
    'data:image/svg+xml;base64,' +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="18" fill="#6b7280">
        ไม่สามารถโหลดรูปภาพได้
      </text>
    </svg>
  `)
}

function onImageLoad(event: Event) {
  const img = event.target as HTMLImageElement
  img.classList.add('loaded')
}

function goBackToNews() {
  router.push({ name: 'public-news' })
}

async function shareNews() {
  if (!newsItem.value) return

  const shareData = {
    title: newsItem.value.title,
    text: `อ่านข่าว: ${newsItem.value.title}`,
    url: window.location.href,
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      alert('คัดลอกลิงก์แล้ว!')
    }
  } catch (error) {
    console.error('Error sharing:', error)
  }
}

function printNews() {
  window.print()
}

// ===== Data Fetching =====
async function fetchNewsDetail() {
  if (!newsId.value) {
    errorMsg.value = 'ไม่พบรหัสข่าวสาร'
    loading.value = false
    return
  }

  loading.value = true
  errorMsg.value = null

  try {
    const data = await getNewsPublicById(newsId.value)

    if (!data || !data.title) {
      errorMsg.value = 'ไม่พบข่าวสารที่ระบุ'
    } else {
      newsItem.value = data
      // TODO: Fetch related news based on category or tags
      // relatedNews.value = await getRelatedNews(data.category, data.id)
    }
  } catch (error) {
    console.error('Error fetching news:', error)
    errorMsg.value = isAxiosError(error)
      ? (error.response?.data as { message?: string })?.message || error.message
      : 'ไม่สามารถโหลดข่าวสารได้'
  } finally {
    loading.value = false
  }
}

// ===== Lifecycle =====
onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  fetchNewsDetail()
})
</script>

<style scoped>
/* Print Styles */
@media print {
  nav,
  footer,
  .no-print {
    display: none !important;
  }

  .bg-gradient-to-br {
    background: white !important;
  }

  .shadow-xl,
  .shadow-lg {
    box-shadow: none !important;
  }
}

/* Custom Prose Styles */
.prose :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.7;
}

.prose :deep(h2) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.prose :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #374151;
}

.prose :deep(img) {
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin: 1.5rem auto;
}

.prose :deep(blockquote) {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  font-style: italic;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

/* Line Clamp Utility */
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Image Loading Animation */
img.loaded {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive Improvements */
@media (max-width: 640px) {
  .aspect-video {
    aspect-ratio: 16/10;
  }
}
</style>

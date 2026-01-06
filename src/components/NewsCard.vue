<template>
  <article
    class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
  >
    <!-- Image Section -->
    <div class="relative aspect-video overflow-hidden bg-gray-100">
      <img
        v-if="news.imageUrl && isImageUrl(news.imageUrl)"
        :src="getImageUrl(news.imageUrl)"
        :alt="news.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        @error="onImageError"
      />
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
      >
        <div class="text-center text-gray-500">
          <i class="fas fa-newspaper text-3xl mb-2"></i>
          <p class="text-sm">ข่าวสาร</p>
        </div>
      </div>

      <!-- Category Badge -->
      <div
        v-if="news.category"
        class="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium"
      >
        {{ getCategoryLabel(news.category) }}
      </div>

      <!-- Date Badge -->
      <div class="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
        {{ formatDate(news.date) }}
      </div>
    </div>

    <!-- Content Section -->
    <div class="p-5">
      <h3
        class="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors"
      >
        {{ news.title }}
      </h3>

      <p v-if="news.excerpt" class="text-gray-600 text-sm mb-4 line-clamp-3">
        {{ news.excerpt }}
      </p>

      <!-- Meta Information -->
      <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div class="flex items-center gap-3">
          <span class="flex items-center gap-1">
            <i class="far fa-calendar-alt"></i>
            {{ formatDateShort(news.date) }}
          </span>
          <span v-if="news.views" class="flex items-center gap-1">
            <i class="far fa-eye"></i>
            {{ formatViews(news.views) }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-between">
        <!-- Read More Button - เลือกหน้าตามประเภทข่าว -->
        <router-link
          :to="getNewsDetailRoute(news)"
          class="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm group/btn"
        >
          <span>อ่านต่อ</span>
          <i
            class="fas fa-arrow-right text-xs group-hover/btn:translate-x-1 transition-transform"
          ></i>
        </router-link>

        <!-- Quick Actions -->
        <div class="flex items-center gap-2">
          <button
            v-if="news.pdfUrl || isPdfUrl(news.imageUrl)"
            @click="downloadPdf(news)"
            class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
            title="ดาวน์โหลด PDF"
          >
            <i class="fas fa-file-pdf"></i>
          </button>

          <button
            @click="shareNews(news)"
            class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
            title="แชร์ข่าวนี้"
          >
            <i class="fas fa-share-alt"></i>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { PublicNewsItem } from '@/types/new'

// Props
interface Props {
  news: PublicNewsItem
}

const props = defineProps<Props>()

// Helper Functions
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

function getCategoryLabel(category: string): string {
  const categoryMap: Record<string, string> = {
    general: 'ทั่วไป',
    activity: 'กิจกรรม',
    procurement: 'จัดซื้อจัดจ้าง',
    recruitment: 'สรรหาบุคลากร',
    forms: 'แบบฟอร์ม',
    staff: 'บุคลากร',
  }
  return categoryMap[category] || category
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

function formatDateShort(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
    })
  } catch {
    return dateString
  }
}

function formatViews(views: number): string {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M'
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K'
  }
  return views.toString()
}

/**
 * เลือก Route สำหรับแสดงรายละเอียดข่าวตามประเภท
 * - หากเป็นข่าวที่มีรูปภาพ → ใช้หน้า NewsImageDetailView
 * - หากเป็นข่าวทั่วไป → ใช้หน้า NewsDetail ปกติ
 */
function getNewsDetailRoute(news: PublicNewsItem) {
  // ตรวจสอบว่าเป็นข่าวที่เน้นรูปภาพหรือไม่
  const hasImage = news.imageUrl && isImageUrl(news.imageUrl)
  const isImageFocused = hasImage && (!news.content || news.content.length < 500)

  if (isImageFocused) {
    return { name: 'news-image-detail', params: { id: news.id } }
  } else {
    return { name: 'news-detail', params: { id: news.id } }
  }
}

// Event Handlers
function onImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src =
    'data:image/svg+xml;base64,' +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">
        ไม่สามารถโหลดรูปภาพได้
      </text>
    </svg>
  `)
}

function downloadPdf(news: PublicNewsItem) {
  const pdfUrl = news.pdfUrl || (isPdfUrl(news.imageUrl) ? getImageUrl(news.imageUrl) : null)
  if (pdfUrl) {
    window.open(pdfUrl, '_blank')
  }
}

async function shareNews(news: PublicNewsItem) {
  const shareData = {
    title: news.title,
    text: `อ่านข่าว: ${news.title}`,
    url: `${window.location.origin}/news/${news.id}`,
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(shareData.url)
      // TODO: Show toast notification
      console.log('คัดลอกลิงก์แล้ว!')
    }
  } catch (error) {
    console.error('Error sharing:', error)
  }
}
</script>

<style scoped>
/* Line Clamp Utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Hover Effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group/btn:hover .group-hover\/btn\:translate-x-1 {
  transform: translateX(0.25rem);
}
</style>

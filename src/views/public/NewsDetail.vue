<template>
  <div class="min-h-screen bg-white py-12 md:py-20 font-sarabun">
    <div class="container mx-auto px-4 max-w-4xl">
      <div v-if="loading">
        <div class="animate-pulse">
          <div class="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/4 mb-10"></div>
          <div class="h-64 bg-gray-200 rounded mb-12"></div>
          <div class="space-y-4">
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
        </div>
      </div>

      <div v-else-if="errorMsg" class="text-center py-20">
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">เกิดข้อผิดพลาดในการโหลดข้อมูล</h2>
        <p class="text-gray-600">{{ errorMsg }}</p>
        <button @click="fetchNewsDetail" class="mt-6 text-blue-600 hover:text-blue-800 font-medium">
          ลองโหลดใหม่
        </button>
      </div>

      <div v-else-if="!newsItem" class="text-center py-20">
        <i class="fas fa-info-circle text-gray-500 text-4xl mb-4"></i>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">ไม่พบข้อมูลข่าวสารนี้</h2>
        <p class="text-gray-600">กรุณาตรวจสอบลิงก์อีกครั้ง</p>
      </div>

      <div v-else class="space-y-8">
        <div class="pt-8 border-t border-gray-100">
          <router-link
            :to="{ name: 'public-news' }"
            class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
          >
            <i class="fas fa-arrow-left"></i>
            กลับสู่หน้าข่าวสารทั้งหมด
          </router-link>
        </div>
        <header class="pb-6 border-b border-gray-200">
          <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
            {{ newsItem.title }}
          </h1>
          <p class="text-sm text-gray-500 flex items-center gap-2">
            <i class="far fa-calendar-alt"></i>
            เผยแพร่เมื่อ: {{ formatDate(newsItem.date) }}
          </p>
        </header>

        <div
          v-if="newsItem.imageUrl && isImageUrl(newsItem.imageUrl)"
          class="relative aspect-video rounded-xl overflow-hidden shadow-lg"
        >
          <img
            :src="newsItem.imageUrl"
            :alt="newsItem.title"
            class="w-full h-full object-cover"
            @error="onImgError"
          />
        </div>

        <div class="prose max-w-none text-gray-800 leading-relaxed" v-html="newsItem.content"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getNewsPublicById } from '@/services/newsService'
import type { NewsDetailItem } from '@/types/new'
import { isAxiosError } from '@/services/apiService'

/* ---------- State ---------- */
const route = useRoute()
// ใช้ Type ที่ Import เข้ามา
const newsItem = ref<NewsDetailItem | null>(null)
const loading = ref(true)
const errorMsg = ref<string | null>(null)
const newsId = ref(route.params.id as string)

/* ---------- Helper Functions ---------- */
function isImageUrl(url?: string | null): boolean {
  if (!url) return false
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)
}
function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  console.error('[NewsDetail] Image failed to load:', el.src)
  // แสดง placeholder เมื่อโหลดภาพไม่สำเร็จ
  const fallback =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#4b5563">ไม่สามารถโหลดภาพได้</text></svg>`,
    )
  if (el && el.src !== fallback) el.src = fallback
}
function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return d
  }
}

/* ---------- Fetch Logic ---------- */
onMounted(() => {
  // เลื่อนหน้าต่างไปด้านบนเมื่อโหลดหน้ารายละเอียด
  window.scrollTo(0, 0)

  if (newsId.value) {
    fetchNewsDetail()
  } else {
    loading.value = false
    errorMsg.value = 'ไม่พบ ID ข่าวสารใน URL'
  }
})

async function fetchNewsDetail() {
  loading.value = true
  errorMsg.value = null
  newsItem.value = null

  if (!newsId.value) {
    loading.value = false
    return
  }

  try {
    const data = await getNewsPublicById(newsId.value)

    if (!data || !data.title) {
      errorMsg.value = 'ไม่พบข่าวสารที่ระบุ'
    } else {
      newsItem.value = data
    }
  } catch (e) {
    errorMsg.value = isAxiosError(e)
      ? ((e.response?.data as { message?: string } | undefined)?.message ?? e.message)
      : 'ไม่สามารถโหลดรายละเอียดข่าวสารได้'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Style สำหรับเนื้อหา HTML ที่ถูก Render ผ่าน v-html (เพื่อความสวยงามและอ่านง่าย) */
.prose :deep(p) {
  margin-bottom: 1.2em;
}
.prose :deep(h2) {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 2em;
  margin-bottom: 1em;
}
.prose :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem; /* rounded-lg */
  margin: 1rem auto;
  display: block;
}
</style>

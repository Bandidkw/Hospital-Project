<template>
  <main class="bg-gray-50 py-12 md:py-16">
    <div class="max-w-4xl mx-auto px-4">
      <div v-if="loading" class="text-center text-gray-500">
        <i class="fas fa-spinner fa-spin text-2xl"></i>
        <p class="mt-2">กำลังโหลดข้อมูล...</p>
      </div>

      <div v-else-if="errorMsg" class="text-center text-red-600">
        <i class="fas fa-exclamation-triangle text-2xl"></i>
        <p class="mt-2">เกิดข้อผิดพลาด: {{ errorMsg }}</p>
        <RouterLink to="/" class="mt-4 inline-block text-blue-600 hover:underline">
          กลับไปหน้าหลัก
        </RouterLink>
      </div>

      <article v-else-if="newsItem" class="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h1 class="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
          {{ newsItem.title }}
        </h1>
        <p class="text-gray-500 mt-3 border-b pb-4 mb-6">
          <i class="far fa-calendar-alt mr-2"></i>
          เผยแพร่เมื่อ: {{ formatDate(newsItem.date) }}
        </p>

        <div v-if="newsItem.imageUrl && !isPdf(newsItem.imageUrl)" class="mb-6">
          <img
            :src="newsItem.imageUrl"
            :alt="newsItem.title"
            class="w-full h-96 object-cover rounded-lg shadow-sm"
            @error="onImgError"
          />
        </div>

        <div class="prose max-w-none">
          <p v-for="(p, i) in normalizeParagraphs(newsItem.content || '')" :key="i">
            {{ p }}
          </p>
        </div>

        <div v-if="newsItem.pdfUrl || (newsItem.imageUrl && isPdf(newsItem.imageUrl))" class="mt-8">
          <a
            :href="newsItem.pdfUrl || newsItem.imageUrl || ''"
            target="_blank"
            class="inline-flex items-center gap-2 bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            <i class="far fa-file-pdf"></i>
            ดาวน์โหลดเอกสารแนบ (PDF)
          </a>
        </div>

        <div class="mt-8 pt-4 border-t">
          <RouterLink
            to="/news"
            class="text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            <i class="fas fa-arrow-left text-[11px]"></i> กลับไปหน้าข่าวสารทั้งหมด
          </RouterLink>
        </div>
      </article>

      <div v-else class="text-center text-gray-500">
        <p>ไม่พบข้อมูลข่าวที่ระบุ</p>
        <RouterLink to="/news" class="mt-4 inline-block text-blue-600 hover:underline">
          ดูข่าวสารทั้งหมด
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getNewsPublicById, type PublicNewsItem } from '@/services/newsService'
import { isAxiosError } from '@/services/apiService'

const route = useRoute()
const newsId = route.params.id as string

const newsItem = ref<PublicNewsItem | null>(null)
const loading = ref(true)
const errorMsg = ref<string | null>(null)

// --- เพิ่มฟังก์ชัน Utilities ---

function isPdf(url?: string | null): boolean {
  if (!url) return false
  return url.toLowerCase().endsWith('.pdf')
}

function normalizeParagraphs(text: string): string[] {
  const clean = String(text ?? '')
    .replace(/\r/g, '')
    .trim()
  if (!clean) return []
  return clean
    .split(/\n{2,}|\n-\n/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return d // คืนค่าเดิมหากการแปลงล้มเหลว
  }
}

function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  console.error('[NewsDetailView] Image failed to load:', el.src)
  // แสดง placeholder เมื่อโหลดภาพไม่สำเร็จ
  const fallback =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#4b5563">ไม่สามารถโหลดภาพได้</text></svg>`,
    )
  if (el && el.src !== fallback) el.src = fallback
}

// --- โค้ดดึงข้อมูล ---

onMounted(async () => {
  // 1. ตรวจสอบ ID
  if (!newsId) {
    errorMsg.value = 'ไม่พบ ID ของข่าว'
    loading.value = false
    return
  }

  try {
    const data = await getNewsPublicById(newsId)
    if (data && data.id) {
      newsItem.value = data
    } else {
      errorMsg.value = 'ไม่พบข้อมูลข่าวสารที่ระบุ ID' // แสดงข้อความนี้แทน
    }
  } catch (e) {
    // 4. จัดการข้อผิดพลาด
    console.error('Failed to fetch news item:', e)
    errorMsg.value = isAxiosError(e)
      ? (e.response?.data as { message?: string })?.message || e.message
      : 'ไม่สามารถโหลดข้อมูลข่าวได้'
  } finally {
    loading.value = false
  }
})
</script>

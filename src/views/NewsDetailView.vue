<template>
  <main class="bg-gray-50 py-12 md:py-16">
    <div class="max-w-4xl mx-auto px-4">
      <article
        v-if="newsItem"
        class="bg-white p-6 md:p-10 rounded-xl shadow-2xl transition-shadow duration-300 hover:shadow-3xl"
      >
        <div class="mb-4 text-sm text-blue-600 hover:text-blue-800 transition-colors">
          <RouterLink to="/news" class="inline-flex items-center gap-1">
            <i class="fas fa-chevron-left text-xs"></i> ข่าวสารทั้งหมด
          </RouterLink>
        </div>

        <header class="pb-6 border-b border-gray-100 mb-6">
          <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug">
            {{ newsItem.title }}
          </h1>
          <div class="mt-4 flex items-center gap-4 text-gray-600">
            <p class="text-sm font-medium">
              <i class="far fa-calendar-alt mr-2 text-blue-500"></i>
              เผยแพร่เมื่อ:
              <span class="text-gray-700 font-semibold">{{ formatDate(newsItem.date) }}</span>
            </p>
            <span
              v-if="newsItem.category"
              class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800"
            >
              {{ newsItem.category }}
            </span>
          </div>
        </header>

        <div
          v-if="newsItem.imageUrl && !isPdf(newsItem.imageUrl)"
          class="mb-8 rounded-lg overflow-hidden shadow-xl border border-gray-100"
        >
          <img
            :src="absoluteImage(newsItem.imageUrl)"
            :alt="newsItem.title"
            class="w-full object-fill h-64 md:h-96"
            @error="onImgError"
          />
        </div>

        <div class="prose max-w-none text-gray-800 leading-relaxed text-lg space-y-4">
          <p v-for="(p, i) in normalizeParagraphs(newsItem.content || '')" :key="i" class="mb-4">
            {{ p }}
          </p>
        </div>

        <div
          v-if="newsItem.pdfUrl || (newsItem.imageUrl && isPdf(newsItem.imageUrl))"
          class="mt-10 pt-6 border-t border-gray-100"
        >
          <a
            :href="newsItem.pdfUrl || absoluteImage(newsItem.imageUrl) || ''"
            target="_blank"
            class="inline-flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-red-700 hover:shadow-xl transition-all duration-200"
          >
            <i class="far fa-file-pdf text-xl"></i>
            <span class="text-lg">ดาวน์โหลดเอกสารแนบ (PDF)</span>
          </a>
        </div>
      </article>
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

function absoluteImage(u?: string | null): string {
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
  const root = base.replace(/\/api(\/v\d+)?$/i, '')
  // 🟢 URL ภาพจาก API
  // มีรูปแบบเป็น uploads/NEWS_... ดังนั้นต้องต่อจาก root ให้ถูกต้อง
  return `${root}/${String(u).replace(/^\/+/, '')}`
}

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
    return d
  }
}

// ℹ️ ฟังก์ชันจัดการเมื่อรูปภาพหลักโหลดไม่ได้
function onImgError(event: Event) {
  ;(event.target as HTMLImageElement).src = '/path/to/placeholder/image.png' // 👈 แทนที่ด้วย path รูปภาพสำรอง
  ;(event.target as HTMLImageElement).classList.add('opacity-50') // ทำให้จางลงเล็กน้อย
}

// --- โค้ดดึงข้อมูล (ปรับปรุงตามการแก้ไข 404/401) ---

onMounted(async () => {
  if (!newsId) {
    errorMsg.value = 'ไม่พบ ID ของข่าว'
    loading.value = false
    return
  }

  try {
    // 🟢 ใช้ getNewsPublicById ที่ได้รับการแก้ไขให้ส่ง ID เป็น Query Parameter แล้ว
    const data = await getNewsPublicById(newsId)

    if (data && data.id) {
      newsItem.value = data
    } else {
      errorMsg.value = 'ไม่พบข้อมูลข่าวสารที่ระบุ ID'
    }
  } catch (e) {
    console.error('Failed to fetch news item:', e)
    errorMsg.value = isAxiosError(e)
      ? (e.response?.data as { message?: string })?.message || e.message
      : 'ไม่สามารถโหลดข้อมูลข่าวได้'
  } finally {
    loading.value = false
  }
})
</script>

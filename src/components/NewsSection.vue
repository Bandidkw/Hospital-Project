<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto text-center px-4">
      <h2 class="text-3xl font-bold text-gray-800 mb-10">ข่าวสารและกิจกรรมล่าสุด</h2>

      <!-- เดิม: grid การ์ด 3 ใบแบบ static -->
      <!-- ใหม่: ใช้ v-for กับ latestNews -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
        <div
          v-for="n in latestNews"
          :key="n.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition text-left"
        >
          <div class="w-full h-48 bg-gray-100 overflow-hidden">
            <img
              v-if="n.imageUrl"
              :src="absoluteImage(n.imageUrl)"
              :alt="n.title"
              class="w-full h-full object-cover"
              @error="onImgError"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <i class="far fa-image text-3xl"></i>
            </div>
          </div>

          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
              {{ n.title }}
            </h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
              {{ n.excerpt || n.content }}
            </p>
            <RouterLink
              :to="{ name: 'public-news' }"
              class="text-blue-500 hover:underline font-semibold"
              @click="rememberScroll()"
            >
              อ่านเพิ่มเติม &rarr;
            </RouterLink>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="!latestNews.length" class="col-span-full text-gray-500 py-10">
          <i class="fas fa-info-circle mr-2"></i> ยังไม่มีข่าวสาร
        </div>
      </div>

      <div class="mt-12">
        <RouterLink
          :to="{ name: 'public-news' }"
          class="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-blue-700 transition"
        >
          ดูข่าวสารทั้งหมด
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getPublicNews, type PublicNewsItem } from '@/services/newsService'
import { isAxiosError } from '@/services/apiService'

const items = ref<PublicNewsItem[]>([])
const loading = ref(false)
const errorMsg = ref<string | null>(null)

onMounted(fetchNews)
async function fetchNews() {
  loading.value = true
  errorMsg.value = null
  try {
    const data = await getPublicNews()
    // เรียงใหม่สุดก่อน
    items.value = (data ?? []).sort((a, b) => (a.date > b.date ? -1 : 1))
  } catch (e) {
    errorMsg.value = isAxiosError(e)
      ? ((e.response?.data as { message?: string } | undefined)?.message ?? e.message)
      : 'ไม่สามารถโหลดข่าวสารได้'
  } finally {
    loading.value = false
  }
}

// ใช้ชื่อ latestNews แทน latestThree หรือจะคงชื่อเดิมก็ได้
const latestNews = computed(() => items.value.slice(0, 3))

function absoluteImage(u?: string | null): string {
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
  const root = base.replace(/\/api(\/v\d+)?$/i, '') // ตัด /api/v1 ออก
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

function rememberScroll() {
  sessionStorage.setItem('homeScrollY', String(window.scrollY || 0))
}
</script>

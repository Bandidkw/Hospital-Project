<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto text-center px-4">
      <h2 class="text-3xl font-bold text-gray-800 mb-10">ข่าวสารและกิจกรรมล่าสุด</h2>

      <!-- Error -->
      <div
        v-if="errorMsg"
        class="mb-6 inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-700"
      >
        <i class="fas fa-exclamation-triangle"></i>
        <span>{{ errorMsg }}</span>
      </div>

      <!-- Loading (optional simple skeleton) -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          <div class="w-full aspect-video bg-gray-200"></div>
          <div class="p-6 text-left">
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div class="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      <!-- Cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
        <div
          v-for="n in latestNews"
          :key="n.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition text-left"
        >
          <div class="aspect-video bg-gray-100 overflow-hidden">
            <img
              v-if="n.imageUrl"
              :src="n.imageUrl"
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
              {{ n.excerpt || n.content || '' }}
            </p>
            <RouterLink
              :to="{ name: 'public-news' }"
              class="text-blue-600 hover:underline font-semibold"
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

      <!-- ดูทั้งหมด -->
      <div class="mt-12">
        <RouterLink
          :to="{ name: 'public-news' }"
          class="text-blue-600 hover:text-white hover:bg-blue-700 font-bold py-2 px-6 rounded-full border-2 border-blue-500 inline-block"
          @click="rememberScroll()"
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

// แสดงแค่ 3 รายการล่าสุด
const latestNews = computed(() => items.value.slice(0, 3))

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
  if (el && el.src !== fallback) el.src = fallback
}

function rememberScroll() {
  sessionStorage.setItem('homeScrollY', String(window.scrollY || 0))
}
</script>

<style scoped>
/* util เล็ก ๆ */
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
.aspect-video {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
}
.aspect-video > img,
.aspect-video > div {
  position: absolute;
  inset: 0;
}
</style>

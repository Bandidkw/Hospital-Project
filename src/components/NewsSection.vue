<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight mb-10">
        ข่าวสารและกิจกรรมล่าสุด
      </h2>

      <!-- Error -->
      <div
        v-if="errorMsg"
        class="mb-6 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/80 px-3 py-2 text-red-700"
        role="alert"
      >
        <i class="fas fa-exclamation-triangle"></i>
        <span>{{ errorMsg }}</span>
      </div>

      <!-- Loading skeleton -->
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

      <!-- Cards (ไม่มีปุ่มอ่านเพิ่มเติมต่อการ์ด) -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <article
          v-for="n in latestNews"
          :key="n.id"
          class="group bg-white rounded-2xl shadow-sm overflow-hidden text-left ring-1 ring-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <!-- ภาพสูงขึ้น -->
          <div class="relative w-full h-56 md:h-60 lg:h-64 bg-gray-100">
            <img
              v-if="n.imageUrl"
              :src="n.imageUrl"
              :alt="n.title"
              class="absolute inset-0 w-full h-full object-cover"
              @error="onImgError"
            />
            <div
              v-else
              class="absolute inset-0 flex items-center justify-center text-gray-400"
              aria-hidden="true"
            >
              <i class="far fa-image text-3xl"></i>
            </div>

            <!-- date badge บนรูป -->
            <div class="absolute left-3 bottom-3">
              <span
                class="inline-flex items-center gap-1 text-xs md:text-[13px] font-medium px-2.5 py-1 rounded-full bg-white/90 text-gray-800 backdrop-blur"
              >
                <i class="far fa-calendar"></i>
                {{ formatDate(n.date) }}
              </span>
            </div>
          </div>

          <!-- เนื้อหา (ไม่มีลิงก์อ่านเพิ่มเติม) -->
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
        </article>

        <!-- Empty state -->
        <div v-if="!latestNews.length" class="col-span-full text-gray-500 py-10">
          <i class="fas fa-info-circle mr-2"></i> ยังไม่มีข่าวสาร
        </div>
      </div>

      <!-- ปุ่มดูทั้งหมด (พาไปหน้ารวมข่าว) -->
      <div class="mt-12">
        <RouterLink
          :to="{ name: 'public-news' }"
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
import { ref, onMounted, computed } from 'vue'
import { getPublicNews, type PublicNewsItem } from '@/services/newsService'
import { isAxiosError } from '@/services/apiService'

type PublicNewsWithStatus = PublicNewsItem & { isPublished?: boolean }

const items = ref<PublicNewsWithStatus[]>([])
const loading = ref(false)
const errorMsg = ref<string | null>(null)

onMounted(fetchNews)
async function fetchNews() {
  loading.value = true
  errorMsg.value = null
  try {
    const data = (await getPublicNews()) as PublicNewsWithStatus[]
    const published = (data ?? []).filter((n) => n.isPublished === true)

    items.value = published.sort((a, b) => (a.date > b.date ? -1 : 1))
  } catch (e) {
    errorMsg.value = isAxiosError(e)
      ? ((e.response?.data as { message?: string } | undefined)?.message ?? e.message)
      : 'ไม่สามารถโหลดข่าวสารได้'
  } finally {
    loading.value = false
  }
}

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

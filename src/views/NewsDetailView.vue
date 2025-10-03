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

        <div v-if="newsItem.imageUrl" class="mb-6">
          <img :src="newsItem.imageUrl" :alt="newsItem.title" class="w-full rounded-lg shadow-sm" />
        </div>

        <div class="prose max-w-none" v-html="newsItem.content"></div>

        <div v-if="newsItem.pdfUrl" class="mt-8">
          <a
            :href="newsItem.pdfUrl"
            target="_blank"
            class="inline-flex items-center gap-2 bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            <i class="far fa-file-pdf"></i>
            ดาวน์โหลดเอกสารแนบ (PDF)
          </a>
        </div>
      </article>

      <div v-else class="text-center text-gray-500">
        <p>ไม่พบข้อมูลข่าวที่ระบุ</p>
      </div>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getNewsById, type NewsItem } from '@/services/newsService'
import { isAxiosError } from '@/services/apiService'

const route = useRoute()
const newsId = route.params.id as string

const newsItem = ref<NewsItem | null>(null)
const loading = ref(true)
const errorMsg = ref<string | null>(null)

onMounted(async () => {
  if (!newsId) {
    errorMsg.value = 'ไม่พบ ID ของข่าว'
    loading.value = false
    return
  }

  try {
    const data = await getNewsById(newsId)
    newsItem.value = data
  } catch (e) {
    console.error('Failed to fetch news item:', e)
    errorMsg.value = isAxiosError(e)
      ? (e.response?.data as { message?: string })?.message || e.message
      : 'ไม่สามารถโหลดข้อมูลข่าวได้'
  } finally {
    loading.value = false
  }
})

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
</script>

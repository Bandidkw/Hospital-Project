<template>
  <div class="container mx-auto p-8 bg-white rounded-lg shadow-xl my-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">
      {{ history.title || 'ประวัติโรงพยาบาล' }}
    </h1>

    <div v-if="loading" class="text-center py-10">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
      <p class="mt-2 text-gray-600">กำลังโหลดประวัติ...</p>
    </div>
    <div v-else v-html="history.contentHtml" class="prose max-w-none mb-6"></div>

    <img
      v-if="history.imageUrl"
      :src="history.imageUrl"
      alt="Historical image of hospital"
      class="w-full h-auto rounded-lg shadow-2xl mt-8 border-4 border-gray-200"
      loading="lazy"
    />
    <p v-else class="text-red-500 mt-4">ไม่สามารถแสดงรูปภาพประวัติโรงพยาบาลได้</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchHistory } from '@/services/historyService'
import type { HistoryData } from '@/types/history'
import { useToast } from 'vue-toastification'

const toast = useToast()

const history = ref<HistoryData>({
  id: 0,
  title: '',
  contentHtml: '',
  imageUrl: '',
})
const loading = ref(true)

const loadHistory = async () => {
  loading.value = true
  try {
    const data = await fetchHistory()
    history.value = data
  } catch (e: unknown) {
    console.error('Failed to load history:', e)
    toast.error('ไม่สามารถโหลดข้อมูลประวัติโรงพยาบาลได้')
  } finally {
    loading.value = false
  }
}

onMounted(loadHistory)
</script>

<style scoped>
/*
 * 💡 หากใช้ Tailwind CSS เวอร์ชันที่ใหม่กว่า คุณอาจต้องติดตั้ง @tailwindcss/typography
 * เพื่อให้การจัดรูปแบบ HTML ที่มาจาก v-html สวยงามขึ้น
 */
.prose :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.75;
}
.prose :deep(br) {
  margin-bottom: 0.5rem; /* กำหนดระยะห่างของ <br> ให้เหมาะสม */
}
</style>

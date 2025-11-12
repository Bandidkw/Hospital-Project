<template>
  <div class="container mx-auto p-8 bg-white rounded-lg shadow-xl my-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">วิสัยทัศน์และพันธกิจ</h1>

    <div v-if="loading" class="text-center py-10">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
      <p class="mt-2 text-gray-600">กำลังโหลดข้อมูลวิสัยทัศน์...</p>
    </div>

    <div v-else>
      <div class="mb-8 p-6 rounded-lg bg-blue-50 border-l-4 border-blue-600 shadow-md">
        <h2 class="text-2xl font-semibold text-blue-600 mb-3 flex items-center">
          <i class="fas fa-eye mr-3 text-blue-500"></i> วิสัยทัศน์ (Vision)
        </h2>
        <p class="text-gray-800 leading-relaxed text-xl font-medium">"{{ visionData.vision }}"</p>
      </div>

      <div class="mb-8 p-6 rounded-lg bg-green-50 border-l-4 border-green-600 shadow-md">
        <h2 class="text-2xl font-semibold text-green-600 mb-3 flex items-center">
          <i class="fas fa-tasks mr-3 text-green-500"></i> พันธกิจ (Mission)
        </h2>
        <div v-html="visionData.missionHtml" class="prose max-w-none text-gray-700"></div>
      </div>

      <div class="p-6 rounded-lg bg-purple-50 border-l-4 border-purple-600 shadow-md">
        <h2 class="text-2xl font-semibold text-purple-600 mb-3 flex items-center">
          <i class="fas fa-bullseye mr-3 text-purple-500"></i> ค่านิยม (Core Values)
        </h2>
        <div v-html="visionData.coreValuesHtml" class="prose max-w-none text-gray-700"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchVision } from '@/services/visionService'
import type { VisionData } from '@/types/vision'
import { useToast } from 'vue-toastification'

const toast = useToast()

const visionData = ref<VisionData>({
  id: '',
  vision: '',
  missionHtml: '',
  coreValuesHtml: '',
})
const loading = ref(true)

const loadVisionData = async () => {
  loading.value = true
  try {
    const data = await fetchVision()
    visionData.value = data
  } catch (e: unknown) {
    console.error('Failed to load vision data:', e)
    toast.error('ไม่สามารถโหลดข้อมูลวิสัยทัศน์และพันธกิจได้')
  } finally {
    loading.value = false
  }
}

onMounted(loadVisionData)
</script>

<style scoped>
/* 💡 หากใช้ Tailwind Typography ควรจัด Style สำหรับ v-html ใน Component */
.prose :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
  margin-top: 1rem;
}
.prose :deep(li) {
  margin-bottom: 0.5rem;
}
</style>

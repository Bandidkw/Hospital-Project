<template>
  <div class="container mx-auto p-8 bg-white rounded-lg shadow-md my-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">ข่าวสารและประกาศ</h1>
    <p class="text-gray-700 leading-relaxed mb-6">
      ติดตามข่าวสารล่าสุด กิจกรรม และประกาศสำคัญจากโรงพยาบาลแม่แตง
      เพื่อให้คุณไม่พลาดทุกความเคลื่อนไหวและข้อมูลที่เป็นประโยชน์
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="newsItem in news" :key="newsItem.id" class="bg-gray-50 rounded-lg shadow-md overflow-hidden">
        <img :src="newsItem.imageUrl" :alt="newsItem.title" class="w-full h-48 object-cover">
        <div class="p-4">
          <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ newsItem.title }}</h2>
          <p class="text-gray-600 text-sm mb-3">
            <i class="fas fa-calendar-alt mr-2"></i> {{ newsItem.date }}
          </p>
          <p class="text-gray-700 text-sm mb-4 line-clamp-3">{{ newsItem.summary }}</p>
          <RouterLink :to="`/news/${newsItem.id}`" class="text-blue-600 hover:underline flex items-center">
            อ่านเพิ่มเติม <i class="fas fa-arrow-right ml-2 text-sm"></i>
          </RouterLink>
        </div>
      </div>
      <div v-if="news.length === 0" class="col-span-full text-center py-8 text-gray-500">
        ยังไม่มีข่าวสารในขณะนี้
      </div>
    </div>

    <!-- Pagination (ถ้ามีข่าวเยอะ) -->
    <div v-if="news.length > 0" class="flex justify-center mt-8">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          <span class="sr-only">Previous</span>
          <i class="fas fa-chevron-left"></i>
        </a>
        <a href="#" aria-current="page" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-600 text-sm font-medium text-white">
          1
        </a>
        <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          2
        </a>
        <a href="#" class="relative hidden md:inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          3
        </a>
        <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
          <span class="sr-only">Next</span>
          <i class="fas fa-chevron-right"></i>
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router'; // Import RouterLink for navigation

const news = ref([
  {
    id: 1,
    title: 'โรงพยาบาลแม่แตงจัดกิจกรรมวันสงกรานต์',
    date: '13 เมษายน 2568',
    summary: 'โรงพยาบาลแม่แตงได้จัดกิจกรรมรดน้ำดำหัวผู้สูงอายุและบุคลากรทางการแพทย์ เนื่องในโอกาสเทศกาลสงกรานต์ประจำปี 2568 เพื่อสืบสานประเพณีไทยอันดีงาม...',
    imageUrl: 'https://placehold.co/400x250/e0e0e0/333333?text=News+1',
  },
  {
    id: 2,
    title: 'โครงการตรวจสุขภาพฟรีสำหรับประชาชนในพื้นที่',
    date: '5 มีนาคม 2568',
    summary: 'ขอเชิญชวนประชาชนในพื้นที่อำเภอแม่แตงและใกล้เคียง เข้าร่วมโครงการตรวจสุขภาพฟรี โดยไม่มีค่าใช้จ่าย ณ โรงพยาบาลแม่แตง...',
    imageUrl: 'https://placehold.co/400x250/e0e0e0/333333?text=News+2',
  },
  {
    id: 3,
    title: 'ประกาศรับสมัครบุคลากรทางการแพทย์หลายอัตรา',
    date: '28 กุมภาพันธ์ 2568',
    summary: 'โรงพยาบาลแม่แตงเปิดรับสมัครบุคลากรทางการแพทย์และเจ้าหน้าที่หลายอัตรา เพื่อรองรับการขยายงานและพัฒนาบริการ...',
    imageUrl: 'https://placehold.co/400x250/e0e0e0/333333?text=News+3',
  },
]);

// In a real application, you would fetch this data from an API
</script>

<style scoped>
/* Add specific styles for this page if needed */
</style>

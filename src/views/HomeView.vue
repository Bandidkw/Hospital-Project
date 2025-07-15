<script setup lang="ts">
import HeroSection from '../components/HeroSection.vue';
import ServiceSection from '@/components/ServiceSection.vue'; // ServiceSection ถูก import แล้ว
</script>

<template>
  <div>
    <HeroSection />

    <ServiceSection />

    <div class="py-16 text-center bg-white">
      <h2 class="text-3xl text-gray-700">ส่วนข่าวสาร (กำลังจะสร้าง)</h2>
    </div>
    <div class="py-16 text-center bg-gray-100">
      <h2 class="text-3xl text-gray-700">ส่วนติดต่อเรา (กำลังจะสร้าง)</h2>
    </div>

  </div>
</template>

<style scoped>
/* CSS สำหรับ HomeView.vue */
</style>

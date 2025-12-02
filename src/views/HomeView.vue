<script setup lang="ts">
import { ref, onMounted } from 'vue' // 💡 เพิ่ม ref และ onMounted
import HeroSection from '../components/HeroSection.vue'
import ServiceSection from '@/components/ServiceSection.vue'
import NewsSection from '@/components/NewsSection.vue'
import ContactUsSection from '@/components/ContactUsSection.vue'
import FacebookFeedSection from '@/components/FacebookFeedSection.vue' // 💡 นำเข้า Component ใหม่

import { facebookService } from '@/services/facebookService' // 💡 นำเข้า Service ใหม่
import type { FacebookPost } from '@/types/facebook'

// --- State สำหรับ Facebook Feed ---
const facebookPosts = ref<FacebookPost[]>([])
const isLoadingFacebook = ref(true)

// --- Logic การดึงข้อมูล ---
const fetchFacebookFeed = async () => {
  isLoadingFacebook.value = true
  try {
    // 💡 เรียก Service เพื่อดึง 3 โพสล่าสุด
    facebookPosts.value = await facebookService.fetchLatestPosts(3)
  } catch (error) {
    console.error('Failed to load Facebook feed on homepage:', error)
  } finally {
    isLoadingFacebook.value = false
  }
}

// --- Lifecycle ---
onMounted(() => {
  fetchFacebookFeed()
})
</script>

<template>
  <div>
    <HeroSection />
    <ServiceSection />

    <NewsSection />

    <FacebookFeedSection :posts="facebookPosts" :is-loading="isLoadingFacebook" />

    <ContactUsSection />
  </div>
</template>

<style scoped></style>

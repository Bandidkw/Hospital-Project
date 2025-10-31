<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <LoadingSpinner v-if="isLoading" />

    <WelcomeSplashPopup v-if="!isWebsiteLoaded" @load-website="loadWebsite" />

    <template v-if="isWebsiteLoaded">
      <header v-if="!isDashboardRoute">
        <HeaderContact />
        <Navbar />
      </header>

      <main class="flex-grow">
        <RouterView />
      </main>

      <Footer />
      <BackToTopButton />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue' // *** เพิ่ม onMounted ***
import { RouterView, useRouter, useRoute } from 'vue-router'
// Components
import Navbar from './components/AppNavbar.vue'
import Footer from './components/AppFooter.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import HeaderContact from './components/HeaderContact.vue'
import BackToTopButton from './components/BackToTopButton.vue'
import WelcomeSplashPopup from '@/components/common/WelcomeSplashPopup.vue'

// ------------------------------------
// STATE & LOGIC FOR SPLASH POPUP
// ------------------------------------
// สถานะ: ควบคุมการแสดงผลเนื้อหาหลัก
const isWebsiteLoaded = ref(false)
const SPLASH_STORAGE_KEY = 'hasVisitedWebsite' // คีย์สำหรับ Local Storage

// ฟังก์ชันสำหรับตั้งค่า isWebsiteLoaded จาก Local Storage
const checkInitialLoad = () => {
  // อ่านค่าจาก Local Storage: ถ้าเคยเข้าชมแล้ว (ค่าเป็น 'true'), ให้ตั้งค่า isWebsiteLoaded เป็น true ทันที
  const hasVisited = localStorage.getItem(SPLASH_STORAGE_KEY)
  if (hasVisited === 'true') {
    isWebsiteLoaded.value = true
  } else {
    isWebsiteLoaded.value = false
  }
}

// เมธอด: ถูกเรียกเมื่อ WelcomeSplashPopup ส่ง Event 'load-website' มา
const loadWebsite = () => {
  // 1. ตั้งค่าสถานะเป็น true เพื่อแสดงเนื้อหาหลัก
  isWebsiteLoaded.value = true
  // 2. บันทึกใน Local Storage ว่าผู้ใช้เคยเข้าชมแล้ว
  localStorage.setItem(SPLASH_STORAGE_KEY, 'true')
  // router.push('/') // (Optional) ถ้าต้องการให้ URL ถูกตั้งค่าไปที่หน้าแรก
}

// ตรวจสอบสถานะการเข้าชมเมื่อ Component ถูก Mount
onMounted(() => {
  checkInitialLoad()
})

// ------------------------------------
// STATE & LOGIC FOR LOADING AND ROUTING
// ------------------------------------
// ส่วนโค้ด Loading และ Routing อื่น ๆ ที่มีอยู่แล้ว ไม่ต้องแก้ไข
const isLoading = ref(false)
const router = useRouter()
const route = useRoute()

const isDashboardRoute = computed(() => {
  return route.path.startsWith('/dashboard')
})

router.beforeEach((to, from, next) => {
  isLoading.value = true
  next()
})
router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})
</script>

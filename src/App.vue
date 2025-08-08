<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <LoadingSpinner v-if="isLoading" />

    <header v-if="!isDashboardRoute">
      <HeaderContact />
      <Navbar />
    </header>

    <main class="flex-grow">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
import Navbar from './components/AppNavbar.vue'
import Footer from './components/Footer.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import HeaderContact from './components/HeaderContact.vue'

// --- โค้ดส่วน script ของคุณถูกต้องสมบูรณ์แล้ว ไม่ต้องแก้ไข ---
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

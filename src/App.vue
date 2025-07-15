<template>
  <div>
    <LoadingSpinner v-if="isLoading" />

    <Navbar />
    <RouterView />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterView, useRouter } from 'vue-router'; // Import useRouter
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import LoadingSpinner from './components/LoadingSpinner.vue'; // Import LoadingSpinner

const isLoading = ref(false); // สถานะสำหรับควบคุมการแสดง Loading Spinner
const router = useRouter(); // สร้าง instance ของ router

// Navigation Guard: ก่อนที่จะเข้าสู่ Route ใหม่
router.beforeEach((to, from, next) => {
  isLoading.value = true; // แสดง Loading Spinner
  next(); // ดำเนินการต่อไปยัง Route ถัดไป
});

// Navigation Guard: หลังจากออกจาก Route และ Render Component เสร็จแล้ว
router.afterEach(() => {
  // ใช้ setTimeout เพื่อให้แน่ใจว่า DOM ถูก Render เรียบร้อยแล้ว
  // หรือในกรณีที่โหลดข้อมูลจาก API ช้าๆ คุณอาจจะต้องไปควบคุม isLoading จาก API call นั้นๆ
  setTimeout(() => {
    isLoading.value = false; // ซ่อน Loading Spinner
  }, 300); // ดีเลย์เล็กน้อย (เช่น 300ms) เพื่อให้เห็น Loading ได้ชัดเจนขึ้น
});
</script>

<style scoped>
/* สามารถเพิ่มสไตล์ Global ที่ App.vue ได้หากต้องการ */
</style>

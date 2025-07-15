<template>
  <div>
    <LoadingSpinner v-if="isLoading" />
    <HeaderContact v-if="!isDashboardRoute" />
    <Navbar v-if="!isDashboardRoute" />
    <RouterView />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterView, useRouter, useRoute } from 'vue-router'; // เพิ่ม useRoute
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import LoadingSpinner from './components/LoadingSpinner.vue';
import HeaderContact from './components/HeaderContact.vue';

const isLoading = ref(false);
const router = useRouter();
const route = useRoute();
const isDashboardRoute = computed(() => {
  return route.path.startsWith('/dashboard');
});

router.beforeEach((to, from, next) => {
  isLoading.value = true;
  next();
});
router.afterEach(() => {
  setTimeout(() => {
    isLoading.value = false; // ซ่อน Loading
  }, 300); // ดีเลย์ 300ms
});
</script>

<style scoped></style>

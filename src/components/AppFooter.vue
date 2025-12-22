<template>
  <footer class="bg-gray-800 p-6 text-white">
    <div class="container mx-auto text-center">
      <p>&copy; {{ currentYear }} Hospital Website. All rights reserved.</p>

      <p class="text-xs text-gray-500 mt-1">
        Developed by
        <a href="" target="_blank" class="hover:text-blue-400 underline font-semibold">
          IT Maetaeng Hospital
        </a>
      </p>

      <div class="mt-2 text-sm text-gray-400">
        <a href="#" class="hover:text-white px-2">Privacy Policy</a> |
        <a href="#" class="hover:text-white px-2">Terms of Service</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
/* CSS สำหรับ Footer*/
</style>

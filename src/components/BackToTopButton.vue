<template>
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform opacity-0 scale-95"
    enter-to-class="transform opacity-100 scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="transform opacity-100 scale-100"
    leave-to-class="transform opacity-0 scale-95"
  >
    <button
      v-if="isVisible"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white font-bold w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-50"
      aria-label="Go to top"
    >
      <i class="fas fa-arrow-up"></i>
    </button>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 2. "เซ็นเซอร์" ตรวจจับว่าลิฟต์ควรจะโผล่มาหรือยัง
const isVisible = ref(false)

// 3. ฟังก์ชัน "เช็กความสูง" ที่จะทำงานทุกครั้งที่เราเลื่อนหน้าจอ
const handleScroll = () => {
  // ถ้าเลื่อนลงมาเกิน 200px ให้แสดงลิฟต์
  if (window.scrollY > 200) {
    isVisible.value = true
  } else {
    // ถ้าน้อยกว่า ก็ซ่อนไว้
    isVisible.value = false
  }
}

// 4. ฟังก์ชัน "กดปุ่มลิฟต์"
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // <-- คาถาทำให้ลิฟต์เลื่อนขึ้นไปนิ่มๆ
  })
}

// 5. "ติดตั้ง" และ "ถอด" เซ็นเซอร์อัตโนมัติ
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

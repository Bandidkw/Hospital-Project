<template>
  <section
    class="relative bg-cover bg-center h-[480px] flex items-center justify-center text-white overflow-hidden"
    :style="{ backgroundImage: `url(${currentBackground})` }"
  >
    <div class="absolute inset-0 bg-black opacity-50"></div>

    <button
      @click="prevSlide"
      class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-colors duration-300 z-20 focus:outline-none"
      aria-label="Previous slide"
    >
      <i class="fas fa-chevron-left text-xl"></i>
    </button>
    <button
      @click="nextSlide"
      class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-colors duration-300 z-20 focus:outline-none"
      aria-label="Next slide"
    >
      <i class="fas fa-chevron-right text-xl"></i>
    </button>

    <div class="container mx-auto text-center z-10 px-4">
      <h1 class="text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in-up">
        {{ currentTitle }}
      </h1>
      <p class="text-lg md:text-xl mb-8 animate-fade-in-up delay-200">
        {{ currentSubtitle }}
      </p>
    </div>

    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
      <span
        v-for="(slide, index) in slides"
        :key="index"
        @click="goToSlide(index)"
        :class="{ 'opacity-100': currentIndex === index, 'opacity-50': currentIndex !== index }"
        class="block w-3 h-3 bg-white rounded-full cursor-pointer transition-opacity duration-300"
      ></span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
// import { RouterLink } from 'vue-router'

// Import your background images directly
// Ensure these paths and filenames match your actual files in src/assets/Home/
import slide01 from '../assets/Home/slide-01.png'
import slide02 from '../assets/Home/slide-02.jpg'
import slide03 from '../assets/Home/slide-03.jpg' // Assuming this is the correct path for slide 3

const slides = ref([
  {
    background: slide01,
    title: 'โรงพยาบาลแม่แตง',
    subtitle: 'ให้บริการทางการแพทย์ด้วยมาตรฐานระดับสากล',
  },
  {
    background: slide02,
    title: 'ดูแลสุขภาพคุณด้วยหัวใจ',
    subtitle: 'ทีมแพทย์และพยาบาลผู้เชี่ยวชาญพร้อมดูแลทุกท่าน',
  },
  {
    background: slide03,
    title: 'ห้องฉุกเฉิน 24 ชั่วโมง',
    subtitle: 'พร้อมให้ความช่วยเหลือในทุกสถานการณ์ฉุกเฉิน',
  },
])

const currentIndex = ref(0)
let slideInterval: ReturnType<typeof setInterval> | undefined

const currentBackground = computed(() => slides.value[currentIndex.value].background)
const currentTitle = computed(() => slides.value[currentIndex.value].title)
const currentSubtitle = computed(() => slides.value[currentIndex.value].subtitle)

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length
  // Stop and restart autoplay to reset the timer after manual interaction
  stopAutoplay()
  startAutoplay()
  // console.log('Next slide clicked, new index:', currentIndex.value)
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length
  // Stop and restart autoplay to reset the timer after manual interaction
  stopAutoplay()
  startAutoplay()
  // console.log('Prev slide clicked, new index:', currentIndex.value)
}

const goToSlide = (index: number) => {
  currentIndex.value = index
  // Stop and restart autoplay to reset the timer after manual interaction
  stopAutoplay()
  startAutoplay()
  // console.log('Dot clicked, new index:', currentIndex.value)
}

const startAutoplay = () => {
  stopAutoplay() // Ensure any existing interval is cleared before setting a new one
  slideInterval = setInterval(nextSlide, 5000) // Change every 5 seconds
  // console.log('Autoplay started.')
}

const stopAutoplay = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = undefined // Clear the reference to the interval
    // console.log('Autoplay stopped.')
  }
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 1s ease-out forwards;
  opacity: 0;
}
.delay-200 {
  animation-delay: 0.2s;
}
.delay-400 {
  animation-delay: 0.4s;
}

section {
  background-size: cover;
  background-position: center;
  transition: background-image 0.8s ease-in-out; /* Smooth transition for background image */
}
</style>

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
      <RouterLink
        to="/services"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 animate-fade-in-up delay-400"
      >
        ดูบริการของเรา
      </RouterLink>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router'; // ต้อง import RouterLink ด้วยถ้ายังไม่ได้ทำ

// ข้อมูลสำหรับแต่ละสไลด์ (ใช้ Placeholder/สีพื้นหลังแทนรูปจริง)
const slides = ref([
  {
    background: 'https://via.placeholder.com/1500x500/007bff/ffffff?text=Hospital+Banner+1',
    title: 'โรงพยาบาลแม่แตง',
    subtitle: 'ให้บริการทางการแพทย์ด้วยมาตรฐานระดับสากล',
  },
  {
    background: 'https://via.placeholder.com/1500x500/28a745/ffffff?text=Caring+for+Our+Community+2',
    title: 'ดูแลสุขภาพคุณด้วยหัวใจ',
    subtitle: 'ทีมแพทย์และพยาบาลผู้เชี่ยวชาญพร้อมดูแลทุกท่าน',
  },
  {
    background: 'https://via.placeholder.com/1500x500/dc3545/ffffff?text=Emergency+Services+3',
    title: 'ห้องฉุกเฉิน 24 ชั่วโมง',
    subtitle: 'พร้อมให้ความช่วยเหลือในทุกสถานการณ์ฉุกเฉิน',
  },
]);

const currentIndex = ref(0);
let slideInterval: number | undefined; // ใช้ number หรือ undefined เพื่อให้เข้ากับ setInterval/clearInterval

// Computed property เพื่อดึงข้อมูลของสไลด์ปัจจุบัน
const currentBackground = computed(() => slides.value[currentIndex.value].background);
const currentTitle = computed(() => slides.value[currentIndex.value].title);
const currentSubtitle = computed(() => slides.value[currentIndex.value].subtitle);

// ฟังก์ชันเปลี่ยนสไลด์ไปถัดไป
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.value.length;
};

// ฟังก์ชันเปลี่ยนสไลด์ไปก่อนหน้า
const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + slides.value.length) % slides.value.length;
};

// ฟังก์ชันไปที่สไลด์ที่ระบุ (สำหรับ Pagination Dots)
const goToSlide = (index: number) => {
  currentIndex.value = index;
};

// ฟังก์ชันเริ่ม Autoplay
const startAutoplay = () => {
  slideInterval = setInterval(nextSlide, 5000); // เปลี่ยนทุก 5 วินาที
};

// ฟังก์ชันหยุด Autoplay
const stopAutoplay = () => {
  if (slideInterval) {
    clearInterval(slideInterval);
  }
};

// Lifecycle Hooks สำหรับเริ่ม/หยุด Autoplay
onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<style scoped>
/* Keyframes for the animation (จากโค้ดเดิมของคุณ) */
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
  opacity: 0; /* เริ่มต้นด้วย opacity 0 เพื่อให้ animation ทำงาน */
}
.delay-200 { animation-delay: 0.2s; }
.delay-400 { animation-delay: 0.4s; }

/* คุณอาจจะต้องเพิ่ม transition สำหรับ background-image ถ้าต้องการให้มัน fade ด้วย */
section {
  transition: background-image 0.5s ease-in-out; /* เพิ่ม transition ให้ background */
}
</style>

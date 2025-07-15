<template>
  <section
    class="relative bg-cover bg-center h-96 flex items-center justify-center text-white"
    style="background-image: url('https://via.placeholder.com/1500x500/007bff/ffffff?text=Hospital+Banner');"
    >
    <div class="absolute inset-0 bg-black opacity-50"></div> <div class="container mx-auto text-center z-10 px-4">
      <h1 class="text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in-up">
        โรงพยาบาลแม่แตง
      </h1>
      <p class="text-lg md:text-xl mb-8 animate-fade-in-up delay-200">
        ให้บริการทางการแพทย์ด้วยมาตรฐานระดับสากล
      </p>
      <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 animate-fade-in-up delay-400">
        ดูบริการของเรา
      </button>
    </div>

    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
      <span class="block w-3 h-3 bg-white rounded-full opacity-50 cursor-pointer"></span>
      <span class="block w-3 h-3 bg-white rounded-full cursor-pointer"></span>
      <span class="block w-3 h-3 bg-white rounded-full opacity-50 cursor-pointer"></span>
    </div>
  </section>
</template>

<script setup lang="ts">
// สามารถเพิ่ม logic สำหรับ slider ได้ในอนาคต
</script>

<style scoped>
/* Animation classes (เพิ่มใน tailwind.config.cjs ในส่วน extend.keyframes และ extend.animation) */
.animate-fade-in-up {
  animation: fade-in-up 1s ease-out forwards;
  opacity: 0;
}
.delay-200 { animation-delay: 0.2s; }
.delay-400 { animation-delay: 0.4s; }

/* ต้องเพิ่ม keyframes ใน tailwind.config.cjs */
</style>

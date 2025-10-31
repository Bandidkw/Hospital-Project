<template>
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center font-sarabun text-white bg-cover bg-center"
    :style="{ backgroundImage: 'url(\'/src/assets/Welcome/background.jpg\')' }"
  >
    <div class="absolute inset-0 bg-black/80"></div>

    <div class="relative z-10 w-full h-full flex items-center justify-center px-4 sm:px-8 py-10">
      <div
        class="flex flex-col max-w-6xl w-full mx-auto p-6 md:p-10 lg:p-8 bg-black/80 shadow-2xl shadow-black/60 border-2 border-yellow-600 rounded-lg transition duration-500 ease-in-out hover:border-yellow-600/70"
      >
        <div class="flex flex-col lg:flex-row items-center mb-10 lg:mb-12">
          <div
            class="w-full lg:w-[400px] lg:mr-16 mb-8 lg:mb-0 max-w-xs sm:max-w-sm lg:max-w-none flex-shrink-0 border-2 border-white overflow-hidden relative rounded-lg"
          >
            <img
              src="@/assets/Welcome/queen-sirikit.png"
              alt="สมเด็จพระนางเจ้าสิริกิติ์ พระบรมราชินีนาถ พระบรมราชชนนีพันปีหลวง"
              class="w-full h-auto block filter grayscale object-cover transform transition duration-500 hover:scale-105"
            />
          </div>

          <div class="flex-1 text-center lg:text-left">
            <h2 class="text-3xl sm:text-3xl font-extrabold mb-1 tracking-wider text-white">
              สมเด็จพระนางเจ้าสิริกิติ์ พระบรมราชินีนาถ
            </h2>
            <h3 class="text-2xl sm:text-2xl font-medium mb-8 text-gray-300">
              พระบรมราชชนนีพันปีหลวง
            </h3>

            <p
              class="text-4xl sm:text-4xl font-black text-white mb-10 tracking-widest leading-snug drop-shadow-md"
            >
              สถิตในดวงใจไทยนิรันดร์
            </p>

            <div class="w-32 h-1 bg-white mx-auto lg:mx-0 mb-8"></div>

            <p class="text-base sm:text-lg leading-relaxed mt-8 text-gray-300">
              น้อมสำนึกในพระมหากรุณาธิคุณเป็นล้นพ้นอันหาที่สุดมิได้
              <br />
              ข้าพระพุทธเจ้า คณะผู้บริหารและเจ้าหน้าที่ โรงพยาบาลแม่แตง
            </p>
          </div>
        </div>

        <div class="mt-10 w-full text-center border-t border-gray-700/50 pt-8">
          <button
            class="bg-white text-black px-8 py-2 text-lg font-bold cursor-pointer transition duration-300 transform shadow-md focus:outline-none focus:ring-4 rounded-xl"
            @click="$emit('load-website')"
          >
            เข้าสู่เว็บไซต์
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'

defineEmits(['load-website'])
</script>

<style>
/* ... */
</style>

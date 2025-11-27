<template>
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center font-sarabun text-white bg-cover bg-center"
    :style="{ backgroundImage: 'url(\'/src/assets/Welcome/background.jpg\')' }"
  >
    <div class="absolute inset-0 bg-black/80"></div>

    <div
      class="relative z-10 w-full h-full min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 md:py-12 overflow-y-auto"
    >
      <div
        class="flex flex-col max-w-6xl w-full mx-auto p-5 sm:p-8 md:p-10 lg:p-12 bg-black/80 shadow-2xl shadow-black/70 border-2 border-yellow-600 rounded-xl transition duration-500 ease-in-out hover:border-yellow-500/90"
      >
        <div class="flex flex-col lg:flex-row items-center mb-8 lg:mb-12">
          <div
            class="w-full lg:w-1/3 xl:w-[400px] lg:mr-10 xl:mr-16 mb-6 lg:mb-0 max-w-xs sm:max-w-sm flex-shrink-0 border-4 border-white overflow-hidden relative rounded-lg shadow-xl"
          >
            <img
              src="@/assets/Welcome/queen-sirikit.png"
              alt="สมเด็จพระนางเจ้าสิริกิติ์ พระบรมราชินีนาถ พระบรมราชชนนีพันปีหลวง"
              class="w-full h-auto block filter grayscale object-cover transform transition duration-500 hover:scale-105"
            />
          </div>

          <div class="flex-1 text-center lg:text-left">
            <h2
              class="text-3xl sm:text-4xl font-extrabold mb-1 tracking-wider text-white drop-shadow-lg"
            >
              สมเด็จพระนางเจ้าสิริกิติ์ พระบรมราชินีนาถ
            </h2>
            <h3 class="text-xl sm:text-2xl font-medium mb-6 text-gray-300">
              พระบรมราชชนนีพันปีหลวง
            </h3>

            <p
              class="text-4xl sm:text-5xl font-black text-yellow-500 mb-8 tracking-wide leading-snug drop-shadow-xl"
            >
              สถิตในดวงใจไทยนิรันดร์
            </p>

            <div class="w-24 h-1 bg-yellow-500 mx-auto lg:mx-0 mb-8"></div>

            <p class="text-base sm:text-lg leading-relaxed mt-6 text-gray-300">
              น้อมสำนึกในพระมหากรุณาธิคุณเป็นล้นพ้นอันหาที่สุดมิได้
              <br />
              ข้าพระพุทธเจ้า คณะผู้บริหารและเจ้าหน้าที่ โรงพยาบาลแม่แตง
            </p>
          </div>
        </div>
        <div class="mt-8 w-full text-center border-t border-gray-600/50 pt-6 sm:pt-8">
          <button
            class="bg-yellow-500 hover:bg-yellow-600 text-black px-10 py-3 text-xl font-extrabold cursor-pointer transition duration-300 transform shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-500/50 active:scale-95 rounded-full"
            @click="$emit('load-website')"
          >
            <i class="fas fa-arrow-right mr-2"></i> เข้าสู่เว็บไซต์
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

<style></style>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 p-8">
    <div
      class="text-center p-16 bg-white shadow-2xl rounded-2xl max-w-xl w-full border-t-8 border-teal-600 transition-shadow duration-300 hover:shadow-3xl"
    >
      <div class="mb-8 flex justify-center">
        <i class="fas fa-cogs text-7xl text-teal-600 animate-spin-slow"></i>
      </div>

      <h1 class="text-4xl font-black text-gray-900 mb-3 tracking-wide">
        🛠️ ฟีเจอร์นี้อยู่ระหว่างการดำเนินการ
      </h1>

      <p class="text-xl text-gray-600 mb-12 font-light">
        ทีมงานกำลังพัฒนาส่วนนี้ เพื่อนำเสนอฟังก์ชันการใช้งานที่ดีที่สุด
      </p>

      <div class="bg-blue-50 border border-blue-200 p-6 rounded-lg text-left mb-10">
        <div class="flex items-start">
          <i class="fas fa-clipboard-list text-2xl text-teal-600 mr-4 mt-0.5"></i>
          <p class="text-gray-800 text-base">
            <span class="font-bold block mb-1">สถานะโครงการ:</span>
            เนื่องจากหน้านี้อยู่ระหว่างการพัฒนาและตรวจสอบอย่างเข้มงวด
            อาจมีการเปลี่ยนแปลงหรือถูกจำกัดชั่วคราว
          </p>
        </div>
      </div>

      <router-link
        to="/dashboard"
        class="inline-flex items-center justify-center px-10 py-3 bg-teal-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        <i class="fas fa-tachometer-alt mr-3"></i> กลับสู่แดชบอร์ด
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// No logic needed
</script>

<style scoped>
/* Custom animation for a smooth, slow spin */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 10s linear infinite; /* 10s คือความเร็วที่หมุนช้าๆ */
}
</style>

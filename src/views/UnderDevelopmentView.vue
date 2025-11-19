<template>
  <div class="flex items-center justify-center min-h-screen bg-white p-6">
    <div
      class="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-12 md:p-20 text-center border-b-8 border-teal-600 ring-2 ring-gray-100 transition duration-500 hover:shadow-3xl"
    >
      <div class="mb-10">
        <div class="text-teal-700 mb-6">
          <i class="fas fa-rocket fa-6x animate-bounce-custom drop-shadow-lg"></i>
        </div>

        <h2 class="text-3xl font-bold text-gray-800 tracking-tighter">โรงพยาบาลแม่แตง</h2>
      </div>

      <h1 class="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-snug">
        เตรียมพบกับ...
        <span class="text-teal-600 block mt-2">คุณสมบัติใหม่เร็ว ๆ นี้!</span>
      </h1>

      <p class="text-xl text-gray-600 mb-12 max-w-lg mx-auto leading-relaxed">
        เรากำลังพัฒนาระบบนี้เพื่อเพิ่มความสะดวกสบายในการเข้าถึงข้อมูลและการบริการด้านสุขภาพของท่าน
      </p>

      <div class="bg-teal-50 p-7 rounded-xl mb-10 border border-teal-200 shadow-inner">
        <h3 class="text-lg font-bold text-teal-700 mb-3 flex items-center justify-center">
          <i class="fas fa-calendar-alt mr-3"></i> คาดการณ์การเปิดตัว
        </h3>

        <p class="text-4xl font-extrabold text-teal-800 tracking-wider">
          <span class="inline-block px-4 py-1 bg-teal-200 rounded-lg">เร็ว ๆ นี้</span>
        </p>
      </div>

      <div class="mt-8 pt-6 border-t-2 border-dashed border-gray-100 text-sm text-gray-500">
        <p class="font-medium">
          <i class="fas fa-hand-holding-heart mr-1 text-red-500"></i>
          ยกระดับมาตรฐานการดูแลสุขภาพที่ดีที่สุดเพื่อประชาชน
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Logic เดิม
</script>

<style scoped>
/* Custom keyframe for a gentle lift/bounce (สื่อถึงการเปิดตัวจรวด) */
@keyframes bounce-custom {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-12px) rotate(3deg); /* เพิ่มการยกและการหมุนเล็กน้อย */
  }
  50% {
    transform: translateY(0) rotate(-3deg);
  }
}

.animate-bounce-custom {
  animation: bounce-custom 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Shadow 3XL สำหรับการโฮเวอร์ */
.shadow-3xl {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>

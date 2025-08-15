<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto text-center">
      <h2 class="text-3xl font-semibold text-gray-700 mb-8">ข่าวสารและกิจกรรมล่าสุด</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src="https://via.placeholder.com/600x400/f0f0f0/333?Text=News+Image"
            alt="ข่าวสาร"
            class="w-full h-48 object-cover"
          />
          <div class="p-6 text-left">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">กิจกรรมวันสุขภาพโลก</h3>
            <p class="text-gray-600 text-sm mb-4">
              ขอเชิญทุกท่านเข้าร่วมกิจกรรมเนื่องในวันสุขภาพโลก พบกับ...
            </p>
            <a href="#" class="text-blue-500 hover:underline font-semibold">อ่านเพิ่มเติม &rarr;</a>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src="https://via.placeholder.com/600x400/e0e0e0/333?Text=Event+Photo"
            alt="กิจกรรม"
            class="w-full h-48 object-cover"
          />
          <div class="p-6 text-left">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">เปิดให้บริการคลินิกใหม่</h3>
            <p class="text-gray-600 text-sm mb-4">
              โรงพยาบาลของเราได้เปิดให้บริการคลินิกเฉพาะทางใหม่ เพื่อ...
            </p>
            <a href="#" class="text-blue-500 hover:underline font-semibold">อ่านเพิ่มเติม &rarr;</a>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src="https://via.placeholder.com/600x400/d0d0d0/333?Text=Announcement"
            alt="ประกาศ"
            class="w-full h-48 object-cover"
          />
          <div class="p-6 text-left">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">ประกาศเรื่องเวลาทำการ</h3>
            <p class="text-gray-600 text-sm mb-4">
              เนื่องในเทศกาลปีใหม่ โรงพยาบาลจะมีการปรับเปลี่ยนเวลาทำการ...
            </p>
            <a href="#" class="text-blue-500 hover:underline font-semibold">อ่านเพิ่มเติม &rarr;</a>
          </div>
        </div>
      </div>
      <div class="mt-12">
        <button
          class="text-blue-600 hover:text-white hover:bg-blue-700 font-bold py-2 px-6 rounded-full border-2 border-blue-500"
        >
          ดูข่าวสารทั้งหมด
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// ในอนาคตเราสามารถเพิ่ม Logic การดึงข้อมูลข่าวสารจาก API ได้ที่นี่
</script>

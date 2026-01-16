<template>
  <div class="container mx-auto p-8 bg-white rounded-lg shadow-md my-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">คลินิกผู้ป่วยนอก (OPD)</h1>
    <p class="text-gray-700 leading-relaxed mb-4">
      คลินิกผู้ป่วยนอกของโรงพยาบาลแม่แตง ให้บริการตรวจรักษาโรคทั่วไป
      และโรคเฉพาะทางโดยแพทย์ผู้เชี่ยวชาญในสาขาต่างๆ เรามุ่งมั่นที่จะให้บริการที่รวดเร็ว สะดวกสบาย
      และมีคุณภาพ เพื่อให้ผู้ป่วยได้รับการดูแลอย่างเหมาะสมโดยไม่ต้องนอนพักในโรงพยาบาล
    </p>
    <p class="text-gray-700 leading-relaxed mb-6">
      ผู้ป่วยสามารถนัดหมายล่วงหน้า หรือ Walk-in เพื่อรับบริการได้ตามเวลาทำการของแต่ละคลินิก
    </p>

    <h2 class="text-2xl font-semibold text-gray-800 mb-4">คลินิกและบริการหลัก</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-indigo-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
        <i class="fas fa-user-md text-indigo-600 text-4xl mb-3"></i>
        <h3 class="text-xl font-semibold text-indigo-800 mb-2">คลินิกอายุรกรรม</h3>
        <p class="text-gray-700">ตรวจรักษาโรคทั่วไปและโรคเรื้อรัง</p>
      </div>
      <div class="bg-pink-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
        <i class="fas fa-baby text-pink-600 text-4xl mb-3"></i>
        <h3 class="text-xl font-semibold text-pink-800 mb-2">คลินิกกุมารเวชกรรม</h3>
        <p class="text-gray-700">ดูแลสุขภาพเด็กและวัยรุ่น</p>
      </div>
      <div class="bg-cyan-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
        <i class="fas fa-bone text-cyan-600 text-4xl mb-3"></i>
        <h3 class="text-xl font-semibold text-cyan-800 mb-2">คลินิกศัลยกรรมกระดูก</h3>
        <p class="text-gray-700">ตรวจรักษาโรคกระดูกและข้อ</p>
      </div>
      <div class="bg-lime-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
        <i class="fas fa-tooth text-lime-600 text-4xl mb-3"></i>
        <h3 class="text-xl font-semibold text-lime-800 mb-2">คลินิกทันตกรรม</h3>
        <p class="text-gray-700">บริการดูแลสุขภาพช่องปากและฟัน</p>
      </div>
      <div class="bg-rose-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
        <i class="fas fa-heartbeat text-rose-600 text-4xl mb-3"></i>
        <h3 class="text-xl font-semibold text-rose-800 mb-2">คลินิกโรคหัวใจ</h3>
        <p class="text-gray-700">ตรวจรักษาและดูแลผู้ป่วยโรคหัวใจ</p>
      </div>
      <div class="bg-fuchsia-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
        <i class="fas fa-eye text-fuchsia-600 text-4xl mb-3"></i>
        <h3 class="text-xl font-semibold text-fuchsia-800 mb-2">คลินิกจักษุ</h3>
        <p class="text-gray-700">ตรวจรักษาโรคตาและสายตา</p>
      </div>
    </div>

    <!-- <h2 class="text-2xl font-semibold text-gray-800 mb-4">เวลาทำการ (โดยประมาณ)</h2>
    <p class="text-gray-700 mb-6">
      วันจันทร์ - วันศุกร์: 08:00 น. - 16:00 น.
      <br>
      วันเสาร์ - วันอาทิตย์: 09:00 น. - 12:00 น. (เฉพาะบางคลินิก)
    </p> -->

    <div class="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md" role="alert">
      <p class="font-bold">การนัดหมาย:</p>
      <p>เพื่อความสะดวกและลดระยะเวลารอคอย กรุณานัดหมายล่วงหน้าก่อนเข้ารับบริการ</p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>

<template>
  <div class="container mx-auto p-8 bg-white rounded-lg shadow-md my-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">ผู้ป่วยใน</h1>
    <p class="text-gray-700 leading-relaxed mb-4">
      บริการผู้ป่วยในของโรงพยาบาลแม่แตง มุ่งเน้นการดูแลผู้ป่วยอย่างใกล้ชิดและต่อเนื่อง
      โดยทีมแพทย์ พยาบาล และบุคลากรทางการแพทย์ผู้เชี่ยวชาญตลอด 24 ชั่วโมง
      เรามีห้องพักผู้ป่วยที่หลากหลาย เพื่อรองรับความต้องการและงบประมาณที่แตกต่างกัน
    </p>
    <p class="text-gray-700 leading-relaxed mb-6">
      ทุกห้องพักถูกออกแบบมาเพื่อความสะดวกสบายและความปลอดภัยของผู้ป่วย
      พร้อมสิ่งอำนวยความสะดวกที่จำเป็น เพื่อให้ผู้ป่วยฟื้นตัวได้อย่างรวดเร็วและมีคุณภาพชีวิตที่ดีขึ้น
    </p>

    <h2 class="text-2xl font-semibold text-gray-800 mb-4">ประเภทห้องพักผู้ป่วย</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-purple-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
        <i class="fas fa-bed text-purple-600 text-4xl mb-3"></i>
        <h3 class="text-xl font-semibold text-purple-800 mb-2">ห้องรวม</h3>
        <p class="text-gray-700">ห้องพักรวมสำหรับผู้ป่วยหลายท่าน</p>
      </div>
      <div class="bg-teal-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
        <i class="fas fa-bed text-teal-600 text-4xl mb-3"></i>
        <h3 class="text-xl font-semibold text-teal-800 mb-2">ห้องพิเศษ</h3>
        <p class="text-gray-700">ห้องพักส่วนตัว พร้อมสิ่งอำนวยความสะดวกครบครัน</p>
      </div>
      <div class="bg-orange-50 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
        <i class="fas fa-bed text-orange-600 text-4xl mb-3"></i>
        <h3 class="text-xl font-semibold text-orange-800 mb-2">ห้อง VIP</h3>
        <p class="text-gray-700">ห้องพักหรูหรา พร้อมบริการพิเศษ</p>
      </div>
    </div>

    <h2 class="text-2xl font-semibold text-gray-800 mb-4">สิ่งอำนวยความสะดวกในห้องพัก</h2>
    <ul class="list-disc list-inside text-gray-700 space-y-2 mb-6">
      <li>เตียงผู้ป่วยปรับระดับได้</li>
      <li>ห้องน้ำส่วนตัว (สำหรับห้องพิเศษและ VIP)</li>
      <li>โทรทัศน์, ตู้เย็น (สำหรับห้องพิเศษและ VIP)</li>
      <li>ระบบเรียกพยาบาลฉุกเฉิน</li>
      <li>เครื่องปรับอากาศ</li>
      <li>อาหารสำหรับผู้ป่วยตามหลักโภชนาการ</li>
    </ul>

    <div class="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md" role="alert">
      <p class="font-bold">ข้อมูลเพิ่มเติม:</p>
      <p>หากต้องการสอบถามข้อมูลเกี่ยวกับห้องพัก หรือการเข้าพักผู้ป่วยใน โปรดติดต่อแผนกผู้ป่วยใน</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// No specific script logic needed for a static page
</script>

<style scoped>
/* Add specific styles for this page if needed */
</style>

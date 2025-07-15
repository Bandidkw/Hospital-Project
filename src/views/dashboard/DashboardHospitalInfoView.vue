<template>
  <div class="p-4 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">ภาพรวม Dashboard</h1>
    <p class="text-gray-600 mb-6">สรุปข้อมูลและสถานะสำคัญของเว็บไซต์</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- ตัวอย่าง Card สรุปข้อมูล -->
      <div class="bg-blue-100 p-4 rounded-lg shadow flex items-center">
        <i class="fas fa-users text-blue-600 text-3xl mr-4"></i>
        <div>
          <p class="text-gray-600">ผู้ใช้งานทั้งหมด</p>
          <p class="text-2xl font-bold text-blue-800">1,234</p>
        </div>
      </div>
      <div class="bg-green-100 p-4 rounded-lg shadow flex items-center">
        <i class="fas fa-newspaper text-green-600 text-3xl mr-4"></i>
        <div>
          <p class="text-gray-600">ข่าวสารล่าสุด</p>
          <p class="text-2xl font-bold text-green-800">50</p>
        </div>
      </div>
      <div class="bg-yellow-100 p-4 rounded-lg shadow flex items-center">
        <i class="fas fa-hospital-alt text-yellow-600 text-3xl mr-4"></i>
        <div>
          <p class="text-gray-600">บริการที่เปิด</p>
          <p class="text-2xl font-bold text-yellow-800">12</p>
        </div>
      </div>
    </div>
    <!-- คุณสามารถเพิ่มกราฟหรือข้อมูลสรุปอื่นๆ ได้ที่นี่ -->
  </div>
</template>

<script setup lang="ts">
// ไม่มี Logic ซับซ้อนสำหรับหน้าภาพรวม
</script>

<style scoped>
/* สไตล์เฉพาะหน้า Dashboard Home */
</style>

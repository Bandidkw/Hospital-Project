<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-chart-pie mr-3 text-blue-500"></i> ภาพรวม Dashboard
    </h2>
    <p class="text-gray-700 mb-6">ยินดีต้อนรับสู่หน้าภาพรวม Dashboard. คุณสามารถดูสถิติและข้อมูลสำคัญได้ที่นี่.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Card 1: ผู้ใช้งานทั้งหมด -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold mb-2">ผู้ใช้งานทั้งหมด</h3>
          <p class="text-4xl font-bold">1,234</p>
        </div>
        <i class="fas fa-users text-5xl opacity-25"></i>
      </div>

      <!-- Card 2: ข่าวสารล่าสุด -->
      <div class="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold mb-2">ข่าวสารล่าสุด</h3>
          <p class="text-4xl font-bold">50</p>
        </div>
        <i class="fas fa-newspaper text-5xl opacity-25"></i>
      </div>

      <!-- Card 3: บริการที่มีให้ -->
      <div class="bg-gradient-to-br from-yellow-500 to-yellow-700 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold mb-2">บริการที่มีให้</h3>
          <p class="text-4xl font-bold">12</p>
        </div>
        <i class="fas fa-concierge-bell text-5xl opacity-25"></i>
      </div>

      <!-- Card 4: เอกสาร ITA -->
      <div class="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold mb-2">เอกสาร ITA</h3>
          <p class="text-4xl font-bold">35</p>
        </div>
        <i class="fas fa-file-alt text-5xl opacity-25"></i>
      </div>

      <!-- Card 5: สไลด์หน้าแรก -->
      <div class="bg-gradient-to-br from-red-500 to-red-700 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold mb-2">สไลด์หน้าแรก</h3>
          <p class="text-4xl font-bold">5</p>
        </div>
        <i class="fas fa-images text-5xl opacity-25"></i>
      </div>

      <!-- Card 6: ลิงก์ Footer -->
      <div class="bg-gradient-to-br from-teal-500 to-teal-700 text-white p-6 rounded-lg shadow-lg flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold mb-2">ลิงก์ Footer</h3>
          <p class="text-4xl font-bold">8</p>
        </div>
        <i class="fas fa-link text-5xl opacity-25"></i>
      </div>
    </div>

    <!-- Placeholder for a simple chart or recent activity -->
    <div class="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">กิจกรรมล่าสุด</h3>
      <ul class="list-disc list-inside text-gray-700">
        <li>ผู้ดูแลระบบ 'admin' เพิ่มข่าวสารใหม่: "การฉีดวัคซีนไข้หวัดใหญ่" (เมื่อ 2 ชั่วโมงที่แล้ว)</li>
        <li>ผู้ดูแลระบบ 'editor' แก้ไขเอกสาร ITA: "รายงานประจำไตรมาส 1/2568" (เมื่อ 1 วันที่แล้ว)</li>
        <li>ผู้ใช้งานใหม่ลงทะเบียน (เมื่อ 3 วันที่แล้ว)</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// Logic สำหรับ Dashboard Home View
// ในอนาคต อาจจะดึงข้อมูลสรุปจาก API มาแสดงใน Card
</script>

<style scoped>
/* Specific styles for this page */
</style>

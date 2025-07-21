<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-tachometer-alt mr-3 text-blue-500"></i> แดชบอร์ดหลัก
    </h2>
    <p class="text-gray-700 mb-6">ยินดีต้อนรับสู่ระบบจัดการเว็บไซต์โรงพยาบาลแม่แตง. นี่คือภาพรวมของข้อมูลสำคัญ.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-blue-100 p-6 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-blue-800">ข่าวสารทั้งหมด</h3>
          <p class="text-4xl font-bold text-blue-900">125</p>
        </div>
        <i class="fas fa-newspaper text-blue-600 text-5xl opacity-50"></i>
      </div>
      <div class="bg-green-100 p-6 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-green-800">เอกสาร ITA</h3>
          <p class="text-4xl font-bold text-green-900">48</p>
        </div>
        <i class="fas fa-file-alt text-green-600 text-5xl opacity-50"></i>
      </div>
      <div class="bg-yellow-100 p-6 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-yellow-800">ผู้ใช้งานระบบ</h3>
          <p class="text-4xl font-bold text-yellow-900">12</p>
        </div>
        <i class="fas fa-users text-yellow-600 text-5xl opacity-50"></i>
      </div>
      <div class="bg-purple-100 p-6 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-purple-800">บุคลากร</h3>
          <p class="text-4xl font-bold text-purple-900">230</p>
        </div>
        <i class="fas fa-user-md text-purple-600 text-5xl opacity-50"></i>
      </div>
    </div>

    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">การดำเนินการด่วน</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button @click="quickAction('add_news')" class="bg-indigo-500 text-white p-4 rounded-lg shadow hover:bg-indigo-600 transition duration-300 flex items-center justify-center">
          <i class="fas fa-plus-circle mr-2"></i> เพิ่มข่าวสารใหม่
        </button>
        <button @click="quickAction('upload_ita')" class="bg-teal-500 text-white p-4 rounded-lg shadow hover:bg-teal-600 transition duration-300 flex items-center justify-center">
          <i class="fas fa-upload mr-2"></i> อัปโหลดเอกสาร ITA
        </button>
        <button @click="quickAction('view_reports')" class="bg-orange-500 text-white p-4 rounded-lg shadow hover:bg-orange-600 transition duration-300 flex items-center justify-center">
          <i class="fas fa-chart-pie mr-2"></i> ดูรายงานสถิติ
        </button>
      </div>
    </div>

    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">กิจกรรมล่าสุด</h3>
      <ul class="space-y-3">
        <li class="flex items-center text-gray-700">
          <i class="fas fa-check-circle text-green-500 mr-3"></i>
          <span><span class="font-semibold">Admin</span> ได้เพิ่มข่าวสารใหม่: "ประกาศวันหยุดราชการ"</span>
          <span class="ml-auto text-sm text-gray-500">เมื่อ 5 นาทีที่แล้ว</span>
        </li>
        <li class="flex items-center text-gray-700">
          <i class="fas fa-upload text-blue-500 mr-3"></i>
          <span><span class="font-semibold">Editor</span> ได้อัปเดตเอกสาร ITA: "รายงานผลการดำเนินงาน 2567"</span>
          <span class="ml-auto text-sm text-gray-500">เมื่อ 1 ชั่วโมงที่แล้ว</span>
        </li>
        <li class="flex items-center text-gray-700">
          <i class="fas fa-user-plus text-purple-500 mr-3"></i>
          <span>ผู้ใช้งานใหม่ <span class="font-semibold">"พยาบาลวิชาชีพ"</span> ได้รับการเพิ่มในระบบ</span>
          <span class="ml-auto text-sm text-gray-500">เมื่อ 1 วันที่แล้ว</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification'; // นำเข้า useToast
import { useRouter } from 'vue-router'; // นำเข้า useRouter

const toast = useToast(); // สร้าง instance ของ toast
const router = useRouter();

const quickAction = (action: string) => {
  switch (action) {
    case 'add_news':
      toast.info('กำลังนำทางไปยังหน้าเพิ่มข่าวสาร...');
      router.push({ name: 'dashboard-news' });
      break;
    case 'upload_ita':
      toast.info('กำลังนำทางไปยังหน้าจัดการเอกสาร ITA...');
      router.push({ name: 'dashboard-ita' });
      break;
    case 'view_reports':
      toast.info('กำลังนำทางไปยังหน้าดูรายงานสถิติ...');
      router.push({ name: 'dashboard-statistics' });
      break;
    default:
      toast.error('การดำเนินการไม่ถูกต้อง!');
      break;
  }
};
</script>

<style scoped></style>

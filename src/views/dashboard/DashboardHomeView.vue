<!-- DashboardHomeView.vue -->
<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-tachometer-alt mr-3 text-blue-500"></i> แดชบอร์ดหลัก
    </h2>
    <p class="text-gray-700 mb-6">
      ยินดีต้อนรับสู่ระบบจัดการเว็บไซต์โรงพยาบาลแม่แตง. นี่คือภาพรวมของข้อมูลสำคัญ.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 flex flex-col justify-between transform transition-transform duration-300 hover:-translate-y-2"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 font-semibold">ข่าวสารทั้งหมด</p>
            <p class="text-4xl font-bold text-gray-800 mt-2">{{ newsCount }}</p>
          </div>
          <div class="bg-blue-100 text-blue-600 p-3 rounded-full">
            <i class="fas fa-newspaper text-2xl"></i>
          </div>
        </div>
        <a href="#" class="text-blue-500 hover:underline text-sm mt-4">จัดการข่าวสาร &rarr;</a>
      </div>

      <div
        class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 flex flex-col justify-between transform transition-transform duration-300 hover:-translate-y-2"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 font-semibold">เอกสาร ITA</p>
            <p class="text-4xl font-bold text-gray-800 mt-2">{{ itaDocumentCount }}</p>
          </div>
          <div class="bg-green-100 text-green-600 p-3 rounded-full">
            <i class="fas fa-file-alt text-2xl"></i>
          </div>
        </div>
        <a href="/dashboard/ita" class="text-green-500 hover:underline text-sm mt-4"
          >จัดการ ITA &rarr;</a
        >
      </div>

      <div
        class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500 flex flex-col justify-between transform transition-transform duration-300 hover:-translate-y-2"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 font-semibold">ผู้ใช้งานระบบ</p>
            <p class="text-4xl font-bold text-gray-800 mt-2">{{ userCount }}</p>
          </div>
          <div class="bg-yellow-100 text-yellow-600 p-3 rounded-full">
            <i class="fas fa-users text-2xl"></i>
          </div>
        </div>
        <a href="#" class="text-yellow-500 hover:underline text-sm mt-4">จัดการผู้ใช้ &rarr;</a>
      </div>

      <div
        class="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500 flex flex-col justify-between transform transition-transform duration-300 hover:-translate-y-2"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-gray-500 font-semibold">บุคลากร</p>
            <p class="text-4xl font-bold text-gray-800 mt-2">{{ personnelCount }}</p>
          </div>
          <div class="bg-purple-100 text-purple-600 p-3 rounded-full">
            <i class="fas fa-user-md text-2xl"></i>
          </div>
        </div>
        <a href="#" class="text-purple-500 hover:underline text-sm mt-4">จัดการบุคลากร &rarr;</a>
      </div>
    </div>

    <!-- ส่วน "การดำเนินการด่วน" - แสดงเฉพาะผู้ดูแลระบบและผู้ดูแลระบบสูงสุดเท่านั้น -->
    <div
      v-if="authStore.isAdmin || authStore.isSuperAdmin"
      class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8"
    >
      <h3 class="text-xl font-semibold text-gray-800 mb-4">การดำเนินการด่วน</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          v-if="authStore.isSuperAdmin"
          @click="quickAction('add_news')"
          class="bg-indigo-500 text-white p-4 rounded-lg shadow hover:bg-indigo-600 transition duration-300 flex items-center justify-center"
        >
          <i class="fas fa-plus-circle mr-2"></i> เพิ่มข่าวสารใหม่
        </button>
        <button
          @click="quickAction('upload_ita')"
          class="bg-teal-500 text-white p-4 rounded-lg shadow hover:bg-teal-600 transition duration-300 flex items-center justify-center"
        >
          <i class="fas fa-upload mr-2"></i> อัปโหลดเอกสาร ITA
        </button>
        <button
          v-if="authStore.isSuperAdmin"
          @click="quickAction('view_reports')"
          class="bg-orange-500 text-white p-4 rounded-lg shadow hover:bg-orange-600 transition duration-300 flex items-center justify-center"
        >
          <i class="fas fa-chart-pie mr-2"></i> ดูรายงานสถิติ
        </button>
      </div>
    </div>

    <!-- ส่วน "การดำเนินการด่วน" สำหรับผู้ใช้ทั่วไป - ตัวอย่างสิ่งที่พวกเขาอาจเห็น -->
    <div v-else-if="authStore.isUser" class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">เข้าถึงส่วนที่ได้รับอนุญาต</h3>
      <p class="text-gray-700">คุณมีสิทธิ์เข้าถึงข้อมูลเบื้องต้นของระบบ</p>
      <!-- คุณสามารถเพิ่มปุ่มเฉพาะสำหรับผู้ใช้ทั่วไปได้ที่นี่ -->
      <button
        @click="quickAction('view_my_docs')"
        class="bg-green-500 text-white p-4 rounded-lg shadow hover:bg-green-600 transition duration-300 flex items-center justify-center mt-4"
      >
        <i class="fas fa-folder-open mr-2"></i> ดูเอกสารส่วนตัว
      </button>
    </div>

    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">กิจกรรมล่าสุด</h3>
      <!-- ตัวอย่างการแสดงผลแบบมีเงื่อนไขสำหรับรายการเฉพาะ -->
      <ul class="space-y-3">
        <li
          v-if="authStore.isAdmin || authStore.isSuperAdmin"
          class="flex items-center text-gray-700"
        >
          <i class="fas fa-check-circle text-green-500 mr-3"></i>
          <span
            ><span class="font-semibold">Admin</span> ได้เพิ่มข่าวสารใหม่:
            "ประกาศวันหยุดราชการ"</span
          >
          <span class="ml-auto text-sm text-gray-500">เมื่อ 5 นาทีที่แล้ว</span>
        </li>
        <li class="flex items-center text-gray-700">
          <i class="fas fa-upload text-blue-500 mr-3"></i>
          <span
            ><span class="font-semibold">Editor</span> ได้อัปเดตเอกสาร ITA: "รายงานผลการดำเนินงาน
            2567"</span
          >
          <span class="ml-auto text-sm text-gray-500">เมื่อ 1 ชั่วโมงที่แล้ว</span>
        </li>
        <li class="flex items-center text-gray-700">
          <i class="fas fa-user-plus text-purple-500 mr-3"></i>
          <span
            >ผู้ใช้งานใหม่
            <span class="font-semibold">"พยาบาลวิชาชีพ"</span> ได้รับการเพิ่มในระบบ</span
          >
          <span class="ml-auto text-sm text-gray-500">เมื่อ 1 วันที่แล้ว</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

// ค่าถูกดึงมาจาก API
const newsCount = ref(125)
const itaDocumentCount = ref(48)
const userCount = ref(12)
const personnelCount = ref(230)

const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()

const quickAction = (action: string) => {
  switch (action) {
    case 'add_news':
      // ตรวจสอบบทบาทก่อนอนุญาตให้ดำเนินการ
      if (authStore.isSuperAdmin) {
        toast.info('กำลังนำทางไปยังหน้าเพิ่มข่าวสาร...')
        router.push({ name: 'dashboard-news' })
      } else {
        toast.error('คุณไม่มีสิทธิ์เข้าถึงส่วนนี้!')
      }
      break
    case 'upload_ita':
      // ตรวจสอบบทบาทก่อนอนุญาตให้ดำเนินการ
      if (authStore.isAdmin || authStore.isSuperAdmin) {
        toast.info('กำลังนำทางไปยังหน้าจัดการเอกสาร ITA...')
        router.push({ name: 'dashboard-ita' })
      } else {
        toast.error('คุณไม่มีสิทธิ์เข้าถึงส่วนนี้!')
      }
      break
    case 'view_reports':
      // ตรวจสอบบทบาทก่อนอนุญาตให้ดำเนินการ
      if (authStore.isSuperAdmin) {
        toast.info('กำลังนำทางไปยังหน้าดูรายงานสถิติ...')
        router.push({ name: 'dashboard-statistics' })
      } else {
        toast.error('คุณไม่มีสิทธิ์เข้าถึงส่วนนี้!')
      }
      break
    case 'view_my_docs':
      // ตรวจสอบบทบาทสำหรับผู้ใช้ทั่วไป
      if (authStore.isUser) {
        toast.info('กำลังนำทางไปยังหน้าเอกสารส่วนตัว...')
        router.push({ name: 'user-docs' }) // สมมติว่าคุณมี route ชื่อ 'user-docs'
      } else {
        toast.error('คุณไม่มีสิทธิ์เข้าถึงส่วนนี้!')
      }
      break
    default:
      toast.error('การดำเนินการไม่ถูกต้อง!')
      break
  }
}
</script>

<style scoped></style>

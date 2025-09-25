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

      <!-- <div
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
      </div> -->

      <!-- <div
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
      </div> -->
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

    <!-- <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold ...">กิจกรรมล่าสุดในระบบ</h3>

      <div class="relative space-y-6">
        <div class="absolute left-4 top-4 h-full border-l-2 border-gray-200"></div>

        <div
          v-for="activity in recentActivities"
          :key="activity.id"
          class="relative flex items-start pl-12"
        >
          <div
            class="absolute left-0 top-1.5 flex items-center justify-center w-8 h-8 rounded-full"
            :class="getActivityIcon(activity.action_type).bgClass"
          >
            <i
              class="fas"
              :class="[
                getActivityIcon(activity.action_type).iconClass,
                getActivityIcon(activity.action_type).colorClass,
              ]"
            ></i>
          </div>
          <div>
            <p class="text-gray-800" v-html="formatActivityMessage(activity)"></p>
            <p class="text-sm text-gray-500 mt-1">{{ formatRelativeTime(activity.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
// import { activityService } from '@/services/activityService'; // ปิดไว้ก่อน เพราะเราจะใช้ข้อมูลจำลอง
import type { ActivityLog } from '@/types/main'

const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()

// --- State ---
const newsCount = ref(0)
const itaDocumentCount = ref(0)
const userCount = ref(0)
const personnelCount = ref(0)

const recentActivities = ref<ActivityLog[]>([])
const isLoadingActivities = ref(true)

// --- ข้อมูลจำลอง (เก็บไว้แค่อันเดียว) ---
const mockActivities: ActivityLog[] = [
  {
    id: 1,
    user_name: 'SuperAdmin',
    action_type: 'CREATE',
    target_type: 'ข่าวสาร',
    target_name: 'ประกาศวันหยุดราชการ',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 นาทีที่แล้ว
  },
  {
    id: 2,
    user_name: 'Admin',
    action_type: 'UPDATE',
    target_type: 'เอกสาร ITA',
    target_name: 'รายงานผลการดำเนินงาน 2567',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 ชั่วโมงที่แล้ว
  },
  {
    id: 3,
    user_name: 'SuperAdmin',
    action_type: 'DELETE',
    target_type: 'ผู้ใช้งาน',
    target_name: 'user_test',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 วันที่แล้ว
  },
]

// --- API Functions ---
const fetchSummaryData = async () => {
  try {
    newsCount.value = 0
    itaDocumentCount.value = 0
    userCount.value = 12
    personnelCount.value = 230
  } catch (error) {
    console.error('Failed to fetch summary data:', error)
    toast.error('ไม่สามารถโหลดข้อมูลสรุปได้')
  }
}

// ฟังก์ชันดึงข้อมูลกิจกรรม (เก็บไว้แค่อันเดียว และใช้ข้อมูลจำลอง)
const fetchRecentActivities = async () => {
  isLoadingActivities.value = true
  try {
    // ปิดการเรียก API จริง
    // recentActivities.value = await activityService.getRecentActivities();

    // หันมาใช้ข้อมูลจำลองแทน
    await new Promise((resolve) => setTimeout(resolve, 500)) // จำลองการดีเลย์
    recentActivities.value = mockActivities
  } catch (error) {
    console.error('Failed to fetch recent activities:', error)
    toast.error('ไม่สามารถโหลดข้อมูลกิจกรรมล่าสุดได้')
  } finally {
    isLoadingActivities.value = false
  }
}

// --- Helper Functions for UI (ส่วนที่ต้องมี) ---
// const getActivityIcon = (actionType: ActivityLog['action_type']) => {
//   switch (actionType) {
//     case 'CREATE':
//       return { bgClass: 'bg-green-100', iconClass: 'fa-plus', colorClass: 'text-green-500' }
//     case 'UPDATE':
//       return { bgClass: 'bg-blue-100', iconClass: 'fa-edit', colorClass: 'text-blue-500' }
//     case 'DELETE':
//       return { bgClass: 'bg-red-100', iconClass: 'fa-trash', colorClass: 'text-red-500' }
//     default:
//       return { bgClass: 'bg-gray-100', iconClass: 'fa-info-circle', colorClass: 'text-gray-500' }
//   }
// }

// const formatActivityMessage = (activity: ActivityLog) => {
//   const user = `<span class="font-bold">${activity.user_name}</span>`
//   const target = `<span class="font-semibold text-gray-900">"${activity.target_name || ''}"</span>`

//   switch (activity.action_type) {
//     case 'CREATE':
//       return `${user} ได้สร้าง ${activity.target_type} ใหม่: ${target}`
//     case 'UPDATE':
//       return `${user} ได้แก้ไข ${activity.target_type}: ${target}`
//     case 'DELETE':
//       return `${user} ได้ลบ ${activity.target_type}: ${target}`
//     default:
//       return activity.details || 'กิจกรรมที่ไม่รู้จัก'
//   }
// }

// const formatRelativeTime = (dateString: string) => {
//   const date = new Date(dateString)
//   const now = new Date()
//   const seconds = Math.round((now.getTime() - date.getTime()) / 1000)
//   const minutes = Math.round(seconds / 60)
//   const hours = Math.round(minutes / 60)
//   const days = Math.round(hours / 24)

//   if (seconds < 60) return 'เมื่อสักครู่'
//   if (minutes < 60) return `เมื่อ ${minutes} นาทีที่แล้ว`
//   if (hours < 24) return `เมื่อ ${hours} ชั่วโมงที่แล้ว`
//   return `เมื่อ ${days} วันที่แล้ว`
// }

// --- Navigation ---
const quickAction = (action: string) => {
  switch (action) {
    case 'add_news':
      if (authStore.isSuperAdmin) {
        router.push({ name: 'dashboard-news' })
      } else {
        toast.error('คุณไม่มีสิทธิ์เข้าถึงส่วนนี้!')
      }
      break
    case 'upload_ita':
      if (authStore.isAdmin || authStore.isSuperAdmin) {
        router.push({ name: 'dashboard-ita' })
      } else {
        toast.error('คุณไม่มีสิทธิ์เข้าถึงส่วนนี้!')
      }
      break
    case 'view_reports':
      if (authStore.isSuperAdmin) {
        router.push({ name: 'dashboard-statistics' })
      } else {
        toast.error('คุณไม่มีสิทธิ์เข้าถึงส่วนนี้!')
      }
      break
    case 'view_my_docs':
      if (authStore.isUser) {
        toast.warning('หน้านี้ยังอยู่ในระหว่างการพัฒนา')
      } else {
        toast.error('คุณไม่มีสิทธิ์เข้าถึงส่วนนี้!')
      }
      break
    default:
      toast.error('การดำเนินการไม่ถูกต้อง!')
      break
  }
}

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchSummaryData()
  fetchRecentActivities()
})
</script>
<style scoped></style>

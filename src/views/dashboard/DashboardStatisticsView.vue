<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-chart-bar mr-3 text-blue-600"></i> สถิติและการวิเคราะห์
    </h2>
    <p class="text-gray-700 mb-6">หน้าสรุปข้อมูลการใช้งานเว็บไซต์และระบบ</p>

    <div v-if="loading" class="text-center py-10">
      <i class="fas fa-spinner fa-spin text-5xl text-blue-500"></i>
      <p class="mt-4 text-lg text-gray-600">กำลังโหลดข้อมูลสถิติ...</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-blue-50 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <p class="text-sm font-medium text-blue-700">ผู้เยี่ยมชมเว็บไซต์ (วันนี้)</p>
          <p class="text-3xl font-extrabold text-gray-900 mt-1">
            {{ summary.dailyVisitors.toLocaleString() }}
          </p>
          <p class="text-xs text-blue-500 mt-1">เทียบกับเมื่อวาน: {{ summary.dailyChange }}%</p>
        </div>

        <div class="bg-green-50 p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <p class="text-sm font-medium text-green-700">จำนวนดาวน์โหลด ITA (ทั้งหมด)</p>
          <p class="text-3xl font-extrabold text-gray-900 mt-1">
            {{ summary.itaDownloads.toLocaleString() }}
          </p>
          <p class="text-xs text-green-500 mt-1">
            เดือนนี้: {{ summary.monthlyItaDownloads.toLocaleString() }} ครั้ง
          </p>
        </div>
      </div>

      <div class="card bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">เมนูที่เข้าชมยอดนิยม (5 อันดับแรก)</h3>
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead class="bg-gray-100">
            <tr>
              <th class="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase">เมนู</th>
              <th class="py-3 px-6 text-center text-xs font-medium text-gray-600 uppercase">
                ยอดเข้าชม (ครั้ง)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in topMenus" :key="index" class="border-b hover:bg-gray-50">
              <td class="py-3 px-6 text-left font-medium">{{ item.menu }}</td>
              <td class="py-3 px-6 text-center text-gray-700">{{ item.views.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="topMenus.length === 0" class="text-center py-4 text-gray-500">
          ไม่พบข้อมูลการเข้าถึงเมนู
        </div>
      </div>

      <div class="mt-8 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p class="font-semibold text-gray-700 mb-2">ข้อมูลเชิงลึกเพิ่มเติม</p>
        <p class="text-sm text-gray-600">
          หน้านี้แสดงข้อมูลสถิติที่ประมวลผลภายในระบบเท่านั้น สำหรับข้อมูลที่ละเอียดกว่า (เช่น
          กราฟรายเดือน/รายปี) จะต้องมีการพัฒนา Backend เพิ่มเติมเพื่อจัดการ Log ข้อมูลเหล่านั้น
        </p>
        <a
          href="#"
          class="mt-3 inline-block bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition duration-300"
        >
          <i class="fas fa-cogs mr-2"></i> ข้อมูลการใช้งานระบบ (Log)
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
// 🟢 Import Type และ Service ที่สร้างใหม่
import type { SummaryStats, TopMenuItem } from '@/types/statistics'
import { fetchStatistics } from '@/services/statisticsService'

const toast = useToast()

const summary = ref<SummaryStats>({
  dailyVisitors: 0,
  dailyChange: '0%',
  itaDownloads: 0,
  monthlyItaDownloads: 0,
})

const topMenus = ref<TopMenuItem[]>([])
const loading = ref(true)

const fetchStats = async () => {
  loading.value = true
  try {
    const data = await fetchStatistics()
    summary.value = data.summary
    topMenus.value = data.topMenus
  } catch (e) {
    toast.error('ไม่สามารถโหลดข้อมูลสถิติได้')
    console.error('Fetch stats failed:', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchStats)
</script>

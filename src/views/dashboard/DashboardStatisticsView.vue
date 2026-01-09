<template>
  <div class="p-6 bg-slate-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 class="text-3xl font-extrabold text-slate-800 flex items-center tracking-tight">
            <span class="p-2 bg-blue-600 rounded-lg mr-4 shadow-lg shadow-blue-200">
              <i class="fas fa-chart-line text-white text-xl"></i>
            </span>
            สถิติและการวิเคราะห์ระบบ
          </h2>
          <p class="text-slate-500 mt-1 font-medium">
            ข้อมูลจำลองสรุปภาพรวมและแนวโน้มการใช้งานเว็บไซต์
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="fetchStats"
            class="bg-white text-slate-700 px-4 py-2 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all flex items-center font-semibold"
            :disabled="loading"
          >
            <i class="fas fa-sync-alt mr-2" :class="{ 'fa-spin': loading }"></i> รีเฟรชข้อมูล
          </button>
        </div>
      </div>

      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100"
      >
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
          <div
            class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
          ></div>
        </div>
        <p class="mt-6 text-slate-600 font-bold text-lg">กำลังประมวลผลข้อมูลสถิติ...</p>
      </div>

      <div v-else>
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <i class="fas fa-users"></i>
              </div>
              <span class="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">
                {{ summary.dailyChange }}%
              </span>
            </div>
            <p class="text-sm font-semibold text-slate-500">ผู้เยี่ยมชม (วันนี้)</p>
            <p class="text-2xl font-black text-slate-800 mt-1">
              {{ summary.dailyVisitors.toLocaleString() }}
            </p>
          </div>

          <div
            class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <i class="fas fa-file-download"></i>
              </div>
            </div>
            <p class="text-sm font-semibold text-slate-500">ดาวน์โหลด ITA (ทั้งหมด)</p>
            <p class="text-2xl font-black text-slate-800 mt-1">
              {{ summary.itaDownloads.toLocaleString() }}
            </p>
          </div>

          <div
            class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="p-2 bg-green-50 text-green-600 rounded-lg">
                <i class="fas fa-calendar-check"></i>
              </div>
            </div>
            <p class="text-sm font-semibold text-slate-500">ITA เดือนนี้</p>
            <p class="text-2xl font-black text-slate-800 mt-1">
              {{ summary.monthlyItaDownloads.toLocaleString() }}
            </p>
          </div>

          <div
            class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <i class="fas fa-mouse-pointer"></i>
              </div>
            </div>
            <p class="text-sm font-semibold text-slate-500">ยอดวิวมวลรวม</p>
            <p class="text-2xl font-black text-slate-800 mt-1">142,850</p>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <!-- Line Chart: Trends -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-bold text-slate-800">แนวโน้มผู้เข้าใช้งาน (7 วันล่าสุด)</h3>
              <span class="text-xs font-semibold text-slate-400">อัปเดตรายวัน</span>
            </div>
            <apexchart
              type="area"
              height="300"
              :options="lineChartOptions"
              :series="lineChartSeries"
            ></apexchart>
          </div>

          <!-- Pie Chart: Distribution -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 class="text-lg font-bold text-slate-800 mb-6">สัดส่วนการเข้าถึงข้อมูล</h3>
            <div class="flex justify-center items-center h-[300px]">
              <apexchart
                type="donut"
                width="380"
                :options="pieChartOptions"
                :series="pieChartSeries"
              ></apexchart>
            </div>
          </div>

          <!-- Bar Chart: Top Menus -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
            <h3 class="text-lg font-bold text-slate-800 mb-6">
              เมนูที่เข้าชมยอดนิยม (ยอดรวมแบบเรียลไทม์)
            </h3>
            <apexchart
              type="bar"
              height="350"
              :options="barChartOptions"
              :series="barChartSeries"
            ></apexchart>
          </div>
        </div>

        <!-- Footer Info -->
        <div
          class="bg-blue-900 rounded-2xl p-8 overflow-hidden relative shadow-xl shadow-blue-100 mb-8"
        >
          <div class="relative z-10 max-w-2xl">
            <h4 class="text-white text-xl font-bold mb-2">
              กำลังอยู่ในช่วงทดสอบระบบวิเคราะห์ข้อมูล
            </h4>
            <p class="text-blue-200 text-sm leading-relaxed mb-6">
              ขณะนี้ระบบแสดงผลโดยใช้ข้อมูลสำหรับการจำลอง (Mock Data)
              เพื่อปรับแต่งดีไซน์กราฟให้เหมาะสมสอดคล้องกับความต้องการของโรงพยาบาล หากต้องการดู Log
              กิจกรรมแบบละเอียดรายวินาที สามารถกดปุ่มด้านล่างเพื่อไปยังหน้า Audit Logs ได้ทันที
            </p>
            <router-link
              to="/dashboard/audit-logs"
              class="inline-flex items-center bg-white text-blue-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg"
            >
              <i class="fas fa-list-ul mr-2"></i> ดูบันทึกกิจกรรมทั้งหมด
            </router-link>
          </div>
          <!-- Abstract Background Decor -->
          <div
            class="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl"
          ></div>
          <div
            class="absolute bottom-0 right-0 w-48 h-48 bg-blue-700 rounded-full mr-10 mb-[-100px] opacity-30 blur-2xl"
          ></div>
          <i
            class="fas fa-chart-pie absolute bottom-6 right-8 text-white/5 text-9xl transform rotate-12"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import VueApexCharts from 'vue3-apexcharts'
import type { SummaryStats, TopMenuItem, StatisticsData } from '@/types/statistics'
import { fetchStatistics } from '@/services/statisticsService'

// Register component
const apexchart = VueApexCharts

const toast = useToast()

const summary = ref<SummaryStats>({
  dailyVisitors: 0,
  dailyChange: '0',
  itaDownloads: 0,
  monthlyItaDownloads: 0,
})

const topMenus = ref<TopMenuItem[]>([])
const trends = ref({ dates: [] as string[], visitors: [] as number[] })
const distribution = ref({ labels: [] as string[], values: [] as number[] })
const loading = ref(true)

// --- Chart Options & Series (Computed) ---

// 1. Line Chart (Visitors Trend)
const lineChartOptions = computed(() => ({
  chart: {
    id: 'visitor-trends',
    toolbar: { show: false },
    fontFamily: 'Sarabun, sans-serif',
  },
  colors: ['#2563eb'],
  stroke: { curve: 'smooth' as const, width: 4 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
      stops: [0, 90, 100],
    },
  },
  xaxis: {
    categories: trends.value.dates,
    labels: { style: { colors: '#94a3b8', fontWeight: 500 } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: { style: { colors: '#94a3b8', fontWeight: 500 } },
  },
  dataLabels: { enabled: false },
  grid: {
    borderColor: '#f1f5f9',
    strokeDashArray: 4,
  },
  tooltip: {
    theme: 'light',
    x: { show: true },
    y: { formatter: (val: number) => `${val.toLocaleString()} ครั้ง` },
  },
}))

const lineChartSeries = computed(() => [
  {
    name: 'ผู้เยี่ยมชม',
    data: trends.value.visitors,
  },
])

// 2. Pie Chart (Distribution)
const pieChartOptions = computed(() => ({
  labels: distribution.value.labels,
  colors: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#d1e9ff'],
  chart: { fontFamily: 'Sarabun, sans-serif' },
  legend: { position: 'bottom' as const },
  stroke: { show: false },
  dataLabels: { enabled: true, dropShadow: { enabled: false } },
}))

const pieChartSeries = computed(() => distribution.value.values)

// 3. Bar Chart (Top Menus)
const barChartOptions = computed(() => ({
  chart: {
    toolbar: { show: false },
    fontFamily: 'Sarabun, sans-serif',
  },
  plotOptions: {
    bar: {
      borderRadius: 12,
      columnWidth: '45%',
      distributed: true,
    },
  },
  colors: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
  dataLabels: { enabled: false },
  legend: { show: false },
  xaxis: {
    categories: topMenus.value.map((item) => item.menu),
    labels: { style: { colors: '#64748b', fontWeight: 600, fontSize: '12px' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: { style: { colors: '#94a3b8' } },
  },
  grid: {
    borderColor: '#f1f5f9',
    xaxis: { lines: { show: false } },
  },
}))

const barChartSeries = computed(() => [
  {
    name: 'ยอดเข้าชม',
    data: topMenus.value.map((item) => item.views),
  },
])

// --- Methods ---
const fetchStats = async () => {
  loading.value = true
  try {
    const data: StatisticsData = await fetchStatistics()
    summary.value = data.summary
    topMenus.value = data.topMenus
    trends.value = data.trends
    distribution.value = data.distribution
  } catch (e) {
    toast.error('ไม่สามารถโหลดข้อมูลสถิติได้')
    console.error('Fetch stats failed:', e)
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 800)
  }
}

onMounted(fetchStats)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@100;300;400;500;600;700;800&display=swap');

.max-w-7xl {
  font-family: 'Sarabun', sans-serif !important;
}
</style>

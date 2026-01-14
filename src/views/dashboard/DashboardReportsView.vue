<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-chart-line mr-3 text-cyan-500"></i> รายงาน
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับสร้างและดูรายงานต่างๆ ของระบบ.</p>

    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">สร้างรายงาน</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Custom Report Type Dropdown -->
        <div class="relative">
          <label for="reportType" class="block text-sm font-medium text-gray-700 mb-2">
            ประเภทรายงาน:<span class="text-red-500">*</span>
          </label>

          <!-- Custom Trigger -->
          <div
            id="reportType"
            class="premium-input flex items-center justify-between cursor-pointer bg-white relative z-0"
            :class="{
              'border-blue-500 ring-4 ring-blue-500/10': isReportTypeDropdownOpen,
            }"
            @click="isReportTypeDropdownOpen = !isReportTypeDropdownOpen"
            tabindex="0"
            @blur="onBlurReportType"
          >
            <span class="text-slate-700 font-medium">
              {{ getReportTypeLabel(reportForm.type) || 'เลือกประเภทรายงาน...' }}
            </span>
            <span
              class="transition-transform duration-300 text-slate-400"
              :class="{ 'rotate-180 text-blue-500': isReportTypeDropdownOpen }"
            >
              <i class="fas fa-chevron-down text-xs"></i>
            </span>
          </div>

          <!-- Custom Menu -->
          <transition name="dropdown-scale">
            <ul
              v-if="isReportTypeDropdownOpen"
              class="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1.5 origin-top"
            >
              <li
                v-for="reportType in reportTypes"
                :key="reportType.value"
                @click.stop="selectReportType(reportType.value)"
                class="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between group/item transition-colors"
                :class="{ 'bg-blue-50/50': reportForm.type === reportType.value }"
              >
                <div class="flex items-center gap-3">
                  <span
                    class="w-2 h-2 rounded-full bg-slate-200 transition-colors group-hover/item:bg-blue-400"
                    :class="{ '!bg-blue-600': reportForm.type === reportType.value }"
                  ></span>
                  <div class="flex items-center gap-2">
                    <i
                      :class="reportType.icon"
                      class="text-sm text-slate-500 group-hover/item:text-blue-600"
                    ></i>
                    <span
                      class="text-slate-600 group-hover/item:text-blue-700"
                      :class="{
                        'font-semibold text-blue-700': reportForm.type === reportType.value,
                      }"
                    >
                      {{ reportType.label }}
                    </span>
                  </div>
                </div>
                <i
                  v-if="reportForm.type === reportType.value"
                  class="fas fa-check text-blue-600 text-sm"
                ></i>
              </li>
            </ul>
          </transition>
        </div>
        <div>
          <label for="dateRange" class="block text-sm font-medium text-gray-700">ช่วงวันที่:</label>
          <input
            type="date"
            id="startDate"
            v-model="reportForm.startDate"
            class="mt-1 block w-full md:w-1/2 inline-block border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span class="mx-2 text-gray-600">-</span>
          <input
            type="date"
            id="endDate"
            v-model="reportForm.endDate"
            class="mt-1 block w-full md:w-1/2 inline-block border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div class="flex justify-end mt-6">
        <button
          @click="generateReport"
          class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          <i class="fas fa-file-export mr-2"></i> สร้างรายงาน
        </button>
      </div>
    </div>

    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รายงานที่สร้างล่าสุด</h3>
      <div v-if="generatedReports.length > 0" class="space-y-4">
        <div
          v-for="report in generatedReports"
          :key="report.id"
          class="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm"
        >
          <div>
            <p class="font-semibold text-gray-800">{{ report.name }}</p>
            <p class="text-sm text-gray-600">
              ประเภท: {{ report.type }} | วันที่สร้าง: {{ report.date }}
            </p>
          </div>
          <a
            :href="report.url"
            target="_blank"
            class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
          >
            <i class="fas fa-download mr-2"></i> ดาวน์โหลด
          </a>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 py-8">
        <p>ยังไม่มีรายงานที่สร้างในขณะนี้.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification' // นำเข้า useToast

const toast = useToast()

interface Report {
  id: number
  name: string
  type: string
  date: string
  url: string
}

interface ReportTypeOption {
  value: string
  label: string
  icon: string
}

// Report Types with Icons
const reportTypes: ReportTypeOption[] = [
  { value: 'user_activity', label: 'รายงานกิจกรรมผู้ใช้งาน', icon: 'fas fa-users' },
  { value: 'news_summary', label: 'รายงานสรุปข่าวสาร', icon: 'fas fa-newspaper' },
  { value: 'ita_documents', label: 'รายงานเอกสาร ITA', icon: 'fas fa-file-alt' },
]

const reportForm = ref({
  type: '',
  startDate: '',
  endDate: '',
})

const generatedReports = ref<Report[]>([])

// Custom Dropdown State
const isReportTypeDropdownOpen = ref(false)

// Custom Dropdown Methods
const selectReportType = (value: string) => {
  reportForm.value.type = value
  isReportTypeDropdownOpen.value = false
}

const onBlurReportType = (event: FocusEvent) => {
  const relatedTarget = event.relatedTarget as HTMLElement
  if (!relatedTarget || !relatedTarget.closest('.absolute')) {
    setTimeout(() => {
      isReportTypeDropdownOpen.value = false
    }, 200)
  }
}

const getReportTypeLabel = (value: string): string => {
  const reportType = reportTypes.find((rt) => rt.value === value)
  return reportType ? reportType.label : ''
}

const generateReport = () => {
  if (!reportForm.value.type) {
    toast.error('กรุณาเลือกประเภทรายงาน!') // เปลี่ยนจาก alert เป็น toast.error
    return
  }
  // In a real application, this would trigger a backend process
  // to generate the report and return a download link.
  console.log('Generating report:', reportForm.value)

  const newReport: Report = {
    id:
      generatedReports.value.length > 0
        ? Math.max(...generatedReports.value.map((r) => r.id)) + 1
        : 1,
    name: `รายงาน ${reportForm.value.type} (${reportForm.value.startDate} - ${reportForm.value.endDate})`,
    type: reportForm.value.type,
    date: new Date().toISOString().split('T')[0],
    url: 'https://www.africau.edu/images/default/sample.pdf', // Placeholder URL
  }
  generatedReports.value.push(newReport)
  toast.success('สร้างรายงานสำเร็จ! สามารถดาวน์โหลดได้จากรายการด้านล่าง.') // เปลี่ยนจาก alert เป็น toast.success
  resetReportForm()
}

const resetReportForm = () => {
  reportForm.value = { type: '', startDate: '', endDate: '' }
}

// In a real application, you might fetch a list of recent reports on mount
// onMounted(() => {
//   fetchRecentReports();
// });
// const fetchRecentReports = async () => { /* ... */ };
</script>

<style scoped>
/* Custom Dropdown Styles */
.premium-input {
  @apply shadow-sm border-2 border-slate-200 rounded-xl px-4 py-3
         transition-all duration-200 ease-in-out
         hover:border-slate-300 hover:shadow-md;
}

.premium-input:focus {
  @apply outline-none;
}

/* Dropdown Scale Animation */
.dropdown-scale-enter-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dropdown-scale-leave-active {
  transition: all 0.15s cubic-bezier(0.4, 0, 1, 1);
}

.dropdown-scale-enter-from {
  opacity: 0;
  transform: scaleY(0.8) translateY(-10px);
}

.dropdown-scale-leave-to {
  opacity: 0;
  transform: scaleY(0.95) translateY(-5px);
}
</style>

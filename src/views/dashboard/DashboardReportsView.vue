<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-chart-line mr-3 text-cyan-500"></i> รายงาน
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับสร้างและดูรายงานต่างๆ ของระบบ.</p>

    <!-- Report Generation Options -->
    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">สร้างรายงาน</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="reportType" class="block text-sm font-medium text-gray-700">ประเภทรายงาน:</label>
          <select id="reportType" v-model="reportForm.type" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">-- เลือกประเภทรายงาน --</option>
            <option value="user_activity">รายงานกิจกรรมผู้ใช้งาน</option>
            <option value="news_summary">รายงานสรุปข่าวสาร</option>
            <option value="ita_documents">รายงานเอกสาร ITA</option>
            <!-- Add more report types -->
          </select>
        </div>
        <div>
          <label for="dateRange" class="block text-sm font-medium text-gray-700">ช่วงวันที่:</label>
          <input type="date" id="startDate" v-model="reportForm.startDate" class="mt-1 block w-full md:w-1/2 inline-block border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
          <span class="mx-2 text-gray-600">-</span>
          <input type="date" id="endDate" v-model="reportForm.endDate" class="mt-1 block w-full md:w-1/2 inline-block border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
      </div>
      <div class="flex justify-end mt-6">
        <button @click="generateReport" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
          <i class="fas fa-file-export mr-2"></i> สร้างรายงาน
        </button>
      </div>
    </div>

    <!-- Generated Reports List (Placeholder) -->
    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รายงานที่สร้างล่าสุด</h3>
      <div v-if="generatedReports.length > 0" class="space-y-4">
        <div v-for="report in generatedReports" :key="report.id" class="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm">
          <div>
            <p class="font-semibold text-gray-800">{{ report.name }}</p>
            <p class="text-sm text-gray-600">ประเภท: {{ report.type }} | วันที่สร้าง: {{ report.date }}</p>
          </div>
          <a :href="report.url" target="_blank" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300">
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
import { ref } from 'vue';

interface Report {
  id: number;
  name: string;
  type: string;
  date: string;
  url: string;
}

const reportForm = ref({
  type: '',
  startDate: '',
  endDate: '',
});

const generatedReports = ref<Report[]>([]);

const generateReport = () => {
  if (!reportForm.value.type) {
    alert('กรุณาเลือกประเภทรายงาน!');
    return;
  }
  // In a real application, this would trigger a backend process
  // to generate the report and return a download link.
  console.log('Generating report:', reportForm.value);

  const newReport: Report = {
    id: generatedReports.value.length > 0 ? Math.max(...generatedReports.value.map(r => r.id)) + 1 : 1,
    name: `รายงาน ${reportForm.value.type} (${reportForm.value.startDate} - ${reportForm.value.endDate})`,
    type: reportForm.value.type,
    date: new Date().toISOString().split('T')[0],
    url: 'https://www.africau.edu/images/default/sample.pdf', // Placeholder URL
  };
  generatedReports.value.push(newReport);
  alert('สร้างรายงานสำเร็จ! สามารถดาวน์โหลดได้จากรายการด้านล่าง.');
  resetReportForm();
};

const resetReportForm = () => {
  reportForm.value = { type: '', startDate: '', endDate: '' };
};

// In a real application, you might fetch a list of recent reports on mount
// onMounted(() => {
//   fetchRecentReports();
// });
// const fetchRecentReports = async () => { /* ... */ };
</script>

<style scoped>
/* Specific styles for this page */
</style>

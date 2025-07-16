<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold text-my-custom-gray mb-6 text-center">เอกสาร ITA (Integrity and Transparency Assessment)</h2>

    <div class="flex flex-wrap justify-center gap-4 mb-8">
      <button
        v-for="year in availableYears"
        :key="year"
        @click="selectYear(year)"
        :class="{
          'bg-blue-600 text-white': selectedYear === year,
          'bg-gray-200 text-my-custom-gray hover:bg-gray-300': selectedYear !== year
        }"
        class="px-6 py-3 rounded-lg font-semibold text-lg transition duration-300 shadow-md"
      >
        ปี {{ year }}
      </button>
    </div>

    <div v-if="!selectedYear" class="text-center text-gray-500 text-lg py-10">
      กรุณาเลือกปีเพื่อดูเอกสาร ITA
    </div>

    <div v-else>
      <div v-if="filteredTopics.length === 0" class="text-center text-gray-500 text-lg py-10">
        ไม่พบเอกสาร ITA สำหรับปีที่เลือก
      </div>

      <div v-for="topic in filteredTopics" :key="topic.id" class="mb-6 border rounded-lg shadow-sm">
        <button
          @click="toggleTopic(topic.id)"
          class="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg flex justify-between items-center focus:outline-none"
        >
          <span class="font-semibold text-lg text-my-custom-gray">{{ topic.title }}</span>
          <i :class="{'fas fa-chevron-down': !isTopicOpen(topic.id), 'fas fa-chevron-up': isTopicOpen(topic.id)}" class="text-sm text-gray-500 transition-transform duration-300"></i>
        </button>

        <div v-if="isTopicOpen(topic.id)" class="p-4 bg-white rounded-b-lg">
          <p class="text-gray-700 mb-4">{{ topic.description }}</p>

          <div v-if="Object.keys(getDocumentsGroupedByQuarter(topic.documents)).length > 0">
            <div v-for="(quarterDocuments, quarter) in getDocumentsGroupedByQuarter(topic.documents)" :key="quarter" class="mb-4">
              <h4 class="font-bold text-md text-my-custom-gray mb-2">ไตรมาสที่ {{ quarter }}</h4>
              <ul class="list-disc pl-5">
                <li v-for="doc in quarterDocuments" :key="doc.id" class="mb-2">
                  <a :href="doc.path" target="_blank" class="text-blue-600 hover:underline flex items-center space-x-2">
                    <i class="fas fa-file-pdf"></i>
                    <span>{{ doc.name }}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <p v-else class="text-gray-500">ยังไม่มีเอกสารสำหรับหมวดหมู่นี้ในไตรมาสนี้</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Interfaces for ITA data structure
interface ITADocument {
  id: number;
  name: string;
  path: string;
  quarter: string; // Add quarter property
}

interface ITATopic {
  id: number;
  year: number;
  title: string;
  description: string;
  documents: ITADocument[];
}

// Mock Data for ITA Documents (Updated with 'quarter' property)
const allITATopics = ref<ITATopic[]>([
  // Data for Year 2567
  {
    id: 1,
    year: 2567,
    title: 'ข้อมูลพื้นฐาน (ปี 2567)',
    description: 'ข้อมูลพื้นฐานของโรงพยาบาลแม่แตงตามเกณฑ์ ITA ปี 2567',
    documents: [
      { id: 101, name: 'เอกสารโครงสร้างองค์กร', path: '/ita/2567/doc_01.pdf', quarter: 'Q1' },
      { id: 102, name: 'ข้อมูลผู้บริหาร', path: '/ita/2567/doc_02.pdf', quarter: 'Q1' },
      { id: 103, name: 'อำนาจหน้าที่', path: '/ita/2567/doc_03.pdf', quarter: 'Q2' },
      { id: 104, name: 'แผนยุทธศาสตร์ชาติ', path: '/ita/2567/doc_04.pdf', quarter: 'Q3' },
      { id: 105, name: 'ข้อมูลติดต่อ', path: '/ita/2567/doc_05.pdf', quarter: 'Q4' },
    ],
  },
  {
    id: 2,
    year: 2567,
    title: 'การจัดซื้อจัดจ้าง (ปี 2567)',
    description: 'เอกสารที่เกี่ยวข้องกับการจัดซื้อจัดจ้างของโรงพยาบาลแม่แตง',
    documents: [
      { id: 201, name: 'แผนการจัดซื้อจัดจ้าง ประจำปี 2567', path: '/ita/2567/purchase_plan_2567.pdf', quarter: 'Q1' },
      { id: 202, name: 'ประกาศผลการจัดซื้อจัดจ้าง ไตรมาสที่ 1', path: '/ita/2567/purchase_q1_result.pdf', quarter: 'Q1' },
      { id: 203, name: 'ประกาศผลการจัดซื้อจัดจ้าง ไตรมาสที่ 2', path: '/ita/2567/purchase_q2_result.pdf', quarter: 'Q2' },
    ],
  },
  {
    id: 3,
    year: 2567,
    title: 'การบริหารงานบุคคล (ปี 2567)',
    description: 'นโยบายและแนวปฏิบัติเกี่ยวกับการบริหารงานบุคคล',
    documents: [
      { id: 301, name: 'นโยบายการบริหารทรัพยากรบุคคล', path: '/ita/2567/hr_policy.pdf', quarter: 'Q1' },
      { id: 302, name: 'รายงานผลการประเมินการปฏิบัติงานบุคลากร', path: '/ita/2567/hr_report.pdf', quarter: 'Q2' },
    ],
  },
  {
    id: 4,
    year: 2567,
    title: 'การดำเนินงานและงบประมาณ (ปี 2567)',
    description: 'เอกสารเกี่ยวกับการดำเนินงานและงบประมาณของโรงพยาบาล',
    documents: [
      { id: 401, name: 'แผนการดำเนินงาน ประจำปี 2567', path: '/ita/2567/op_plan.pdf', quarter: 'Q1' },
      { id: 402, name: 'รายงานการใช้งบประมาณ ไตรมาส 1', path: '/ita/2567/budget_q1.pdf', quarter: 'Q1' },
      { id: 403, name: 'รายงานการใช้งบประมาณ ไตรมาส 2', path: '/ita/2567/budget_q2.pdf', quarter: 'Q2' },
      { id: 404, name: 'รายงานการใช้งบประมาณ ไตรมาส 3', path: '/ita/2567/budget_q3.pdf', quarter: 'Q3' },
    ],
  },
  // Data for Year 2566
  {
    id: 5,
    year: 2566,
    title: 'ข้อมูลพื้นฐาน (ปี 2566)',
    description: 'ข้อมูลพื้นฐานของโรงพยาบาลแม่แตงตามเกณฑ์ ITA ปี 2566',
    documents: [
      { id: 501, name: 'เอกสารโครงสร้างองค์กร (2566)', path: '/ita/2566/doc_01_2566.pdf', quarter: 'Q1' },
      { id: 502, name: 'ข้อมูลผู้บริหาร (2566)', path: '/ita/2566/doc_02_2566.pdf', quarter: 'Q1' },
      { id: 503, name: 'อำนาจหน้าที่ (2566)', path: '/ita/2566/doc_03_2566.pdf', quarter: 'Q2' },
    ],
  },
  {
    id: 6,
    year: 2566,
    title: 'การจัดซื้อจัดจ้าง (ปี 2566)',
    description: 'เอกสารที่เกี่ยวข้องกับการจัดซื้อจัดจ้างของโรงพยาบาลแม่แตง ปี 2566',
    documents: [
      { id: 601, name: 'แผนการจัดซื้อจัดจ้าง ประจำปี 2566', path: '/ita/2566/purchase_plan_2566.pdf', quarter: 'Q1' },
      { id: 602, name: 'ประกาศผลการจัดซื้อจัดจ้าง ไตรมาสที่ 1 (2566)', path: '/ita/2566/purchase_q1_result_2566.pdf', quarter: 'Q1' },
      { id: 603, name: 'ประกาศผลการจัดซื้อจัดจ้าง ไตรมาสที่ 2 (2566)', path: '/ita/2566/purchase_q2_result_2566.pdf', quarter: 'Q2' },
      { id: 604, name: 'ประกาศผลการจัดซื้อจัดจ้าง ไตรมาสที่ 3 (2566)', path: '/ita/2566/purchase_q3_result_2566.pdf', quarter: 'Q3' },
    ],
  },
  // Data for Year 2565
  {
    id: 7,
    year: 2565,
    title: 'ข้อมูลพื้นฐาน (ปี 2565)',
    description: 'ข้อมูลพื้นฐานของโรงพยาบาลแม่แตงตามเกณฑ์ ITA ปี 2565',
    documents: [
      { id: 701, name: 'เอกสารโครงสร้างองค์กร (2565)', path: '/ita/2565/doc_01_2565.pdf', quarter: 'Q1' },
      { id: 702, name: 'ข้อมูลผู้บริหาร (2565)', path: '/ita/2565/doc_02_2565.pdf', quarter: 'Q2' },
    ],
  },
  {
    id: 8,
    year: 2565,
    title: 'การจัดซื้อจัดจ้าง (ปี 2565)',
    description: 'เอกสารที่เกี่ยวข้องกับการจัดซื้อจัดจ้างของโรงพยาบาลแม่แตง ปี 2565',
    documents: [
      { id: 801, name: 'แผนการจัดซื้อจัดจ้าง ประจำปี 2565', path: '/ita/2565/purchase_plan_2565.pdf', quarter: 'Q1' },
      { id: 802, name: 'ประกาศผลการจัดซื้อจัดจ้าง ไตรมาสที่ 1 (2565)', path: '/ita/2565/purchase_q1_result_2565.pdf', quarter: 'Q1' },
      { id: 803, name: 'ประกาศผลการจัดซื้อจัดจ้าง ไตรมาสที่ 2 (2565)', path: '/ita/2565/purchase_q2_result_2565.pdf', quarter: 'Q2' },
      { id: 804, name: 'ประกาศผลการจัดซื้อจัดจ้าง ไตรมาสที่ 3 (2565)', path: '/ita/2565/purchase_q3_result_2565.pdf', quarter: 'Q3' },
      { id: 805, name: 'ประกาศผลการจัดซื้อจัดจ้าง ไตรมาสที่ 4 (2565)', path: '/ita/2565/purchase_q4_result_2565.pdf', quarter: 'Q4' },
    ],
  },
]);

const availableYears = computed(() => {
  const years = new Set(allITATopics.value.map(topic => topic.year));
  return Array.from(years).sort((a, b) => b - a); // Sort in descending order
});

const selectedYear = ref<number | null>(null);
const openTopics = ref<number[]>([]);

// Select the latest year on component mount
onMounted(() => {
  if (availableYears.value.length > 0) {
    selectedYear.value = availableYears.value[0];
  }
});

const selectYear = (year: number) => {
  selectedYear.value = year;
  openTopics.value = []; // Close all topics when year changes
};

const filteredTopics = computed(() => {
  if (!selectedYear.value) return [];
  return allITATopics.value.filter(topic => topic.year === selectedYear.value);
});

const toggleTopic = (id: number) => {
  const index = openTopics.value.indexOf(id);
  if (index > -1) {
    openTopics.value.splice(index, 1); // Close if open
  } else {
    openTopics.value.push(id); // Open if closed
  }
};

const isTopicOpen = (id: number) => {
  return openTopics.value.includes(id);
};

// New function to group documents by quarter
const getDocumentsGroupedByQuarter = (documents: ITADocument[]) => {
  const quarters: { [key: string]: ITADocument[] } = {};
  documents.forEach(doc => {
    if (doc.quarter) { // Ensure quarter exists
      if (!quarters[doc.quarter]) {
        quarters[doc.quarter] = [];
      }
      quarters[doc.quarter].push(doc);
    }
  });

  // Define the desired order of quarters
  const quarterOrder = ['Q1', 'Q2', 'Q3', 'Q4'];

  // Sort quarters and return as an object
  const sortedQuarters: { [key: string]: ITADocument[] } = {};
  quarterOrder.forEach(q => {
    if (quarters[q]) {
      sortedQuarters[q] = quarters[q];
    }
  });
  return sortedQuarters;
};
</script>

<style scoped>
/* Your existing styles */
</style>

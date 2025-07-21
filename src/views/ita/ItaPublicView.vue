<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-extrabold text-my-custom-blue mb-8 text-center">
      การประเมินคุณธรรมและความโปร่งใส (MOPH ITA)
    </h1>

    <div class="mb-8 flex justify-center items-center space-x-4">
      <label for="yearFilter" class="text-lg font-semibold text-gray-700">เลือกปีงบประมาณ:</label>
      <select
        id="yearFilter"
        v-model="selectedYear"
        class="p-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
      >
        <option v-for="year in availableYears" :key="year" :value="year">
          ปีงบประมาณ {{ year }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="text-center py-20">
      <i class="fas fa-spinner fa-spin text-5xl text-blue-500"></i>
      <p class="mt-6 text-xl text-gray-600">กำลังโหลดข้อมูล ITA...</p>
    </div>

    <div v-else-if="error" class="text-center py-20 text-red-600">
      <i class="fas fa-exclamation-triangle text-5xl mb-6"></i>
      <p class="text-xl">เกิดข้อผิดพลาดในการดึงข้อมูล: {{ error }}</p>
      <button
        @click="fetchITATopics"
        class="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg shadow-md"
      >
        ลองใหม่
      </button>
    </div>

    <div v-else-if="filteredTopics.length === 0" class="text-center py-20 text-gray-500 text-2xl">
      <i class="fas fa-folder-open text-5xl mb-6"></i>
      <p>ไม่พบข้อมูล ITA สำหรับปีงบประมาณที่เลือก หรือยังไม่มีการเพิ่มข้อมูล.</p>
    </div>

    <div v-else class="space-y-10">
      <div
        v-for="topicGroup in groupedTopicsBySubTopic"
        :key="topicGroup.id"
        class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
      >
        <h2 class="text-2xl font-bold text-my-custom-gray mb-4 flex items-center">
          <i class="fas fa-folder mr-3 text-emerald-600"></i> {{ topicGroup.title }}
        </h2>
        <p
          v-if="topicGroup.description"
          class="text-gray-600 mb-6 border-l-4 border-emerald-400 pl-3 italic"
        >
          {{ topicGroup.description }}
        </p>

        <div v-if="Object.keys(topicGroup.subTopics).length > 0" class="space-y-6">
          <div
            v-for="(docs, subTopicName) in topicGroup.subTopics"
            :key="subTopicName"
            class="ml-4"
          >
            <h3 class="text-xl font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
              <i class="fas fa-file-alt mr-2 text-blue-500"></i>
              {{ subTopicName || 'เอกสารทั่วไป' }}
            </h3>
            <ul class="list-none p-0">
              <li
                v-for="doc in sortedDocuments(docs)"
                :key="doc.id"
                class="flex items-start mb-3 bg-gray-50 p-3 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
              >
                <i class="fas fa-file-pdf text-red-500 text-xl mr-3 mt-1"></i>
                <div>
                  <a
                    :href="doc.path"
                    target="_blank"
                    class="text-blue-600 hover:underline text-lg font-medium"
                  >
                    {{ doc.name }}
                  </a>
                  <p class="text-sm text-gray-600 mt-1">
                    <span class="font-semibold">ไตรมาส:</span> {{ doc.quarter }}
                    <span v-if="doc.description" class="ml-4 italic">{{ doc.description }}</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div v-else class="text-gray-500 text-center py-4 border-t mt-6">
          ยังไม่มีเอกสารสำหรับหัวข้อนี้ในปัจจุบัน
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
// import axios from 'axios'; // Uncomment if using real API calls

// Interfaces (must match your backend or mock data structure)
interface ITADocument {
  id: number
  name: string // Document title
  path: string // URL to the document file
  quarter: string // e.g., 'Q1', 'Q2'
  topicId: number // Links to the ITATopic
  year: number // Year of the document
  description?: string // Optional description for the document
  subTopic?: string // New: Sub-category/type of document
}

interface ITATopic {
  id: number
  year: number
  title: string // MOIT main topic title, e.g., 'MOIT 1: ...'
  description: string // Description of the MOIT topic
  documents: ITADocument[] // Array of documents under this MOIT topic
}

// Reactive States
const itaTopics = ref<ITATopic[]>([]) // This will hold our fetched/mocked ITA data
const loading = ref(true) // Initial loading state
const error = ref<string | null>(null) // Error message
const selectedYear = ref<number | null>(null) // Year selected by the user

// Mock Data (simulating data that would come from an API)
const mockITATopics: ITATopic[] = [
  // --- MOIT Topics for Year 2567 ---
  {
    id: 1,
    year: 2567,
    title:
      'MOIT 1: หน่วยงานมีการกำหนดมาตรการ และวางระบบการเผยแพร่ข้อมูลต่อสาธารณะผ่านเว็บไซต์ของหน่วยงาน',
    description: 'เอกสารที่เกี่ยวข้องกับการกำหนดมาตรการและระบบการเผยแพร่ข้อมูล.',
    documents: [
      {
        id: 101,
        name: 'คำสั่งแต่งตั้งคณะทำงาน ITA 2567',
        path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        quarter: 'Q1',
        topicId: 1,
        year: 2567,
        subTopic: 'คำสั่ง',
      },
      {
        id: 102,
        name: 'ประกาศช่องทางการเผยแพร่ข้อมูล 2567',
        path: 'https://www.africau.edu/images/default/sample.pdf',
        quarter: 'Q1',
        topicId: 1,
        year: 2567,
        subTopic: 'ประกาศ',
      },
      {
        id: 103,
        name: 'รายงานสรุปการเผยแพร่ข้อมูล Q2/2567',
        path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        quarter: 'Q2',
        topicId: 1,
        year: 2567,
        subTopic: 'รายงานผล',
      },
      {
        id: 104,
        name: 'มาตรการเสริมสร้างความโปร่งใส',
        path: 'https://www.africau.edu/images/default/sample.pdf',
        quarter: 'Q2',
        topicId: 1,
        year: 2567,
        subTopic: 'มาตรการ',
      },
    ],
  },
  {
    id: 2,
    year: 2567,
    title: 'MOIT 2: หน่วยงานมีการเปิดเผยข้อมูลข่าวสารที่เป็นปัจจุบัน',
    description: 'เอกสารที่เกี่ยวข้องกับการเปิดเผยข้อมูลข่าวสารที่อัปเดต.',
    documents: [
      {
        id: 201,
        name: 'รายงานสรุปข้อมูลข่าวสาร Q1-2567',
        path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        quarter: 'Q1',
        topicId: 2,
        year: 2567,
        subTopic: 'รายงานผล',
      },
      {
        id: 202,
        name: 'แผนการปรับปรุงเว็บไซต์ 2567',
        path: 'https://www.africau.edu/images/default/sample.pdf',
        quarter: 'Q2',
        topicId: 2,
        year: 2567,
        subTopic: 'แผนปฏิบัติการ',
      },
    ],
  },
  {
    id: 3,
    year: 2567,
    title: 'MOIT 3: หน่วยงานมีรายงานการวิเคราะห์ผลการจัดซื้อจัดจ้างและการจัดหาพัสดุประจำปีงบประมาณ',
    description: 'รายงานและข้อมูลการจัดซื้อจัดจ้างและจัดหาพัสดุ.',
    documents: [
      {
        id: 301,
        name: 'รายงานผลการจัดซื้อจัดจ้าง 2567 (รอบ 6 เดือน)',
        path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        quarter: 'Q2',
        topicId: 3,
        year: 2567,
        subTopic: 'รายงานผล',
      },
      {
        id: 302,
        name: 'ประกาศแผนจัดซื้อจัดจ้างประจำปี 2567',
        path: 'https://www.africau.edu/images/default/sample.pdf',
        quarter: 'Q1',
        topicId: 3,
        year: 2567,
        subTopic: 'ประกาศ',
      },
    ],
  },
  {
    id: 12, // ID สำหรับ MOIT 13 (ใน mock data นี้ใช้ ID 12 เพื่อให้ไม่ซ้ำกับ MOIT 1-11)
    year: 2567,
    title: 'MOIT 13: หน่วยงานประเมินการดำเนินการตามแนวทางปฏิบัติของหน่วยงาน ในปีงบประมาณ',
    description: 'เอกสารเกี่ยวกับการประเมินแนวทางปฏิบัติของหน่วยงาน.',
    documents: [
      {
        id: 1301,
        name: 'รายงานผลการประเมินภายใน Q2 2567',
        path: 'https://www.africau.edu/images/default/sample.pdf',
        quarter: 'Q2',
        topicId: 12,
        year: 2567,
        subTopic: 'รายงานผล',
      },
      {
        id: 1302,
        name: 'คู่มือการประเมินตนเอง ITA 2567',
        path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        quarter: 'Q1',
        topicId: 12,
        year: 2567,
        subTopic: 'คู่มือ',
      },
      {
        id: 1303,
        name: 'สรุปการประชุมคณะกรรมการ ITA',
        path: 'https://www.africau.edu/images/default/sample.pdf',
        quarter: 'Q1',
        topicId: 12,
        year: 2567,
        subTopic: 'อื่นๆ',
      },
    ],
  },
  // --- MOIT Topics for Year 2566 ---
  {
    id: 14, // ID ใหม่สำหรับปี 2566
    year: 2566,
    title:
      'MOIT 1: หน่วยงานมีการกำหนดมาตรการ และวางระบบการเผยแพร่ข้อมูลต่อสาธารณะผ่านเว็บไซต์ ของหน่วยงาน (ปี 2566)',
    description: 'เอกสารที่เกี่ยวข้องกับการกำหนดมาตรการและระบบการเผยแพร่ข้อมูล ปี 2566.',
    documents: [
      {
        id: 1401,
        name: 'ประกาศช่องทางข้อมูล 2566',
        path: 'https://www.africau.edu/images/default/sample.pdf',
        quarter: 'Q1',
        topicId: 14,
        year: 2566,
        subTopic: 'ประกาศ',
      },
    ],
  },
  {
    id: 15, // ID ใหม่สำหรับปี 2566
    year: 2566,
    title: 'MOIT 2: หน่วยงานมีการเปิดเผยข้อมูลข่าวสารที่เป็นปัจจุบัน (ปี 2566)',
    description: 'เอกสารที่เกี่ยวข้องกับการเปิดเผยข้อมูลข่าวสารที่อัปเดต ปี 2566.',
    documents: [
      {
        id: 1501,
        name: 'รายงานข้อมูลข่าวสาร Q4-2566',
        path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        quarter: 'Q4',
        topicId: 15,
        year: 2566,
        subTopic: 'รายงานผล',
      },
    ],
  },
  // Add more MOIT topics for 2566 or other years as needed, with documents and subTopics
]

// Computed Properties
const availableYears = computed(() => {
  const years = new Set(mockITATopics.map((topic) => topic.year))
  return Array.from(years).sort((a, b) => b - a) // Sort descending
})

const filteredTopics = computed(() => {
  if (!selectedYear.value) {
    return []
  }
  // Filter topics by selected year
  return itaTopics.value.filter((topic) => topic.year === selectedYear.value)
})

// New computed property to group documents by subTopic within each main topic
const groupedTopicsBySubTopic = computed(() => {
  return filteredTopics.value.map((topic) => {
    const subTopics: { [key: string]: ITADocument[] } = {} // Use index signature for string keys

    // Group documents by their subTopic
    topic.documents.forEach((doc) => {
      const sTopic = doc.subTopic || 'เอกสารทั่วไป' // Default if subTopic is not set
      if (!subTopics[sTopic]) {
        subTopics[sTopic] = []
      }
      subTopics[sTopic].push(doc)
    })

    return {
      ...topic, // Copy all properties from the original topic
      subTopics: subTopics, // Add the new grouped subTopics object
    }
  })
})

// Function to sort documents by quarter (Q1, Q2, Q3, Q4)
const sortedDocuments = (documents: ITADocument[]) => {
  const quarterOrder = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 }
  return [...documents].sort((a, b) => {
    const aQuarterValue =
      a.quarter && quarterOrder[a.quarter as keyof typeof quarterOrder]
        ? quarterOrder[a.quarter as keyof typeof quarterOrder]
        : 0
    const bQuarterValue =
      b.quarter && quarterOrder[b.quarter as keyof typeof quarterOrder]
        ? quarterOrder[b.quarter as keyof typeof quarterOrder]
        : 0
    return aQuarterValue - bQuarterValue
  })
}

// Functions (simulating API calls)
const fetchITATopics = async () => {
  loading.value = true
  error.value = null
  try {
    // In a real application, you'd fetch from your backend here.
    // const response = await axios.get<ITATopic[]>('/api/public-ita-topics');
    // itaTopics.value = response.data;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 700))

    // Assign mock data
    itaTopics.value = mockITATopics

    // Set default selected year to the latest available year
    if (!selectedYear.value && availableYears.value.length > 0) {
      selectedYear.value = availableYears.value[0]
    }
  } catch (err: any) {
    console.error('Error fetching public ITA topics:', err)
    error.value = err.message || 'ไม่สามารถดึงข้อมูล ITA ได้'
  } finally {
    loading.value = false
  }
}

// Lifecycle Hooks
onMounted(() => {
  fetchITATopics()
})
</script>

<style scoped>
/* Custom colors can be defined in your tailwind.config.js */
/* Example:
theme: {
  extend: {
    colors: {
      'my-custom-blue': '#2563eb',
      'my-custom-gray': '#334155',
    }
  }
}
*/
</style>

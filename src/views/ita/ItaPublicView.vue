<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-extrabold text-my-custom-blue mb-8 text-center">
      การประเมินคุณธรรมและความโปร่งใส <br />(MOPH ITA)
    </h1>

    <div v-if="availableYears.length > 0" class="mb-8 flex justify-center items-center space-x-4">
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
    </div>

    <div v-else-if="!selectedYearData" class="text-center py-20 text-gray-500 text-2xl">
      <i class="fas fa-folder-open text-5xl mb-6"></i>
      <p>ไม่พบข้อมูล ITA สำหรับปีงบประมาณที่เลือก</p>
    </div>

    <div v-else class="space-y-10">
      <div
        v-for="moit in groupedMoitsByCategory"
        :key="moit.id"
        class="bg-white rounded-xl shadow-lg p-8"
      >
        <h2 class="text-2xl font-bold text-my-custom-gray mb-4">
          <i class="fas fa-folder mr-3 text-emerald-600"></i> {{ moit.title }}
        </h2>
        <p v-if="moit.description" class="text-gray-600 mb-6 italic">{{ moit.description }}</p>

        <div class="space-y-6">
          <div v-for="quarter in [1, 2, 3, 4]" :key="quarter">
            <h3
              @click="toggleQuarter(moit.id, quarter)"
              class="text-xl font-semibold text-gray-700 mb-3 border-b pb-2 flex justify-between items-center cursor-pointer"
            >
              <span>
                <i class="fas fa-calendar-alt mr-2 text-orange-500"></i>
                ไตรมาสที่ {{ quarter }}
              </span>
              <i
                class="fas fa-chevron-down transition-transform duration-300"
                :class="{ 'rotate-180': expandedQuarters[`${moit.id}-${quarter}`] }"
              ></i>
            </h3>

            <div v-if="expandedQuarters[`${moit.id}-${quarter}`]" class="space-y-4 ml-4">
              <div
                v-for="(docs, subTopic) in groupedDocumentsBySubTopic(moit.documents, quarter)"
                :key="subTopic"
              >
                <h4 class="text-lg font-semibold text-gray-800 mb-2">
                  <i class="fas fa-tags mr-2"></i> {{ subTopic || 'เอกสารทั่วไป' }}
                </h4>
                <ul class="list-disc pl-6">
                  <li v-for="doc in docs" :key="doc.id" class="mb-2">
                    <a :href="doc.fileUrl" target="_blank" class="text-blue-600 hover:underline">
                      {{ doc.title }}
                    </a>
                    <p v-if="doc.description" class="text-sm text-gray-500 italic">
                      {{ doc.description }}
                    </p>
                  </li>
                </ul>
              </div>
              <div
                v-if="!hasDocumentsForQuarter(moit.documents, quarter)"
                class="text-gray-500 italic"
              >
                ยังไม่มีเอกสารสำหรับไตรมาสนี้
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
// 1. Import Type ที่ถูกต้องจากไฟล์กลาง
import type { YearIta, Moit, ItaDocument } from '@/types/ita'
// import { itaService } from '@/services/itaService'; // เปิดใช้งานเมื่อเชื่อม API จริง

// 2. Mock Data ที่สมบูรณ์ตาม Interface ล่าสุด
const mockITAData: YearIta[] = [
  {
    id: 'year-2567',
    year: '2567',
    title: 'ปีงบประมาณ 2567',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    moits: [
      {
        id: 'moit1-2567',
        ita_topic_id: 'year-2567',
        moit_name: 'MOIT 1',
        title: 'MOIT 1: หน่วยงานมีการกำหนดมาตรการ...',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documents: [
          {
            id: 'doc-1',
            topic_id: 'moit1-2567',
            title: 'ประกาศ MOIT 1 Q1',
            sub_topic: 'ประกาศ',
            quarter: 1,
            fileUrl: '#',
            fileName: 'doc1.pdf',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'doc-2',
            topic_id: 'moit1-2567',
            title: 'รายงาน MOIT 1 Q1',
            sub_topic: 'รายงานผล',
            quarter: 1,
            fileUrl: '#',
            fileName: 'doc2.pdf',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'doc-3',
            topic_id: 'moit1-2567',
            title: 'ประกาศ MOIT 1 Q2',
            sub_topic: 'ประกาศ',
            quarter: 2,
            fileUrl: '#',
            fileName: 'doc3.pdf',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
      {
        id: 'moit2-2567',
        ita_topic_id: 'year-2567',
        moit_name: 'MOIT 2',
        title: 'MOIT 2: หน่วยงานมีการเปิดเผยข้อมูล...',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        documents: [
          {
            id: 'doc-4',
            topic_id: 'moit2-2567',
            title: 'รายงาน MOIT 2 Q4',
            sub_topic: 'รายงานผล',
            quarter: 4,
            fileUrl: '#',
            fileName: 'doc4.pdf',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    ],
  },
]

// 3. State ทั้งหมดที่ต้องใช้
const itaData = ref<YearIta[]>(mockITAData)
const loading = ref(false)
const error = ref<string | null>(null)
const selectedYear = ref<string | null>('2567')
const expandedQuarters = ref<{ [key: string]: boolean }>({})

// 4. Computed Properties ชุดใหม่ที่ทำงานกับโครงสร้าง 3 ชั้น
const availableYears = computed(() => {
  if (!itaData.value) return []
  const years = new Set(itaData.value.map((data) => data.year))
  return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))
})

const selectedYearData = computed(() => {
  if (!selectedYear.value || !itaData.value) return null
  return itaData.value.find((data) => data.year === selectedYear.value) || null
})

// ===== นี่คือฟังก์ชันใหม่ที่คุณต้องเพิ่มเข้ามา =====
const groupedMoitsByCategory = computed(() => {
  if (!selectedYearData.value) return []

  return selectedYearData.value.moits.map((moit: Moit) => {
    const grouped: { [category: string]: ItaDocument[] } = {}

    moit.documents.forEach((doc) => {
      const category = doc.sub_topic || 'เอกสารทั่วไป'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(doc)
    })

    return { ...moit, groupedDocuments: grouped }
  })
})

// 5. Helper Functions สำหรับจัดกลุ่มและตรวจสอบข้อมูล
const groupedDocumentsBySubTopic = (documents: ItaDocument[], quarter: number) => {
  const filteredDocs = documents.filter((doc) => doc.quarter === quarter)
  const grouped: { [subTopic: string]: ItaDocument[] } = {}
  filteredDocs.forEach((doc) => {
    const sub = doc.sub_topic || 'เอกสารทั่วไป'
    if (!grouped[sub]) {
      grouped[sub] = []
    }
    grouped[sub].push(doc)
  })
  return grouped
}

const hasDocumentsForQuarter = (documents: ItaDocument[], quarter: number) => {
  return documents.some((doc) => doc.quarter === quarter)
}

// 6. ฟังก์ชันสำหรับ Accordion
const toggleQuarter = (moitId: string, quarter: number) => {
  const keyToToggle = `${moitId}-${quarter}`
  const wasOpen = !!expandedQuarters.value[keyToToggle]

  const newExpandedState: { [key: string]: boolean } = {}

  for (const key in expandedQuarters.value) {
    if (!key.startsWith(`${moitId}-`)) {
      newExpandedState[key] = expandedQuarters.value[key]
    }
  }

  if (!wasOpen) {
    newExpandedState[keyToToggle] = true
  }

  expandedQuarters.value = newExpandedState
}

// 7. ฟังก์ชันสำหรับดึงข้อมูลจริง (ตอนนี้ปิดไว้ก่อน)
const fetchAllITAData = async () => {
  // ...
}

onMounted(() => {
  fetchAllITAData()
})
</script>

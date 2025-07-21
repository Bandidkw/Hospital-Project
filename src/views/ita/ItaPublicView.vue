<template>
  <div class="container mx-auto px-4 py-8">
    <h2 class="text-3xl font-bold text-my-custom-gray mb-6 text-center">
      เอกสาร ITA (Integrity and Transparency Assessment)
    </h2>

    <div v-if="loading" class="text-center py-10">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
      <p class="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
    </div>

    <div v-else-if="error" class="text-center py-10 text-red-600">
      <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
      <p>เกิดข้อผิดพลาดในการดึงข้อมูล: {{ error }}</p>
      <button
        @click="fetchITATopics"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ลองใหม่
      </button>
    </div>

    <div v-else>
      <div class="flex flex-wrap justify-center gap-4 mb-8">
        <button
          v-for="year in availableYears"
          :key="year"
          @click="selectYear(year)"
          :class="{
            'bg-blue-600 text-white': selectedYear === year,
            'bg-gray-200 text-my-custom-gray hover:bg-gray-300': selectedYear !== year,
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

        <div
          v-for="topic in filteredTopics"
          :key="topic.id"
          class="mb-6 border rounded-lg shadow-sm"
        >
          <button
            @click="toggleTopic(topic.id)"
            class="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg flex justify-between items-center focus:outline-none"
          >
            <span class="font-semibold text-lg text-my-custom-gray">{{ topic.title }}</span>
            <i
              :class="{
                'fas fa-chevron-down': !isTopicOpen(topic.id),
                'fas fa-chevron-up': isTopicOpen(topic.id),
              }"
              class="text-sm text-gray-500 transition-transform duration-300"
            ></i>
          </button>

          <div v-if="isTopicOpen(topic.id)" class="p-4 bg-white rounded-b-lg">
            <p class="text-gray-700 mb-4">{{ topic.description }}</p>

            <div v-if="Object.keys(getDocumentsGroupedByQuarter(topic.documents)).length > 0">
              <div
                v-for="(quarterDocuments, quarter) in getDocumentsGroupedByQuarter(topic.documents)"
                :key="quarter"
                class="mb-4"
              >
                <h4 class="font-bold text-md text-my-custom-gray mb-2">ไตรมาสที่ {{ quarter }}</h4>
                <ul class="list-disc pl-5">
                  <li v-for="doc in quarterDocuments" :key="doc.id" class="mb-2">
                    <a
                      :href="doc.path"
                      target="_blank"
                      class="text-blue-600 hover:underline flex items-center space-x-2"
                    >
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios' // Import axios

interface ITADocument {
  id: number
  name: string
  path: string
  quarter: string
}

interface ITATopic {
  id: number
  year: number
  title: string
  description: string
  documents: ITADocument[]
}

// State for data, loading, and error
const allITATopics = ref<ITATopic[]>([]) // เปลี่ยนจาก Mock data เป็น Array ว่างเปล่า
const loading = ref(true)
const error = ref<string | null>(null)

const availableYears = computed(() => {
  const years = new Set(allITATopics.value.map((topic) => topic.year))
  return Array.from(years).sort((a, b) => b - a) // Sort in descending order
})

const selectedYear = ref<number | null>(null)
const openTopics = ref<number[]>([])

const fetchITATopics = async () => {
  loading.value = true
  error.value = null
  try {
    // กำหนด URL ของ API
    const apiUrl = '/api/ita-topics' // ตัวอย่าง: หาก Backend อยู่บนโดเมนเดียวกันและมี /api/ita-topics
    // หรือ https://your-backend.com/api/ita-topics หากเป็น External API

    const response = await axios.get<ITATopic[]>(apiUrl) // ระบุ Type จาก response
    allITATopics.value = response.data

    if (availableYears.value.length > 0 && selectedYear.value === null) {
      selectedYear.value = availableYears.value[0]
    }
  } catch (err: any) {
    console.error('Error fetching ITA topics:', err)
    error.value = err.message || 'ไม่สามารถดึงข้อมูลได้'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchITATopics()
})

const selectYear = (year: number) => {
  selectedYear.value = year
  openTopics.value = []
}

const filteredTopics = computed(() => {
  if (!selectedYear.value) return []
  return allITATopics.value.filter((topic) => topic.year === selectedYear.value)
})

const toggleTopic = (id: number) => {
  const index = openTopics.value.indexOf(id)
  if (index > -1) {
    openTopics.value.splice(index, 1)
  } else {
    openTopics.value.push(id)
  }
}

const isTopicOpen = (id: number) => {
  return openTopics.value.includes(id)
}

const getDocumentsGroupedByQuarter = (documents: ITADocument[]) => {
  const quarters: { [key: string]: ITADocument[] } = {}
  documents.forEach((doc) => {
    if (doc.quarter) {
      if (!quarters[doc.quarter]) {
        quarters[doc.quarter] = []
      }
      quarters[doc.quarter].push(doc)
    }
  })

  const quarterOrder = ['Q1', 'Q2', 'Q3', 'Q4']
  const sortedQuarters: { [key: string]: ITADocument[] } = {}
  quarterOrder.forEach((q) => {
    if (quarters[q]) {
      sortedQuarters[q] = quarters[q]
    }
  })
  return sortedQuarters
}
</script>

<style scoped></style>

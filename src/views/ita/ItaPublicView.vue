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
// 1. Import Type ที่ถูกต้องจากไฟล์กลาง และ Service ที่จะใช้งาน
import type { YearIta, Moit, ItaDocument } from '@/types/ita'
import { itaService } from '@/services/itaService'
import { useToast } from 'vue-toastification'

const toast = useToast()

// 2. State ทั้งหมดที่ต้องใช้ (เริ่มต้นด้วยค่าว่าง)
const itaData = ref<YearIta[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const selectedYear = ref<string | null>(null)
const expandedQuarters = ref<{ [key: string]: boolean }>({})

// 3. Computed Properties ชุดใหม่ที่ทำงานกับโครงสร้าง 3 ชั้น
const availableYears = computed(() => {
  if (!itaData.value) return []
  const years = new Set(itaData.value.map((data) => data.year))
  return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))
})

const selectedYearData = computed(() => {
  if (!selectedYear.value || !itaData.value) return null
  return itaData.value.find((data) => data.year === selectedYear.value) || null
})

// Computed property ที่ใช้จัดกลุ่มข้อมูลสำหรับแสดงผลใน template
const groupedMoitsByCategory = computed(() => {
  if (!selectedYearData.value) return []

  return selectedYearData.value.moits.map((moit: Moit) => {
    const grouped: { [category: string]: ItaDocument[] } = {}

    // ป้องกันกรณีที่ documents อาจจะยังไม่มี
    if (moit.documents) {
      moit.documents.forEach((doc) => {
        const category = doc.sub_topic || 'เอกสารทั่วไป'
        if (!grouped[category]) {
          grouped[category] = []
        }
        grouped[category].push(doc)
      })
    }

    return { ...moit, groupedDocuments: grouped }
  })
})

// 4. Helper Functions สำหรับจัดกลุ่มและตรวจสอบข้อมูล
const groupedDocumentsBySubTopic = (documents: ItaDocument[] | undefined, quarter: number) => {
  if (!documents) return {} // ป้องกันกรณีที่ documents เป็น undefined
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

const hasDocumentsForQuarter = (documents: ItaDocument[] | undefined, quarter: number) => {
  if (!documents) return false // ป้องกันกรณีที่ documents เป็น undefined
  return documents.some((doc) => doc.quarter === quarter)
}

// 5. ฟังก์ชันสำหรับ Accordion
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

// 6. ฟังก์ชันสำหรับดึงข้อมูลจริง (เปิดใช้งานแล้ว!)
const fetchAllITAData = async () => {
  loading.value = true
  error.value = null
  try {
    // itaService.getAllTopics() จะไปเรียก GET /user/year-moit
    const dataFromApi = await itaService.getAllTopics()
    itaData.value = dataFromApi

    if (availableYears.value.length > 0) {
      selectedYear.value = availableYears.value[0]
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
    }
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

// 7. สั่งให้ดึงข้อมูลทันทีที่เปิดหน้า
onMounted(() => {
  fetchAllITAData()
})
</script>

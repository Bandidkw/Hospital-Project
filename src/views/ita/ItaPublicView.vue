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
        v-for="moitGroup in groupedMoitsByCategory"
        :key="moitGroup.id"
        class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
      >
        <h2 class="text-2xl font-bold text-my-custom-gray mb-4 flex items-center">
          <i class="fas fa-folder mr-3 text-emerald-600"></i> {{ moitGroup.title }}
        </h2>
        <p
          v-if="moitGroup.description"
          class="text-gray-600 mb-6 border-l-4 border-emerald-400 pl-3 italic"
        >
          {{ moitGroup.description }}
        </p>

        <div v-if="Object.keys(moitGroup.groupedDocuments).length > 0" class="space-y-6 ml-4">
          <div
            v-for="(docs, categoryName) in moitGroup.groupedDocuments"
            :key="categoryName"
            class="bg-gray-50 p-4 rounded-md shadow-sm"
          >
            <h3 class="text-xl font-bold text-gray-700 mb-3 pb-2 border-b flex items-center">
              <i class="fas fa-tags mr-2 text-orange-500"></i> {{ categoryName }}
            </h3>

            <ul class="list-none p-0 ml-4">
              <li
                v-for="doc in docs"
                :key="doc.id"
                class="flex items-start mb-3 bg-white p-3 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
              >
                <i class="fas fa-file-pdf text-red-500 text-xl mr-3 mt-1"></i>
                <div>
                  <a
                    :href="doc.fileUrl"
                    target="_blank"
                    class="text-blue-600 hover:underline text-lg font-medium"
                  >
                    {{ doc.title }}
                  </a>
                  <p v-if="doc.description" class="text-sm text-gray-600 mt-1 italic">
                    {{ doc.description }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div v-else class="text-gray-500 text-center py-4 border-t mt-6">
          ยังไม่มีเอกสารสำหรับหัวข้อนี้
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
// 1. แก้ไข Import ให้ถูกต้องตาม Interface ใหม่
import type { YearIta, Moit, ItaDocument } from '@/types/ita'
import { itaService } from '@/services/itaService'

// 2. State หลักจะเก็บข้อมูลแบบ 3 ชั้น (YearIta[])
const itaData = ref<YearIta[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const selectedYear = ref<string | null>(null)

// 3. Computed สำหรับดึง "ปี" ที่มีข้อมูลทั้งหมดออกมาสร้าง Dropdown
const availableYears = computed(() => {
  if (!itaData.value) return []
  const years = new Set(itaData.value.map((data) => data.year))
  return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))
})

// 4. Computed สำหรับหา "ข้อมูลของปีที่ถูกเลือก" แค่ปีเดียว
const selectedYearData = computed(() => {
  if (!selectedYear.value || !itaData.value) return null
  return itaData.value.find((data) => data.year === selectedYear.value) || null
})

// 5. Computed สำหรับจัดกลุ่ม "เอกสาร" ที่อยู่ใน "MOIT" ของปีที่เลือก
const groupedMoitsByCategory = computed(() => {
  if (!selectedYearData.value) return []

  // เพิ่ม (moit: Moit) เข้าไปเพื่อบอก Type ให้ชัดเจน
  return selectedYearData.value.moits.map((moit: Moit) => {
    const grouped: { [category: string]: ItaDocument[] } = {}

    moit.documents.forEach((doc) => {
      const category = doc.category || 'เอกสารทั่วไป'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(doc)
    })

    return { ...moit, groupedDocuments: grouped }
  })
})

// 6. ฟังก์ชัน fetch ข้อมูลจะเรียกใช้ Service เดิม แต่ State ที่รับข้อมูลจะเปลี่ยนไป
const fetchAllITAData = async () => {
  loading.value = true
  error.value = null
  try {
    // itaService.getAllTopics() จะคืนค่าเป็น YearIta[]
    const dataFromApi = await itaService.getAllTopics()
    itaData.value = dataFromApi

    // ตั้งค่าปีเริ่มต้นเป็นปีล่าสุด
    if (availableYears.value.length > 0) {
      selectedYear.value = availableYears.value[0]
    }
  } catch (err: unknown) {
    console.error('Error fetching public ITA data:', err)
    if (err instanceof Error) {
      // ถ้า err เป็น Error object จริงๆ เราถึงจะใช้ .message ได้
      error.value = err.message
    } else {
      // ถ้าเป็น Error รูปแบบอื่นที่เราไม่รู้จัก
      error.value = 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAllITAData()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-extrabold text-my-custom-teal mb-8 text-center">
      การประเมินคุณธรรมและความโปร่งใส <br />(MOPH ITA)
    </h1>

    <!-- ตัวกรองเลือกปี -->
    <div v-if="availableYears.length > 0" class="mb-8 flex justify-center items-center space-x-4">
      <label for="yearFilter" class="text-lg font-semibold text-gray-700">เลือกปีงบประมาณ:</label>
      <select
        id="yearFilter"
        v-model="selectedYear"
        class="p-3 border rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 text-lg"
      >
        <option v-for="year in availableYears" :key="year" :value="year">
          ปีงบประมาณ {{ year }}
        </option>
      </select>
    </div>

    <!-- สถานะโหลด/เออเรอร์ -->
    <div v-if="loading" class="text-center py-20">
      <i class="fas fa-spinner fa-spin text-5xl text-teal-500"></i>
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

    <!-- เนื้อหา -->
    <div v-else class="space-y-10">
      <div
        v-for="moit in groupedMoitsByCategory"
        :key="moit.id"
        class="bg-white rounded-xl shadow-lg p-8"
      >
        <h2 class="text-2xl font-bold text-my-custom-gray mb-4">
          <i class="fas fa-folder mr-3 text-emerald-600"></i> {{ moit.moit_name }} {{ moit.title }}
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
              <!-- เอกสารแยกตามหัวข้อย่อย -->
              <div
                v-for="(docs, subTopic) in groupedDocumentsBySubTopic(moit.documents, quarter)"
                :key="subTopic"
              >
                <h4 class="text-lg font-semibold text-gray-800 mb-2">
                  <i class="fas fa-tags mr-2"></i> {{ subTopic || 'เอกสารทั่วไป' }}
                </h4>
                <ul class="list-disc pl-6">
                  <li v-for="doc in docs" :key="doc.id" class="mb-2">
                    <a
                      v-if="doc.fileUrl"
                      href="#"
                      class="text-teal-600 hover:underline"
                      @click.prevent="openFile(doc.fileUrl, doc.title)"
                    >
                      {{ doc.title }}
                    </a>
                    <span v-else class="text-gray-800">{{ doc.title }}</span>
                    <p v-if="doc.description" class="text-sm text-gray-500 italic">
                      {{ doc.description }}
                    </p>
                  </li>
                </ul>
              </div>

              <!-- ไม่มีเอกสารในไตรมาสนี้ -->
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
import type { YearIta, Moit, ItaDocument } from '@/types/ita'
import { itaService } from '@/services/itaService'
import { useToast } from 'vue-toastification'

const toast = useToast()

/* ------------------------------------
 * State
 * ---------------------------------- */
const itaData = ref<YearIta[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const selectedYear = ref<string | null>(null)
const expandedQuarters = ref<Record<string, boolean>>({})

// Development mode check
// const isDev = computed(() => import.meta.env.DEV)

/* ------------------------------------
 * Computed
 * ---------------------------------- */
const availableYears = computed(() => {
  const years = new Set((itaData.value ?? []).map((d) => d.year))
  // เรียงจากปีล่าสุดไปเก่าสุด
  return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))
})

const selectedYearData = computed<YearIta | null>(() => {
  if (!selectedYear.value) return null
  return (itaData.value ?? []).find((d) => d.year === selectedYear.value) ?? null
})

/**
 * จัดกลุ่มเอกสารในแต่ละ MOIT เป็น { sub_topic: ItaDocument[] }
 * (ใช้ในส่วน head ของการ์ดเพื่อเตรียมข้อมูล)
 */
const groupedMoitsByCategory = computed(() => {
  if (!selectedYearData.value) return []

  const moitsWithGroups = selectedYearData.value.moits.map((moit: Moit) => {
    // Logic การจัดกลุ่มเดิม
    const grouped: Record<string, ItaDocument[]> = {}
    for (const doc of moit.documents ?? []) {
      const category = doc.sub_topic || 'เอกสารทั่วไป'
      ;(grouped[category] ??= []).push(doc)
    }
    return { ...moit, groupedDocuments: grouped }
  })

  // 💡 การแก้ไข: เรียงลำดับ MOIT ตามตัวเลข
  moitsWithGroups.sort((a, b) => {
    // 1. ดึงตัวเลข MOIT ออกมา (เช่น "MOIT 11" -> 11)
    const numA = parseInt(a.moit_name.match(/\d+/)?.[0] ?? '0')
    const numB = parseInt(b.moit_name.match(/\d+/)?.[0] ?? '0')

    // 2. เปรียบเทียบตัวเลข
    return numA - numB // เรียงจากน้อยไปมาก
  })

  return moitsWithGroups
})

/* ------------------------------------
 * Helpers (null-safe + quarter normalization)
 * ---------------------------------- */
// ดึงตัวเลขของ quarter ออกมา (รองรับ "1" หรือ "Q1" → คืน "1")
const normalizeQuarterToken = (q?: string) => {
  if (!q) return undefined
  const num = q.match(/\d+/)?.[0]
  return num ?? q
}

// จัดกลุ่มเอกสารตาม sub_topic สำหรับไตรมาสที่กำหนด
const groupedDocumentsBySubTopic = (
  documents: ItaDocument[] | null | undefined,
  quarter: number,
) => {
  const list = documents ?? []
  const q = String(quarter)
  const grouped: Record<string, ItaDocument[]> = {}
  for (const doc of list) {
    if (normalizeQuarterToken(doc.quarter) !== q) continue
    const sub = doc.sub_topic || 'เอกสารทั่วไป'
    ;(grouped[sub] ??= []).push(doc)
  }
  return grouped
}

// มีเอกสารของไตรมาสนี้หรือไม่
const hasDocumentsForQuarter = (documents: ItaDocument[] | null | undefined, quarter: number) => {
  const list = documents ?? []
  const q = String(quarter)
  return list.some((doc) => normalizeQuarterToken(doc.quarter) === q)
}

/* ------------------------------------
 * UI: Accordion
 * ---------------------------------- */
const toggleQuarter = (moitId: string, quarter: number) => {
  const key = `${moitId}-${quarter}`
  const wasOpen = !!expandedQuarters.value[key]
  const next: Record<string, boolean> = {}
  for (const k in expandedQuarters.value) {
    if (!k.startsWith(`${moitId}-`)) next[k] = expandedQuarters.value[k]
  }
  if (!wasOpen) next[key] = true
  expandedQuarters.value = next
}

/* ------------------------------------
 * Data Fetch
 * ---------------------------------- */
const fetchAllITAData = async () => {
  loading.value = true
  error.value = null
  try {
    const dataFromApi = await itaService.getAllTopics()
    itaData.value = dataFromApi
    // ตั้งค่า default ปีล่าสุด
    if (availableYears.value.length > 0) {
      selectedYear.value = availableYears.value[0]
    } else {
      selectedYear.value = null
    }
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

/* ------------------------------------
 * File Opening
 * ---------------------------------- */
const openFile = (fileUrl: string, title: string) => {
  console.log('Opening file:', { fileUrl, title })

  if (!fileUrl) {
    toast.error('ไม่พบลิงก์ไฟล์')
    return
  }

  // เปิดไฟล์ในแท็บใหม่
  window.open(fileUrl, '_blank', 'noopener,noreferrer')
}

onMounted(fetchAllITAData)
</script>

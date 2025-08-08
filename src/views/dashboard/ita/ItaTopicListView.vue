<!-- ItaTopicListView.vue -->
<template>
  <div class="container mx-auto p-8 bg-white rounded-lg shadow-xl">
    <div v-if="yearData" class="mb-8">
      <router-link
        to="/dashboard/ita"
        class="text-blue-600 hover:underline text-lg mb-4 inline-block"
      >
        <i class="fas fa-arrow-left mr-2"></i>กลับไปหน้าจัดการปี
      </router-link>
      <div class="flex justify-between items-center border-b-4 border-blue-500 pb-4">
        <div>
          <h1 class="text-4xl font-extrabold text-blue-800">
            จัดการหัวข้อ ITA ปีงบประมาณ {{ yearData.year }}
          </h1>
          <p class="text-gray-600 mt-2 text-lg">สร้างหรือจัดการหัวข้อหลัก (MOIT) สำหรับปีนี้</p>
        </div>
        <button
          @click="openCreateTopicModal"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-lg flex items-center"
        >
          <i class="fas fa-plus mr-2"></i>
          สร้างหัวข้อใหม่
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-16">
      <i class="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
      <p class="mt-4 text-xl text-gray-600">กำลังโหลดรายการหัวข้อ...</p>
    </div>
    <div v-else-if="error" class="text-center py-16 bg-red-50 p-8 rounded-lg">
      <p class="text-xl text-red-600">เกิดข้อผิดพลาด: {{ error }}</p>
    </div>

    <div v-else class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-blue-100">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              ชื่อหัวข้อ (MOIT)
            </th>
            <th
              class="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              การจัดการ
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="!topics || topics.length === 0">
            <td colspan="3" class="px-6 py-4 text-center text-gray-500">
              ยังไม่มีหัวข้อสำหรับปีงบประมาณนี้
            </td>
          </tr>
          <tr v-for="topic in topics" :key="topic.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ topic.id }}</td>
            <td class="px-6 py-4 text-gray-700">{{ topic.title }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
              <button
                @click="editTopic(topic.id)"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                จัดการเอกสาร
              </button>
              <button @click="deleteTopic(topic.id)" class="text-red-600 hover:text-red-900">
                ลบ
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="isCreateModalOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          สร้างหัวข้อใหม่สำหรับปี {{ yearData?.year }}
        </h2>
        <form @submit.prevent="handleCreateTopicSubmit" class="space-y-6">
          <div>
            <label for="moit-template" class="block text-gray-700 font-bold mb-2"
              >เลือกแม่แบบหัวข้อ (MOIT):</label
            >
            <select
              id="moit-template"
              v-model="newTopicData.templateValue"
              class="shadow border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option disabled value="">-- กรุณาเลือกหัวข้อ --</option>
              <option
                v-for="template in moitTemplates"
                :key="template.value"
                :value="template.value"
              >
                {{ template.value }}: {{ template.text.substring(0, 100) }}...
              </option>
            </select>
          </div>
          <div class="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              @click="isCreateModalOpen = false"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-full"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
            >
              สร้างหัวข้อและไปต่อ
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { itaService } from '@/services/itaService'
import type { YearIta, Moit } from '@/types/ita'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const yearId = route.params.yearId as string

const yearData = ref<YearIta | null>(null)
const topics = ref<Moit[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// State สำหรับ Modal
const isCreateModalOpen = ref(false)
const newTopicData = ref({
  templateValue: '', // จะเก็บค่า value ของ MOIT ที่เลือก เช่น 'MOIT 1'
})

// "แม่แบบ" ของหัวข้อ MOIT
const moitTemplates: { value: string; text: string }[] = [
  { value: 'MOIT 1', text: 'MOIT 1: การวางระบบการเผยแพร่ข้อมูลต่อสาธารณะผ่านเว็บไซต์ของหน่วย' },
  { value: 'MOIT 2', text: 'MOIT 2: การเปิดเผยข้อมูลข่าวสารที่เป็นปัจจุบัน' },
]

const fetchTopicsForYear = async () => {
  loading.value = true
  error.value = null
  try {
    // *** TODO: เราจะต้องเพิ่มฟังก์ชัน getTopicsByYearId ใน service ของเรา ***
    // const result = await itaService.getTopicsByYearId(yearId);
    // yearData.value = { id: result.id, year: result.year, moits: [] }; // เก็บแค่ข้อมูลปี
    // topics.value = result.moits;

    toast.info(`(จำลอง) กำลังโหลดข้อมูลสำหรับ Year ID: ${yearId}`)
    yearData.value = { id: yearId, year: '2568', moits: [], createdAt: '', updatedAt: '' }
    topics.value = [
      {
        id: 'moit-001',
        ita_topic_id: yearId,
        moit_name: 'MOIT 1',
        title: 'MOIT 1: การวางระบบเผยแพร่ข้อมูล',
        documents: [],
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 'moit-002',
        ita_topic_id: yearId,
        moit_name: 'MOIT 2',
        title: 'MOIT 2: การเปิดเผยข้อมูลข่าวสาร',
        documents: [],
        createdAt: '',
        updatedAt: '',
      },
    ]
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
    }
  } finally {
    loading.value = false
  }
}

const openCreateTopicModal = () => {
  newTopicData.value.templateValue = ''
  isCreateModalOpen.value = true
}

const handleCreateTopicSubmit = async () => {
  if (!newTopicData.value.templateValue) {
    toast.error('กรุณาเลือกหัวข้อ')
    return
  }
  const selectedTemplate = moitTemplates.find((t) => t.value === newTopicData.value.templateValue)
  if (!selectedTemplate) return

  const newTitle = selectedTemplate.text

  try {
    toast.info(`กำลังสร้างหัวข้อ: "${selectedTemplate.value}"...`)
    // สังเกตว่าเราส่ง yearId ไปด้วย
    const newTopic = await itaService.createTopic({ yearId: yearId, title: newTitle })
    if (newTopic && newTopic.id) {
      isCreateModalOpen.value = false
      toast.success(`สร้างหัวข้อสำเร็จ!`)
      fetchTopicsForYear()
      router.push(`/dashboard/ita/topic/${newTopic.id}/edit`)
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
    }
    toast.error(error.value || 'ไม่สามารถดึงข้อมูลปีได้')
  }
}

const editTopic = (topicId: string | number) => {
  router.push(`/dashboard/ita/topic/${topicId}/edit`)
}

const deleteTopic = async (topicId: string | number) => {
  // Logic การลบหัวข้อ
}

onMounted(() => {
  fetchTopicsForYear()
})
</script>

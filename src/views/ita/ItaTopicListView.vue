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
              <button
                @click="deleteTopic(topic.id, topic.moit_name)"
                class="text-red-600 hover:text-red-900"
              >
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
import { log } from 'console'

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
  templateValue: '',
})

// "แม่แบบ" ของหัวข้อ MOIT
const moitTemplates = [
  {
    value: 'MOIT 1',
    text: 'MOIT 1: หน่วยงานมีการวางระบบโดยการกำหนดมาตรการการเผยแพร่ข้อมูลต่อสาธารณะ ผ่านเว็บไซต์ของหน่วยงาน',
  },
  { value: 'MOIT 2', text: 'MOIT 2: หน่วยงานมีการเปิดเผยข้อมูลข่าวสารที่เป็นปัจจุบัน' },
  {
    value: 'MOIT 3',
    text: 'MOIT 3: หน่วยงานมีรายงานการวิเคราะห์ผลการจัดซื้อจัดจ้างและการจัดหาพัสดุประจำปีงบประมาณ',
  },
  {
    value: 'MOIT 4',
    text: 'MOIT 4: หน่วยงานมีการวางระบบการจัดซื้อจัดจ้างและการจัดหาพัสดุ ประจำปีงบประมาณ',
  },
  {
    value: 'MOIT 5',
    text: 'MOIT 5: หน่วยงานมีการสรุปผลการจัดซื้อจัดจ้างและการจัดหาพัสดุรายเดือน ประจำปีงบประมาณ',
  },
  { value: 'MOIT 6', text: 'MOIT 6: ผู้บริหารแสดงนโยบายการบริหารและพัฒนาทรัพยากรบุคคล' },
  {
    value: 'MOIT 7',
    text: 'MOIT 7: หน่วยงานมีการรายงานการประเมินและเกี่ยวกับการประเมินผลการปฏิบัติราชการของบุคลากรในหน่วยงาน และเปิดเผยผลการปฏิบัติราชการ ระดับดีเด่น และระดับดีมาก ในที่เปิดเผยให้ทราบ',
  },
  {
    value: 'MOIT 8',
    text: 'MOIT 8: หน่วยงานมีการอบรมให้ความรู้แก่เจ้าหน้าที่ภายในหน่วยงานเกี่ยวกับการเสริมสร้างและพัฒนาทางด้านจริยธรรม และการรักษาวินัยรวมทั้งการป้องกันมิให้กระทำผิดวินัย',
  },
  {
    value: 'MOIT 9',
    text: 'MOIT 9: หน่วยงานมีแนวปฏิบัติการจัดการเรื่องร้องเรียน และช่องทางการร้องเรียน',
  },
  {
    value: 'MOIT 10',
    text: 'MOIT 10: หน่วยงานมีสรุปผลการดำเนินงานเรื่องรัองเรียนการปฏิบัติงานหรือการให้บริการของเจ้าหน้าที่ภายในหน่วยงาน และเรื่องร้องเรียนการทุจริตและประพฤติมิชอบ',
  },
  {
    value: 'MOIT 11',
    text: 'MOIT 11: หน่วยงานของท่านเปิดโอกาสให้ผู้มีส่วนได้ส่วนเสียมีโอกาสเข้ามามีส่วนร่วมในการดำเนินงานตามภารกิจของหน่วยงาน',
  },
  { value: 'MOIT 12', text: 'MOIT 12: หน่วยงานมีมาตรการ "การป้องกันการรับสินบน" ที่เป็นระบบ' },
  {
    value: 'MOIT 13',
    text: 'MOIT 13: หน่วยงานประเมินการดำเนินการตามแนวทางปฏิบัติของหน่วยงาน ในปีงบประมาณตามเกณฑ์จริยธรรมการจัดซื้อจัดหาและการส่งเสริมการขายยาและเวชภัณฑ์ที่มิใช่ยาของกระทรวงสาธารณสุข พ.ศ. 2564',
  },
  {
    value: 'MOIT 14',
    text: 'MOIT 14: หน่วยงานมีแนวทางปฏิบัติเกี่ยวกับการใช้ทรัพย์สินของราชการ และมีขั้นตอนการขออนุญาตเพื่อยืมทรัพย์สินของราชการไปใช้ปฏิบัติในหน่วยงานที่ถูกต้อง',
  },
  {
    value: 'MOIT 15',
    text: 'MOIT 15: หน่วยงานมีแผนปฏิบัติการป้องกัน ปราบปรามการทุจริตและประพฤติมิชอบ และแผนปฏิบัติการส่งเสริมคุณธรรมของชมรมจริยธรรม ประจำปีงบประมาณ',
  },
  {
    value: 'MOIT 16',
    text: 'MOIT 16: หน่วยงานมีรายงานการกำกับติดตามการดำเนินงานตามแผนปฏิบัติการป้องกัน ปราบปรามการทุจริตและประพฤติมิชอบ',
  },
  {
    value: 'MOIT 17',
    text: 'MOIT 17: หน่วยงานมีการประเมินความเสี่ยงการทุจริต ประจำปีงบประมาณอย่างเป็นระบบ',
  },
  {
    value: 'MOIT 18',
    text: 'MOIT 18: หน่วยงานมีการปฏิบัติตามมาตรการป้องกันการทุจริต (การควบคุมความเสี่ยงการทุจริต)',
  },
  {
    value: 'MOIT 19',
    text: 'MOIT 19: หน่วยงานมีการรายงานผลการส่งเสริมการปฏิบัติตามประมวลจริยธรรมข้าราชการพลเรือน:กรณีการเรี่ยไรและกรณีการให้หรือรับของขวัญหรือประโยชน์อื่นใด ประจำปีงบประมาณ',
  },
  {
    value: 'MOIT 20',
    text: 'MOIT 20: หน่วยงานมีการอบรมให้ความรู้ภายในหน่วยงาน เรื่อง ผลประโยชน์ทับซ้อนในหลักสูตร ต้านทุจริตศึกษา(Anti-Corruption Education)กระทรวงสาธารณสุข (ฉบับปรับปรุง) พ.ศ.2565',
  },
  {
    value: 'MOIT 21',
    text: 'MOIT 21: หน่วยงานมีการเผยแพร่เจตจำนงสุจริตของการปฏิบัติหน้าที่ราชการ และนโยบายที่เคารพ สิทธิมนุษยชนและศักดิ์ศรีของผู้ปฏิบัติงานและของผู้บริหาร ต่อสาธารณชน',
  },
  {
    value: 'MOIT 22',
    text: 'MOIT 22: หน่วยงานมีแนวปฏิบัติที่เคารพสิทธิมนุษยชนและศักดิ์ศรีของผู้ปฏิบัติงาน และรายงานการป้องกันและแก้ไขปัญหาการล่วงละเมิดหรือคุกคามทางเพศในการทำงาน ประจำปีงบประมาณ',
  },
]

const fetchTopicsForYear = async () => {
  loading.value = true
  error.value = null
  try {
    const result = await itaService.getTopicsByYearId(yearId)
    yearData.value = result
    topics.value = result.moits
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
    }
    toast.error(error.value || 'ไม่สามารถดึงข้อมูลหัวข้อได้')
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

  try {
    // --- สร้าง "แบบฟอร์ม" (payload) ที่ถูกต้อง ---
    const payload = {
      year_ita_id: yearId, // <-- เปลี่ยนจาก yearId เป็น year_ita_id
      moit_name: selectedTemplate.value,
      title: selectedTemplate.text,
      description: `รายละเอียดของ ${selectedTemplate.value}`,
    }
    // ---------------------------------------------

    toast.info(`กำลังสร้างหัวข้อ: "${selectedTemplate.value}"...`)

    const newTopic = await itaService.createTopic(payload)

    if (newTopic && newTopic.id) {
      isCreateModalOpen.value = false
      toast.success(`สร้างหัวข้อสำเร็จ!`)
      fetchTopicsForYear()
      router.push(`/dashboard/ita/topic/${newTopic.id}/edit`)
    } else {
      throw new Error('ไม่ได้รับ ID ของหัวข้อใหม่จากเซิร์ฟเวอร์')
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      toast.error(err.message)
    } else {
      toast.error('เกิดข้อผิดพลาดในการสร้างหัวข้อใหม่')
    }
  }
}

const editTopic = (topicId: string | number) => {
  router.push(`/dashboard/ita/topic/${topicId}/edit`)
}

// --- 2. ฟังก์ชันลบหัวข้อ (ฉบับสมบูรณ์) ---
const deleteTopic = async (topicId: string | number, topicName: string) => {
  console.log('ปุ่มทำงาน')

  // ใช้ confirm() เพื่อยืนยันการลบ
  if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบหัวข้อ "${topicName}"? การกระทำนี้ไม่สามารถกู้คืนได้!`)) {
    try {
      toast.info(`กำลังลบหัวข้อ "${topicName}"...`)
      await itaService.deleteTopic(topicId)
      toast.success(`ลบหัวข้อ "${topicName}" สำเร็จ!`)
      console.log('ลบสำเร็จ')
      fetchTopicsForYear()
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('เกิดข้อผิดพลาดในการลบหัวข้อ')
      }
    }
  }
}

onMounted(() => {
  fetchTopicsForYear()
})
</script>

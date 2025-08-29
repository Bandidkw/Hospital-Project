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
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-1/6"
            >
              MOIT
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-2/5"
            >
              ชื่อหัวข้อ
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-2/5"
            >
              คำอธิบาย
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
            <td colspan="4" class="px-6 py-4 text-center text-gray-500">
              ยังไม่มีหัวข้อสำหรับปีงบประมาณนี้
            </td>
          </tr>
          <tr v-for="topic in topics" :key="topic.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ topic.moit_name }}</td>
            <td class="px-6 py-4 text-gray-700">{{ topic.title }}</td>
            <td class="px-6 py-4 text-gray-700">{{ topic.description || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
              <button
                @click="editTopic(topic.id)"
                class="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-700"
              >
                <i class="fas fa-folder-open mr-2"></i>จัดการเอกสาร
              </button>
              <button
                @click="openEditTopicModal(topic)"
                class="inline-flex items-center px-4 py-2 bg-yellow-400 text-gray-800 text-sm font-medium rounded-md hover:bg-yellow-500"
              >
                <i class="fas fa-pencil-alt mr-2"></i>แก้ไข
              </button>
              <button
                @click="openDeleteConfirmModal(topic)"
                class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-red-700"
              >
                <i class="fas fa-trash-alt mr-2"></i>ลบ
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">
          {{ isEditing ? 'แก้ไขหัวข้อ' : `สร้างหัวข้อใหม่สำหรับปี ${yearData?.year}` }}
        </h2>
        <form @submit.prevent="handleFormSubmit" class="space-y-6">
          <div v-if="!isEditing">
            <label for="moit-template" class="block text-gray-700 font-bold mb-2"
              >เลือกแม่แบบหัวข้อ (MOIT):</label
            >
            <select
              id="moit-template"
              v-model="formData.templateValue"
              class="shadow border rounded-lg w-full py-3 px-4 text-gray-700"
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
          <div v-else class="space-y-4">
            <div>
              <label for="moit_name" class="block text-gray-700 font-bold mb-2">MOIT:</label>
              <input
                id="moit_name"
                type="text"
                v-model="formData.moit_name"
                class="shadow rounded-lg w-full py-3 px-4 text-gray-700"
                required
              />
            </div>
            <div>
              <label for="title" class="block text-gray-700 font-bold mb-2">ชื่อหัวข้อ:</label>
              <input
                id="title"
                type="text"
                v-model="formData.title"
                class="shadow rounded-lg w-full py-3 px-4 text-gray-700"
                required
              />
            </div>
            <div>
              <label for="description" class="block text-gray-700 font-bold mb-2">คำอธิบาย:</label>
              <textarea
                id="description"
                v-model="formData.description"
                rows="3"
                class="shadow rounded-lg w-full py-3 px-4 text-gray-700"
              ></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              @click="closeModal"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-full"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="isDeleteModalOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h3 class="text-2xl font-bold text-red-700 mb-4 flex items-center">
          <i class="fas fa-exclamation-triangle mr-3"></i>ยืนยันการลบ
        </h3>
        <p class="text-gray-700 mb-6 text-lg">
          คุณแน่ใจหรือไม่ว่าต้องการลบหัวข้อ <br />
          <strong class="text-black">"{{ topicToDelete?.title }}"</strong>?
          <br />
          <span class="text-sm text-red-600">การกระทำนี้ไม่สามารถกู้คืนได้</span>
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="closeDeleteConfirmModal"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-full"
          >
            ยกเลิก
          </button>
          <button
            @click="handleConfirmDelete"
            class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full"
          >
            ยืนยันการลบ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { itaService } from '@/services/itaService'
import type { YearIta, Moit } from '@/types/ita'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// ✅ อ่าน yearId ให้ปลอดภัย (รองรับทั้ง :yearId และ :id)
const yearId = computed(() => (route.params.yearId ?? route.params.id) as string | undefined)

const yearData = ref<YearIta | null>(null)
const topics = ref<Moit[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// --- State ของ Modal สร้าง/แก้ไข ---
const isModalOpen = ref(false)
const isEditing = ref(false)
const formData = ref({
  id: '',
  templateValue: '',
  moit_name: '',
  title: '',
  description: '',
})

// --- State ของ Modal ลบ ---
const isDeleteModalOpen = ref(false)
const topicToDelete = ref<Moit | null>(null)

// "แม่แบบ" ของหัวข้อ MOIT ทั้งหมดสำหรับให้ User เลือก
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
    if (!yearId.value) {
      error.value = 'ไม่พบ yearId ในเส้นทาง'
      return
    }
    const res = await itaService.getYearById(yearId.value)
    yearData.value = res

    // ✅ จัดเรียงหัวข้อ MOIT ตามเลขท้าย
    topics.value = (res.moits ?? []).sort((a, b) => {
      const numA = parseInt(a.moit_name.replace(/\D/g, ''), 10) || 0
      const numB = parseInt(b.moit_name.replace(/\D/g, ''), 10) || 0
      return numA - numB
    })
  } catch (e: unknown) {
    if (e instanceof Error) {
      error.value = e.message
    } else {
      error.value = 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
    }
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

const openCreateTopicModal = () => {
  isEditing.value = false
  formData.value = { id: '', templateValue: '', moit_name: '', title: '', description: '' }
  isModalOpen.value = true
}

const openEditTopicModal = (topicToEdit: Moit) => {
  isEditing.value = true
  formData.value = {
    id: topicToEdit.id,
    moit_name: topicToEdit.moit_name,
    title: topicToEdit.title,
    description: topicToEdit.description || '',
    templateValue: '',
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleFormSubmit = async () => {
  try {
    if (isEditing.value) {
      const payload = {
        moit_name: formData.value.moit_name,
        title: formData.value.title,
        description: formData.value.description,
      }
      toast.info(`กำลังอัปเดตข้อมูล "${payload.moit_name}"...`)
      await itaService.updateTopic(formData.value.id, payload)
      toast.success(`อัปเดตข้อมูลสำเร็จ!`)
    } else {
      const selectedTemplate = moitTemplates.find((t) => t.value === formData.value.templateValue)
      if (!selectedTemplate) {
        toast.error('กรุณาเลือกหัวข้อ')
        return
      }
      if (!yearId.value) {
        toast.error('ไม่พบรหัสปี (yearId)')
        return
      }
      const payload = {
        year_ita_id: yearId.value, // ✅ ใช้ yearId ที่ถูกต้อง
        moit_name: selectedTemplate.value,
        title: selectedTemplate.text,
        description: `รายละเอียดของ ${selectedTemplate.value}`,
      }
      toast.info(`กำลังสร้างหัวข้อ: "${payload.moit_name}"...`)
      await itaService.createTopic(payload)
      toast.success(`สร้างหัวข้อสำเร็จ!`)
    }
    closeModal()
    await fetchTopicsForYear()
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่คาดคิด')
  }
}

const editTopic = (topicId: string | number) => {
  router.push(`/dashboard/ita/topic/${topicId}/edit`)
}

const openDeleteConfirmModal = (topic: Moit) => {
  topicToDelete.value = topic
  isDeleteModalOpen.value = true
}

const closeDeleteConfirmModal = () => {
  isDeleteModalOpen.value = false
  topicToDelete.value = null
}

const handleConfirmDelete = async () => {
  if (!topicToDelete.value) return
  try {
    toast.info(`กำลังลบ "${topicToDelete.value.title}"...`)
    await itaService.deleteTopic(topicToDelete.value.id)
    toast.success(`ลบ "${topicToDelete.value.title}" สำเร็จ!`)
    closeDeleteConfirmModal()
    await fetchTopicsForYear()
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการลบหัวข้อ')
  }
}

onMounted(fetchTopicsForYear)
</script>

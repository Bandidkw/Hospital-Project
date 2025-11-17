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
                class="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-green-700 transition duration-150"
              >
                <i class="fas fa-folder-open mr-2"></i>จัดการเอกสาร
              </button>
              <button
                @click="openEditTopicModal(topic)"
                class="inline-flex items-center px-4 py-2 bg-yellow-400 text-gray-800 text-sm font-medium rounded-md hover:bg-yellow-500 transition duration-150"
              >
                <i class="fas fa-pencil-alt mr-2"></i>แก้ไข
              </button>
              <button
                @click="openDeleteConfirmModal(topic)"
                class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-red-700 transition duration-150"
              >
                <i class="fas fa-trash-alt mr-2"></i>ลบ
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ItaTopicFormModal
      :isOpen="isModalOpen"
      :isEditing="isEditing"
      :year="Number(yearData?.year ?? 0)"
      :formData="formData"
      :moitTemplates="moitTemplates"
      @close="closeModal"
      @save="handleFormSubmit"
    />

    <DeleteConfirmModal
      :isOpen="isDeleteModalOpen"
      :itemTitle="topicToDelete?.title ?? 'รายการนี้'"
      @close="closeDeleteConfirmModal"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// สมมติว่า itaService ถูก Import ถูกต้อง
import { itaService } from '@/services/itaService'
// สมมติว่า Type ถูก Import ถูกต้อง
import type { YearIta, Moit } from '@/types/ita'
import { useToast } from 'vue-toastification'

// 💡 Import Components ใหม่
import ItaTopicFormModal from '@/components/ita/ItaTopicFormModal.vue'
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// 💡 [Interface สำหรับ Form Data]
interface TopicFormData {
  id: string
  templateValue: string
  moit_name: string
  title: string
  description: string
}

// ✅ อ่าน yearId ให้ปลอดภัย
const yearId = computed(() => (route.params.yearId ?? route.params.id) as string | undefined)

const yearData = ref<YearIta | null>(null)
const topics = ref<Moit[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// --- State ของ Modal สร้าง/แก้ไข ---
const isModalOpen = ref(false)
const isEditing = ref(false)
const formData = ref<TopicFormData>({
  id: '',
  templateValue: '',
  moit_name: '',
  title: '',
  description: '',
})

// --- State ของ Modal ลบ ---
const isDeleteModalOpen = ref(false)
const topicToDelete = ref<Moit | null>(null)

// "แม่แบบ" ของหัวข้อ MOIT ทั้งหมด (ย้ายมาอยู่ที่นี่เพื่อให้ Parent ส่งให้ Child)
const moitTemplates = [
  {
    value: 'MOIT 1',
    text: 'หน่วยงานมีการวางระบบโดยการกำหนดมาตรการการเผยแพร่ข้อมูลต่อสาธารณะ ผ่านเว็บไซต์ของหน่วยงาน',
  },
  { value: 'MOIT 2', text: 'หน่วยงานมีการเปิดเผยข้อมูลข่าวสารที่เป็นปัจจุบัน' },
  {
    value: 'MOIT 3',
    text: 'หน่วยงานมีรายงานการวิเคราะห์ผลการจัดซื้อจัดจ้างและการจัดหาพัสดุประจำปีงบประมาณ',
  },
  {
    value: 'MOIT 4',
    text: 'หน่วยงานมีการวางระบบการจัดซื้อจัดจ้างและการจัดหาพัสดุ ประจำปีงบประมาณ',
  },
  {
    value: 'MOIT 5',
    text: 'หน่วยงานมีการสรุปผลการจัดซื้อจัดจ้างและการจัดหาพัสดุรายเดือน ประจำปีงบประมาณ',
  },
  { value: 'MOIT 6', text: 'ผู้บริหารแสดงนโยบายการบริหารและพัฒนาทรัพยากรบุคคล' },
  {
    value: 'MOIT 7',
    text: 'หน่วยงานมีการรายงานการประเมินและเกี่ยวกับการประเมินผลการปฏิบัติราชการของบุคลากรในหน่วยงาน และเปิดเผยผลการปฏิบัติราชการ ระดับดีเด่น และระดับดีมาก ในที่เปิดเผยให้ทราบ',
  },
  {
    value: 'MOIT 8',
    text: 'หน่วยงานมีการอบรมให้ความรู้แก่เจ้าหน้าที่ภายในหน่วยงานเกี่ยวกับการเสริมสร้างและพัฒนาทางด้านจริยธรรม และการรักษาวินัยรวมทั้งการป้องกันมิให้กระทำผิดวินัย',
  },
  { value: 'MOIT 9', text: 'หน่วยงานมีแนวปฏิบัติการจัดการเรื่องร้องเรียน และช่องทางการร้องเรียน' },
  {
    value: 'MOIT 10',
    text: 'หน่วยงานมีสรุปผลการดำเนินงานเรื่องรัองเรียนการปฏิบัติงานหรือการให้บริการของเจ้าหน้าที่ภายในหน่วยงาน และเรื่องร้องเรียนการทุจริตและประพฤติมิชอบ',
  },
  {
    value: 'MOIT 11',
    text: 'หน่วยงานของท่านเปิดโอกาสให้ผู้มีส่วนได้ส่วนเสียมีโอกาสเข้ามามีส่วนร่วมในการดำเนินงานตามภารกิจของหน่วยงาน',
  },
  { value: 'MOIT 12', text: 'หน่วยงานมีมาตรการ "การป้องกันการรับสินบน" ที่เป็นระบบ' },
  {
    value: 'MOIT 13',
    text: 'หน่วยงานประเมินการดำเนินการตามแนวทางปฏิบัติของหน่วยงาน ในปีงบประมาณตามเกณฑ์จริยธรรมการจัดซื้อจัดหาและการส่งเสริมการขายยาและเวชภัณฑ์ที่มิใช่ยาของกระทรวงสาธารณสุข พ.ศ. 2564',
  },
  {
    value: 'MOIT 14',
    text: 'หน่วยงานมีแนวทางปฏิบัติเกี่ยวกับการใช้ทรัพย์สินของราชการ และมีขั้นตอนการขออนุญาตเพื่อยืมทรัพย์สินของราชการไปใช้ปฏิบัติในหน่วยงานที่ถูกต้อง',
  },
  {
    value: 'MOIT 15',
    text: 'หน่วยงานมีแผนปฏิบัติการป้องกัน ปราบปรามการทุจริตและประพฤติมิชอบ และแผนปฏิบัติการส่งเสริมคุณธรรมของชมรมจริยธรรม ประจำปีงบประมาณ',
  },
  {
    value: 'MOIT 16',
    text: 'หน่วยงานมีรายงานการกำกับติดตามการดำเนินงานตามแผนปฏิบัติการป้องกัน ปราบปรามการทุจริตและประพฤติมิชอบ',
  },
  {
    value: 'MOIT 17',
    text: 'หน่วยงานมีการประเมินความเสี่ยงการทุจริต ประจำปีงบประมาณอย่างเป็นระบบ',
  },
  {
    value: 'MOIT 18',
    text: 'หน่วยงานมีการปฏิบัติตามมาตรการป้องกันการทุจริต (การควบคุมความเสี่ยงการทุจริต)',
  },
  {
    value: 'MOIT 19',
    text: 'หน่วยงานมีการรายงานผลการส่งเสริมการปฏิบัติตามประมวลจริยธรรมข้าราชการพลเรือน:กรณีการเรี่ยไรและกรณีการให้หรือรับของขวัญหรือประโยชน์อื่นใด ประจำปีงบประมาณ',
  },
  {
    value: 'MOIT 20',
    text: 'หน่วยงานมีการอบรมให้ความรู้ภายในหน่วยงาน เรื่อง ผลประโยชน์ทับซ้อนในหลักสูตร ต้านทุจริตศึกษา(Anti-Corruption Education)กระทรวงสาธารณสุข (ฉบับปรับปรุง) พ.ศ.2565',
  },
  {
    value: 'MOIT 21',
    text: 'หน่วยงานมีการเผยแพร่เจตจำนงสุจริตของการปฏิบัติหน้าที่ราชการ และนโยบายที่เคารพ สิทธิมนุษยชนและศักดิ์ศรีของผู้ปฏิบัติงานและของผู้บริหาร ต่อสาธารณชน',
  },
  {
    value: 'MOIT 22',
    text: 'หน่วยงานมีแนวปฏิบัติที่เคารพสิทธิมนุษยชนและศักดิ์ศรีของผู้ปฏิบัติงาน และรายงานการป้องกันและแก้ไขปัญหาการล่วงละเมิดหรือคุกคามทางเพศในการทำงาน ประจำปีงบประมาณ',
  },
]

// ------------------------------------------------------------------
// READ (Fetch Data)
// ------------------------------------------------------------------
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

// ------------------------------------------------------------------
// CREATE / UPDATE (Modal Logic)
// ------------------------------------------------------------------

const openCreateTopicModal = () => {
  isEditing.value = false
  // Reset formData สำหรับโหมดสร้าง
  formData.value = { id: '', templateValue: '', moit_name: '', title: '', description: '' }
  isModalOpen.value = true
}

const openEditTopicModal = (topicToEdit: Moit) => {
  isEditing.value = true
  // Populate formData สำหรับโหมดแก้ไข
  formData.value = {
    id: topicToEdit.id,
    templateValue: '',
    moit_name: topicToEdit.moit_name,
    title: topicToEdit.title,
    description: topicToEdit.description || '',
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// 💡 [Event Handler จาก Child Component]
const handleFormSubmit = async (data: TopicFormData) => {
  try {
    if (data.id) {
      // โหมด UPDATE
      const payload = {
        moit_name: data.moit_name,
        title: data.title,
        description: data.description,
      }
      toast.info(`กำลังอัปเดตข้อมูล "${payload.moit_name}"...`)
      await itaService.updateTopic(data.id, payload)
      toast.success(`อัปเดตข้อมูลสำเร็จ!`)
    } else {
      // โหมด CREATE
      if (!yearId.value) {
        toast.error('ไม่พบรหัสปี (yearId)')
        return
      }
      if (!data.moit_name) {
        toast.error('กรุณาเลือกหัวข้อแม่แบบ')
        return
      }
      const payload = {
        year_ita_id: yearId.value,
        moit_name: data.moit_name,
        title: data.title,
        description: data.description,
      }
      toast.info(`กำลังสร้างหัวข้อ: "${payload.moit_name}"...`)
      await itaService.createTopic(payload)
      toast.success(`สร้างหัวข้อสำเร็จ!`)
    }
    closeModal()
    await fetchTopicsForYear()
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
  }
}

const editTopic = (topicId: string | number) => {
  // นำทางไปหน้าจัดการเอกสาร
  router.push(`/dashboard/ita/topic/${topicId}/edit`)
}

// ------------------------------------------------------------------
// DELETE (Modal Logic)
// ------------------------------------------------------------------

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

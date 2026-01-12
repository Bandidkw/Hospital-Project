<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-xl">
    <h1
      class="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-4 border-b-4 border-blue-500 pb-2"
    >
      จัดการเอกสาร ITA
    </h1>
    <p class="text-gray-600 mb-8 text-lg">
      เพิ่ม แก้ไข หรือลบเอกสาร ITA (การประเมินคุณธรรมและความโปร่งใส) สำหรับปีงบประมาณต่างๆ
    </p>

    <!-- ฟอร์มสำหรับเพิ่ม/แก้ไขเอกสาร ITA -->
    <div class="bg-blue-50 p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-2xl font-semibold text-blue-700 mb-6">
        {{ editingDocument ? 'แก้ไขเอกสาร ITA' : 'เพิ่มเอกสาร ITA ใหม่' }}
      </h2>
      <form @submit.prevent="saveITADocument">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mb-4">
            <label for="documentName" class="block text-gray-700 text-sm font-bold mb-2"
              >ชื่อเอกสาร:</label
            >
            <input
              type="text"
              id="documentName"
              v-model="currentDocument.name"
              placeholder="เช่น รายงานผล ITA 2567"
              class="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div class="mb-4">
            <label for="budgetYear" class="block text-gray-700 text-sm font-bold mb-2"
              >ปีงบประมาณ:</label
            >
            <select
              id="budgetYear"
              v-model="currentDocument.year"
              class="shadow border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="year in getYearsList()" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="mb-4">
            <label for="quarter" class="block text-gray-700 text-sm font-bold mb-2">ไตรมาส:</label>
            <select
              id="quarter"
              v-model="currentDocument.quarter"
              class="shadow border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Q1">ไตรมาส 1</option>
              <option value="Q2">ไตรมาส 2</option>
              <option value="Q3">ไตรมาส 3</option>
              <option value="Q4">ไตรมาส 4</option>
            </select>
          </div>
          <!-- หัวข้อ ITA (MOIT) สำหรับ Dropdown -->
          <div class="mb-4">
            <label for="moitTopic" class="block text-gray-700 text-sm font-bold mb-2"
              >หัวข้อ ITA (MOIT):</label
            >
            <select
              id="moitTopic"
              v-model="currentDocument.moitTopic"
              @change="resetSubTopic"
              class="shadow border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="topic in itaTopics" :key="topic.value" :value="topic.value">
                {{ topic.shortText }}
              </option>
            </select>
          </div>
        </div>

        <!-- หัวข้อย่อย / ประเภทเอกสาร (Dynamic Dropdown) -->
        <div class="mb-4">
          <label for="subTopic" class="block text-gray-700 text-sm font-bold mb-2"
            >หัวข้อย่อย / ประเภทเอกสาร:</label
          >
          <select
            id="subTopic"
            v-model="currentDocument.subTopic"
            class="shadow border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">--- เลือกหัวข้อย่อย / ประเภทเอกสาร ---</option>
            <option v-for="sub in availableSubTopics" :key="sub.value" :value="sub.value">
              {{ sub.text }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label for="description" class="block text-gray-700 text-sm font-bold mb-2"
            >คำอธิบาย:</label
          >
          <textarea
            id="description"
            v-model="currentDocument.description"
            placeholder="คำอธิบายเพิ่มเติมเกี่ยวกับเอกสาร"
            rows="3"
            class="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>

        <!-- อัปโหลดไฟล์เอกสาร -->
        <div class="mb-6">
          <label for="documentFile" class="block text-gray-700 text-sm font-bold mb-2"
            >อัปโหลดไฟล์เอกสาร (PDF):</label
          >
          <input
            type="file"
            id="documentFile"
            accept=".pdf"
            @change="handleFileUpload"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer rounded-lg"
          />
          <p v-if="selectedFileName" class="text-sm text-gray-600 mt-2">
            ไฟล์ที่เลือก: <span class="font-medium text-blue-800">{{ selectedFileName }}</span>
          </p>
          <p v-else-if="currentDocument.url" class="text-sm text-gray-600 mt-2">
            ไฟล์ปัจจุบัน:
            <span class="font-medium text-blue-800">{{
              currentDocument.url.split('/').pop()
            }}</span>
          </p>
          <p class="text-xs text-gray-500 mt-1">
            รองรับเฉพาะไฟล์ PDF เท่านั้น (การอัปโหลดจริงต้องมี Backend)
          </p>
        </div>

        <div class="flex items-center justify-end space-x-4">
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-lg"
          >
            {{ editingDocument ? 'บันทึกการแก้ไข' : 'เพิ่มเอกสาร' }}
          </button>
          <button
            type="button"
            @click="cancelEdit"
            v-if="editingDocument"
            class="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105 shadow-lg"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>

    <!-- ตารางแสดงรายการเอกสาร -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-blue-700 mb-6 flex items-center">
        รายการเอกสาร ITA ทั้งหมด
        <span class="ml-auto text-base text-gray-500"
          >รวม {{ sortedITADocuments.length }} รายการ</span
        >
      </h2>
      <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-blue-100">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                ชื่อเอกสาร
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                ปี
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                ไตรมาส
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                หัวข้อ MOIT
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                หัวข้อย่อย
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                การจัดการ
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="sortedITADocuments.length === 0">
              <td colspan="6" class="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                ยังไม่มีเอกสาร ITA ในระบบ.
              </td>
            </tr>
            <tr v-for="doc in sortedITADocuments" :key="doc.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <a
                  :href="doc.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  {{ doc.name }}
                </a>
                <p v-if="doc.description" class="text-xs text-gray-500 mt-1">
                  {{ doc.description }}
                </p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                {{ doc.year }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                {{ doc.quarter }}
              </td>
              <td class="px-6 py-4 text-gray-700 max-w-xs overflow-hidden text-ellipsis">
                <!-- แสดงชื่อเต็มในตาราง -->
                {{ getMoitTopicText(doc.moitTopic) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-700">
                {{ getSubTopicText(doc.moitTopic, doc.subTopic) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button
                  @click="editITADocument(doc)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3 transform transition duration-300 hover:scale-110"
                >
                  แก้ไข
                </button>
                <button
                  @click="confirmDeleteITADocument(doc.id)"
                  class="text-red-600 hover:text-red-900 transform transition duration-300 hover:scale-110"
                >
                  ลบ
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal ยืนยันการลบ -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full transform transition-all scale-100 opacity-100"
      >
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">
          คุณแน่ใจหรือไม่ว่าต้องการลบเอกสารนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="cancelDelete"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-full focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105"
          >
            ยกเลิก
          </button>
          <button
            @click="deleteITADocument"
            class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full focus:outline-none focus:shadow-outline transform transition duration-300 hover:scale-105"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

// เริ่มต้นใช้งาน Toast
const toast = useToast()

// Interface สำหรับโครงสร้างเอกสาร ITA
interface ITADocument {
  id: number
  name: string
  year: number
  quarter: string
  moitTopic: string // เก็บค่า 'value' เช่น "MOIT 1"
  subTopic: string // เก็บค่า 'value' ของหัวข้อย่อย
  description: string
  url: string // เก็บ simulate file path/name
}

import {
  ITA_TOPICS as itaTopics,
  MOIT_SUB_TOPIC_MAPPING as moitSubTopicMapping,
} from '@/features/ita/itaConstants'

// Dummy data for demonstration
const itaDocuments = ref<ITADocument[]>([
  {
    id: 1,
    name: 'รายงานผลการประเมิน ITA ประจำปี 2566',
    year: 2566,
    quarter: 'Q4',
    moitTopic: 'MOIT 1',
    subTopic: 'PUB_INFO_TRACKING_REPORT',
    description: 'สรุปผลการประประเมิน ITA ของหน่วยงานในปีงบประมาณ 2566',
    url: 'https://www.africau.edu/images/default/sample.pdf',
  },
  {
    id: 2,
    name: 'แผนปฏิบัติการป้องกันการทุจริต 2567',
    year: 2567,
    quarter: 'Q1',
    moitTopic: 'MOIT 2',
    subTopic: 'MOPH_ANTI_CORRUPTION_PLAN',
    description: 'แผนงานและมาตรการป้องกันการทุจริตของกระทรวงสาธารณสุข',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 3,
    name: 'รายงานวิเคราะห์จัดซื้อจัดจ้าง 2566',
    year: 2566,
    quarter: 'Q2',
    moitTopic: 'MOIT 3',
    subTopic: 'PROCUREMENT_ANALYSIS_REPORT',
    description: 'รายงานการวิเคราะห์ผลการจัดซื้อจัดจ้างและการจัดหาพัสดุประจำปีงบประมาณ 2566',
    url: 'https://www.africau.edu/images/default/sample.pdf',
  },
  {
    id: 4,
    name: 'ประกาศแผนจัดซื้อจัดจ้าง 2567',
    year: 2567,
    quarter: 'Q1',
    moitTopic: 'MOIT 4',
    subTopic: 'PROCUREMENT_PLAN_ANNOUNCE',
    description: 'ประกาศเผยแพร่แผนการจัดซื้อจัดจ้างและการจัดหาพัสดุ ประจำปี 2567',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
])

// สถานะ Reactive สำหรับเอกสารที่กำลังแก้ไข/เพิ่ม
const currentDocument = ref<ITADocument>({
  id: 0,
  name: '',
  year: getYearsList()[0], // กำหนดปีเริ่มต้นเป็นปีปัจจุบัน
  quarter: 'Q1',
  moitTopic: itaTopics[0].value, // กำหนดหัวข้อ MOIT เริ่มต้นเป็น MOIT 1
  subTopic: '', // กำหนดหัวข้อย่อยเริ่มต้นเป็นค่าว่าง
  description: '',
  url: '',
})

// สถานะสำหรับการอัปโหลดไฟล์
const selectedFile = ref<File | null>(null)
const selectedFileName = ref<string | null>(null)

// แฟล็กเพื่อระบุว่ากำลังแก้ไขเอกสารที่มีอยู่หรือไม่
const editingDocument = ref(false)

// สถานะสำหรับ Modal ยืนยันการลบ
const documentToDeleteId = ref<number | null>(null)
const showConfirmModal = ref(false)

// ฟังก์ชันสร้างรายการปี (พ.ศ.)
function getYearsList(): number[] {
  const currentBuddhistYear = new Date().getFullYear() + 543
  const years = []
  // รวมปีปัจจุบัน + 2 ปีข้างหน้า
  for (let i = 0; i <= 2; i++) {
    years.push(currentBuddhistYear + i)
  }
  // รวม 5 ปีย้อนหลัง
  for (let i = 1; i <= 5; i++) {
    years.unshift(currentBuddhistYear - i)
  }
  return years.sort((a, b) => b - a) // เรียงลำดับจากมากไปน้อย
}

// Computed property สำหรับกรองหัวข้อย่อยตามหัวข้อ MOIT ที่เลือก
const availableSubTopics = computed(() => {
  const selectedMoitTopic = currentDocument.value.moitTopic
  return moitSubTopicMapping[selectedMoitTopic] || []
})

// รีเซ็ตหัวข้อย่อยเมื่อหัวข้อ MOIT เปลี่ยน
const resetSubTopic = () => {
  currentDocument.value.subTopic = ''
}

// Computed property สำหรับเรียงลำดับเอกสารตามปี (มากไปน้อย) และไตรมาส (น้อยไปมาก)
const sortedITADocuments = computed(() => {
  return [...itaDocuments.value].sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year
    }
    const quarterOrder = { Q1: 1, Q2: 2, Q3: 3, Q4: 4 }
    return (
      quarterOrder[a.quarter as keyof typeof quarterOrder] -
      quarterOrder[b.quarter as keyof typeof quarterOrder]
    )
  })
})

// ฟังก์ชันช่วยดึงข้อความเต็มของหัวข้อ MOIT สำหรับแสดงในตาราง
const getMoitTopicText = (moitValue: string) => {
  const topic = itaTopics.find((t) => t.value === moitValue)
  return topic ? topic.text : moitValue
}

// ฟังก์ชันช่วยดึงข้อความเต็มของหัวข้อย่อยสำหรับแสดงในตาราง
const getSubTopicText = (moitValue: string, subValue: string) => {
  const subTopicsForMoit = moitSubTopicMapping[moitValue] || []
  const sub = subTopicsForMoit.find((s) => s.value === subValue)
  return sub ? sub.text : subValue
}

// จัดการการเปลี่ยนแปลงไฟล์ที่เลือก
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    selectedFileName.value = target.files[0].name
  } else {
    selectedFile.value = null
    selectedFileName.value = null
  }
}

// บันทึกหรืออัปเดตเอกสาร ITA
const saveITADocument = () => {
  // ตรวจสอบความถูกต้องเบื้องต้น
  if (
    !currentDocument.value.name ||
    !currentDocument.value.year ||
    !currentDocument.value.quarter ||
    !currentDocument.value.moitTopic ||
    !currentDocument.value.subTopic
  ) {
    toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
    return
  }

  // การจำลองการอัปโหลดไฟล์
  if (selectedFile.value) {
    currentDocument.value.url = `uploads/${selectedFile.value.name}` // URL จำลอง
    toast.info(`จำลองการอัปโหลดไฟล์: ${selectedFile.value.name}`)
  } else if (!currentDocument.value.url && !editingDocument.value) {
    toast.error('กรุณาเลือกไฟล์ PDF สำหรับเอกสารใหม่')
    return
  }

  if (editingDocument.value) {
    // อัปเดตเอกสารที่มีอยู่
    const index = itaDocuments.value.findIndex((doc) => doc.id === currentDocument.value.id)
    if (index !== -1) {
      itaDocuments.value[index] = { ...currentDocument.value }
      toast.success('บันทึกการแก้ไขเอกสาร ITA สำเร็จ!')
    }
  } else {
    // เพิ่มเอกสารใหม่
    const newId =
      itaDocuments.value.length > 0 ? Math.max(...itaDocuments.value.map((doc) => doc.id)) + 1 : 1
    currentDocument.value.id = newId
    itaDocuments.value.push({ ...currentDocument.value })
    toast.success('เพิ่มเอกสาร ITA สำเร็จ!')
  }
  resetForm() // ล้างฟอร์มหลังจากบันทึก
}

// ใส่ข้อมูลในฟอร์มเพื่อแก้ไข
const editITADocument = (doc: ITADocument) => {
  currentDocument.value = { ...doc } // สร้างสำเนาเพื่อหลีกเลี่ยงการเปลี่ยนแปลงโดยตรง
  editingDocument.value = true
  selectedFile.value = null // ล้างไฟล์ที่เลือกไว้ก่อนหน้า
  selectedFileName.value = null // ล้างชื่อไฟล์ที่เลือก

  // หากเอกสารที่กำลังแก้ไขมี URL ให้แสดงชื่อไฟล์ปัจจุบัน
  if (doc.url) {
    selectedFileName.value = doc.url.split('/').pop() || null
  }
}

// ยกเลิกการแก้ไขและรีเซ็ตฟอร์ม
const cancelEdit = () => {
  resetForm()
}

// แสดง Modal ยืนยันการลบ
const confirmDeleteITADocument = (id: number) => {
  documentToDeleteId.value = id
  showConfirmModal.value = true
}

// ลบเอกสารหลังจากยืนยัน
const deleteITADocument = () => {
  if (documentToDeleteId.value !== null) {
    itaDocuments.value = itaDocuments.value.filter((doc) => doc.id !== documentToDeleteId.value)
    toast.success('ลบเอกสาร ITA สำเร็จ!')
  }
  resetDeleteConfirm() // ปิด Modal และรีเซ็ตสถานะ
}

// ยกเลิกการลบ
const cancelDelete = () => {
  resetDeleteConfirm()
}

// รีเซ็ตฟอร์มเป็นสถานะเริ่มต้น
const resetForm = () => {
  currentDocument.value = {
    id: 0,
    name: '',
    year: getYearsList()[0],
    quarter: 'Q1',
    moitTopic: itaTopics[0].value,
    subTopic: '',
    description: '',
    url: '',
  }
  editingDocument.value = false
  selectedFile.value = null
  selectedFileName.value = null
}

// รีเซ็ตสถานะ Modal ยืนยันการลบ
const resetDeleteConfirm = () => {
  documentToDeleteId.value = null
  showConfirmModal.value = false
}
</script>

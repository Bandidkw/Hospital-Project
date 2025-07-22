<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-award mr-3 text-emerald-500"></i> จัดการเอกสาร ITA
    </h2>
    <p class="text-gray-700 mb-6">
      หน้านี้ใช้สำหรับเพิ่ม, แก้ไข, และลบเอกสารการประเมินคุณธรรมและความโปร่งใส (ITA).
    </p>

    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">
        {{ editingDocument ? 'แก้ไขเอกสาร ITA' : 'เพิ่มเอกสาร ITA ใหม่' }}
      </h3>
      <form @submit.prevent="saveITADocument" class="space-y-4">
        <div>
          <label for="documentTitle" class="block text-sm font-medium text-gray-700"
            >ชื่อเอกสาร:</label
          >
          <input
            type="text"
            id="documentTitle"
            v-model="currentDocument.title"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="documentYear" class="block text-sm font-medium text-gray-700"
              >ปีงบประมาณ:</label
            >
            <select
              id="documentYear"
              v-model="currentDocument.year"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- เลือกปี --</option>
              <option v-for="year in getYearsList()" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          <div>
            <label for="documentQuarter" class="block text-sm font-medium text-gray-700"
              >ไตรมาส:</label
            >
            <select
              id="documentQuarter"
              v-model="currentDocument.quarter"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- เลือกไตรมาส --</option>
              <option value="1">ไตรมาส 1</option>
              <!-- CHANGED: value to '1' -->
              <option value="2">ไตรมาส 2</option>
              <!-- CHANGED: value to '2' -->
              <option value="3">ไตรมาส 3</option>
              <!-- CHANGED: value to '3' -->
              <option value="4">ไตรมาส 4</option>
              <!-- CHANGED: value to '4' -->
            </select>
          </div>
        </div>
        <div>
          <label for="documentTopic" class="block text-sm font-medium text-gray-700"
            >หัวข้อ ITA (MOIT):</label
          >
          <select
            id="documentTopic"
            v-model="currentDocument.topic"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">-- เลือกหัวข้อ MOIT --</option>
            <option v-for="topic in itaTopics" :key="topic" :value="topic">{{ topic }}</option>
          </select>
        </div>
        <!-- New field for Sub Topic -->
        <div>
          <label for="documentSubTopic" class="block text-sm font-medium text-gray-700"
            >หัวข้อย่อย (ประเภทเอกสาร):</label
          >
          <select
            id="documentSubTopic"
            v-model="currentDocument.subTopic"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- เลือกหัวข้อย่อย (ไม่บังคับ) --</option>
            <option value="คำสั่ง">คำสั่ง</option>
            <option value="ประกาศ">ประกาศ</option>
            <option value="รายงานผล">รายงานผล</option>
            <option value="แผนปฏิบัติการ">แผนปฏิบัติการ</option>
            <option value="คู่มือ">คู่มือ</option>
            <option value="แนวปฏิบัติ">แนวปฏิบัติ</option>
            <option value="อื่นๆ">อื่นๆ</option>
          </select>
        </div>
        <div>
          <label for="documentDescription" class="block text-sm font-medium text-gray-700"
            >คำอธิบาย (Optional):</label
          >
          <textarea
            id="documentDescription"
            v-model="currentDocument.description"
            rows="3"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        <div>
          <label for="documentUrl" class="block text-sm font-medium text-gray-700"
            >URL ไฟล์เอกสาร (PDF/Doc):</label
          >
          <input
            type="url"
            id="documentUrl"
            v-model="currentDocument.url"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="เช่น https://example.com/document.pdf"
            required
          />
          <p class="text-xs text-gray-500 mt-1">
            สำหรับตอนนี้ใช้ URL ตรงๆ เมื่อมี Backend จะเปลี่ยนเป็นระบบอัปโหลดไฟล์
          </p>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            type="submit"
            class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            <i class="fas fa-save mr-2"></i>
            {{ editingDocument ? 'บันทึกการแก้ไข' : 'เพิ่มเอกสาร' }}
          </button>
          <button
            v-if="editingDocument"
            type="button"
            @click="cancelEdit"
            class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300"
          >
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </form>
    </div>

    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รายการเอกสาร ITA</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">ชื่อเอกสาร</th>
              <th class="py-3 px-6 text-left">ปี</th>
              <th class="py-3 px-6 text-left">ไตรมาส</th>
              <th class="py-3 px-6 text-left">หัวข้อ MOIT</th>
              <th class="py-3 px-6 text-left">หัวข้อย่อย</th>
              <!-- New column for Sub Topic -->
              <th class="py-3 px-6 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr
              v-for="doc in sortedITADocuments"
              :key="doc.id"
              class="border-b border-gray-200 hover:bg-gray-50"
            >
              <td class="py-3 px-6 text-left">
                <a
                  :href="doc.url"
                  target="_blank"
                  class="text-blue-600 hover:underline flex items-center"
                >
                  <i class="fas fa-file-alt mr-2"></i> {{ doc.title }}
                </a>
              </td>
              <td class="py-3 px-6 text-left">{{ doc.year }}</td>
              <td class="py-3 px-6 text-left">{{ doc.quarter }}</td>
              <td class="py-3 px-6 text-left">{{ doc.topic }}</td>
              <td class="py-3 px-6 text-left">{{ doc.subTopic || '-' }}</td>
              <!-- Display Sub Topic -->
              <td class="py-3 px-6 text-center">
                <button
                  @click="editITADocument(doc)"
                  class="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs hover:bg-yellow-600 transition duration-300 mr-2"
                >
                  <i class="fas fa-edit"></i> แก้ไข
                </button>
                <button
                  @click="confirmDeleteITADocument(doc.id)"
                  class="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition duration-300"
                >
                  <i class="fas fa-trash-alt"></i> ลบ
                </button>
              </td>
            </tr>
            <tr v-if="itaDocuments.length === 0">
              <td colspan="6" class="py-8 text-center text-gray-500">ยังไม่มีเอกสาร ITA ในระบบ.</td>
              <!-- Updated colspan -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบเอกสาร ITA นี้?</p>
        <div class="flex justify-center space-x-4">
          <button
            @click="deleteITADocument"
            class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300"
          >
            <i class="fas fa-trash-alt mr-2"></i> ลบ
          </button>
          <button
            @click="cancelDelete"
            class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300"
          >
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

// Interface for ITA Document
interface ITADocument {
  id: number
  title: string
  year: number
  quarter: string // Changed to string for flexibility
  topic: string // Main MOIT topic, e.g., 'MOIT 1: ...'
  subTopic?: string // New field for sub-topic, e.g., 'คำสั่ง', 'รายงานผล'
  description?: string
  url: string // URL to the actual document file
}

// Mock data for ITA Documents (admin view)
const itaDocuments = ref<ITADocument[]>([
  {
    id: 1,
    title: 'เอกสารโครงสร้างองค์กร 2567',
    year: 2567,
    quarter: '1', // CHANGED: from 'Q1' to '1'
    topic:
      'MOIT 1 หน่วยงานมีการวางระบบโดยการกำหนดมาตรการการเผยแพร่ข้อมูลต่อสาธารณะ ผ่านเว็บไซต์ของหน่วยงาน',
    subTopic: 'คำสั่ง', // Example subTopic
    description: 'เอกสารโครงสร้างองค์กรล่าสุด',
    url: 'https://www.africau.edu/images/default/sample.pdf',
  },
  {
    id: 2,
    title: 'แผนการจัดซื้อจัดจ้าง 2567',
    year: 2567,
    quarter: '1', // CHANGED: from 'Q1' to '1'
    topic: 'MOIT 3 หน่วยงานมีรายงานการวิเคราะห์ผลการจัดซื้อจัดจ้างและการจัดหาพัสดุประจำปีงบประมาณ',
    subTopic: 'แผนปฏิบัติการ', // Example subTopic
    description: 'แผนการจัดซื้อจัดจ้างประจำปี',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 3,
    title: 'รายงานผลการดำเนินงาน Q2 2567',
    year: 2567,
    quarter: '2', // CHANGED: from 'Q2' to '2'
    topic: 'MOIT 5 หน่วยงานมีการสรุปผลการจัดซื้อจัดจ้างและการจัดหาพัสดุรายเดือน ประจำปีงบประมาณ',
    subTopic: 'รายงานผล', // Example subTopic
    description: 'รายงานผลการดำเนินงานไตรมาส 2',
    url: 'https://www.africau.edu/images/default/sample.pdf',
  },
  {
    id: 4,
    title: 'นโยบาย No Gift Policy 2566',
    year: 2566,
    quarter: '1', // CHANGED: from 'Q1' to '1'
    topic: 'MOIT 12 หน่วยงานมีมาตรการ "การป้องกันการรับสินบน" ที่เป็นระบบ',
    subTopic: 'ประกาศ', // Example subTopic
    description: 'นโยบายไม่รับของขวัญปี 2566',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 5,
    title: 'งบประมาณรายรับ-รายจ่าย 2565',
    year: 2565,
    quarter: '3', // CHANGED: from 'Q3' to '3'
    topic: 'MOIT 2 หน่วยงานมีการเปิดเผยข้อมูลข่าวสารที่เป็นปัจจุบัน',
    subTopic: 'รายงานผล', // Example subTopic
    description: 'สรุปงบประมาณปี 2565',
    url: 'https://www.africau.edu/images/default/sample.pdf',
  },
  {
    id: 6,
    title: 'นโยบายป้องกันการรับสินบน 2567',
    year: 2567,
    quarter: '1', // CHANGED: from 'Q1' to '1'
    topic: 'MOIT 13 หน่วยงานประเมินการดำเนินการตามแนวทางปฏิบัติของหน่วยงาน ในปีงบประมาณ',
    subTopic: 'นโยบาย', // Example subTopic for MOIT 13
    description: 'นโยบายป้องกันการรับสินบนล่าสุดสำหรับปี 2567',
    url: 'https://www.africau.edu/images/default/sample.pdf',
  },
])

// List of predefined ITA topics for the main topic dropdown
const itaTopics = ref([
  'MOIT 1 หน่วยงานมีการวางระบบโดยการกำหนดมาตรการการเผยแพร่ข้อมูลต่อสาธารณะ ผ่านเว็บไซต์ของหน่วยงาน',
  'MOIT 2 หน่วยงานมีการเปิดเผยข้อมูลข่าวสารที่เป็นปัจจุบัน',
  'MOIT 3 หน่วยงานมีรายงานการวิเคราะห์ผลการจัดซื้อจัดจ้างและการจัดหาพัสดุประจำปีงบประมาณ',
  'MOIT 4 หน่วยงานมีการวางระบบการจัดซื้อจัดจ้างและการจัดหาพัสดุ ประจำปีงบประมาณ',
  'MOIT 5 หน่วยงานมีการสรุปผลการจัดซื้อจัดจ้างและการจัดหาพัสดุรายเดือน ประจำปีงบประมาณ',
  'MOIT 6 ผู้บริหารแสดงนโยบายการบริหารและพัฒนาทรัพยากรบุคคล',
  'MOIT 7 หน่วยงานมีการรายงานการประเมินและเกี่ยวกับการประเมินผลการปฏิบัติราชการของบุคลากรในหน่วยงาน และเปิดเผยผลการปฏิบัติราชการ ระดับดีเด่น และระดับดีมาก ในที่เปิดเผยให้ทราบ รอบปีงบประมาณ พ.ศ. 2566 และรอบปีงบประมาณ',
  'MOIT 8 หน่วยงานมีการอบรมให้ความรู้แก่เจ้าหน้าที่ภายในหน่วยงานเกี่ยวกับการเสริมสร้างและพัฒนาทางด้านจริยธรรม และการรักษาวินัยรวมทั้งการป้องกันมิให้กระทำผิดวินัย',
  'MOIT 9 หน่วยงานมีแนวปฏิบัติการจัดการเรื่องร้องเรียน และช่องทางการร้องเรียน',
  'MOIT 10 หน่วยงานมีสรุปผลการดำเนินงานเรื่องรัองเรียนการปฏิบัติงานหรือการให้บริการของเจ้าหน้าที่ภายในหน่วยงาน และเรื่องร้องเรียนการทุจริตและประพฤติมิชอบ',
  'MOIT 11 หน่วยงานของท่านเปิดโอกาสให้ผู้มีส่วนได้ส่วนเสียมีโอกาสเข้ามามีส่วนร่วมในการดำเนินงานตามภารกิจของหน่วยงาน',
  'MOIT 12 หน่วยงานมีมาตรการ "การป้องกันการรับสินบน" ที่เป็นระบบ',
  'MOIT 13 หน่วยงานประเมินการดำเนินการตามแนวทางปฏิบัติของหน่วยงาน ในปีงบประมาณ', // MOIT 13 added
  'MOIT 14 หน่วยงานมีแนวทางปฏิบัติเกี่ยวกับการใช้ทรัพย์สินของราชการ และมีขั้นตอนการขออนุญาตเพื่อยืมทรัพย์สินของราชการไปใช้ปฏิบัติในหน่วยงานที่ถูกต้อง',
  'MOIT 15 หน่วยงานมีแผนปฏิบัติการป้องกัน ปราบปรามการทุจริตและประพฤติมิชอบ และแผนปฏิบัติการส่งเสริมคุณธรรมของชมรมจริยธรรม ประจำปีงบประมาณ',
  'MOIT 16 หน่วยงานมีรายงานการกำกับติดตามการดำเนินงานตามแผนปฏิบัติการป้องกัน ปราบปรามการทุจริตและประพฤติมิชอบ ประจำปีงบประมาณ 2568 และแผนปฏิบัติการส่งเสริมคุณธรรมของชมรมจริยธรรม ประจำปีงบประมาณ',
  'MOIT 17 หน่วยงานมีการประเมินความเสี่ยงการทุจริต ประจำปีงบประมาณ',
  'MOIT 18 หน่วยงานมีการปฏิบัติตามมาตรการป้องกันการทุจริต (การควบคุมความเสี่ยงการทุจริต)',
  'MOIT 19 หน่วยงานมีการรายงานผลการส่งเสริมการปฏิบัติตามประมวลจริยธรรมข้าราชการพลเรือน:กรณีการเรี่ยไรและกรณีการให้หรือรับของขวัญหรือประโยชน์อื่นใด ประจำปีงบประมาณ',
  'MOIT 20 หน่วยงานมีการอบรมให้ความรู้ภายในหน่วยงาน เรื่อง ผลประโยชน์ทับซ้อนในหลักสูตร ต้านทุจริตศึกษา(Anti-Corruption Education)กระทรวงสาธารณสุข (ฉบับปรับปรุง) พ.ศ.2565',
  'MOIT 21 หน่วยงานมีการเผยแพร่เจตจำนงสุจริตของการปฏิบัติหน้าที่ราชการ และนโยบายที่เคารพ สิทธิมนุษยชนและศักดิ์ศรีของผู้ปฏิบัติงานและของผู้บริหาร ต่อสาธารณชน',
  'MOIT 22 หน่วยงานมีแนวปฏิบัติที่เคารพสิทธิมนุษยชนและศักดิ์ศรีของผู้ปฏิบัติงาน และรายงานการป้องกันและแก้ไขปัญหาการล่วงละเมิดหรือคุกคามทางเพศในการทำงาน ประจำปีงบประมาณ',
])

// Reactive state for the current document being added/edited
const currentDocument = ref<ITADocument>({
  id: 0,
  title: '',
  year: new Date().getFullYear() + 543, // Default to current Thai year
  quarter: '1', // CHANGED: Default to '1'
  topic: '',
  subTopic: '', // Initialize new subTopic field
  description: '',
  url: '',
})

// Reactive state to determine if we are editing an existing document
const editingDocument = ref(false)

// Reactive state for document to be deleted and confirmation modal visibility
const documentToDeleteId = ref<number | null>(null)
const showConfirmModal = ref(false)

// Function to generate a list of years for the dropdown
const getYearsList = () => {
  const currentYear = new Date().getFullYear() + 543 // Thai year
  const years = []
  // Generate years from 2 years in the future to 5 years in the past
  for (let i = currentYear + 2; i >= currentYear - 5; i--) {
    years.push(i)
  }
  return years
}

// Computed property to sort documents by year (descending) and then quarter
const sortedITADocuments = computed(() => {
  // CHANGED: quarterOrder to reflect numeric string values
  const quarterOrder: { [key: string]: number } = { '1': 1, '2': 2, '3': 3, '4': 4 }
  return [...itaDocuments.value].sort((a, b) => {
    // Sort by year descending first
    if (b.year !== a.year) {
      return b.year - a.year
    }
    // If years are the same, sort by quarter
    const aQuarterValue = quarterOrder[a.quarter] || 0
    const bQuarterValue = quarterOrder[b.quarter] || 0
    return aQuarterValue - bQuarterValue
  })
})

// Function to save (add or update) an ITA document
const saveITADocument = () => {
  if (editingDocument.value) {
    // Find the index of the document being edited
    const index = itaDocuments.value.findIndex((doc) => doc.id === currentDocument.value.id)
    if (index !== -1) {
      // Update the document in the array with a copy of currentDocument
      itaDocuments.value[index] = { ...currentDocument.value }
    }
    toast.success('แก้ไขเอกสาร ITA สำเร็จ!')
  } else {
    // Assign a new unique ID for a new document
    currentDocument.value.id =
      itaDocuments.value.length > 0 ? Math.max(...itaDocuments.value.map((doc) => doc.id)) + 1 : 1
    // Add the new document to the array
    itaDocuments.value.push({ ...currentDocument.value })
    toast.success('เพิ่มเอกสาร ITA ใหม่สำเร็จ!')
  }
  resetForm() // Reset the form after saving
}

// Function to populate the form for editing an existing document
const editITADocument = (doc: ITADocument) => {
  currentDocument.value = { ...doc } // Create a copy to avoid direct mutation
  editingDocument.value = true // Set editing mode to true
}

// Function to cancel editing and reset the form
const cancelEdit = () => {
  resetForm()
}

// Function to open the confirmation modal for deleting a document
const confirmDeleteITADocument = (id: number) => {
  documentToDeleteId.value = id
  showConfirmModal.value = true
}

// Function to delete the document after confirmation
const deleteITADocument = () => {
  if (documentToDeleteId.value !== null) {
    // Filter out the document to be deleted
    itaDocuments.value = itaDocuments.value.filter((doc) => doc.id !== documentToDeleteId.value)
    toast.success('ลบเอกสาร ITA สำเร็จ!')
  }
  resetDeleteConfirm()
}

const cancelDelete = () => {
  resetDeleteConfirm()
}

const resetForm = () => {
  currentDocument.value = {
    id: 0,
    title: '',
    year: new Date().getFullYear() + 543,
    quarter: '', // CHANGED: Default to '1'
    topic: '',
    subTopic: '',
    description: '',
    url: '',
  }
  editingDocument.value = false
}

const resetDeleteConfirm = () => {
  documentToDeleteId.value = null
  showConfirmModal.value = false
}
</script>

<style scoped></style>

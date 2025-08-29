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

// MOIT topics with full text and a new shortText for dropdowns
const itaTopics = [
  {
    value: 'MOIT 1',
    text: 'หน่วยงานมีการวางระบบโดยการกำหนดมาตรการการเผยแพร่ข้อมูลต่อสาธารณะ ผ่านเว็บไซต์ของหน่วยงาน',
    shortText: 'MOIT 1: การวางระบบเผยแพร่ข้อมูล',
  },
  {
    value: 'MOIT 2',
    text: 'หน่วยงานมีการเปิดเผยข้อมูลข่าวสารที่เป็นปัจจุบัน',
    shortText: 'MOIT 2: การเปิดเผยข้อมูลข่าวสาร',
  },
  {
    value: 'MOIT 3',
    text: 'หน่วยงานมีรายงานการวิเคราะห์ผลการจัดซื้อจัดจ้างและการจัดหาพัสดุประจำปีงบประมาณ',
    shortText: 'MOIT 3: รายงานวิเคราะห์จัดซื้อจัดจ้าง',
  },
  {
    value: 'MOIT 4',
    text: 'หน่วยงานมีการวางระบบการจัดซื้อจัดจ้างและการจัดหาพัสดุ ประจำปีงบประมาณ',
    shortText: 'MOIT 4: การวางระบบจัดซื้อจัดจ้าง',
  },
  {
    value: 'MOIT 5',
    text: 'หน่วยงานมีการสรุปผลการจัดซื้อจัดจ้างและการจัดหาพัสดุรายเดือน ประจำปีงบประมาณ',
    shortText: 'MOIT 5: สรุปผลจัดซื้อจัดจ้างรายเดือน',
  },
  {
    value: 'MOIT 6',
    text: 'ผู้บริหารแสดงนโยบายการบริหารและพัฒนาทรัพยากรบุคคล',
    shortText: 'MOIT 6: นโยบายบริหารทรัพยากรบุคคล',
  },
  {
    value: 'MOIT 7',
    text: 'หน่วยงานมีการรายงานการประเมินและเกี่ยวกับการประเมินผลการปฏิบัติราชการของบุคลากรในหน่วยงาน และเปิดเผยผลการปฏิบัติราชการ ระดับดีเด่น และระดับดีมาก ในที่เปิดเผยให้ทราบ',
    shortText: 'MOIT 7: รายงานประเมินผลปฏิบัติราชการ',
  },
  {
    value: 'MOIT 8',
    text: 'หน่วยงานมีการอบรมให้ความรู้แก่เจ้าหน้าที่ภายในหน่วยงานเกี่ยวกับการเสริมสร้างและพัฒนาทางด้านจริยธรรม และการรักษาวินัยรวมทั้งการป้องกันมิให้กระทำผิดวินัย',
    shortText: 'MOIT 8: อบรมจริยธรรมและวินัย',
  },
  {
    value: 'MOIT 9',
    text: 'หน่วยงานมีแนวปฏิบัติการจัดการเรื่องร้องเรียน และช่องทางการร้องเรียน',
    shortText: 'MOIT 9: แนวปฏิบัติจัดการเรื่องร้องเรียน',
  },
  {
    value: 'MOIT 10',
    text: 'หน่วยงานมีสรุปผลการดำเนินงานเรื่องรัองเรียนการปฏิบัติงานหรือการให้บริการของเจ้าหน้าที่ภายในหน่วยงาน และเรื่องร้องเรียนการทุจริตและประพฤติมิชอบ',
    shortText: 'MOIT 10: สรุปผลเรื่องร้องเรียน',
  },
  {
    value: 'MOIT 11',
    text: 'หน่วยงานของท่านเปิดโอกาสให้ผู้มีส่วนได้ส่วนเสียมีโอกาสเข้ามามีส่วนร่วมในการดำเนินงานตามภารกิจของหน่วยงาน',
    shortText: 'MOIT 11: การมีส่วนร่วมของผู้มีส่วนได้ส่วนเสีย',
  },
  {
    value: 'MOIT 12',
    text: 'หน่วยงานมีมาตรการ "การป้องกันการรับสินบน" ที่เป็นระบบ',
    shortText: 'MOIT 12: มาตรการป้องกันการรับสินบน',
  },
  {
    value: 'MOIT 13',
    text: 'หน่วยงานประเมินการดำเนินการตามแนวทางปฏิบัติของหน่วยงาน ในปีงบประมาณตามเกณฑ์จริยธรรมการจัดซื้อจัดหาและการส่งเสริมการขายยาและเวชภัณฑ์ที่มิใช่ยาของกระทรวงสาธารณสุข พ.ศ. 2564',
    shortText: 'MOIT 13: ประเมินเกณฑ์จริยธรรมจัดซื้อยา',
  },
  {
    value: 'MOIT 14',
    text: 'หน่วยงานมีแนวทางปฏิบัติเกี่ยวกับการใช้ทรัพย์สินของราชการ และมีขั้นตอนการขออนุญาตเพื่อยืมทรัพย์สินของราชการไปใช้ปฏิบัติในหน่วยงานที่ถูกต้อง',
    shortText: 'MOIT 14: แนวทางใช้ทรัพย์สินราชการ',
  },
  {
    value: 'MOIT 15',
    text: 'หน่วยงานมีแผนปฏิบัติการป้องกัน ปราบปรามการทุจริตและประพฤติมิชอบ และแผนปฏิบัติการส่งเสริมคุณธรรมของชมรมจริยธรรม ประจำปีงบประมาณ',
    shortText: 'MOIT 15: แผนป้องกันทุจริตและส่งเสริมคุณธรรม',
  },
  {
    value: 'MOIT 16',
    text: 'หน่วยงานมีรายงานการกำกับติดตามการดำเนินงานตามแผนปฏิบัติการป้องกัน ปราบปรามการทุจริตและประพฤติมิชอบ',
    shortText: 'MOIT 16: รายงานติดตามแผนป้องกันทุจริต',
  },
  {
    value: 'MOIT 17',
    text: 'หน่วยงานมีการประเมินความเสี่ยงการทุจริต ประจำปีงบประมาณอย่างเป็นระบบ',
    shortText: 'MOIT 17: ประเมินความเสี่ยงการทุจริต',
  },
  {
    value: 'MOIT 18',
    text: 'หน่วยงานมีการปฏิบัติตามมาตรการป้องกันการทุจริต (การควบคุมความเสี่ยงการทุจริต)',
    shortText: 'MOIT 18: ปฏิบัติตามมาตรการป้องกันทุจริต',
  },
  {
    value: 'MOIT 19',
    text: 'หน่วยงานมีการรายงานผลการส่งเสริมการปฏิบัติตามประมวลจริยธรรมข้าราชการพลเรือน:กรณีการเรี่ยไรและกรณีการให้หรือรับของขวัญหรือประโยชน์อื่นใด ประจำปีงบประมาณ',
    shortText: 'MOIT 19: รายงานส่งเสริมจริยธรรมข้าราชการ',
  },
  {
    value: 'MOIT 20',
    text: 'หน่วยงานมีการอบรมให้ความรู้ภายในหน่วยงาน เรื่อง ผลประโยชน์ทับซ้อนในหลักสูตร ต้านทุจริตศึกษา(Anti-Corruption Education)กระทรวงสาธารณสุข (ฉบับปรับปรุง) พ.ศ.2565',
    shortText: 'MOIT 20: อบรมผลประโยชน์ทับซ้อน',
  },
  {
    value: 'MOIT 21',
    text: 'หน่วยงานมีการเผยแพร่เจตจำนงสุจริตของการปฏิบัติหน้าที่ราชการ และนโยบายที่เคารพ สิทธิมนุษยชนและศักดิ์ศรีของผู้ปฏิบัติงานและของผู้บริหาร ต่อสาธารณชน',
    shortText: 'MOIT 21: เผยแพร่เจตจำนงสุจริต',
  },
  {
    value: 'MOIT 22',
    text: 'หน่วยงานมีแนวปฏิบัติที่เคารพสิทธิมนุษยชนและศักดิ์ศรีของผู้ปฏิบัติงาน และรายงานการป้องกันและแก้ไขปัญหาการล่วงละเมิดหรือคุกคามทางเพศในการทำงาน ประจำปีงบประมาณ',
    shortText: 'MOIT 22: แนวปฏิบัติเคารพสิทธิและป้องกันคุกคามทางเพศ',
  },
]

// กำหนดการจับคู่หัวข้อ MOIT กับหัวข้อย่อยที่เกี่ยวข้อง
const moitSubTopicMapping: { [key: string]: { value: string; text: string }[] } = {
  'MOIT 1': [
    { value: 'COMMAND_ANNOUNCE_FRAMEWORK', text: 'คำสั่ง / ประกาศ ที่ระบุกรอบแนวทาง' },
    {
      value: 'PUB_INFO_TRACKING_REPORT',
      text: 'รายงานผลการกำกับติดตามการเผยแพร่ข้อมูลต่อสาธารณะผ่านเว็บไซต์ของหน่วยงานในปีที่ผ่านมา',
    },
    { value: 'OTHER_MOIT1', text: 'อื่นๆ (ไม่ระบุประเภท)' },
  ],
  'MOIT 2': [
    { value: 'CURRENT_BASIC_INFO', text: 'ข้อมูลพื้นฐานที่เป็นปัจจุบัน' },
    { value: 'MOPH_VISION_MISSION_VALUES', text: 'วิสัยทัศน์ พันธกิจ ค่านิยม MOPH' },
    { value: 'ETHICS_ACT_2562', text: 'พระราชบัญญัติมาตรฐานทางจริยธรรม พ.ศ. 2562' },
    { value: 'CIVIL_SERVANT_ETHICS_CODE_2564', text: 'ประมวลจริยธรรมข้าราชการพลเรือน พ.ศ. 2564' },
    {
      value: 'MOPH_OFFICIAL_ETHICS_2564',
      text: 'ข้อกำหนดจริยธรรมเจ้าหน้าที่ของรัฐ สำนักงานปลัดกระทรวงสาธารณสุข พ.ศ. 2564',
    },
    { value: 'NATIONAL_STRATEGY_3_LEVELS', text: 'ยุทธศาสตร์และแผนระดับชาติ จำนวน 3 ระดับ' },
    {
      value: 'MOPH_ANTI_CORRUPTION_PLAN',
      text: 'แผนปฏิบัติการด้านการป้องกันปราบปรามการทุจริตและประพฤติมิชอบและการส่งเสริมคุณธรรม จริยธรรมของกระทรวงสาธารณสุข',
    },
    { value: 'UNIT_POLICY_STRATEGY', text: 'นโยบายและยุทธศาสตร์ของหน่วยงาน' },
    { value: 'UNIT_ANNUAL_ACTION_PLAN', text: 'แผนปฏิบัติการประจำปีของหน่วยงาน' },
    { value: 'UNIT_ANNUAL_ACTION_REPORT', text: 'รายงานผลการดำเนินงานตามแผนปฏิบัติการประจำปี' },
    {
      value: 'UNIT_ANNUAL_BUDGET_PLAN_REPORT',
      text: 'แผนการใช้จ่ายงบประมาณประจำปีของหน่วยงาน และผลการใช้จ่ายงบประมาณประจำปีของหน่วยงาน ตามแผนการใช้จ่ายงบประมาณประจำปีของหน่วยงาน',
    },
    { value: 'DISCLOSURE_FORM', text: 'แบบฟอร์มการเผยแพร่ฯ' },
    {
      value: 'COMPLAINT_HANDLING_MANUAL',
      text: 'คู่มือการปฏิบัติงานการร้องเรียนการปฏิบัติงานหรือให้บริการของเจ้าหน้าที่',
    },
    {
      value: 'CORRUPTION_COMPLAINT_MANUAL',
      text: 'คู่มือการปฏิบัติงานการร้องเรียนเรื่องการทุจริตและประพฤติมิชอบ',
    },
    {
      value: 'MAIN_SUPPORT_MISSION_MANUAL',
      text: 'คู่มือการปฏิบัติงานตามภารกิจหลักและภารกิจสนับสนุนของหน่วยงาน',
    },
    {
      value: 'SERVICE_PROCEDURE_MANUAL',
      text: 'คู่มือขั้นตอนการให้บริการ (ภารกิจให้บริการประชาชนตามพระราชบัญญัติ การอํานวยความสะดวกในการพิจารณาอนุญาตของทางราชการ พ.ศ. 2558) (เฉพาะสำนักงานสาธารณสุขจังหวัด และสำนักงานสาธารณสุขอำเภอ)',
    },
    {
      value: 'SERVICE_COMPLAINT_REPORT_12M',
      text: 'รายงานผลการดำเนินการเกี่ยวกับเรื่องร้องเรียนการปฏิบัติงานหรือการให้บริการ ประจำปีงบประมาณ (รายงานผลการดำเนินการรอบ 12 เดือน)',
    },
    {
      value: 'CORRUPTION_COMPLAINT_REPORT_12M',
      text: 'รายงานผลการดำเนินการเกี่ยวกับเรื่องร้องเรียนการทุจริตและประพฤติมิชอบ ประจำปีงบประมาณ(รายงานผลการดำเนินการรอบ 12 เดือน)',
    },
    { value: 'PROCUREMENT_DATA', text: 'ข้อมูลการจัดซื้อจัดจ้าง' },
    { value: 'OTHER_MOIT2', text: 'อื่นๆ (ไม่ระบุประเภท)' },
  ],
  'MOIT 3': [
    {
      value: 'PROCUREMENT_ANALYSIS_REPORT',
      text: 'รายงานการวิเคราะห์ผลการจัดซื้อจัดจ้างและการจัดหาพัสดุประจำปีงบประมาณ',
    },
    { value: 'OTHER_MOIT3', text: 'อื่นๆ (ไม่ระบุประเภท)' },
  ],
  'MOIT 4': [
    {
      value: 'PROCUREMENT_PLAN_ANNOUNCE',
      text: 'ประกาศเผยแพร่แผนการจัดซื้อจัดจ้างและการจัดหาพัสดุ ประจำปีของหน่วยงาน',
    },
    { value: 'INVESTMENT_REPORT_QUARTERLY', text: 'รายงานผลแผนจัดซื้อจัดจ้าง งบลงทุน ทุกไตรมาส' },
    {
      value: 'OPERATION_REPORT_QUARTERLY',
      text: 'รายงานผลแผนจัดซื้อจัดจ้าง งบดำเนินงาน ทุกไตรมาส',
    },
    {
      value: 'PREVENT_CONFLICT_OF_INTEREST',
      text: 'การป้องกันผู้มีส่วนได้ส่วนเสียกับการจัดซื้อจัดจ้าง',
    },
    { value: 'OTHER_MOIT4', text: 'อื่นๆ (ไม่ระบุประเภท)' },
  ],
  'MOIT 5': [
    // MOIT 5: หน่วยงานมีการสรุปผลการจัดซื้อจัดจ้างและการจัดหาพัสดุรายเดือน ประจำปีงบประมาณ
    // ลบ quarter1-4 ออก เพราะเป็นส่วนของ dropdown ไตรมาสหลัก
    { value: 'MONTHLY_PROCUREMENT_SUMMARY', text: 'สรุปผลการจัดซื้อจัดจ้างรายเดือน' }, // เพิ่มหัวข้อย่อยที่เกี่ยวข้อง
    { value: 'OTHER_MOIT5', text: 'อื่นๆ (ไม่ระบุประเภท)' }, // เปลี่ยนเป็น MOIT5 เฉพาะ
  ],
  'MOIT 6': [
    // MOIT 6: ผู้บริหารแสดงนโยบายการบริหารและพัฒนาทรัพยากรบุคคล
    { value: 'HR_POLICY_ANNOUNCEMENT', text: 'นโยบายการบริหารทรัพยากรบุคคล' },
    { value: 'HR_MANAGEMENT_PLAN', text: 'แผนการบริหารทรัพยากรบุคคลของหน่วยงาน' },
    { value: 'OTHER_MOIT6', text: 'อื่นๆ (ไม่ระบุประเภท)' }, // เปลี่ยนเป็น MOIT6 เฉพาะ
  ],
  'MOIT 7': [
    // MOIT 7: หน่วยงานมีการรายงานการประเมินและเกี่ยวกับการประเมินผลการปฏิบัติราชการของบุคลากรในหน่วยงาน และเปิดเผยผลการปฏิบัติราชการ ระดับดีเด่น และระดับดีมาก ในที่เปิดเผยให้ทราบ
    {
      value: 'PERFORMANCE_EVAL_REPORT_Q2',
      text: 'หลักฐานประกาศรายงานการประเมินผลฯ รอบ 2 ปีงบประมาณ',
    },
    {
      value: 'PERFORMANCE_EVAL_REPORT_Q3',
      text: 'หลักฐานประกาศรายงานการประเมินผลฯ รอบ 1 ปีงบประมาณ',
    }, // ปรับ text ให้สอดคล้องกับ Q3
    { value: 'OTHER_MOIT7', text: 'อื่นๆ (ไม่ระบุประเภท)' }, // เปลี่ยนเป็น MOIT7 เฉพาะ
  ],
  'MOIT 8': [
    // MOIT 8: หน่วยงานมีการอบรมให้ความรู้แก่เจ้าหน้าที่ภายในหน่วยงานเกี่ยวกับการเสริมสร้างและพัฒนาทางด้านจริยธรรม และการรักษาวินัยรวมทั้งการป้องกันมิให้กระทำผิดวินัย
    {
      value: 'ETHICS_TRAINING_EVIDENCE',
      text: 'หลักฐานที่แสดงถึงการอบรมให้ความรู้ด้านจริยธรรมและวินัย',
    }, // ปรับ text ให้สั้นลง
    { value: 'OTHER_MOIT8', text: 'อื่นๆ (ไม่ระบุประเภท)' }, // เปลี่ยนเป็น MOIT8 เฉพาะ
  ],
  'MOIT 9': [
    // MOIT 9: หน่วยงานมีแนวปฏิบัติการจัดการเรื่องร้องเรียน และช่องทางการร้องเรียน
    {
      value: 'COMPLAINT_HANDLING_GUIDELINES',
      text: 'แนวปฏิบัติการจัดการเรื่องร้องเรียน และช่องทางการร้องเรียน',
    },
    { value: 'OTHER_MOIT9', text: 'อื่นๆ (ไม่ระบุประเภท)' }, // เปลี่ยนเป็น MOIT9 เฉพาะ
  ],
  'MOIT 10': [
    // MOIT 10: หน่วยงานมีสรุปผลการดำเนินงานเรื่องรัองเรียนการปฏิบัติงานหรือการให้บริการของเจ้าหน้าที่ภายในหน่วยงาน และเรื่องร้องเรียนการทุจริตและประพฤติมิชอบ
    { value: 'COMPLAINT_SUMMARY_Q1', text: 'สรุปผลการดำเนินงานเรื่องร้องเรียน ไตรมาสที่ 1' },
    { value: 'COMPLAINT_SUMMARY_Q2', text: 'สรุปผลการดำเนินงานเรื่องร้องเรียน ไตรมาสที่ 2' },
    { value: 'COMPLAINT_SUMMARY_Q3', text: 'สรุปผลการดำเนินงานเรื่องร้องเรียน ไตรมาสที่ 3' },
    { value: 'COMPLAINT_SUMMARY_Q4', text: 'สรุปผลการดำเนินงานเรื่องร้องเรียน ไตรมาสที่ 4' },
    { value: 'OTHER_MOIT10', text: 'อื่นๆ (ไม่ระบุประเภท)' }, // เปลี่ยนเป็น MOIT10 เฉพาะ
  ],
  'MOIT 11': [
    // MOIT 11: หน่วยงานของท่านเปิดโอกาสให้ผู้มีส่วนได้ส่วนเสียมีโอกาสเข้ามามีส่วนร่วมในการดำเนินงานตามภารกิจของหน่วยงาน
    {
      value: 'STAKEHOLDER_PARTICIPATION_EVIDENCE',
      text: 'หลักฐานการมีส่วนร่วมของผู้มีส่วนได้ส่วนเสีย',
    }, // ปรับ text ให้สื่อความหมาย
    { value: 'OTHER_MOIT11', text: 'อื่นๆ (ไม่ระบุประเภท)' }, // เปลี่ยนเป็น MOIT11 เฉพาะ
  ],
  'MOIT 12': [
    // MOIT 12: หน่วยงานมีมาตรการ "การป้องกันการรับสินบน" ที่เป็นระบบ
    { value: 'ANTI_BRIBERY_MEASURES_Q2', text: 'มาตรการป้องกันการรับสินบน ไตรมาสที่ 2' },
    { value: 'ANTI_BRIBERY_MEASURES_Q4', text: 'มาตรการป้องกันการรับสินบน ไตรมาสที่ 4' },
    { value: 'OTHER_MOIT12', text: 'อื่นๆ (ไม่ระบุประเภท)' }, // เปลี่ยนเป็น MOIT12 เฉพาะ
  ],
  'MOIT 13': [
    // MOIT 13: หน่วยงานประเมินการดำเนินการตามแนวทางปฏิบัติของหน่วยงาน ในปีงบประมาณตามเกณฑ์จริยธรรมการจัดซื้อจัดหาและการส่งเสริมการขายยาและเวชภัณฑ์ที่มิใช่ยาของกระทรวงสาธารณสุข พ.ศ. 2564
    {
      value: 'ETHICS_PROCUREMENT_EVAL_REPORT',
      text: 'รายงานการประเมินเกณฑ์จริยธรรมการจัดซื้อจัดหา',
    },
    { value: 'OTHER_MOIT13', text: 'อื่นๆ (ไม่ระบุประเภท)' }, // เปลี่ยนเป็น MOIT13 เฉพาะ
  ],
  'MOIT 14': [
    // MOIT 14: หน่วยงานมีแนวทางปฏิบัติเกี่ยวกับการใช้ทรัพย์สินของราชการ และมีขั้นตอนการขออนุญาตเพื่อยืมทรัพย์สินของราชการไปใช้ปฏิบัติในหน่วยงานที่ถูกต้อง
    {
      value: 'GOVT_ASSET_USAGE_GUIDELINES',
      text: 'แนวทางปฏิบัติเกี่ยวกับการใช้ทรัพย์สินของราชการ',
    },
    { value: 'OTHER_MOIT14', text: 'อื่นๆ (ไม่ระบุประเภท)' }, // เปลี่ยนเป็น MOIT14 เฉพาะ
  ],
  'MOIT 15': [
    // MOIT 15: หน่วยงานมีแผนปฏิบัติการป้องกัน ปราบปรามการทุจริตและประพฤติมิชอบ และแผนปฏิบัติการส่งเสริมคุณธรรมของชมรมจริยธรรม ประจำปีงบประมาณ
    { value: 'ANTI_CORRUPTION_PLAN', text: 'แผนปฏิบัติการป้องกันปราบปรามการทุจริต' },
    { value: 'ETHICS_CLUB_PLAN', text: 'แผนปฏิบัติการส่งเสริมคุณธรรมของชมรมจริยธรรม' },
    { value: 'OTHER_MOIT15', text: 'อื่นๆ (ไม่ระบุประเภท)' }, // เปลี่ยนเป็น MOIT15 เฉพาะ
  ],
  'MOIT 16': [
    // MOIT 16: หน่วยงานมีรายงานการกำกับติดตามการดำเนินงานตามแผนปฏิบัติการป้องกัน ปราบปรามการทุจริตและประพฤติมิชอบ
    { value: 'ANTI_CORRUPTION_TRACKING_Q2', text: 'รายงานติดตามแผนป้องกันทุจริต ไตรมาสที่ 2' },
    { value: 'ANTI_CORRUPTION_TRACKING_Q4', text: 'รายงานติดตามแผนป้องกันทุจริต ไตรมาสที่ 4' },
    { value: 'OTHER_MOIT16', text: 'อื่นๆ (ไม่ระบุประเภท)' }, // เปลี่ยนเป็น MOIT16 เฉพาะ
  ],
  'MOIT 17': [
    // MOIT 17: หน่วยงานมีการประเมินความเสี่ยงการทุจริต ประจำปีงบประมาณอย่างเป็นระบบ
    { value: 'CORRUPTION_RISK_EVAL_Q2', text: 'รายงานประเมินความเสี่ยงการทุจริต ไตรมาสที่ 2' },
    { value: 'CORRUPTION_RISK_EVAL_Q4', text: 'รายงานประเมินความเสี่ยงการทุจริต ไตรมาสที่ 4' },
    { value: 'OTHER_MOIT17', text: 'อื่นๆ (ไม่ระบุประเภท)' }, // เปลี่ยนเป็น MOIT17 เฉพาะ
  ],
  'MOIT 18': [
    // MOIT 18: หน่วยงานมีการปฏิบัติตามมาตรการป้องกันการทุจริต (การควบคุมความเสี่ยงการทุจริต)
    {
      value: 'ANTI_CORRUPTION_MEASURES_REPORT_Q4',
      text: 'รายงานการปฏิบัติตามมาตรการป้องกันการทุจริต ไตรมาสที่ 4',
    },
    { value: 'OTHER_MOIT18', text: 'อื่นๆ (ไม่ระบุประเภท)' }, // เปลี่ยนเป็น MOIT18 เฉพาะ
  ],
  'MOIT 19': [
    // MOIT 19: หน่วยงานมีการรายงานผลการส่งเสริมการปฏิบัติตามประมวลจริยธรรมข้าราชการพลเรือน:กรณีการเรี่ยไรและกรณีการให้หรือรับของขวัญหรือประโยชน์อื่นใด ประจำปีงบประมาณ
    {
      value: 'CIVIL_SERVANT_ETHICS_REPORT_Q2',
      text: 'รายงานส่งเสริมจริยธรรมข้าราชการ ไตรมาสที่ 2',
    },
    {
      value: 'CIVIL_SERVANT_ETHICS_REPORT_Q4',
      text: 'รายงานส่งเสริมจริยธรรมข้าราชการ ไตรมาสที่ 4',
    },
    { value: 'OTHER_MOIT19', text: 'อื่นๆ (ไม่ระบุประเภท)' }, // เปลี่ยนเป็น MOIT19 เฉพาะ
  ],
  'MOIT 20': [
    // MOIT 20: หน่วยงานมีการอบรมให้ความรู้ภายในหน่วยงาน เรื่อง ผลประโยชน์ทับซ้อนในหลักสูตร ต้านทุจริตศึกษา(Anti-Corruption Education)กระทรวงสาธารณสุข (ฉบับปรับปรุง) พ.ศ.2565
    { value: 'CONFLICT_OF_INTEREST_TRAINING_EVIDENCE', text: 'หลักฐานการอบรมผลประโยชน์ทับซ้อน' },
    { value: 'OTHER_MOIT20', text: 'อื่นๆ (ไม่ระบุประเภท)' }, // เปลี่ยนเป็น MOIT20 เฉพาะ
  ],
  'MOIT 21': [
    // MOIT 21: หน่วยงานมีการเผยแพร่เจตจำนงสุจริตของการปฏิบัติหน้าที่ราชการ และนโยบายที่เคารพ สิทธิมนุษยชนและศักดิ์ศรีของผู้ปฏิบัติงานและของผู้บริหาร ต่อสาธารณชน
    {
      value: 'INTEGRITY_INTENTION_PUBLICATION',
      text: 'การเผยแพร่เจตจำนงสุจริตและนโยบายสิทธิมนุษยชน',
    },
    { value: 'OTHER_MOIT21', text: 'อื่นๆ (ไม่ระบุประเภท)' }, // เปลี่ยนเป็น MOIT21 เฉพาะ
  ],
  'MOIT 22': [
    // MOIT 22: หน่วยงานมีแนวปฏิบัติที่เคารพสิทธิมนุษยชนและศักดิ์ศรีของผู้ปฏิบัติงาน และรายงานการป้องกันและแก้ไขปัญหาการล่วงละเมิดหรือคุกคามทางเพศในการทำงาน ประจำปีงบประมาณ
    {
      value: 'HUMAN_RIGHTS_PRACTICE_REPORT_Q2',
      text: 'รายงานแนวปฏิบัติสิทธิมนุษยชนและป้องกันคุกคามทางเพศ ไตรมาสที่ 2',
    },
    {
      value: 'HUMAN_RIGHTS_PRACTICE_REPORT_Q4',
      text: 'รายงานแนวปฏิบัติสิทธิมนุษยชนและป้องกันคุกคามทางเพศ ไตรมาสที่ 4',
    },
    { value: 'OTHER_MOIT22', text: 'อื่นๆ (ไม่ระบุประเภท)' }, // เปลี่ยนเป็น MOIT22 เฉพาะ
  ],
}

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

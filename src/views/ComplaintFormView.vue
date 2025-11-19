<template>
  <div class="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-2xl border-t-4 border-red-600">
      <h1 class="text-3xl font-extrabold text-red-700 mb-2 flex items-center">
        <i class="fas fa-comment-dots mr-3 text-3xl"></i> ยื่นข้อร้องเรียน
      </h1>
      <p class="text-gray-600 mb-8 border-b pb-4">
        กรุณากรอกข้อมูลและรายละเอียดข้อร้องเรียนของท่าน
        ทางโรงพยาบาลจะดำเนินการตรวจสอบและติดต่อกลับโดยเร็วที่สุด
      </p>

      <form @submit.prevent="submitComplaint" class="space-y-8">
        <div class="p-5 border border-gray-200 rounded-lg bg-gray-50 space-y-6">
          <h2 class="text-xl font-bold text-gray-800 flex items-center mb-4">
            <i class="fas fa-user-circle mr-2 text-red-500"></i> ข้อมูลผู้แจ้ง
          </h2>

          <div>
            <label for="fullName" class="block text-sm font-semibold text-gray-700"
              >ชื่อ-นามสกุล ผู้แจ้ง (ถ้าต้องการระบุ):</label
            >
            <input
              type="text"
              id="fullName"
              v-model="complaintData.fullName"
              class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition duration-150"
              placeholder="เช่น นาย/นางสาว สมัคร ใจดี"
            />
          </div>

          <div>
            <label for="contactInfo" class="block text-sm font-semibold text-gray-700"
              >ข้อมูลติดต่อ (เบอร์โทรศัพท์ หรือ อีเมล):
              <span class="text-red-600 font-bold">* จำเป็นต้องระบุ</span></label
            >
            <input
              type="text"
              id="contactInfo"
              v-model="complaintData.contactInfo"
              class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition duration-150"
              required
              placeholder="0XX-XXX-XXXX หรือ email@example.com"
            />
          </div>
        </div>

        <div class="p-5 border border-gray-200 rounded-lg bg-gray-50 space-y-6">
          <h2 class="text-xl font-bold text-gray-800 flex items-center mb-4">
            <i class="fas fa-file-alt mr-2 text-red-500"></i> รายละเอียดการร้องเรียน
          </h2>

          <div>
            <label for="subject" class="block text-sm font-semibold text-gray-700"
              >หัวข้อเรื่องร้องเรียน: <span class="text-red-600 font-bold">*</span></label
            >

            <select
              id="subject"
              v-model="complaintData.subject"
              class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 bg-white focus:ring-red-500 focus:border-red-500 transition duration-150"
              required
            >
              <option value="" disabled selected>--- กรุณาเลือกหัวข้อร้องเรียน ---</option>

              <option v-for="subject in complaintSubjects" :key="subject" :value="subject">
                {{ subject }}
              </option>
            </select>
          </div>

          <div>
            <label for="description" class="block text-sm font-semibold text-gray-700"
              >รายละเอียดข้อร้องเรียน: <span class="text-red-600 font-bold">*</span></label
            >
            <textarea
              id="description"
              rows="6"
              v-model="complaintData.description"
              class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-red-500 focus:border-red-500 transition duration-150"
              required
              placeholder="กรุณาให้ข้อมูลเท่าที่จำได้ เช่น วันที่/เวลาเกิดเหตุ, สถานที่, ชื่อเจ้าหน้าที่ (ถ้าทราบ) เพื่อให้ง่ายต่อการตรวจสอบ"
            ></textarea>
          </div>
        </div>

        <div class="pt-4">
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-red-600 text-white font-bold text-lg py-4 rounded-lg hover:bg-red-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <i class="fas fa-paper-plane mr-2" v-if="!loading"></i>
            <i class="fas fa-spinner fa-spin mr-2" v-else></i>
            {{ loading ? 'กำลังส่งข้อร้องเรียน...' : 'ส่งข้อร้องเรียน' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { isAxiosError } from 'axios'
import { createComplaint } from '@/services/complaintService'

const complaintSubjects = [
  'พฤติกรรม/การบริการของบุคลากร',
  'การรอคอย/ความล่าช้าในการรับบริการ',
  'คุณภาพการรักษา/ความผิดพลาดทางการแพทย์',
  'ความสะอาด/สุขอนามัยของสถานที่',
  'สิ่งอำนวยความสะดวก/สภาพแวดล้อม',
  'ปัญหาการเบิกจ่าย/ค่ารักษาพยาบาล',
  'ระบบนัดหมาย/การสื่อสาร',
  'อื่นๆ (โปรดระบุในรายละเอียด)',
]

const toast = useToast()

// ------------------------------------------------------------------
// 1. Type & State (🟢 แก้ไข Interface ให้ตรงกับ API Payload)
// ------------------------------------------------------------------

interface ComplaintFormData {
  subject: string
  description: string
  fullName: string // 🟢 แก้ไข: เปลี่ยนจาก complainantName เป็น fullName
  contactInfo: string
  status: string // 🟢 เพิ่ม: ตามที่ API Payload กำหนด
}

const initialFormData: ComplaintFormData = {
  subject: '',
  description: '',
  fullName: '', // 🟢 ใช้ fullName
  contactInfo: '',
  status: 'รอดำเนินการ', // 🟢 เพิ่ม status
}

const complaintData = ref<ComplaintFormData>({ ...initialFormData })
const loading = ref(false)

// ------------------------------------------------------------------
// 2. Submission Logic
// ------------------------------------------------------------------

const submitComplaint = async () => {
  if (
    !complaintData.value.subject ||
    !complaintData.value.description ||
    !complaintData.value.contactInfo
  ) {
    toast.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน')
    return
  }

  loading.value = true
  try {
    // Payload ที่ส่งไปจะตรงกับ ComplaintFormData: { subject, description, fullName, contactInfo, status }
    await createComplaint(complaintData.value)

    toast.success('ส่งข้อร้องเรียนสำเร็จ! ทางโรงพยาบาลจะดำเนินการตรวจสอบและติดต่อกลับ')
    resetForm()
  } catch (e: unknown) {
    const message = isAxiosError(e)
      ? e.response?.data?.message || 'การส่งข้อร้องเรียนล้มเหลว'
      : 'เกิดข้อผิดพลาดในการเชื่อมต่อ'
    toast.error(message)
    console.error('Complaint submission failed:', e)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  complaintData.value = { ...initialFormData }
}
</script>

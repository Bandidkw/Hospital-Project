<template>
  <div class="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <h1 class="text-3xl font-extrabold text-red-600 mb-4 flex items-center">
        <i class="fas fa-exclamation-circle mr-3"></i> ยื่นข้อร้องเรียน
      </h1>
      <p class="text-gray-600 mb-8 border-b pb-4">
        กรุณากรอกข้อมูลและรายละเอียดข้อร้องเรียนของท่าน
        ทางโรงพยาบาลจะดำเนินการตรวจสอบและติดต่อกลับโดยเร็วที่สุด
      </p>

      <form @submit.prevent="submitComplaint" class="space-y-6">
        <div>
          <label for="reporterName" class="block text-sm font-medium text-gray-700"
            >ชื่อ-นามสกุล ผู้แจ้ง (ถ้าต้องการระบุ):</label
          >
          <input
            type="text"
            id="reporterName"
            v-model="complaintData.reporterName"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500"
            placeholder="เช่น นาย/นางสาว สมัคร ใจดี"
          />
        </div>

        <div>
          <label for="reporterContact" class="block text-sm font-medium text-gray-700"
            >ข้อมูลติดต่อ (เช่น เบอร์โทรศัพท์ หรือ อีเมล):
            <span class="text-red-500">*</span></label
          >
          <input
            type="text"
            id="reporterContact"
            v-model="complaintData.reporterContact"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500"
            required
            placeholder="0XX-XXX-XXXX หรือ email@example.com"
          />
        </div>

        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700"
            >หัวข้อเรื่องร้องเรียน: <span class="text-red-500">*</span></label
          >

          <select
            id="subject"
            v-model="complaintData.subject"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500"
            required
          >
            <option value="" disabled>--- กรุณาเลือกหัวข้อร้องเรียน ---</option>

            <option v-for="subject in complaintSubjects" :key="subject" :value="subject">
              {{ subject }}
            </option>
          </select>
        </div>

        <div>
          <label for="detail" class="block text-sm font-medium text-gray-700"
            >รายละเอียดข้อร้องเรียน: <span class="text-red-500">*</span></label
          >
          <textarea
            id="detail"
            rows="5"
            v-model="complaintData.detail"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500"
            required
            placeholder="กรุณาให้ข้อมูลเท่าที่จำได้ เช่น วันที่/เวลาเกิดเหตุ, สถานที่, ชื่อเจ้าหน้าที่ (ถ้าทราบ)"
          ></textarea>
        </div>

        <div class="pt-4">
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-red-600 text-white font-semibold py-3 rounded-md hover:bg-red-700 transition duration-300 disabled:bg-gray-400"
          >
            <i class="fas fa-paper-plane mr-2" v-if="!loading"></i>
            <i class="fas fa-spinner fa-spin mr-2" v-else></i>
            {{ loading ? 'กำลังส่ง...' : 'ส่งข้อร้องเรียน' }}
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
import { createComplaint } from '@/services/complaintService' // 💡 ต้องสร้างฟังก์ชันนี้ใน Service

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
// 1. Type & State
// ------------------------------------------------------------------

interface ComplaintFormData {
  subject: string
  detail: string
  reporterName: string
  reporterContact: string // ข้อมูลติดต่อ
}

const initialFormData: ComplaintFormData = {
  subject: '',
  detail: '',
  reporterName: '',
  reporterContact: '',
}

const complaintData = ref<ComplaintFormData>({ ...initialFormData })
const loading = ref(false)

// ------------------------------------------------------------------
// 2. Submission Logic
// ------------------------------------------------------------------

const submitComplaint = async () => {
  if (
    !complaintData.value.subject ||
    !complaintData.value.detail ||
    !complaintData.value.reporterContact
  ) {
    toast.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน')
    return
  }

  loading.value = true
  try {
    // 💡 สมมติว่า createComplaint(data) ถูกสร้างใน complaintService.ts
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

<style scoped>
/* styles for form */
</style>

<template>
  <main class="bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-10">
      <header class="mb-10 text-center">
        <h1
          class="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-3"
        >
          <i class="fas fa-exchange-alt text-blue-600"></i>
          <span>แบบฟอร์มแจ้งการส่งตัวผู้ป่วย</span>
        </h1>
        <p class="text-gray-600 mt-2">กรุณากรอกข้อมูลให้ครบถ้วนเพื่อความสะดวกในการประสานงาน</p>
      </header>

      <div class="mb-8 flex justify-between items-center border-b pb-4">
        <div v-for="step in 4" :key="step" class="text-center w-1/4">
          <div
            class="mx-auto w-8 h-8 rounded-full flex items-center justify-center text-lg"
            :class="
              currentStep === step
                ? 'bg-blue-600 text-white'
                : currentStep > step
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
            "
          >
            <i v-if="currentStep > step" class="fas fa-check"></i>
            <span velse>{{ step }}</span>
          </div>
          <p class="text-xs mt-1" :class="currentStep >= step ? 'font-semibold' : 'text-gray-500'">
            {{ stepLabels[step - 1] }}
          </p>
        </div>
      </div>

      <div class="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <form @submit.prevent="submitForm">
          <!-- step 1 -->
          <section v-if="currentStep === 1" class="space-y-4">
            <h2 class="text-2xl font-bold text-gray-800">1. ข้อมูลผู้ป่วยและต้นทาง</h2>
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label for="patientName" class="block text-sm font-medium text-gray-700"
                  >ชื่อ-นามสกุล ผู้ป่วย</label
                >
                <input
                  id="patientName"
                  v-model="formData.patientName"
                  type="text"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label for="patientHN" class="block text-sm font-medium text-gray-700"
                  >เลข HN (Hospital Number)</label
                >
                <input
                  id="patientHN"
                  v-model="formData.patientHN"
                  type="text"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
            <div>
              <label for="originHospital" class="block text-sm font-medium text-gray-700"
                >โรงพยาบาลต้นทาง</label
              >
              <select
                id="originHospital"
                v-model="formData.originHospitalId"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option disabled value="">-- กรุณาเลือกโรงพยาบาล --</option>
                <option v-for="hospital in hospitalList" :key="hospital.id" :value="hospital.id">
                  {{ hospital.name }}
                </option>
              </select>
            </div>

            <div>
              <label for="referralFile" class="block text-sm font-medium text-gray-700">
                อัปโหลดเอกสารส่งตัว (ไม่เกิน 5 ไฟล์)
              </label>
              <input
                id="referralFile"
                @change="onFileChange"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                class="hidden"
              />
              <label
                for="referralFile"
                class="cursor-pointer inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-semibold text-sm hover:bg-blue-100"
              >
                เลือกไฟล์
              </label>

              <div v-if="formData.referralFiles.length > 0" class="mt-4 space-y-2">
                <p class="text-sm font-medium text-gray-800">ไฟล์ที่เลือก:</p>
                <div
                  v-for="(file, index) in formData.referralFiles"
                  :key="index"
                  class="flex items-center justify-between bg-gray-100 p-2 rounded-md text-sm"
                >
                  <span class="text-gray-700 truncate pr-2">{{ file.name }}</span>
                  <button
                    @click="removeFile(index)"
                    type="button"
                    class="text-red-500 hover:text-red-700 font-bold"
                    title="ลบไฟล์นี้"
                  >
                    &times;
                  </button>
                </div>
              </div>
              <p v-else class="mt-2 text-sm text-gray-500">ยังไม่ได้เลือกไฟล์ใด</p>
            </div>
          </section>
          <!-- step 2 -->
          <section v-if="currentStep === 2" class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-800">2. โรงพยาบาลปลายทางและคลินิก</h2>
            <div
              v-for="(dest, destIndex) in formData.destinations"
              :key="destIndex"
              class="p-4 border rounded-lg bg-gray-50 space-y-3"
            >
              <div class="flex justify-between items-start">
                <h3 class="font-semibold pt-2">ปลายทางที่ {{ destIndex + 1 }}</h3>
                <button
                  v-if="formData.destinations.length > 1"
                  @click="removeDestination(destIndex)"
                  type="button"
                  class="px-3 py-2 text-red-600 hover:text-red-800"
                  title="ลบปลายทางนี้"
                >
                  <i class="fas fa-times-circle"></i>
                </button>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">โรงพยาบาลปลายทาง</label>
                <select
                  v-model="dest.hospitalId"
                  @change="handleHospitalChange(destIndex)"
                  class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option disabled value="">-- กรุณาเลือกโรงพยาบาล --</option>
                  <option v-for="hospital in hospitalList" :key="hospital.id" :value="hospital.id">
                    {{ hospital.name }}
                  </option>
                </select>
              </div>
              <div
                v-for="(clinic, clinicIndex) in dest.clinics"
                :key="clinicIndex"
                class="flex items-end gap-2"
              >
                <div class="flex-grow">
                  <label class="block text-sm font-medium text-gray-700">คลินิก/แผนก</label>
                  <select
                    v-model="clinic.clinicId"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    :disabled="!dest.hospitalId"
                  >
                    <option disabled value="">
                      {{ dest.hospitalId ? '-- กรุณาเลือกคลินิก --' : 'โปรดเลือกโรงพยาบาลก่อน' }}
                    </option>
                    <option
                      v-for="clinicOpt in dest.availableClinics"
                      :key="clinicOpt.id"
                      :value="clinicOpt.id"
                    >
                      {{ clinicOpt.name }}
                    </option>
                  </select>
                </div>
                <button
                  v-if="dest.clinics.length > 1"
                  @click="removeClinic(destIndex, clinicIndex)"
                  type="button"
                  class="px-3 py-2 text-red-600 hover:text-red-800"
                  title="ลบคลินิก"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
              <button
                @click="addClinic(destIndex)"
                type="button"
                class="text-sm text-blue-600 hover:underline"
              >
                + เพิ่มคลินิก/ใบนัด
              </button>
            </div>
            <button
              @click="addDestination"
              type="button"
              class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              + เพิ่มโรงพยาบาลปลายทางอื่น
            </button>
          </section>
          <!-- step 3 -->
          <section v-if="currentStep === 3" class="space-y-4">
            <h2 class="text-2xl font-bold text-gray-800">3. เลือกวันและเวลาเดินทาง</h2>
            <div class="flex justify-center pt-4">
              <!-- component -->
              <CustomCalendar v-model="formData.travelDate" />
            </div>
          </section>
          <!-- step 4 -->
          <section v-if="currentStep === 4" class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-800">4. ตรวจสอบและยืนยันข้อมูล</h2>

            <div class="border-b pb-4">
              <h3 class="font-semibold text-lg text-gray-700 mb-2">ข้อมูลผู้ป่วย</h3>
              <p><strong>ชื่อ-นามสกุล:</strong> {{ formData.patientName }}</p>
              <p><strong>HN:</strong> {{ formData.patientHN }}</p>
              <p>
                <strong>โรงพยาบาลต้นทาง:</strong> {{ getHospitalName(formData.originHospitalId) }}
              </p>
              <div class="mt-2">
                <p>
                  <strong>เอกสารส่งตัวที่แนบ: </strong>
                  <span v-if="formData.referralFiles.length > 0">
                    {{ formData.referralFiles.length }} ไฟล์
                  </span>
                  <span v-else class="text-gray-500">ไม่ได้แนบไฟล์</span>
                </p>
                <ul
                  v-if="formData.referralFiles.length > 0"
                  class="list-disc list-inside ml-4 text-sm text-gray-600"
                >
                  <li v-for="file in formData.referralFiles" :key="file.name">
                    {{ file.name }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="border-b pb-4">
              <h3 class="font-semibold text-lg text-gray-700 mb-2">ข้อมูลปลายทาง</h3>
              <div v-for="(dest, index) in formData.destinations" :key="index" class="mb-3">
                <p class="font-medium">
                  <strong>ปลายทางที่ {{ index + 1 }}:</strong>
                  {{ getHospitalName(dest.hospitalId) }}
                </p>
                <ul class="list-disc list-inside ml-4">
                  <li v-for="(clinic, cIndex) in dest.clinics" :key="cIndex">
                    {{ getClinicName(dest.hospitalId, clinic.clinicId) }}
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 class="font-semibold text-lg text-gray-700 mb-2">วันและเวลาเดินทาง</h3>
              <p>
                <strong>วันที่เลือก: </strong>
                <span v-if="formData.travelDate">
                  {{
                    formData.travelDate.toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  }}
                </span>
                <span v-else class="text-gray-500"> ยังไม่ได้เลือก </span>
              </p>
            </div>

            <p class="text-gray-600 mt-4">กรุณาตรวจสอบข้อมูลทั้งหมดให้ถูกต้องก่อนกดยืนยัน</p>
          </section>
          <div class="mt-8 flex justify-between">
            <!-- btn -->
            <button
              v-if="currentStep > 1"
              @click="prevStep"
              type="button"
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              ย้อนกลับ
            </button>
            <div v-else></div>
            <button
              v-if="currentStep < 4"
              @click="nextStep"
              type="button"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ถัดไป
            </button>
            <button
              v-if="currentStep === 4"
              type="submit"
              :disabled="isSubmitting"
              class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 disabled:bg-gray-400"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
              <span>{{ isSubmitting ? 'กำลังส่ง...' : 'ยืนยันการส่งข้อมูล' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import CustomCalendar from '@/components/CustomCalendar.vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const router = useRouter()
const toast = useToast()
// --- Interfaces for Data ---
interface Hospital {
  id: string
  name: string
}
interface Clinic {
  id: string
  name: string
}

// --- Mock Data ---
const mockHospitals: Hospital[] = [
  { id: 'h01', name: 'โรงพยาบาลแม่แตง' },
  { id: 'h02', name: 'โรงพยาบาลนครพิงค์' },
  { id: 'h03', name: 'โรงพยาบาลมหาราชนครเชียงใหม่' },
]
const mockClinics: Record<string, Clinic[]> = {
  h01: [
    { id: 'h01c01', name: 'คลินิกอายุรกรรม' },
    { id: 'h01c02', name: 'คลินิกศัลยกรรม' },
  ],
  h02: [
    { id: 'h02c01', name: 'แผนกโรคหัวใจ' },
    { id: 'h02c02', name: 'แผนกจักษุวิทยา' },
  ],
  h03: [{ id: 'h03c01', name: 'ศูนย์ความเป็นเลิศทางการแพทย์' }],
}

// --- Component State ---
const isSubmitting = ref(false)
const currentStep = ref(1)
const stepLabels = ['ข้อมูลผู้ป่วย', 'เลือกปลายทาง', 'เลือกวันเวลา', 'ยืนยันข้อมูล']
const hospitalList = ref<Hospital[]>([])

const formData = reactive({
  patientName: '',
  patientHN: '',
  originHospitalId: '',
  referralFiles: [] as File[], // 👈 **เปลี่ยนจาก referralFile เป็น referralFiles และกำหนดเป็น Array**
  destinations: [
    {
      hospitalId: '',
      availableClinics: [] as Clinic[],
      clinics: [{ clinicId: '' }],
    },
  ],
  travelDate: new Date(),
})

// --- API Fetching Functions ---
const fetchHospitals = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  hospitalList.value = mockHospitals
}
const fetchClinicsForHospital = async (hospitalId: string): Promise<Clinic[]> => {
  if (!hospitalId) return []
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockClinics[hospitalId] || []
}

onMounted(() => {
  fetchHospitals()
})

// --- Methods ---
const handleHospitalChange = async (destIndex: number) => {
  const destination = formData.destinations[destIndex]
  destination.availableClinics = []
  destination.clinics = [{ clinicId: '' }]
  if (destination.hospitalId) {
    const clinics = await fetchClinicsForHospital(destination.hospitalId)
    destination.availableClinics = clinics
  }
}

// 👇 **อัปเดตฟังก์ชัน onFileChange ใหม่ทั้งหมด**
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newFiles = target.files

  if (!newFiles) return

  // นำไฟล์ชุดเดิมและชุดใหม่มารวมกัน
  const combinedFiles = [...formData.referralFiles, ...Array.from(newFiles)]

  // ตรวจสอบว่าไฟล์ที่รวมกันแล้วเกิน 5 ไฟล์หรือไม่
  if (combinedFiles.length > 5) {
    toast.error('คุณสามารถอัปโหลดไฟล์ได้สูงสุด 5 ไฟล์เท่านั้น')
    // **สำคัญ:** ต้องล้างค่าใน input ออกเพื่อให้ผู้ใช้เลือกไฟล์ซ้ำได้หากต้องการ
    target.value = ''
    return
  }

  // อัปเดต state ด้วยไฟล์ที่รวมกันแล้ว
  formData.referralFiles = combinedFiles

  // **สำคัญ:** ล้างค่าใน input ทุกครั้งเพื่อให้ change event ทำงานถูกต้อง
  // หากผู้ใช้ลบไฟล์บางส่วนแล้วต้องการเลือกไฟล์เดิมซ้ำ
  target.value = ''
}

// เพิ่มฟังก์ชันสำหรับลบไฟล์
const removeFile = (fileIndex: number) => {
  formData.referralFiles.splice(fileIndex, 1)
}

const addDestination = () => {
  formData.destinations.push({ hospitalId: '', availableClinics: [], clinics: [{ clinicId: '' }] })
}
const removeDestination = (index: number) => {
  if (formData.destinations.length > 1) {
    formData.destinations.splice(index, 1)
  }
}
const addClinic = (destIndex: number) => {
  formData.destinations[destIndex].clinics.push({ clinicId: '' })
}
const removeClinic = (destIndex: number, clinicIndex: number) => {
  if (formData.destinations[destIndex].clinics.length > 1) {
    formData.destinations[destIndex].clinics.splice(clinicIndex, 1)
  }
}

const getHospitalName = (hospitalId: string): string => {
  if (!hospitalId) return 'N/A'
  const hospital = hospitalList.value.find((h) => h.id === hospitalId)
  return hospital ? hospital.name : hospitalId
}

const getClinicName = (hospitalId: string, clinicId: string): string => {
  if (!hospitalId || !clinicId) return 'N/A'
  const clinicsOfHospital = mockClinics[hospitalId]
  if (!clinicsOfHospital) return clinicId
  const clinic = clinicsOfHospital.find((c) => c.id === clinicId)
  return clinic ? clinic.name : clinicId
}

// 👇 **อัปเดตฟังก์ชัน validateStep1 ใหม่ทั้งหมด**
const validateStep1 = () => {
  // Regex ที่อนุญาตเฉพาะตัวอักษรไทย, อังกฤษ, ตัวเลข และวรรค
  const validPattern = /^[a-zA-Z0-9ก-๙\s]*$/

  if (!formData.patientName.trim()) {
    toast.error('กรุณากรอกชื่อผู้ป่วย')
    return false
  }
  if (!validPattern.test(formData.patientName)) {
    toast.error('ชื่อ-สกุล ต้องไม่มีสัญลักษณ์พิเศษ')
    return false
  }

  if (!formData.patientHN.trim()) {
    toast.error('กรุณากรอกเลข HN')
    return false
  }
  if (!validPattern.test(formData.patientHN)) {
    toast.error('เลข HN ต้องไม่มีสัญลักษณ์พิเศษ')
    return false
  }

  if (!formData.originHospitalId) {
    toast.error('กรุณาเลือกโรงพยาบาลต้นทาง')
    return false
  }
  return true
}

const validateStep2 = () => {
  for (const dest of formData.destinations) {
    if (!dest.hospitalId) {
      toast.error('กรุณาเลือกโรงพยาบาลปลายทางให้ครบทุกรายการ')
      return false
    }
    for (const clinic of dest.clinics) {
      if (!clinic.clinicId) {
        toast.error('กรุณาเลือกคลินิกให้ครบทุกรายการ')
        return false
      }
    }
  }
  return true
}

const nextStep = () => {
  if (currentStep.value === 1 && !validateStep1()) {
    return
  }
  if (currentStep.value === 2 && !validateStep2()) {
    return
  }
  if (currentStep.value < 4) currentStep.value++
}
const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}
const submitForm = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  toast.info('กำลังส่งข้อมูล...')

  try {
    console.log('Form Data to Submit:', JSON.parse(JSON.stringify(formData)))
    await new Promise((resolve) => setTimeout(resolve, 2000))
    toast.success('ส่งข้อมูลการส่งตัวผู้ป่วยสำเร็จ!')
    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (error) {
    console.error('Submission failed:', error)
    toast.error('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง')
    isSubmitting.value = false
  }
}
</script>

<style scoped></style>

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
            <span v-else>{{ step }}</span>
          </div>
          <p class="text-xs mt-1" :class="currentStep >= step ? 'font-semibold' : 'text-gray-500'">
            {{ stepLabels[step - 1] }}
          </p>
        </div>
      </div>

      <div class="bg-white p-6 md:p-8 rounded-lg shadow-md">
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
            <label for="referralFile" class="block text-sm font-medium text-gray-700"
              >อัปโหลดเอกสารส่งตัว (ถ้ามี)</label
            >
            <input
              id="referralFile"
              @change="onFileChange"
              type="file"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </section>

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

        <section v-if="currentStep === 3" class="space-y-4">
          <h2 class="text-2xl font-bold text-gray-800">3. เลือกวันและเวลาเดินทาง</h2>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >วันและเวลาที่ต้องการเดินทาง</label
            >
            <Datepicker
              v-model="formData.travelDate"
              locale="th"
              :min-date="new Date()"
              :minutes-increment="30"
              :minutes-grid-increment="30"
              placeholder="เลือกวันและเวลา"
              auto-apply
              class="mt-1"
            />
          </div>
        </section>

        <section v-if="currentStep === 4">
          <h2 class="text-2xl font-bold text-gray-800">4. ตรวจสอบและยืนยันข้อมูล</h2>
          <p class="text-gray-600 mt-4">กรุณาตรวจสอบข้อมูลทั้งหมดให้ถูกต้องก่อนกดยืนยัน</p>
        </section>

        <div class="mt-8 flex justify-between">
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
            class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            ยืนยันการส่งข้อมูล
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

// --- Interfaces for Data ---
interface Hospital {
  id: string
  name: string
}
interface Clinic {
  id: string
  name: string
}

// --- Mock Data (ข้อมูลจำลอง, ในอนาคตจะมาจาก API) ---
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
const currentStep = ref(1)
const stepLabels = ['ข้อมูลผู้ป่วย', 'เลือกปลายทาง', 'เลือกวันเวลา', 'ยืนยันข้อมูล']

const hospitalList = ref<Hospital[]>([])

const formData = reactive({
  patientName: '',
  patientHN: '',
  originHospitalId: '',
  referralFile: null as File | null,
  destinations: [
    {
      hospitalId: '',
      availableClinics: [] as Clinic[],
      clinics: [{ clinicId: '' }],
    },
  ],
  travelDate: null as Date | null,
})

// --- Mock API Fetching Functions ---
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

// --- Watcher for Dependent Dropdown ---
watch(
  () => formData.destinations,
  async (newDestinations, oldDestinations) => {
    for (const [index, dest] of newDestinations.entries()) {
      const oldDest = oldDestinations?.[index]
      if (dest.hospitalId && (!oldDest || dest.hospitalId !== oldDest.hospitalId)) {
        formData.destinations[index].availableClinics = []
        const clinics = await fetchClinicsForHospital(dest.hospitalId)
        formData.destinations[index].availableClinics = clinics
        formData.destinations[index].clinics = [{ clinicId: '' }]
      }
    }
  },
  { deep: true },
)

// --- Methods ---
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    formData.referralFile = target.files[0]
  }
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
const nextStep = () => {
  if (currentStep.value < 4) currentStep.value++
}
const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}
</script>

<style>
/* Style for Datepicker */
:root {
  --dp-font-family: 'Sarabun', sans-serif;
  --dp-border-radius: 0.375rem;
  --dp-input-padding: 8px 12px;
  --dp-primary-color: #2563eb;
}
</style>

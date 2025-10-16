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
          <section v-if="currentStep === 1" class="space-y-6">
            <h2 class="text-2xl font-bold text-gray-800">1. ข้อมูลผู้ป่วยและต้นทาง</h2>

            <div class="border border-gray-200 rounded-lg p-5 bg-white space-y-4">
              <h3 class="text-lg font-semibold text-gray-700 -mt-2 mb-2">ข้อมูลส่วนตัว</h3>
              <!-- ชื่อ-นามสกุล ผู้ป่วย -->
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    for="patientName"
                    class="block text-sm font-medium text-gray-700 sm:text-base"
                    >ชื่อ-นามสกุล</label
                  >
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div
                      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      <i class="fa-solid fa-user text-gray-400"></i>
                    </div>
                    <input
                      id="patientName"
                      v-model="formData.patientName"
                      type="text"
                      placeholder="เช่น นายสมชาย ใจดี"
                      class="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-base"
                    />
                  </div>
                </div>
                <!-- เลข HN (Hospital Number) -->
                <div>
                  <label for="patientHN" class="block text-sm font-medium text-gray-700"
                    >เลข HN (Hospital Number)</label
                  >
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div
                      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      <i class="fa-solid fa-hashtag text-gray-400"></i>
                    </div>
                    <input
                      id="patientHN"
                      v-model="formData.patientHN"
                      type="text"
                      placeholder="กรอกเลข HN ของโรงพยาบาลต้นทาง"
                      class="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-base"
                    />
                  </div>
                </div>
              </div>
              <div class="grid sm:grid-cols-2 gap-4">
                <!-- เลขบัตรประจำตัวประชาชน -->
                <div>
                  <label for="patientIdCard" class="block text-sm font-medium text-gray-700"
                    >เลขบัตรประจำตัวประชาชน</label
                  >
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div
                      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      <i class="fa-solid fa-id-card text-gray-400"></i>
                    </div>
                    <input
                      id="patientIdCard"
                      v-model="formData.patientIdCard"
                      type="text"
                      maxlength="13"
                      placeholder="กรอกเลข 13 หลัก"
                      class="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-base"
                    />
                  </div>
                  <p class="mt-1 text-xs text-gray-500">กรุณากรอกตัวเลขติดกันโดยไม่ต้องมีขีด</p>
                </div>
                <!-- เบอร์โทรศัพท์ที่ติดต่อได้ -->
                <div>
                  <label for="patientTel" class="block text-sm font-medium text-gray-700"
                    >เบอร์โทรศัพท์ที่ติดต่อได้</label
                  >
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div
                      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      <i class="fa-solid fa-phone text-gray-400"></i>
                    </div>
                    <input
                      id="patientTel"
                      v-model="formData.patientTel"
                      type="tel"
                      maxlength="10"
                      placeholder="0812345678"
                      class="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg p-5 bg-white space-y-4">
              <h3 class="text-lg font-semibold text-gray-700 -mt-2 mb-2">ข้อมูลการส่งตัว</h3>
              <div>
                <label for="originHospital" class="block text-sm font-medium text-gray-700"
                  >โรงพยาบาลต้นทาง</label
                >
                <select
                  id="originHospital"
                  v-model="formData.originHospitalId"
                  class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                >
                  <option disabled value="">-- กรุณาเลือกโรงพยาบาล --</option>
                  <option v-for="hospital in hospitalList" :key="hospital.id" :value="hospital.id">
                    {{ hospital.name }}
                  </option>
                </select>
              </div>
              <div>
                <label for="healthScheme" class="block text-sm font-medium text-gray-700"
                  >สิทธิการรักษา</label
                >
                <select
                  id="healthScheme"
                  v-model="formData.healthScheme"
                  class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                >
                  <option disabled value="">-- กรุณาเลือกสิทธิ --</option>
                  <option value="บัตรทอง">สิทธิหลักประกันสุขภาพถ้วนหน้า (บัตรทอง)</option>
                  <option value="ประกันสังคม">สิทธิประกันสังคม</option>
                  <option value="ข้าราชการ">สิทธิสวัสดิการการรักษาพยาบาลข้าราชการ</option>
                  <option value="ชำระเงินเอง">ชำระเงินเอง</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >อัปโหลดเอกสารส่งตัว (ไม่เกิน 5 ไฟล์)</label
              >
              <div
                class="mt-1 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 hover:border-blue-400 transition-colors"
              >
                <div class="text-center">
                  <i class="fa-solid fa-cloud-arrow-up mx-auto h-12 w-12 text-gray-400"></i>
                  <div class="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      for="referralFile"
                      class="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                    >
                      <span>เลือกไฟล์จากอุปกรณ์</span>
                      <input
                        id="referralFile"
                        @change="onFileChange"
                        type="file"
                        class="sr-only"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                    <p class="pl-1">หรือลากและวางที่นี่</p>
                  </div>
                  <p class="text-xs leading-5 text-gray-600">
                    รองรับ PDF, PNG, JPG ขนาดไม่เกิน 10MB ต่อไฟล์
                  </p>
                </div>
              </div>

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
              class="bg-white border border-gray-200 rounded-lg shadow-sm transition-all"
            >
              <div
                class="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200 rounded-t-lg"
              >
                <h3 class="font-semibold text-lg text-gray-800 flex items-center gap-3">
                  <i class="fa-solid fa-map-location-dot text-blue-600"></i>
                  <span>ปลายทางที่ {{ destIndex + 1 }}</span>
                </h3>
                <button
                  v-if="formData.destinations.length > 1"
                  @click="removeDestination(destIndex)"
                  type="button"
                  class="text-gray-500 hover:text-red-600 transition-colors"
                  title="ลบปลายทางนี้"
                >
                  <i class="fa-solid fa-trash-can fa-lg"></i>
                </button>
              </div>

              <div class="p-5 space-y-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >โรงพยาบาลปลายทาง</label
                  >
                  <div class="relative">
                    <div
                      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      <i class="fa-solid fa-hospital text-gray-400"></i>
                    </div>
                    <select
                      v-model="dest.hospitalId"
                      @change="handleHospitalChange(destIndex)"
                      class="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-base"
                    >
                      <option disabled value="">-- กรุณาเลือกโรงพยาบาล --</option>
                      <option
                        v-for="hospital in hospitalList"
                        :key="hospital.id"
                        :value="hospital.id"
                      >
                        {{ hospital.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >คลินิก / แผนกที่ต้องการติดต่อ</label
                  >
                  <div class="space-y-3">
                    <div
                      v-for="(clinic, clinicIndex) in dest.clinics"
                      :key="clinicIndex"
                      class="flex items-center gap-2"
                    >
                      <div class="relative flex-grow">
                        <div
                          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                        >
                          <i class="fa-solid fa-stethoscope text-gray-400"></i>
                        </div>
                        <select
                          v-model="clinic.clinicId"
                          class="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-base"
                          :disabled="!dest.hospitalId"
                        >
                          <option disabled value="">
                            {{
                              dest.hospitalId ? '-- กรุณาเลือกคลินิก --' : 'โปรดเลือกโรงพยาบาลก่อน'
                            }}
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
                        class="text-gray-400 hover:text-red-500 transition-colors p-2"
                        title="ลบคลินิก"
                      >
                        <i class="fa-solid fa-minus-circle"></i>
                      </button>
                    </div>
                  </div>
                  <button
                    @click="addClinic(destIndex)"
                    type="button"
                    class="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-2"
                  >
                    <i class="fa-solid fa-plus-circle"></i>
                    <span>เพิ่มคลินิก/ใบนัด</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              @click="addDestination"
              type="button"
              class="w-full py-3 px-4 flex justify-center items-center gap-3 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition-colors border-2 border-dashed border-blue-200"
            >
              <i class="fa-solid fa-plus"></i>
              <span>เพิ่มโรงพยาบาลปลายทางอื่น</span>
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
          <section v-if="currentStep === 4">
            <div v-if="trackingCode" class="text-center bg-white p-8 rounded-lg shadow-md">
              <i class="fas fa-check-circle text-green-500 text-6xl mb-4"></i>
              <h2 class="text-2xl md:text-3xl font-bold text-gray-800">
                ส่งข้อมูลของท่านเรียบร้อยแล้ว
              </h2>
              <p class="text-gray-600 mt-2">
                กรุณาบันทึกรหัสติดตามสถานะด้านล่างนี้ เพื่อใช้ตรวจสอบความคืบหน้า
              </p>

              <div
                class="my-6 bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-4 max-w-md mx-auto"
              >
                <span class="text-sm text-gray-600">รหัสติดตามสถานะของคุณคือ:</span>
                <p class="text-2xl md:text-3xl font-bold text-blue-800 tracking-widest mt-1">
                  {{ trackingCode }}
                </p>
              </div>

              <p class="text-sm text-gray-500">
                คุณสามารถนำรหัสนี้ไปตรวจสอบสถานะได้ที่เมนู "ติดตามสถานะการส่งตัว"
              </p>

              <button
                @click="router.push('/')"
                type="button"
                class="mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
              >
                <i class="fa-solid fa-home mr-2"></i>
                กลับสู่หน้าหลัก
              </button>
            </div>

            <div v-else>
              <h2 class="text-2xl font-bold text-gray-800 mb-6">4. ตรวจสอบและยืนยันข้อมูล</h2>

              <div class="space-y-6 bg-white p-6 rounded-lg border">
                <div class="border-b pb-4">
                  <h3 class="font-semibold text-lg text-gray-700 mb-3">ข้อมูลผู้ป่วย</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm sm:text-base">
                    <p><strong>ชื่อ-นามสกุล:</strong> {{ formData.patientName || '-' }}</p>
                    <p><strong>HN:</strong> {{ formData.patientHN || '-' }}</p>
                    <p><strong>เลขบัตรประชาชน:</strong> {{ formData.patientIdCard || '-' }}</p>
                    <p><strong>เบอร์โทรศัพท์:</strong> {{ formData.patientTel || '-' }}</p>
                    <p>
                      <strong>โรงพยาบาลต้นทาง:</strong>
                      {{ getHospitalName(formData.originHospitalId) }}
                    </p>
                    <p><strong>สิทธิการรักษา:</strong> {{ formData.healthScheme || '-' }}</p>
                  </div>
                  <div class="mt-3">
                    <p class="font-medium">
                      <strong>เอกสารส่งตัวที่แนบ: </strong>
                      <span v-if="formData.referralFiles.length > 0">
                        {{ formData.referralFiles.length }} ไฟล์
                      </span>
                      <span v-else class="text-gray-500 font-normal">ไม่ได้แนบไฟล์</span>
                    </p>
                    <ul
                      v-if="formData.referralFiles.length > 0"
                      class="list-disc list-inside ml-4 text-base text-gray-600 mt-1"
                    >
                      <li v-for="file in formData.referralFiles" :key="file.name">
                        {{ file.name }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="border-b pb-4">
                  <h3 class="font-semibold text-lg text-gray-700 mb-3">ข้อมูลปลายทาง</h3>
                  <div
                    v-for="(dest, index) in formData.destinations"
                    :key="index"
                    class="mb-3 text-sm sm:text-base"
                  >
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
                  <p class="text-sm sm:text-base">
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
                      น.
                    </span>
                    <span v-else class="text-gray-500"> ยังไม่ได้เลือก </span>
                  </p>
                </div>
              </div>
              <p class="text-gray-600 mt-6 text-center">
                กรุณาตรวจสอบข้อมูลทั้งหมดให้ถูกต้องก่อนกดยืนยัน
              </p>
            </div>
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
const trackingCode = ref<string | null>(null)

const generateTrackingCode = (): string => {
  const timestamp = Date.now().toString().slice(-5) // เอาเลข 5 ตัวท้ายของ timestamp
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase() // สุ่มตัวอักษร 6 ตัว
  return `REF-${timestamp}-${randomChars}` // ผลลัพธ์เช่น: REF-54321-A4B7X1
}

const formData = reactive({
  patientName: '',
  patientHN: '',
  patientIdCard: '',
  patientTel: '',
  patientBirthdate: '',
  healthScheme: '',
  originHospitalId: '',
  referralFiles: [] as File[],
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

// 👇 **ฟังก์ชัน onFileChange**
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
  formData.referralFiles = combinedFiles
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

// 👇 **ฟังก์ชัน validateStep1**
const validateStep1 = () => {
  // การตรวจสอบเดิม
  if (!formData.patientName.trim()) {
    toast.error('กรุณากรอกชื่อผู้ป่วย')
    return false
  }
  if (!formData.patientHN.trim()) {
    toast.error('กรุณากรอกเลข HN')
    return false
  }

  // --- การตรวจสอบข้อมูลที่เพิ่มเข้ามา ---
  if (!formData.patientIdCard.trim() || formData.patientIdCard.length !== 13) {
    toast.error('กรุณากรอกเลขบัตรประชาชน 13 หลักให้ถูกต้อง')
    return false
  }
  if (!formData.patientTel.trim() || formData.patientTel.length !== 10) {
    toast.error('กรุณากรอกเบอร์โทรศัพท์ 10 หลักให้ถูกต้อง')
    return false
  }
  if (!formData.healthScheme) {
    toast.error('กรุณาเลือกสิทธิการรักษา')
    return false
  }
  // ------------------------------------

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
    // จำลองการส่งข้อมูลไปที่ Backend (ใช้เวลา 1.5 วินาที)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // สร้างรหัสติดตามสถานะและอัปเดตค่าใน state
    trackingCode.value = generateTrackingCode()
  } catch (error) {
    console.error('Submission failed:', error)
    toast.error('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง')
    // หากล้มเหลว ให้ isSubmitting เป็น false เพื่อให้ผู้ใช้ลองใหม่ได้
    isSubmitting.value = false
  }
  // หมายเหตุ: เราจะไม่ตั้ง isSubmitting.value = false ใน finally block แล้ว
  // เพราะเมื่อสำเร็จ เราต้องการให้ปุ่ม submit หายไปพร้อมกับฟอร์ม
}
</script>

<style scoped></style>

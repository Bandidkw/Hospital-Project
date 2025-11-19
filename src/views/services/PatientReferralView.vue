<template>
  <main class="bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto px-4 py-10">
      <header class="mb-10 text-center">
        <h1
          class="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-3"
        >
          <i class="fas fa-exchange-alt text-teal-600"></i>
          <span>แบบฟอร์มแจ้งการส่งตัวผู้ป่วย</span>
        </h1>
        <p class="text-gray-600 mt-2">กรุณากรอกข้อมูลให้ครบถ้วนเพื่อความสะดวกในการประสานงาน</p>
      </header>

      <div class="mb-8 flex justify-between items-center border-b pb-4">
        <div v-for="step in 4" :key="step" class="text-center w-1/4">
          <div
            class="mx-auto w-8 h-8 rounded-full flex items-center justify-center text-lg transition-colors duration-300"
            :class="
              currentStep === step
                ? 'bg-teal-600 text-white shadow-lg'
                : currentStep > step
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
            "
          >
            <i v-if="currentStep > step" class="fas fa-check"></i>
            <span v-else>{{ step }}</span>
          </div>
          <p
            class="text-xs mt-2 transition-colors duration-300"
            :class="currentStep >= step ? 'font-semibold text-gray-800' : 'text-gray-400'"
          >
            {{ stepLabels[step - 1] }}
          </p>
        </div>
      </div>

      <div class="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
        <form @submit.prevent="submitForm">
          <section v-if="currentStep === 1" class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold text-gray-800 border-l-4 border-teal-500 pl-3">
              1. ข้อมูลผู้ป่วยและต้นทาง
            </h2>

            <div class="border border-gray-200 rounded-lg p-5 bg-gray-50/50 space-y-4">
              <h3 class="text-lg font-semibold text-gray-700 mb-2">ข้อมูลส่วนตัว</h3>

              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label for="patientName" class="block text-sm font-medium text-gray-700"
                    >ชื่อ-นามสกุล <span class="text-red-500">*</span></label
                  >
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div
                      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      <i class="fas fa-user text-gray-400"></i>
                    </div>
                    <input
                      id="patientName"
                      v-model="formData.patientName"
                      type="text"
                      placeholder="เช่น นายสมชาย ใจดี"
                      class="block w-full rounded-md border-gray-300 pl-10 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label for="patientHN" class="block text-sm font-medium text-gray-700"
                    >เลข HN (Hospital Number) <span class="text-red-500">*</span></label
                  >
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div
                      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      <i class="fas fa-hashtag text-gray-400"></i>
                    </div>
                    <input
                      id="patientHN"
                      v-model="formData.patientHN"
                      type="text"
                      placeholder="ระบุเลข HN"
                      class="block w-full rounded-md border-gray-300 pl-10 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label for="patientIdCard" class="block text-sm font-medium text-gray-700"
                    >เลขบัตรประจำตัวประชาชน <span class="text-red-500">*</span></label
                  >
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div
                      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      <i class="fas fa-id-card text-gray-400"></i>
                    </div>
                    <input
                      id="patientIdCard"
                      v-model="formData.patientIdCard"
                      type="text"
                      maxlength="13"
                      placeholder="13 หลัก (ไม่ต้องมีขีด)"
                      class="block w-full rounded-md border-gray-300 pl-10 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label for="patientTel" class="block text-sm font-medium text-gray-700"
                    >เบอร์โทรศัพท์ที่ติดต่อได้ <span class="text-red-500">*</span></label
                  >
                  <div class="mt-1 relative rounded-md shadow-sm">
                    <div
                      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      <i class="fas fa-phone text-gray-400"></i>
                    </div>
                    <input
                      id="patientTel"
                      v-model="formData.patientTel"
                      type="tel"
                      maxlength="10"
                      placeholder="081xxxxxxx"
                      class="block w-full rounded-md border-gray-300 pl-10 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg p-5 bg-gray-50/50 space-y-4">
              <h3 class="text-lg font-semibold text-gray-700 mb-2">ข้อมูลการส่งตัว</h3>
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label for="originHospital" class="block text-sm font-medium text-gray-700"
                    >โรงพยาบาลต้นทาง <span class="text-red-500">*</span></label
                  >
                  <select
                    id="originHospital"
                    v-model="formData.originHospitalId"
                    class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 focus:border-teal-500 focus:outline-none focus:ring-teal-500"
                  >
                    <option disabled value="">-- กรุณาเลือก --</option>
                    <option
                      v-for="hospital in hospitalList"
                      :key="hospital.id"
                      :value="hospital.id"
                    >
                      {{ hospital.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label for="healthScheme" class="block text-sm font-medium text-gray-700"
                    >สิทธิการรักษา <span class="text-red-500">*</span></label
                  >
                  <select
                    id="healthScheme"
                    v-model="formData.healthScheme"
                    class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 focus:border-teal-500 focus:outline-none focus:ring-teal-500"
                  >
                    <option disabled value="">-- กรุณาเลือก --</option>
                    <option value="บัตรทอง">สิทธิหลักประกันสุขภาพถ้วนหน้า (บัตรทอง)</option>
                    <option value="ประกันสังคม">สิทธิประกันสังคม</option>
                    <option value="ข้าราชการ">สิทธิสวัสดิการข้าราชการ</option>
                    <option value="ชำระเงินเอง">ชำระเงินเอง</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >อัปโหลดเอกสารส่งตัว (สูงสุด 5 ไฟล์)</label
              >
              <div
                class="mt-1 flex justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 hover:border-teal-400 hover:bg-teal-50 transition-all cursor-pointer"
                @click="triggerFileInput"
              >
                <div class="text-center">
                  <i class="fas fa-cloud-upload-alt mx-auto h-12 w-12 text-gray-400 mb-3"></i>
                  <div class="flex text-sm text-gray-600 justify-center">
                    <label
                      class="relative cursor-pointer rounded-md font-semibold text-teal-600 focus-within:outline-none hover:text-teal-500"
                    >
                      <span>คลิกเพื่อเลือกไฟล์</span>
                      <input
                        ref="fileInput"
                        id="referralFile"
                        @change="onFileChange"
                        type="file"
                        class="sr-only"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                    <p class="pl-1">หรือลากไฟล์มาวาง</p>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">PDF, PNG, JPG ขนาดไม่เกิน 10MB</p>
                </div>
              </div>

              <div v-if="formData.referralFiles.length > 0" class="mt-4 grid gap-2">
                <div
                  v-for="(file, index) in formData.referralFiles"
                  :key="index"
                  class="flex items-center justify-between bg-teal-50 p-2 px-3 rounded-md text-sm border border-teal-100"
                >
                  <div class="flex items-center overflow-hidden">
                    <i class="fas fa-file-alt text-teal-500 mr-2"></i>
                    <span class="text-gray-700 truncate">{{ file.name }}</span>
                  </div>
                  <button
                    @click.stop="removeFile(index)"
                    type="button"
                    class="text-red-400 hover:text-red-600 transition-colors p-1"
                    title="ลบไฟล์"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section v-if="currentStep === 2" class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold text-gray-800 border-l-4 border-teal-500 pl-3">
              2. โรงพยาบาลปลายทางและคลินิก
            </h2>

            <div
              v-for="(dest, destIndex) in formData.destinations"
              :key="destIndex"
              class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <div
                class="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200 rounded-t-lg"
              >
                <h3 class="font-semibold text-lg text-gray-800 flex items-center gap-2">
                  <span class="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded">
                    #{{ destIndex + 1 }}
                  </span>
                  <span>ข้อมูลปลายทาง</span>
                </h3>
                <button
                  v-if="formData.destinations.length > 1"
                  @click="removeDestination(destIndex)"
                  type="button"
                  class="text-gray-400 hover:text-red-600 transition-colors"
                  title="ลบรายการนี้"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>

              <div class="p-5 space-y-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >โรงพยาบาลปลายทาง <span class="text-red-500">*</span></label
                  >
                  <select
                    v-model="dest.hospitalId"
                    @change="handleHospitalChange(destIndex)"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  >
                    <option disabled value="">-- เลือกโรงพยาบาล --</option>
                    <option
                      v-for="hospital in hospitalList"
                      :key="hospital.id"
                      :value="hospital.id"
                    >
                      {{ hospital.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >คลินิก / แผนก <span class="text-red-500">*</span></label
                  >

                  <div
                    v-if="!dest.hospitalId"
                    class="text-sm text-gray-500 bg-gray-100 p-3 rounded-md"
                  >
                    <i class="fas fa-info-circle mr-1"></i> กรุณาเลือกโรงพยาบาลก่อน
                  </div>

                  <div v-else class="space-y-3">
                    <div
                      v-for="(clinic, clinicIndex) in dest.clinics"
                      :key="clinicIndex"
                      class="flex items-center gap-2"
                    >
                      <select
                        v-model="clinic.clinicId"
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                      >
                        <option disabled value="">-- เลือกคลินิก --</option>
                        <option
                          v-for="clinicOpt in dest.availableClinics"
                          :key="clinicOpt.id"
                          :value="clinicOpt.id"
                        >
                          {{ clinicOpt.name }}
                        </option>
                      </select>

                      <button
                        v-if="dest.clinics.length > 1"
                        @click="removeClinic(destIndex, clinicIndex)"
                        type="button"
                        class="text-gray-400 hover:text-red-500 p-2"
                        title="ลบคลินิก"
                      >
                        <i class="fas fa-minus-circle"></i>
                      </button>
                    </div>

                    <button
                      @click="addClinic(destIndex)"
                      type="button"
                      class="text-sm text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1 mt-2"
                    >
                      <i class="fas fa-plus"></i> เพิ่มแผนก/คลินิก
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              @click="addDestination"
              type="button"
              class="w-full py-3 border-2 border-dashed border-teal-300 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-semibold"
            >
              <i class="fas fa-plus-circle mr-2"></i> เพิ่มโรงพยาบาลปลายทางอื่น
            </button>
          </section>

          <section v-if="currentStep === 3" class="space-y-6 animate-fade-in">
            <h2 class="text-2xl font-bold text-gray-800 border-l-4 border-teal-500 pl-3">
              3. เลือกวันและเวลาเดินทาง
            </h2>
            <div class="flex justify-center py-6">
              <CustomCalendar v-model="formData.travelDate" />
            </div>
            <p class="text-center text-sm text-gray-500">
              * กรุณาเลือกวันที่ผู้ป่วยสะดวก หรือวันที่คาดว่าจะเดินทางไปถึง
            </p>
          </section>

          <section v-if="currentStep === 4" class="animate-fade-in">
            <div v-if="trackingCode" class="text-center py-10">
              <div
                class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6"
              >
                <i class="fas fa-check text-green-600 text-4xl"></i>
              </div>
              <h2 class="text-3xl font-bold text-gray-800 mb-2">ส่งข้อมูลสำเร็จ!</h2>
              <p class="text-gray-600 mb-8">ระบบได้รับข้อมูลการส่งตัวเรียบร้อยแล้ว</p>

              <div
                class="bg-white border-2 border-teal-100 rounded-xl p-6 max-w-md mx-auto shadow-sm mb-8"
              >
                <p class="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-2">
                  รหัสติดตามสถานะ
                </p>
                <p class="text-3xl font-mono font-bold text-teal-700 tracking-wider select-all">
                  {{ trackingCode }}
                </p>
              </div>

              <button
                @click="router.push('/')"
                type="button"
                class="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition shadow-md font-medium"
              >
                กลับสู่หน้าหลัก
              </button>
            </div>

            <div v-else>
              <h2 class="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-teal-500 pl-3">
                4. ตรวจสอบและยืนยันข้อมูล
              </h2>

              <div
                class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6"
              >
                <div class="p-6 border-b border-gray-100">
                  <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <i class="fas fa-user-circle text-teal-500"></i> ข้อมูลผู้ป่วย
                  </h3>
                  <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
                    <div>
                      <dt class="text-gray-500">ชื่อ-นามสกุล</dt>
                      <dd class="font-medium text-gray-900">{{ formData.patientName }}</dd>
                    </div>
                    <div>
                      <dt class="text-gray-500">HN</dt>
                      <dd class="font-medium text-gray-900">{{ formData.patientHN }}</dd>
                    </div>
                    <div>
                      <dt class="text-gray-500">เลขบัตรประชาชน</dt>
                      <dd class="font-medium text-gray-900">{{ formData.patientIdCard }}</dd>
                    </div>
                    <div>
                      <dt class="text-gray-500">เบอร์โทรศัพท์</dt>
                      <dd class="font-medium text-gray-900">{{ formData.patientTel }}</dd>
                    </div>
                    <div>
                      <dt class="text-gray-500">โรงพยาบาลต้นทาง</dt>
                      <dd class="font-medium text-gray-900">
                        {{ getHospitalName(formData.originHospitalId) }}
                      </dd>
                    </div>
                    <div>
                      <dt class="text-gray-500">สิทธิการรักษา</dt>
                      <dd class="font-medium text-gray-900">{{ formData.healthScheme }}</dd>
                    </div>
                  </dl>

                  <div class="mt-4 pt-4 border-t border-gray-50">
                    <dt class="text-gray-500 text-sm mb-2">
                      เอกสารแนบ ({{ formData.referralFiles.length }})
                    </dt>
                    <ul
                      v-if="formData.referralFiles.length"
                      class="list-disc list-inside text-sm text-gray-700 space-y-1"
                    >
                      <li v-for="file in formData.referralFiles" :key="file.name">
                        {{ file.name }}
                      </li>
                    </ul>
                    <span v-else class="text-sm text-gray-400 italic">- ไม่มีเอกสารแนบ -</span>
                  </div>
                </div>

                <div class="p-6 border-b border-gray-100 bg-gray-50/30">
                  <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <i class="fas fa-hospital-alt text-teal-500"></i> ปลายทางที่ต้องการส่งตัว
                  </h3>
                  <div
                    v-for="(dest, idx) in formData.destinations"
                    :key="idx"
                    class="mb-4 last:mb-0"
                  >
                    <p class="font-semibold text-gray-900 mb-1">
                      {{ idx + 1 }}. {{ getHospitalName(dest.hospitalId) }}
                    </p>
                    <ul class="ml-6 list-disc text-sm text-gray-600">
                      <li v-for="(clinic, cIdx) in dest.clinics" :key="cIdx">
                        {{ getClinicName(dest.hospitalId, clinic.clinicId) }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="p-6">
                  <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <i class="fas fa-calendar-check text-teal-500"></i> วันที่เดินทาง
                  </h3>
                  <p class="text-gray-900 font-medium">
                    {{
                      formData.travelDate instanceof Date
                        ? formData.travelDate.toLocaleDateString('th-TH', { dateStyle: 'long' })
                        : 'ยังไม่ระบุ'
                    }}
                  </p>
                </div>
              </div>

              <p class="text-center text-sm text-gray-500 mb-6">
                <i class="fas fa-info-circle mr-1"></i> กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยัน
              </p>
            </div>
          </section>

          <div class="mt-8 flex justify-between pt-6 border-t border-gray-100" v-if="!trackingCode">
            <button
              v-if="currentStep > 1"
              @click="prevStep"
              type="button"
              class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              <i class="fas fa-arrow-left mr-2"></i> ย้อนกลับ
            </button>
            <div v-else></div>
            <button
              v-if="currentStep < 4"
              @click="nextStep"
              type="button"
              class="px-6 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition shadow-sm hover:shadow flex items-center"
            >
              ถัดไป <i class="fas fa-arrow-right ml-2"></i>
            </button>

            <button
              v-if="currentStep === 4"
              type="submit"
              :disabled="isSubmitting"
              class="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow-md hover:shadow-lg flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
              <span>{{ isSubmitting ? 'กำลังส่งข้อมูล...' : 'ยืนยันการส่งข้อมูล' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import CustomCalendar from '@/components/CustomCalendar.vue'

// Import Types & Services
import type { Hospital, Clinic, ReferralFormData } from '@/types/referral'
import { getHospitals, getClinicsByHospital, createReferral } from '@/services/referralService'

const router = useRouter()
const toast = useToast()

// --- State ---
const isSubmitting = ref(false)
const currentStep = ref(1)
const stepLabels = ['ข้อมูลผู้ป่วย', 'เลือกปลายทาง', 'เลือกวันเวลา', 'ยืนยันข้อมูล']
const trackingCode = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Master Data State
const hospitalList = ref<Hospital[]>([])

// **Extended Interface for UI State**
// เราต้องขยาย Interface เพราะ ReferralFormData ใน type หลักอาจจะไม่มี availableClinics
// เพื่อใช้จัดการ Dropdown ในหน้าจอ
interface DestinationState {
  hospitalId: string
  clinics: { clinicId: string }[]
  availableClinics: Clinic[] // เพิ่ม field นี้สำหรับ UI logic
}

interface FormState extends Omit<ReferralFormData, 'destinations'> {
  destinations: DestinationState[]
}

const formData = reactive<FormState>({
  patientName: '',
  patientHN: '',
  patientIdCard: '',
  patientTel: '',
  patientBirthdate: '', // Optional
  healthScheme: '',
  originHospitalId: '',
  referralFiles: [],
  destinations: [
    {
      hospitalId: '',
      clinics: [{ clinicId: '' }],
      availableClinics: [],
    },
  ],
  travelDate: new Date(),
})

// --- Fetching Logic ---
const fetchHospitalsData = async () => {
  try {
    hospitalList.value = await getHospitals()
  } catch (error) {
    console.error('Failed to fetch hospitals:', error)
    toast.error('ไม่สามารถดึงรายชื่อโรงพยาบาลได้')
  }
}

const fetchClinicsData = async (hospitalId: string): Promise<Clinic[]> => {
  if (!hospitalId) return []
  try {
    return await getClinicsByHospital(hospitalId)
  } catch (error) {
    console.error(`Failed to fetch clinics for ${hospitalId}:`, error)
    toast.error('ไม่สามารถดึงข้อมูลคลินิกได้')
    return []
  }
}

onMounted(() => {
  fetchHospitalsData()
})

// --- Handlers ---

const handleHospitalChange = async (destIndex: number) => {
  const destination = formData.destinations[destIndex]
  // Reset clinics when hospital changes
  destination.clinics = [{ clinicId: '' }]
  destination.availableClinics = []

  if (destination.hospitalId) {
    destination.availableClinics = await fetchClinicsData(destination.hospitalId)
  }
}

// 2. สร้างฟังก์ชันเพื่อเรียกใช้ click() อย่างปลอดภัย
const triggerFileInput = () => {
  fileInput.value?.click()
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newFiles = target.files
  if (!newFiles) return

  const combinedFiles = [...formData.referralFiles, ...Array.from(newFiles)]
  if (combinedFiles.length > 5) {
    toast.error('อัปโหลดได้สูงสุด 5 ไฟล์')
    target.value = ''
    return
  }

  // Check file size (10MB limit example)
  const oversized = Array.from(newFiles).some((f) => f.size > 10 * 1024 * 1024)
  if (oversized) {
    toast.error('บางไฟล์มีขนาดเกิน 10MB')
    target.value = ''
    return
  }

  formData.referralFiles = combinedFiles
  target.value = ''
}

const removeFile = (index: number) => {
  formData.referralFiles.splice(index, 1)
}

// Destination Management
const addDestination = () => {
  formData.destinations.push({ hospitalId: '', clinics: [{ clinicId: '' }], availableClinics: [] })
}
const removeDestination = (index: number) => {
  if (formData.destinations.length > 1) {
    formData.destinations.splice(index, 1)
  }
}

// Clinic Management
const addClinic = (destIndex: number) => {
  formData.destinations[destIndex].clinics.push({ clinicId: '' })
}
const removeClinic = (destIndex: number, clinicIndex: number) => {
  if (formData.destinations[destIndex].clinics.length > 1) {
    formData.destinations[destIndex].clinics.splice(clinicIndex, 1)
  }
}

// --- Helpers for Display ---
const getHospitalName = (id: string) => {
  return hospitalList.value.find((h) => h.id === id)?.name || id
}

const getClinicName = (hospitalId: string, clinicId: string) => {
  // ค้นหาจาก destinations state ปัจจุบัน
  const dest = formData.destinations.find((d) => d.hospitalId === hospitalId)
  if (dest) {
    return dest.availableClinics.find((c) => c.id === clinicId)?.name || clinicId
  }
  return clinicId
}

// --- Validation & Navigation ---
const validateStep1 = () => {
  if (!formData.patientName.trim()) return showError('กรุณากรอกชื่อผู้ป่วย')
  if (!formData.patientHN.trim()) return showError('กรุณากรอกเลข HN')
  if (!formData.patientIdCard.trim() || formData.patientIdCard.length !== 13)
    return showError('กรุณากรอกเลขบัตรประชาชน 13 หลัก')
  if (!formData.patientTel.trim()) return showError('กรุณากรอกเบอร์โทรศัพท์')
  if (!formData.originHospitalId) return showError('กรุณาเลือกโรงพยาบาลต้นทาง')
  if (!formData.healthScheme) return showError('กรุณาเลือกสิทธิการรักษา')
  return true
}

const validateStep2 = () => {
  for (const dest of formData.destinations) {
    if (!dest.hospitalId) return showError('กรุณาเลือกโรงพยาบาลปลายทางให้ครบ')
    for (const clinic of dest.clinics) {
      if (!clinic.clinicId) return showError('กรุณาเลือกคลินิกให้ครบ')
    }
  }
  return true
}

const showError = (msg: string) => {
  toast.error(msg)
  return false
}

const nextStep = () => {
  if (currentStep.value === 1 && !validateStep1()) return
  if (currentStep.value === 2 && !validateStep2()) return
  if (currentStep.value < 4) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

// --- Submission ---
const submitForm = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    // แปลง FormState กลับเป็น ReferralFormData (ตัด availableClinics ออก)
    // แต่จริงๆ createReferral รับ object ที่มี key เกินได้ หรือเราจะ map ใหม่ก็ได้
    // ในที่นี้ Service เรา handle แค่ field ที่ต้องการ ดังนั้นส่ง formData ไปได้เลย (TS อาจบ่นเรื่อง availableClinics)
    // เพื่อความ clean เรา map ให้ตรง type
    const payload: ReferralFormData = {
      ...formData,
      destinations: formData.destinations.map((d) => ({
        hospitalId: d.hospitalId,
        clinics: d.clinics,
      })),
    }

    const response = await createReferral(payload)
    trackingCode.value = response.trackingCode
    toast.success('ส่งข้อมูลเรียบร้อยแล้ว')
  } catch (error) {
    console.error('Submission error:', error)
    toast.error('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

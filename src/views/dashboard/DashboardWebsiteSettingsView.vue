<template>
  <div class="p-6 bg-white rounded-xl shadow-2xl transition duration-500">
    <h2 class="text-3xl font-extrabold text-gray-800 mb-2 flex items-center">
      <i class="fas fa-globe mr-4 text-cyan-600"></i> ตั้งค่าเว็บไซต์
    </h2>
    <p class="text-gray-600 mb-6 border-b pb-4">
      จัดการข้อมูลพื้นฐานของเว็บไซต์ เช่น ชื่อโรงพยาบาล, ที่อยู่, เบอร์โทรศัพท์,
      และช่องทางติดต่ออื่นๆ ที่จะแสดงผลบนหน้าเว็บไซต์.
    </p>

    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-6xl text-blue-500"></i>
      <p class="mt-4 text-lg text-gray-600">กำลังโหลดข้อมูลตั้งค่า...</p>
    </div>

    <form v-else @submit.prevent="saveWebsiteSettings" class="space-y-8">
      <div class="card bg-gray-200 p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-info-circle mr-2 text-blue-500"></i> ข้อมูลทั่วไป
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="hospitalNameTh" class="block text-sm font-semibold text-gray-700"
              >ชื่อโรงพยาบาล (เต็ม):</label
            >
            <input
              type="text"
              id="hospitalNameTh"
              v-model="websiteSettings.hospitalNameTh"
              required
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="โรงพยาบาลแม่แตง"
            />
          </div>
          <div>
            <label for="hospitalNameEn" class="block text-sm font-semibold text-gray-700"
              >ชื่อโรงพยาบาล (English/ชื่อย่อ):</label
            >
            <input
              type="text"
              id="hospitalNameEn"
              v-model="websiteSettings.hospitalNameEn"
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Maetaeng Hospital"
            />
          </div>

          <div class="col-span-full">
            <label for="address" class="block text-sm font-semibold text-gray-700"
              >ที่อยู่โรงพยาบาล:</label
            >
            <textarea
              id="address"
              v-model="websiteSettings.address"
              rows="3"
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div>
            <label for="zipCode" class="block text-sm font-semibold text-gray-700"
              >รหัสไปรษณีย์:</label
            >
            <input
              type="text"
              id="zipCode"
              v-model="websiteSettings.zipCode"
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="province" class="block text-sm font-semibold text-gray-700">จังหวัด:</label>
            <input
              type="text"
              id="province"
              v-model="websiteSettings.province"
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div class="card bg-gray-200 p-6 rounded-xl shadow-lg border-t-4 border-green-500">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-phone-alt mr-2 text-green-600"></i> ข้อมูลการติดต่อ
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="telMain" class="block text-sm font-semibold text-gray-700"
              >เบอร์โทรศัพท์หลัก:</label
            >
            <input
              type="tel"
              id="telMain"
              v-model="websiteSettings.telMain"
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="053-XXX-XXXX"
            />
          </div>
          <div>
            <label for="fax" class="block text-sm font-semibold text-gray-700"
              >เบอร์โทรสาร (FAX):</label
            >
            <input
              type="tel"
              id="fax"
              v-model="websiteSettings.fax"
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="053-YYY-YYYY"
            />
          </div>

          <div class="col-span-full">
            <label for="emailMain" class="block text-sm font-semibold text-gray-700"
              >อีเมลหลัก:</label
            >
            <input
              type="email"
              id="emailMain"
              v-model="websiteSettings.emailMain"
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="info@yourhospital.com"
            />
          </div>
        </div>
      </div>

      <div class="card bg-gray-200 p-6 rounded-xl shadow-lg border-t-4 border-cyan-500">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-share-alt mr-2 text-cyan-600"></i> Social Media / แผนที่
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="facebookUrl" class="block text-sm font-semibold text-gray-700"
              >Facebook URL:</label
            >
            <input
              type="url"
              id="facebookUrl"
              v-model="websiteSettings.facebookUrl"
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://www.facebook.com/..."
            />
          </div>
          <div>
            <label for="lineId" class="block text-sm font-semibold text-gray-700"
              >LINE ID/URL:</label
            >
            <input
              type="text"
              id="lineId"
              v-model="websiteSettings.lineId"
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="@yourlineid"
            />
          </div>

          <div>
            <label for="youtubeUrl" class="block text-sm font-semibold text-gray-700"
              >Youtube URL:</label
            >
            <input
              type="url"
              id="youtubeUrl"
              v-model="websiteSettings.youtubeUrl"
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://www.youtube.com/..."
            />
          </div>
          <div>
            <label for="twitterUrl" class="block text-sm font-semibold text-gray-700"
              >Twitter (X) URL:</label
            >
            <input
              type="url"
              id="twitterUrl"
              v-model="websiteSettings.twitterUrl"
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://twitter.com/..."
            />
          </div>

          <div class="col-span-full">
            <label for="googleMapIframe" class="block text-sm font-semibold text-gray-700"
              >Google Maps Embed Code (iFrame):</label
            >
            <textarea
              id="googleMapIframe"
              v-model="websiteSettings.googleMapIframe"
              rows="4"
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 font-mono text-xs placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="วางโค้ด iframe ที่คัดลอกมาจาก Google Maps"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              ใช้โค้ด HTML iFrame ที่ได้จากการ "ฝังแผนที่" เท่านั้น
            </p>
          </div>
        </div>
      </div>

      <div class="card bg-gray-50 p-6 rounded-xl shadow-lg border-t-4 border-yellow-500">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-search mr-2 text-yellow-600"></i> SEO (การค้นหา)
        </h3>
        <div class="space-y-4">
          <div>
            <label for="metaDescription" class="block text-sm font-semibold text-gray-700"
              >Meta Description (160 อักขระ):</label
            >
            <textarea
              id="metaDescription"
              v-model="websiteSettings.metaDescription"
              rows="3"
              maxlength="160"
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              {{ websiteSettings.metaDescription?.length || 0 }} / 160 อักขระ
            </p>
          </div>

          <div>
            <label for="keywords" class="block text-sm font-semibold text-gray-700"
              >Keywords (คั่นด้วยคอมม่า):</label
            >
            <input
              type="text"
              id="keywords"
              v-model="websiteSettings.keywords"
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="โรงพยาบาล, แม่แตง, สุขภาพ, แพทย์"
            />
          </div>
        </div>
      </div>

      <div class="pt-4 flex justify-end">
        <button
          type="submit"
          :disabled="isSaving"
          class="flex items-center bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition duration-300 text-lg shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <i class="fas fa-spinner fa-spin mr-2" v-if="isSaving"></i>
          <i class="fas fa-save mr-2" v-else></i>
          {{ isSaving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
// 💡 เราใช้ Service ที่คุณปรับปรุงล่าสุดซึ่งเชื่อมต่อ API จริงแล้ว
import { fetchSettings, updateSettings } from '@/services/settingsService'
import type { SettingsData } from '@/types/settings'

const toast = useToast()

// ------------------------------------------------------------------
// 1. STATE MANAGEMENT
// ------------------------------------------------------------------

// 🟢 โครงสร้าง State ที่สมบูรณ์และสอดคล้องกับ SettingsData
const websiteSettings = ref<SettingsData>({
  id: 'global-settings-1',
  hospitalNameTh: '',
  hospitalNameEn: '',
  address: '',
  zipCode: '',
  province: '',
  telMain: '',
  fax: '',
  emailMain: '',
  facebookUrl: '',
  lineId: '',
  youtubeUrl: '', // 🟢 เพิ่ม field ที่หายไป
  twitterUrl: '', // 🟢 เพิ่ม field ที่หายไป
  googleMapIframe: '',
  metaDescription: '',
  keywords: '',
})

const loading = ref(true)
const isSaving = ref(false)

// ------------------------------------------------------------------
// 2. LIFECYCLE & DATA FETCHING
// ------------------------------------------------------------------

const fetchWebsiteSettings = async () => {
  // 1. เริ่มโหลด (loading.value ถูกตั้งเป็น true ก่อนเข้า try/catch)
  loading.value = true
  try {
    const data = await fetchSettings()
    websiteSettings.value = data
  } catch (e) {
    toast.error('ไม่สามารถโหลดข้อมูลตั้งค่าเว็บไซต์ปัจจุบันได้')
    console.error('Fetch settings failed:', e)
  } finally {
    // 🟢 2. ต้องตั้ง loading.value = false เสมอ ไม่ว่าจะสำเร็จหรือล้มเหลว
    loading.value = false
  }
}

// ------------------------------------------------------------------
// 3. SAVE LOGIC
// ------------------------------------------------------------------

const saveWebsiteSettings = async () => {
  isSaving.value = true
  try {
    // 💡 ฟังก์ชัน updateSettings จะใช้ PATCH /settings/1 ตามที่เรากำหนดใน Service
    await updateSettings(websiteSettings.value)
    toast.success('บันทึกการตั้งค่าเว็บไซต์สำเร็จ!')
  } catch (e: unknown) {
    console.error('Error saving website settings:', e)
    toast.error('บันทึกการตั้งค่าล้มเหลว')
  } finally {
    isSaving.value = false
  }
}

onMounted(fetchWebsiteSettings)
</script>

<template>
  <div class="p-6 bg-white rounded-xl shadow-2xl transition duration-500">
    <h2 class="text-3xl font-extrabold text-gray-800 mb-2 flex items-center">
      <i class="fas fa-globe mr-4 text-cyan-600"></i>
      {{ editMode ? 'แก้ไขตั้งค่าเว็บไซต์' : 'สร้างตั้งค่าเว็บไซต์ใหม่' }}
    </h2>
    <div class="flex justify-between items-center mb-4 border-b pb-4">
      <p class="text-gray-600">
        {{ editMode ? 'แก้ไขข้อมูลการตั้งค่าเว็บไซต์' : 'สร้างข้อมูลการตั้งค่าเว็บไซต์ใหม่' }}
        เช่น ชื่อโรงพยาบาล, ที่อยู่, เบอร์โทรศัพท์, และช่องทางติดต่ออื่นๆ
      </p>
      <router-link
        to="/dashboard/website-settings-list"
        class="flex items-center bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-300 shadow-md whitespace-nowrap"
      >
        <i class="fas fa-list mr-2"></i>
        ดูข้อมูลทั้งหมด
      </router-link>
    </div>

    <form @submit.prevent="saveWebsiteSettings" class="space-y-8">
      <div class="card bg-gray-200 p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-info-circle mr-2 text-blue-500"></i> ข้อมูลทั่วไป
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="hospitalNameTh" class="block text-sm font-semibold text-gray-700"
              >ชื่อโรงพยาบาล (เต็ม): <span class="text-red-500">*</span></label
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
              >ชื่อโรงพยาบาล (English/ชื่อย่อ): <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="hospitalNameEn"
              v-model="websiteSettings.hospitalNameEn"
              required
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Maetaeng Hospital"
            />
          </div>

          <div class="col-span-full">
            <label for="address" class="block text-sm font-semibold text-gray-700"
              >ที่อยู่โรงพยาบาล: <span class="text-red-500">*</span></label
            >
            <textarea
              id="address"
              v-model="websiteSettings.address"
              rows="3"
              required
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div>
            <label for="zipCode" class="block text-sm font-semibold text-gray-700"
              >รหัสไปรษณีย์: <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="zipCode"
              v-model="websiteSettings.zipCode"
              required
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="province" class="block text-sm font-semibold text-gray-700"
              >จังหวัด: <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="province"
              v-model="websiteSettings.province"
              required
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
              >เบอร์โทรศัพท์หลัก: <span class="text-red-500">*</span></label
            >
            <input
              type="tel"
              id="telMain"
              v-model="websiteSettings.telMain"
              required
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="053-XXX-XXXX"
            />
          </div>
          <div>
            <label for="fax" class="block text-sm font-semibold text-gray-700"
              >เบอร์โทรสาร (FAX): <span class="text-red-500">*</span></label
            >
            <input
              type="tel"
              id="fax"
              v-model="websiteSettings.fax"
              required
              class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="053-YYY-YYYY"
            />
          </div>

          <div class="col-span-full">
            <label for="emailMain" class="block text-sm font-semibold text-gray-700"
              >อีเมลหลัก: <span class="text-red-500">*</span></label
            >
            <input
              type="email"
              id="emailMain"
              v-model="websiteSettings.emailMain"
              required
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

      <div class="card bg-gray-200 p-6 rounded-xl shadow-lg border-t-4 border-yellow-500">
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
          {{ isSaving ? 'กำลังบันทึก...' : editMode ? 'อัพเดทการตั้งค่า' : 'สร้างการตั้งค่า' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { createSettings, fetchSettingsById, updateSettings } from '@/services/settingsService'
import type { SettingsData } from '@/types/settings'

const route = useRoute()
const router = useRouter()
const toast = useToast()

// ------------------------------------------------------------------
// 1. STATE MANAGEMENT
// ------------------------------------------------------------------

const websiteSettings = ref<SettingsData>({
  id: '',
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
  youtubeUrl: '',
  twitterUrl: '',
  googleMapIframe: '',
  metaDescription: '',
  keywords: '',
  isActive: false,
})

const loading = ref(false)
const isSaving = ref(false)
const editMode = computed(() => !!route.query.id)

// ------------------------------------------------------------------
// 2. LIFECYCLE & DATA FETCHING
// ------------------------------------------------------------------

const loadSettingData = async () => {
  const id = route.query.id as string
  if (!id) return

  loading.value = true
  try {
    const data = await fetchSettingsById(id)
    websiteSettings.value = data
    // toast.success('โหลดข้อมูลสำเร็จ')
  } catch (e) {
    toast.error('ไม่สามารถโหลดข้อมูลได้')
    console.error('Failed to load settings:', e)
  } finally {
    loading.value = false
  }
}

// ------------------------------------------------------------------
// 3. VALIDATION
// ------------------------------------------------------------------

const validateForm = (): boolean => {
  const settings = websiteSettings.value

  // ตรวจสอบข้อมูลทั่วไป
  if (!settings.hospitalNameTh?.trim()) {
    toast.error('กรุณากรอกชื่อโรงพยาบาล (ภาษาไทย)')
    return false
  }
  if (!settings.hospitalNameEn?.trim()) {
    toast.error('กรุณากรอกชื่อโรงพยาบาล (ภาษาอังกฤษ)')
    return false
  }
  if (!settings.address?.trim()) {
    toast.error('กรุณากรอกที่อยู่โรงพยาบาล')
    return false
  }
  if (!settings.zipCode?.trim()) {
    toast.error('กรุณากรอกรหัสไปรษณีย์')
    return false
  }
  if (!settings.province?.trim()) {
    toast.error('กรุณากรอกจังหวัด')
    return false
  }

  // ตรวจสอบข้อมูลการติดต่อ
  if (!settings.telMain?.trim()) {
    toast.error('กรุณากรอกเบอร์โทรศัพท์หลัก')
    return false
  }
  if (!settings.fax?.trim()) {
    toast.error('กรุณากรอกเบอร์โทรสาร (FAX)')
    return false
  }
  if (!settings.emailMain?.trim()) {
    toast.error('กรุณากรอกอีเมลหลัก')
    return false
  }

  // ตรวจสอบรูปแบบอีเมล
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(settings.emailMain)) {
    toast.error('รูปแบบอีเมลไม่ถูกต้อง')
    return false
  }

  return true
}

// ------------------------------------------------------------------
// 4. SAVE LOGIC
// ------------------------------------------------------------------

const saveWebsiteSettings = async () => {
  if (!validateForm()) {
    return
  }
  isSaving.value = true
  try {
    if (editMode.value && websiteSettings.value.id) {
      await updateSettings(websiteSettings.value.id, websiteSettings.value)
      toast.success('อัพเดทการตั้งค่าเว็บไซต์สำเร็จ!')
      router.push('/dashboard/website-settings-list')
    } else {
      // โหมดสร้างใหม่: ใช้ POST /settings
      await createSettings(websiteSettings.value)
      toast.success('สร้างการตั้งค่าเว็บไซต์สำเร็จ!')
      router.push('/dashboard/website-settings-list')
    }
  } catch (e: unknown) {
    console.error('Error saving website settings:', e)
    toast.error(editMode.value ? 'อัพเดทการตั้งค่าล้มเหลว' : 'สร้างการตั้งค่าล้มเหลว')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  if (editMode.value) {
    loadSettingData()
  }
})
</script>

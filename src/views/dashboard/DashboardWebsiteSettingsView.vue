<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-globe mr-3 text-cyan-600"></i> ตั้งค่าเว็บไซต์
    </h2>
    <p class="text-gray-700 mb-6">
      จัดการข้อมูลพื้นฐานของเว็บไซต์ เช่น ชื่อโรงพยาบาล, ที่อยู่, เบอร์โทรศัพท์,
      และช่องทางติดต่ออื่นๆ ที่จะแสดงผลบนหน้าเว็บไซต์.
    </p>

    <form @submit.prevent="saveWebsiteSettings" class="space-y-6">
      <div class="card bg-gray-50 p-6 rounded-lg shadow-inner">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">ข้อมูลทั่วไป</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="hospitalName" class="block text-sm font-medium text-gray-700"
              >ชื่อโรงพยาบาล (เต็ม):</label
            >
            <input
              type="text"
              id="hospitalName"
              v-model="websiteSettings.hospitalName"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="hospitalShortName" class="block text-sm font-medium text-gray-700"
              >ชื่อย่อโรงพยาบาล:</label
            >
            <input
              type="text"
              id="hospitalShortName"
              v-model="websiteSettings.hospitalShortName"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="col-span-full">
            <label for="slogan" class="block text-sm font-medium text-gray-700"
              >คำขวัญ/สโลแกน:</label
            >
            <input
              type="text"
              id="slogan"
              v-model="websiteSettings.slogan"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="col-span-full">
            <label for="address" class="block text-sm font-medium text-gray-700"
              >ที่อยู่โรงพยาบาล:</label
            >
            <textarea
              id="address"
              v-model="websiteSettings.address"
              rows="3"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div>
            <label for="zipCode" class="block text-sm font-medium text-gray-700"
              >รหัสไปรษณีย์:</label
            >
            <input
              type="text"
              id="zipCode"
              v-model="websiteSettings.zipCode"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="province" class="block text-sm font-medium text-gray-700">จังหวัด:</label>
            <input
              type="text"
              id="province"
              v-model="websiteSettings.province"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div class="card bg-gray-50 p-6 rounded-lg shadow-inner">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">ข้อมูลการติดต่อ</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="phoneMain" class="block text-sm font-medium text-gray-700"
              >เบอร์โทรศัพท์หลัก:</label
            >
            <input
              type="tel"
              id="phoneMain"
              v-model="websiteSettings.phoneMain"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="phoneEmergency" class="block text-sm font-medium text-gray-700"
              >เบอร์โทรฉุกเฉิน:</label
            >
            <input
              type="tel"
              id="phoneEmergency"
              v-model="websiteSettings.phoneEmergency"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="col-span-full">
            <label for="emailMain" class="block text-sm font-medium text-gray-700"
              >อีเมลหลัก:</label
            >
            <input
              type="email"
              id="emailMain"
              v-model="websiteSettings.emailMain"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="col-span-full">
            <label for="contactFormEmail" class="block text-sm font-medium text-gray-700"
              >อีเมลสำหรับฟอร์มติดต่อ (ซ่อนจากหน้าเว็บ):</label
            >
            <input
              type="email"
              id="contactFormEmail"
              v-model="websiteSettings.contactFormEmail"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p class="text-xs text-gray-500 mt-1">
              อีเมลนี้ใช้สำหรับรับข้อความจากฟอร์มติดต่อเท่านั้น จะไม่แสดงบนหน้าเว็บไซต์
            </p>
          </div>
        </div>
      </div>

      <div class="card bg-gray-50 p-6 rounded-lg shadow-inner">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Social Media และลิงก์ภายนอก</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="facebookUrl" class="block text-sm font-medium text-gray-700"
              >Facebook URL:</label
            >
            <input
              type="url"
              id="facebookUrl"
              v-model="websiteSettings.facebookUrl"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://www.facebook.com/maetaenghospital.cm/"
            />
          </div>
          <div>
            <label for="lineId" class="block text-sm font-medium text-gray-700">LINE ID/URL:</label>
            <input
              type="text"
              id="lineId"
              v-model="websiteSettings.lineId"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your_line_id / https://line.me/ti/p/@yourid"
            />
          </div>
          <div>
            <label for="twitterUrl" class="block text-sm font-medium text-gray-700"
              >Twitter (X) URL:</label
            >
            <input
              type="url"
              id="twitterUrl"
              v-model="websiteSettings.twitterUrl"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://twitter.com/yourhandle"
            />
          </div>
          <div>
            <label for="youtubeUrl" class="block text-sm font-medium text-gray-700"
              >YouTube URL:</label
            >
            <input
              type="url"
              id="youtubeUrl"
              v-model="websiteSettings.youtubeUrl"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://www.youtube.com/yourchannel"
            />
          </div>
          <div class="col-span-full">
            <label for="googleMapsEmbed" class="block text-sm font-medium text-gray-700"
              >Google Maps Embed URL (iFrame):</label
            >
            <textarea
              id="googleMapsEmbed"
              v-model="websiteSettings.googleMapsEmbed"
              rows="4"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="คัดลอก Embed Code จาก Google Maps แล้ววางที่นี่"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">ใช้สำหรับแสดงแผนที่บนหน้าติดต่อ</p>
          </div>
        </div>
      </div>

      <div class="card bg-gray-50 p-6 rounded-lg shadow-inner">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">SEO และอื่นๆ</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="col-span-full">
            <label for="metaDescription" class="block text-sm font-medium text-gray-700"
              >Meta Description (สำหรับ SEO):</label
            >
            <textarea
              id="metaDescription"
              v-model="websiteSettings.metaDescription"
              rows="3"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              maxlength="160"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              คำอธิบายสั้นๆ ของเว็บไซต์ที่จะปรากฏในผลการค้นหา (ไม่เกิน 160 ตัวอักษร)
            </p>
          </div>
          <div class="col-span-full">
            <label for="keywords" class="block text-sm font-medium text-gray-700"
              >Keywords (สำหรับ SEO - คั่นด้วยคอมม่า):</label
            >
            <input
              type="text"
              id="keywords"
              v-model="websiteSettings.keywords"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="โรงพยาบาล, แม่แตง, สุขภาพ, แพทย์"
            />
            <p class="text-xs text-gray-500 mt-1">คำสำคัญที่เกี่ยวข้องกับเว็บไซต์</p>
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-6">
        <button
          type="submit"
          class="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition duration-300 text-lg"
        >
          <i class="fas fa-save mr-2"></i> บันทึกการตั้งค่า
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

interface WebsiteSettings {
  hospitalName: string
  hospitalShortName: string
  slogan: string
  address: string
  zipCode: string
  province: string
  phoneMain: string
  phoneEmergency: string
  emailMain: string
  contactFormEmail: string // Internal email for contact form submissions
  facebookUrl: string
  lineId: string
  twitterUrl: string
  youtubeUrl: string
  googleMapsEmbed: string // iframe embed code
  metaDescription: string
  keywords: string
  // logoUrl: string; // Example for future
  // faviconUrl: string; // Example for future
}

const websiteSettings = ref<WebsiteSettings>({
  hospitalName: 'โรงพยาบาลแม่แตง',
  hospitalShortName: 'รพ.แม่แตง',
  slogan: 'ใส่ใจสุขภาพคุณ เพื่อชีวิตที่ดีขึ้น',
  address: '123 หมู่ 1 ต.สันมหาพน อ.แม่แตง จ.เชียงใหม่',
  zipCode: '50170',
  province: 'เชียงใหม่',
  phoneMain: '053-XXX-XXXX',
  phoneEmergency: '053-YYY-YYYY',
  emailMain: 'info@maetaenghospital.com',
  contactFormEmail: 'webmaster@maetaenghospital.com',
  facebookUrl: 'https://www.facebook.com/maetaenghospital.cm',
  lineId: '@maetaenghospital',
  twitterUrl: '',
  youtubeUrl: '',
  googleMapsEmbed:
    '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15217.430030589635!2d98.98369405021273!3d19.066487532394593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3719b6d8a25d%3A0x7d01869e5f5f403!2z4Lih4Lir4Liy4Lio4LmE4LiU4Lih4Lij4Lix4Lia4Liy4LiH4LmC4Liy4Lih4LiH4Lix4LmB4LiL4Lil4Lii4Li14LmA!5e0!3m2!1sth!2sth!4v1700000000000!5m2!1sth!2sth" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  metaDescription:
    'โรงพยาบาลแม่แตง ให้บริการทางการแพทย์ครบวงจร ด้วยทีมแพทย์ผู้เชี่ยวชาญและเทคโนโลยีที่ทันสมัย',
  keywords: 'โรงพยาบาล, แม่แตง, เชียงใหม่, สุขภาพ, แพทย์, พยาบาล',
})

const LOCAL_STORAGE_KEY = 'websiteSettings'

// โหลดข้อมูลจาก localStorage เมื่อ Component ถูกสร้าง
onMounted(() => {
  const savedSettings = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (savedSettings) {
    try {
      websiteSettings.value = JSON.parse(savedSettings)
    } catch (e) {
      console.error('Failed to parse website settings from localStorage:', e)
      localStorage.removeItem(LOCAL_STORAGE_KEY) // Clear corrupted data
    }
  }
})

// Watch สำหรับตรวจจับการเปลี่ยนแปลงของ websiteSettings และบันทึกอัตโนมัติ
watch(
  websiteSettings,
  (newSettings) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSettings))
  },
  { deep: true },
) // ใช้ deep: true เพื่อให้ watch ตรวจจับการเปลี่ยนแปลงภายใน object

const saveWebsiteSettings = () => {
  // ข้อมูลถูกบันทึกโดย watch แล้ว
  toast.success('บันทึกการตั้งค่าเว็บไซต์สำเร็จแล้ว!')
}
</script>

<style scoped>
/* Styles remain the same */
</style>

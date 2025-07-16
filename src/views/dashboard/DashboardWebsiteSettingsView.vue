<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-sliders-h mr-3 text-teal-500"></i> ตั้งค่าเว็บไซต์
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับจัดการการตั้งค่าทั่วไปของเว็บไซต์ เช่น ชื่อเว็บไซต์, ข้อมูลติดต่อ, และลิงก์โซเชียลมีเดีย.</p>

    <!-- Settings Form -->
    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">การตั้งค่าทั่วไป</h3>
      <form @submit.prevent="saveSettings" class="space-y-4">
        <div>
          <label for="siteName" class="block text-sm font-medium text-gray-700">ชื่อเว็บไซต์:</label>
          <input type="text" id="siteName" v-model="settings.siteName" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="tagline" class="block text-sm font-medium text-gray-700">สโลแกน/คำขวัญ:</label>
          <input type="text" id="tagline" v-model="settings.tagline" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="contactEmail" class="block text-sm font-medium text-gray-700">อีเมลติดต่อ:</label>
          <input type="email" id="contactEmail" v-model="settings.contactEmail" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="contactPhone" class="block text-sm font-medium text-gray-700">เบอร์โทรศัพท์ติดต่อ:</label>
          <input type="tel" id="contactPhone" v-model="settings.contactPhone" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="address" class="block text-sm font-medium text-gray-700">ที่อยู่:</label>
          <textarea id="address" v-model="settings.address" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <h3 class="text-lg font-semibold text-gray-800 mt-6 mb-3">ลิงก์โซเชียลมีเดีย</h3>
        <div>
          <label for="facebookUrl" class="block text-sm font-medium text-gray-700">Facebook URL:</label>
          <input type="url" id="facebookUrl" v-model="settings.socialMedia.facebook" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="twitterUrl" class="block text-sm font-medium text-gray-700">Twitter URL:</label>
          <input type="url" id="twitterUrl" v-model="settings.socialMedia.twitter" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="youtubeUrl" class="block text-sm font-medium text-gray-700">YouTube URL:</label>
          <input type="url" id="youtubeUrl" v-model="settings.socialMedia.youtube" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>

        <div class="flex justify-end">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            <i class="fas fa-save mr-2"></i> บันทึกการตั้งค่า
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface WebsiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    youtube: string;
  };
}

const settings = ref<WebsiteSettings>({
  siteName: 'โรงพยาบาลแม่แตง',
  tagline: 'Maetaeng Hospital',
  contactEmail: 'info@maetaenghospital.com',
  contactPhone: '053-XXX-XXXX',
  address: 'เลขที่ 123 หมู่ 4 ตำบลแม่แตง อำเภอแม่แตง จังหวัดเชียงใหม่ 50170',
  socialMedia: {
    facebook: 'https://facebook.com/maetaenghospital',
    twitter: 'https://twitter.com/maetaenghospital',
    youtube: 'https://youtube.com/maetaenghospital',
  },
});

const saveSettings = () => {
  // In a real application, you would send this data to your backend API
  console.log('Saving settings:', settings.value);
  alert('บันทึกการตั้งค่าเว็บไซต์สำเร็จ!');
};

// In a real application, you would fetch initial settings on mount
// onMounted(() => {
//   fetchSettings();
// });
// const fetchSettings = async () => { /* ... */ };
</script>

<style scoped>
/* Specific styles for this page */
</style>

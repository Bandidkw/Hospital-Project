<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-extrabold text-gray-900 mb-6 text-center">ติดต่อเรา</h1>
    <p class="text-xl text-gray-700 text-center mb-12">เราพร้อมให้บริการและตอบทุกข้อสงสัยของคุณ</p>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div class="bg-white p-8 rounded-lg shadow-xl">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <i class="fas fa-info-circle text-blue-500 mr-3"></i> ข้อมูลการติดต่อ
        </h2>
        <div class="space-y-4 text-lg text-gray-700">
          <div v-if="websiteSettings.hospitalName" class="flex items-start">
            <i class="fas fa-hospital text-blue-500 mr-4 mt-1"></i>
            <div>
              <p class="font-semibold">{{ websiteSettings.hospitalName }}</p>
              <p v-if="websiteSettings.slogan" class="text-sm text-gray-500">{{ websiteSettings.slogan }}</p>
            </div>
          </div>
          <div v-if="websiteSettings.address" class="flex items-start">
            <i class="fas fa-map-marker-alt text-blue-500 mr-4 mt-1"></i>
            <p>{{ websiteSettings.address }} {{ websiteSettings.zipCode }} {{ websiteSettings.province }}</p>
          </div>
          <div v-if="websiteSettings.phoneMain" class="flex items-center">
            <i class="fas fa-phone-alt text-blue-500 mr-4"></i>
            <p>โทรศัพท์: <a :href="'tel:' + websiteSettings.phoneMain" class="text-blue-600 hover:underline">{{ websiteSettings.phoneMain }}</a></p>
          </div>
          <div v-if="websiteSettings.phoneEmergency" class="flex items-center">
            <i class="fas fa-ambulance text-blue-500 mr-4"></i>
            <p>เบอร์ฉุกเฉิน: <a :href="'tel:' + websiteSettings.phoneEmergency" class="text-blue-600 hover:underline">{{ websiteSettings.phoneEmergency }}</a></p>
          </div>
          <div v-if="websiteSettings.emailMain" class="flex items-center">
            <i class="fas fa-envelope text-blue-500 mr-4"></i>
            <p>อีเมล: <a :href="'mailto:' + websiteSettings.emailMain" class="text-blue-600 hover:underline">{{ websiteSettings.emailMain }}</a></p>
          </div>
          <div class="pt-4 border-t border-gray-200 mt-4" v-if="hasSocialMedia">
            <h3 class="text-xl font-semibold text-gray-800 mb-3">ช่องทางโซเชียลมีเดีย</h3>
            <div class="flex space-x-4">
              <a v-if="websiteSettings.facebookUrl" :href="websiteSettings.facebookUrl" target="_blank" class="text-blue-600 hover:text-blue-800 text-3xl transition-colors duration-300">
                <i class="fab fa-facebook-square"></i>
              </a>
              <a v-if="websiteSettings.lineId" :href="getLineUrl(websiteSettings.lineId)" target="_blank" class="text-green-500 hover:text-green-700 text-3xl transition-colors duration-300">
                <i class="fab fa-line"></i>
              </a>
              <a v-if="websiteSettings.twitterUrl" :href="websiteSettings.twitterUrl" target="_blank" class="text-blue-400 hover:text-blue-600 text-3xl transition-colors duration-300">
                <i class="fab fa-twitter-square"></i>
              </a>
              <a v-if="websiteSettings.youtubeUrl" :href="websiteSettings.youtubeUrl" target="_blank" class="text-red-600 hover:text-red-800 text-3xl transition-colors duration-300">
                <i class="fab fa-youtube-square"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-8 rounded-lg shadow-xl">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <i class="fas fa-map-marked-alt text-red-500 mr-3"></i> แผนที่
        </h2>
        <div v-if="websiteSettings.googleMapsEmbed" class="map-container rounded-lg overflow-hidden shadow-md">
          <div v-html="websiteSettings.googleMapsEmbed" class="w-full h-96"></div>
        </div>
        <p v-else class="text-gray-600 text-center py-8">ไม่มีข้อมูลแผนที่ กรุณาตั้งค่าในส่วน "ตั้งค่าเว็บไซต์" ของ Dashboard.</p>
      </div>
    </div>

    <div class="bg-white p-8 rounded-lg shadow-xl mt-12">
      <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">ส่งข้อความถึงเรา</h2>
      <form @submit.prevent="submitContactForm" class="max-w-xl mx-auto space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล:</label>
          <input type="text" id="name" v-model="contactForm.name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">อีเมล:</label>
          <input type="email" id="email" v-model="contactForm.email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700">หัวข้อ:</label>
          <input type="text" id="subject" v-model="contactForm.subject" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700">ข้อความ:</label>
          <textarea id="message" v-model="contactForm.message" rows="6" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500" required></textarea>
        </div>
        <div class="flex justify-center">
          <button type="submit" class="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition duration-300 text-lg">
            <i class="fas fa-paper-plane mr-2"></i> ส่งข้อความ
          </button>
        </div>
      </form>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

// Define the WebsiteSettings interface here
// This ensures TypeScript knows the structure of websiteSettings
interface WebsiteSettings {
  hospitalName: string;
  hospitalShortName: string;
  slogan: string;
  address: string;
  zipCode: string;
  province: string;
  phoneMain: string;
  phoneEmergency: string;
  emailMain: string;
  contactFormEmail: string;
  facebookUrl: string;
  lineId: string;
  twitterUrl: string;
  youtubeUrl: string;
  googleMapsEmbed: string;
  metaDescription: string;
  keywords: string;
}

// Initialize websiteSettings with the correct interface type and empty default values
const websiteSettings = ref<WebsiteSettings>({
  hospitalName: '',
  hospitalShortName: '',
  slogan: '',
  address: '',
  zipCode: '',
  province: '',
  phoneMain: '',
  phoneEmergency: '',
  emailMain: '',
  contactFormEmail: '',
  facebookUrl: '',
  lineId: '',
  twitterUrl: '',
  youtubeUrl: '',
  googleMapsEmbed: '',
  metaDescription: '',
  keywords: '',
});

// Contact form data
const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

// Load data from localStorage when the component is mounted
onMounted(() => {
  const savedSettings = localStorage.getItem('websiteSettings');
  if (savedSettings) {
    try {
      websiteSettings.value = JSON.parse(savedSettings);
    } catch (e) {
      console.error("Failed to parse website settings from localStorage in ContactView:", e);
      // Fallback to default empty values if parsing fails
      websiteSettings.value = {
        hospitalName: '', hospitalShortName: '', slogan: '', address: '', zipCode: '', province: '',
        phoneMain: '', phoneEmergency: '', emailMain: '', contactFormEmail: '',
        facebookUrl: '', lineId: '', twitterUrl: '', youtubeUrl: '', googleMapsEmbed: '',
        metaDescription: '', keywords: '',
      };
    }
  }
});

// Computed property to check if any social media links are set
const hasSocialMedia = computed(() => {
  return websiteSettings.value.facebookUrl || websiteSettings.value.lineId || websiteSettings.value.twitterUrl || websiteSettings.value.youtubeUrl;
});

// Function to generate LINE URL based on ID or direct link
const getLineUrl = (lineId: string) => {
  if (lineId.startsWith('http')) {
    return lineId;
  }
  return `https://line.me/ti/p/${lineId}`;
};

const submitContactForm = () => {
  console.log('Contact form submitted:', contactForm.value);
  toast.success('ส่งข้อความสำเร็จแล้ว! เราจะติดต่อกลับโดยเร็วที่สุด.');

  // Reset form
  contactForm.value = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };
};
</script>

<style scoped>
/* Optional: Add some padding for the iframe to look better */
.map-container {
  padding-bottom: 75%; /* 4:3 Aspect Ratio (adjust as needed) */
  position: relative;
  height: 0;
  overflow: hidden;
}

.map-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

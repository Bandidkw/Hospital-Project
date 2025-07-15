<template>
  <div class="container mx-auto p-8 bg-white rounded-lg shadow-md my-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">ติดต่อเรา</h1>
    <p class="text-gray-700 leading-relaxed mb-6">
      หากคุณมีข้อสงสัย ข้อเสนอแนะ หรือต้องการความช่วยเหลือเพิ่มเติม
      โปรดติดต่อเราตามช่องทางด้านล่างนี้ ทีมงานโรงพยาบาลแม่แตงยินดีให้บริการ
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <!-- ข้อมูลติดต่อ -->
      <div class="bg-blue-50 p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold text-blue-700 mb-4 flex items-center">
          <i class="fas fa-info-circle mr-3 text-blue-500"></i> ข้อมูลติดต่อ
        </h2>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-center">
            <i class="fas fa-map-marker-alt mr-3 text-lg text-gray-600"></i>
            <span>ที่อยู่: [ที่อยู่โรงพยาบาลแม่แตง]</span>
          </li>
          <li class="flex items-center">
            <i class="fas fa-phone-alt mr-3 text-lg text-gray-600"></i>
            <span>โทรศัพท์: 053-XXX-XXXX</span>
          </li>
          <li class="flex items-center">
            <i class="fas fa-fax mr-3 text-lg text-gray-600"></i>
            <span>โทรสาร: 053-XXX-XXXX</span>
          </li>
          <li class="flex items-center">
            <i class="fas fa-envelope mr-3 text-lg text-gray-600"></i>
            <span>อีเมล: info@maetaenghospital.com</span>
          </li>
          <li class="flex items-center">
            <i class="fas fa-clock mr-3 text-lg text-gray-600"></i>
            <span>เวลาทำการ: จันทร์ - ศุกร์, 08:00 - 16:00 น.</span>
          </li>
        </ul>
      </div>

      <!-- แผนที่ (ตัวอย่าง) -->
      <div class="bg-green-50 p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold text-green-700 mb-4 flex items-center">
          <i class="fas fa-map mr-3 text-green-500"></i> แผนที่
        </h2>
        <div class="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
          <!-- Placeholder for Google Maps iframe or image -->
          <img src="https://placehold.co/400x250/e0e0e0/333333?text=Map+Placeholder" alt="Map" class="w-full h-full object-cover rounded-md">
        </div>
        <p class="text-sm text-gray-600 mt-3">
          คลิกที่แผนที่เพื่อดูเส้นทาง
        </p>
      </div>
    </div>

    <!-- แบบฟอร์มติดต่อ (ตัวอย่าง) -->
    <div class="bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <i class="fas fa-paper-plane mr-3 text-gray-600"></i> ส่งข้อความถึงเรา
      </h2>
      <form @submit.prevent="submitContactForm" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล</label>
          <input type="text" id="name" v-model="form.name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">อีเมล</label>
          <input type="email" id="email" v-model="form.email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700">หัวข้อ</label>
          <input type="text" id="subject" v-model="form.subject" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700">ข้อความ</label>
          <textarea id="message" v-model="form.message" rows="5" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            <i class="fas fa-paper-plane mr-2"></i> ส่งข้อความ
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const submitContactForm = () => {
  // In a real application, you would send this data to your backend API
  console.log('Contact form submitted:', form.value);
  alert('ขอบคุณสำหรับข้อความของคุณ เราจะติดต่อกลับโดยเร็วที่สุด!');
  // Reset form
  form.value = { name: '', email: '', subject: '', message: '' };
};
</script>

<style scoped>
/* Add specific styles for this page if needed */
</style>

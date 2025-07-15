<template>
  <div class="container mx-auto p-8 bg-white rounded-lg shadow-md my-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">บุคลากร</h1>
    <p class="text-gray-700 leading-relaxed mb-6">
      โรงพยาบาลแม่แตงภาคภูมิใจในทีมบุคลากรทางการแพทย์และเจ้าหน้าที่ผู้เชี่ยวชาญ
      ซึ่งเป็นหัวใจสำคัญในการให้บริการดูแลสุขภาพแก่ประชาชนทุกคน
      บุคลากรของเราประกอบด้วยแพทย์ พยาบาล เภสัชกร นักเทคนิคการแพทย์
      และเจ้าหน้าที่สนับสนุนอื่นๆ ที่มีความรู้ความสามารถ ประสบการณ์
      และพร้อมทุ่มเทเพื่อดูแลผู้ป่วยด้วยความเมตตาและเอาใจใส่
    </p>

    <h2 class="text-2xl font-semibold text-gray-800 mb-4">คณะผู้บริหาร</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-gray-50 p-4 rounded-lg shadow flex flex-col items-center text-center">
        <img src="https://placehold.co/150x150/f0f0f0/333333?text=Director" alt="Director" class="w-32 h-32 rounded-full object-cover mb-4">
        <h3 class="text-lg font-semibold text-gray-800">นายแพทย์ [ชื่อผู้อำนวยการ]</h3>
        <p class="text-blue-600">ผู้อำนวยการโรงพยาบาลแม่แตง</p>
      </div>
      <div class="bg-gray-50 p-4 rounded-lg shadow flex flex-col items-center text-center">
        <img src="https://placehold.co/150x150/f0f0f0/333333?text=Deputy" alt="Deputy Director" class="w-32 h-32 rounded-full object-cover mb-4">
        <h3 class="text-lg font-semibold text-gray-800">นาง [ชื่อรองผู้อำนวยการ]</h3>
        <p class="text-blue-600">รองผู้อำนวยการฝ่ายบริหาร</p>
      </div>
      <div class="bg-gray-50 p-4 rounded-lg shadow flex flex-col items-center text-center">
        <img src="https://placehold.co/150x150/f0f0f0/333333?text=Head+Nurse" alt="Head Nurse" class="w-32 h-32 rounded-full object-cover mb-4">
        <h3 class="text-lg font-semibold text-gray-800">นางสาว [ชื่อหัวหน้าพยาบาล]</h3>
        <p class="text-blue-600">หัวหน้าพยาบาล</p>
      </div>
    </div>

    <h2 class="text-2xl font-semibold text-gray-800 mb-4">ทีมแพทย์</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="doctor in doctors" :key="doctor.id" class="bg-gray-50 p-4 rounded-lg shadow flex flex-col items-center text-center">
        <img :src="doctor.imageUrl" :alt="doctor.name" class="w-24 h-24 rounded-full object-cover mb-3">
        <h3 class="text-md font-semibold text-gray-800">{{ doctor.name }}</h3>
        <p class="text-sm text-gray-600">{{ doctor.specialty }}</p>
      </div>
    </div>

    <!-- สามารถเพิ่มส่วนสำหรับพยาบาล, เภสัชกร, และเจ้าหน้าที่อื่นๆ ได้ในลักษณะเดียวกัน -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const doctors = ref([
  { id: 1, name: 'นายแพทย์ อนันต์ สุขภาพดี', specialty: 'อายุรกรรม', imageUrl: 'https://placehold.co/100x100/f0f0f0/333333?text=Doc1' },
  { id: 2, name: 'แพทย์หญิง วารี รักษาดี', specialty: 'กุมารเวชกรรม', imageUrl: 'https://placehold.co/100x100/f0f0f0/333333?text=Doc2' },
  { id: 3, name: 'นายแพทย์ ชาญชัย กระดูกแข็ง', specialty: 'ศัลยกรรมกระดูก', imageUrl: 'https://placehold.co/100x100/f0f0f0/333333?text=Doc3' },
  { id: 4, name: 'แพทย์หญิง ดารณี ผิวสวย', specialty: 'ผิวหนัง', imageUrl: 'https://placehold.co/100x100/f0f0f0/333333?text=Doc4' },
]);

// In a real application, you would fetch this data from an API
</script>

<style scoped>
/* Add specific styles for this page if needed */
</style>

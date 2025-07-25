<template>
  <div class="container mx-auto p-8 bg-gray-300 rounded-lg shadow-md my-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">บุคลากร</h1>
    <p class="text-gray-700 leading-relaxed mb-6">
      โรงพยาบาลแม่แตงภาคภูมิใจในทีมบุคลากรทางการแพทย์และเจ้าหน้าที่ผู้เชี่ยวชาญ
      ซึ่งเป็นหัวใจสำคัญในการให้บริการดูแลสุขภาพแก่ประชาชนทุกคน บุคลากรของเราประกอบด้วยแพทย์ พยาบาล
      เภสัชกร นักเทคนิคการแพทย์ และเจ้าหน้าที่สนับสนุนอื่นๆ ที่มีความรู้ความสามารถ ประสบการณ์
      และพร้อมทุ่มเทเพื่อดูแลผู้ป่วยด้วยความเมตตาและเอาใจใส่
    </p>
    <div class="flex justify-center items-center">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">คณะผู้บริหารโรงพยาบาลแม่แตง</h2>
    </div>
    <div class="flex md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 justify-center items-center">
      <div class="bg-gray-50 p-4 rounded-lg shadow flex flex-col items-center text-center">
        <img
          src="https://placehold.co/150x150/f0f0f0/333333?text=Director"
          alt="Director"
          class="w-32 h-32 rounded-full object-cover mb-4"
        />
        <h3 class="text-lg font-semibold text-gray-800">กานต์สินี ศุทธวัฒน์พงษ์</h3>
        <p class="text-gray-800">นายแพทย์ชำนาญการ</p>
        <p class="text-blue-600">รักษาการในตำแหน่ง ผู้อำนวยการโรงพยาบาลแม่แตง</p>
      </div>
      <!-- <div class="bg-gray-50 p-4 rounded-lg shadow flex flex-col items-center text-center">
        <img
          src="https://placehold.co/150x150/f0f0f0/333333?text=Deputy"
          alt="Deputy Director"
          class="w-32 h-32 rounded-full object-cover mb-4"
        />
        <h3 class="text-lg font-semibold text-gray-800">นาง [ชื่อรองผู้อำนวยการ]</h3>
        <p class="text-gray-800">พยาบาลวิชาชีพชํานาญการ</p>
        <p class="text-blue-600">รองผู้อำนวยการฝ่ายบริหาร</p>
      </div> -->
      <!-- <div class="bg-gray-50 p-4 rounded-lg shadow flex flex-col items-center text-center">
        <img
          src="https://placehold.co/150x150/f0f0f0/333333?text=Head+Nurse"
          alt="Head Nurse"
          class="w-32 h-32 rounded-full object-cover mb-4"
        />
        <h3 class="text-lg font-semibold text-gray-800">นางสาว [ชื่อหัวหน้าพยาบาล]</h3>
        <p class="text-gray-800">พยาบาลวิชาชีพชํานาญการ</p>
        <p class="text-blue-600">หัวหน้าพยาบาล</p>
      </div> -->
    </div>

    <!-- <h2 class="text-2xl font-semibold text-gray-800 mb-4">ทีมแพทย์</h2> -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="doctor in doctors"
        :key="doctor.id"
        class="bg-gray-50 p-4 rounded-lg shadow flex flex-col items-center text-center"
      >
        <img
          :src="doctor.imageUrl"
          :alt="doctor.name"
          class="w-24 h-24 rounded-full object-cover mb-3"
        />
        <h3 class="text-md font-semibold text-gray-800">{{ doctor.name }}</h3>
        <p class="text-sm text-gray-600">{{ doctor.position }}</p>
        <p class="text-sm text-gray-600">{{ doctor.specialty }}</p>
        <p class="text-sm text-gray-600">โทร : 053-104148-51 ต่อ {{ doctor.tel }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const doctors = ref([
  {
    id: 1,
    name: 'อัญมณี สีลอ',
    position: 'นักจัดการงานทั่วไปปฏิบัติการ',
    specialty: 'หัวหน้ากลุ่มบริหารทั่วไป',
    imageUrl: 'https://placehold.co/100x100/f0f0f0/333333?text=Doc1',
    tel: '145',
  },
  {
    id: 2,
    name: 'ไชยา บุญสู',
    position: 'พยาบาลวิชาชีพชํานาญการ',
    specialty: 'หัวหน้างานประกันสุขภาพยุทธศาสตร์',
    imageUrl: 'https://placehold.co/100x100/f0f0f0/333333?text=Doc2',
    tel: '333',
  },
  {
    id: 3,
    name: 'อัญชี ศิริ',
    position: 'พยาบาลวิชาชีพชํานาญการ',
    specialty: 'รักษาการแทน หัวหน้ากลุ่มงานการพยาบาล',
    imageUrl: 'https://placehold.co/100x100/f0f0f0/333333?text=Doc3',
    tel: '104',
  },
  {
    id: 4,
    name: 'อรนุช ตัณฑจำรูญ',
    position: 'ทันตแพทย์ชํานาญการพิเศษ',
    specialty: 'หัวหน้ากลุ่มงานทันตกรรม',
    imageUrl: 'https://placehold.co/100x100/f0f0f0/333333?text=Doc4',
    tel: '114',
  },
  {
    id: 5,
    name: 'นฤมล แก้วมา',
    position: 'นักเทคนิคการแพทย์ชํานาญการ',
    specialty: 'หัวหน้ากลุ่มงานเทคนิคการแพทย์',
    imageUrl: 'https://placehold.co/100x100/f0f0f0/333333?text=Doc5',
    tel: '128',
  },
  {
    id: 6,
    name: 'คนึงนิจ ศรีสอนใจ',
    position: 'พยาบาลวิชาชีพชํานาญการ',
    specialty: 'หัวหน้ากลุ่มงานบริการด้านปฐมภูมิและองค์รวม',
    imageUrl: 'https://placehold.co/100x100/f0f0f0/333333?text=Doc6',
    tel: '118',
  },
  {
    id: 7,
    name: 'นัยนา พึ่งธรรม',
    position: 'เภสัชกรชํานาญการ',
    specialty: 'หัวหน้ากลุ่มงานเภสัชและคุ้มครองผู้บริโภค',
    imageUrl: 'https://placehold.co/100x100/f0f0f0/333333?text=Doc7',
    tel: '112',
  },
  {
    id: 8,
    name: 'แคทรียา พจนสุนทร',
    position: 'นักกายภาพบําบัดปฏิบัติการ',
    specialty: 'หัวหน้ากลุ่มงานเวชกรรมฟื้นฟู',
    imageUrl: 'https://placehold.co/100x100/f0f0f0/333333?text=Doc8',
    tel: '172',
  },
])

// In a real application, you would fetch this data from an API
</script>

<style scoped>
/* Add specific styles for this page if needed */
</style>

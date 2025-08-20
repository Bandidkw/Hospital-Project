<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">บริการของเรา</h2>
      <p class="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
        ให้บริการทางการแพทย์ด้วยหัวใจ ด้วยทีมแพทย์และพยาบาลผู้เชี่ยวชาญ
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="service in services"
          :key="service.id"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center"
        >
          <div class="text-blue-500 text-5xl mb-4">
            <i :class="service.icon"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ service.title }}</h3>
          <p class="text-gray-600 text-sm mb-4 flex-grow">{{ service.description }}</p>
          <RouterLink
            :to="service.link"
            class="mt-auto inline-block bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors duration-300 text-sm"
          >
            ดูเพิ่มเติม
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// ข้อมูลจำลองสำหรับบริการต่างๆ
const services = ref([
  {
    id: 1,
    icon: 'fas fa-stethoscope', // ไอคอนสำหรับ OPD
    title: 'OPD',
    description: 'ผู้ป่วยนอก บริการตรวจรักษาโรคทั่วไป และให้คำปรึกษาปัญหาสุขภาพ',
    link: '/outpatient',
  },
  {
    id: 2,
    icon: 'fas fa-bed', // ไอคอนสำหรับ IPD
    title: 'IPD',
    description: 'บริการดูแลผู้ป่วยในอย่างใกล้ชิด ตลอด 24 ชั่วโมง พร้อมทีมแพทย์ผู้เชี่ยวชาญ',
    link: '/inpatient',
  },
  {
    id: 3,
    icon: 'fas fa-ambulance', // ไอคอนสำหรับ Emergency
    title: 'ห้องฉุกเฉิน',
    description: 'พร้อมให้บริการตลอด 24 ชั่วโมง สำหรับผู้ป่วยฉุกเฉินและอุบัติเหตุ',
    link: '/emergency',
  },
  // {
  //   id: 4,
  //   icon: 'fas fa-flask', // ไอคอนสำหรับ Lab
  //   title: 'ห้องปฏิบัติการ',
  //   description: 'บริการตรวจวินิจฉัยทางห้องปฏิบัติการที่ทันสมัยและแม่นยำ',
  //   link: '/laboratory', // สมมติว่ามีหน้าสำหรับห้องปฏิบัติการ
  // },
  // สามารถเพิ่มบริการอื่นๆ ได้ที่นี่
  // {
  //   id: 5,
  //   icon: 'fas fa-x-ray',
  //   title: 'รังสีวิทยา',
  //   description: 'บริการตรวจวินิจฉัยด้วยภาพ เช่น X-ray, Ultrasound',
  //   link: '/radiology',
  // },
])
</script>

<style scoped>
/* คุณสามารถเพิ่ม CSS เฉพาะ component นี้ได้ที่นี่ หากจำเป็น */
</style>

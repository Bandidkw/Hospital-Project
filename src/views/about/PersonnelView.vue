<template>
  <div class="container mx-auto p-8 bg-white my-8 rounded-xl shadow-lg">
    <h1 class="text-4xl font-extrabold text-blue-800 mb-2">บุคลากร</h1>
    <p class="text-gray-700 leading-relaxed mb-8 border-b pb-4">
      โรงพยาบาลแม่แตงภาคภูมิใจในทีมบุคลากรทางการแพทย์และเจ้าหน้าที่ผู้เชี่ยวชาญ
      ซึ่งเป็นหัวใจสำคัญในการให้บริการดูแลสุขภาพแก่ประชาชนทุกคน...
    </p>

    <div v-if="loading" class="text-center py-10 text-gray-500">
      <i class="fas fa-spinner fa-spin text-4xl"></i>
      <p class="mt-4 text-lg">กำลังโหลดข้อมูลบุคลากร...</p>
    </div>

    <div v-else-if="errorMsg" class="text-center py-10 text-red-600">
      <i class="fas fa-exclamation-triangle text-4xl"></i>
      <p class="mt-4 text-lg">เกิดข้อผิดพลาดในการโหลดข้อมูล: {{ errorMsg }}</p>
    </div>

    <div v-else-if="personnelList.length > 0">
      <h2 class="text-2xl font-bold text-gray-800 border-b-2 border-blue-100 pb-2 mb-6">
        คณะผู้บริหารโรงพยาบาลแม่แตง
      </h2>

      <div
        v-if="directorList.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12 justify-items-center"
      >
        <PersonnelCard v-for="p in directorList" :key="p.id" :personnel="p" :is-director="true" />
      </div>
      <div v-else class="text-center py-5 text-gray-500 mb-8">ไม่พบข้อมูลคณะผู้บริหาร</div>

      <h2 class="text-2xl font-bold text-gray-800 border-b-2 border-blue-100 pb-2 mb-6">บุคลากร</h2>

      <div
        v-if="staffList.length > 0"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        <PersonnelCard v-for="p in staffList" :key="p.id" :personnel="p" />
      </div>
      <div v-else class="text-center py-5 text-gray-500 mb-8">ไม่พบข้อมูลบุคลากรทั่วไปในระบบ</div>
    </div>

    <div v-else class="text-center py-10 text-gray-500">
      <p>ไม่พบข้อมูลบุคลากรในระบบ</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getPublicPersonnelList } from '@/services/personnelService'
import type { PersonnelItem } from '@/types/personnel'
import PersonnelCard from '@/components/PersonnelCard.vue'

const personnelList = ref<PersonnelItem[]>([])
const loading = ref(true)
const errorMsg = ref<string | null>(null)

// ------------------------------------------------------------------
// 🟢 Computed Properties สำหรับการแบ่งกลุ่มและการจัดเรียง
// ------------------------------------------------------------------

const directorList = computed(() => {
  return personnelList.value
    .filter((p) => p.isDirector) // กรองเฉพาะคนที่ isDirector เป็น true
    .sort((a, b) => {
      // Logic การจัดเรียง: ให้คนที่เป็น "ผู้อำนวยการ" ขึ้นก่อน "รองผู้อำนวยการ" หรือตำแหน่งอื่นๆ
      const posA = a.position.toLowerCase()
      const posB = b.position.toLowerCase()

      // ให้ 'ผู้อำนวยการ' หรือ 'director' มีลำดับสูงกว่า
      const isDirectorA = posA.includes('ผู้อำนวยการ') || posA.includes('director')
      const isDirectorB = posB.includes('ผู้อำนวยการ') || posB.includes('director')

      if (isDirectorA && !isDirectorB) return -1
      if (!isDirectorA && isDirectorB) return 1

      // ถ้าเป็นผู้บริหารเหมือนกัน ให้จัดเรียงตามตำแหน่ง (เช่น รองผู้อำนวยการ 1, 2, ...)
      return posA.localeCompare(posB)
    })
})

const staffList = computed(() => {
  // กรองเฉพาะคนที่ isDirector เป็น false
  return (
    personnelList.value
      .filter((p) => !p.isDirector)
      // (ทางเลือก) จัดเรียงบุคลากรทั่วไปตามตำแหน่งหรือชื่อ
      .sort((a, b) => a.position.localeCompare(b.position))
  )
})

// ------------------------------------------------------------------
// Fetch Data
// ------------------------------------------------------------------

const fetchPersonnel = async () => {
  try {
    const data = await getPublicPersonnelList()
    personnelList.value = data
  } catch (e) {
    // จัดการ Error (อาจใช้ isAxiosError เพื่อแสดงข้อความที่เฉพาะเจาะจงกว่านี้)
    errorMsg.value = 'ไม่สามารถโหลดข้อมูลบุคลากรได้'
    console.error('Fetch personnel failed:', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchPersonnel)
</script>

<style scoped>
/* คุณอาจเพิ่ม styles ที่นี่ หรือใช้ Tailwind CSS Classes */
</style>

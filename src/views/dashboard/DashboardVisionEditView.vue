<template>
  <div class="p-6 bg-white rounded-xl shadow-2xl">
    <h2 class="text-3xl font-extrabold text-gray-800 mb-2 flex items-center">
      <i class="fas fa-bullseye mr-4 text-red-600"></i> แก้ไขวิสัยทัศน์/พันธกิจ
    </h2>
    <p class="text-gray-600 mb-6 border-b pb-4">
      จัดการข้อความสำคัญ เช่น วิสัยทัศน์ พันธกิจ และค่านิยมหลักขององค์กร
    </p>

    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-6xl text-red-500"></i>
      <p class="mt-4 text-lg text-gray-600">กำลังโหลดข้อมูลวิสัยทัศน์...</p>
    </div>

    <form v-else @submit.prevent="saveVisionData" class="space-y-8">
      <div class="card bg-gray-100 p-6 rounded-xl shadow-lg border-t-4 border-red-500">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-eye mr-2 text-red-500"></i> วิสัยทัศน์ (Vision)
        </h3>
        <div>
          <label for="vision" class="block text-sm font-semibold text-gray-700"
            >ข้อความวิสัยทัศน์:</label
          >
          <input
            type="text"
            id="vision"
            v-model="visionData.vision"
            required
            class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-red-500 focus:border-red-500"
            placeholder="เป็นองค์กรที่เป็นเลิศด้าน..."
          />
        </div>
      </div>

      <div class="card bg-gray-100 p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-tasks mr-2 text-blue-500"></i> พันธกิจ (Mission)
        </h3>
        <div>
          <label for="missionHtml" class="block text-sm font-semibold text-gray-700"
            >ข้อความพันธกิจ (รองรับ HTML/Rich Text):</label
          >
          <textarea
            id="missionHtml"
            v-model="visionData.missionHtml"
            rows="5"
            class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder="เช่น: <ul><li>ข้อ 1</li><li>ข้อ 2</li></ul>"
          ></textarea>
        </div>
      </div>

      <div class="card bg-gray-100 p-6 rounded-xl shadow-lg border-t-4 border-green-500">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-handshake mr-2 text-green-500"></i> ค่านิยมหลัก (Core Values)
        </h3>
        <div>
          <label for="coreValuesHtml" class="block text-sm font-semibold text-gray-700"
            >ข้อความค่านิยมหลัก (รองรับ HTML/Rich Text):</label
          >
          <textarea
            id="coreValuesHtml"
            v-model="visionData.coreValuesHtml"
            rows="5"
            class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
            placeholder="เช่น: M-T-H, Morality, Teamwork, Honesty"
          ></textarea>
        </div>
      </div>

      <div class="pt-4 flex justify-end">
        <button
          type="submit"
          :disabled="isSaving"
          class="flex items-center bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 transition duration-300 text-lg shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <i class="fas fa-spinner fa-spin mr-2" v-if="isSaving"></i>
          <i class="fas fa-save mr-2" v-else></i>
          {{ isSaving ? 'กำลังบันทึก...' : 'บันทึกวิสัยทัศน์' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { fetchVision, updateVision } from '@/services/visionService'
import type { VisionData } from '@/types/vision'

const toast = useToast()

const visionData = ref<VisionData>({
  id: '',
  vision: '',
  missionHtml: '',
  coreValuesHtml: '',
  lastUpdated: '',
})

const loading = ref(true)
const isSaving = ref(false)

// ------------------------------------------------------------------
// DATA FETCHING
// ------------------------------------------------------------------

const loadVisionData = async () => {
  loading.value = true
  try {
    visionData.value = await fetchVision()
  } catch (e: unknown) {
    toast.error('ไม่สามารถโหลดข้อมูลวิสัยทัศน์/พันธกิจได้')
    console.error('Fetch vision failed:', e)
  } finally {
    loading.value = false
  }
}

// ------------------------------------------------------------------
// SAVE LOGIC
// ------------------------------------------------------------------

const saveVisionData = async () => {
  isSaving.value = true
  try {
    await updateVision(visionData.value)
    toast.success('บันทึกวิสัยทัศน์และพันธกิจสำเร็จ!')
  } catch (e: unknown) {
    console.error('Error saving vision data:', e)
    toast.error('บันทึกข้อมูลล้มเหลว')
  } finally {
    isSaving.value = false
  }
}

onMounted(loadVisionData)
</script>

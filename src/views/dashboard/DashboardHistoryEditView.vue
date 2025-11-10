<template>
  <div class="p-6 bg-white rounded-xl shadow-2xl">
    <h2 class="text-3xl font-extrabold text-gray-800 mb-2 flex items-center">
      <i class="fas fa-history mr-4 text-orange-600"></i> จัดการประวัติโรงพยาบาล
    </h2>
    <p class="text-gray-600 mb-6 border-b pb-4">
      แก้ไขเนื้อหาความเป็นมาและรูปภาพประวัติที่จะแสดงบนหน้าเว็บไซต์หลัก
    </p>

    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-6xl text-orange-500"></i>
      <p class="mt-4 text-lg text-gray-600">กำลังโหลดข้อมูลประวัติ...</p>
    </div>

    <form v-else @submit.prevent="saveHistorySettings" class="space-y-8">
      <div class="card bg-gray-50 p-6 rounded-xl shadow-lg border-t-4 border-orange-500">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-file-alt mr-2 text-orange-500"></i> เนื้อหาประวัติ
        </h3>

        <div>
          <label for="historyTitle" class="block text-sm font-semibold text-gray-700"
            >หัวข้อ:</label
          >
          <input
            type="text"
            id="historyTitle"
            v-model="historyData.title"
            required
            class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            placeholder="ประวัติโรงพยาบาลแม่แตง"
          />
        </div>

        <div class="mt-4">
          <label for="contentHtml" class="block text-sm font-semibold text-gray-700"
            >เนื้อหา (รองรับ HTML):</label
          >
          <textarea
            id="contentHtml"
            v-model="historyData.contentHtml"
            rows="15"
            required
            class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 font-mono text-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            คุณสามารถใส่แท็ก HTML เช่น &lt;p&gt;, &lt;br&gt; เพื่อจัดรูปแบบเนื้อหาได้
          </p>
        </div>
      </div>

      <div class="card bg-gray-50 p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-image mr-2 text-blue-500"></i> รูปภาพประกอบ
        </h3>

        <div>
          <label for="imageUrl" class="block text-sm font-semibold text-gray-700"
            >URL รูปภาพประวัติ:</label
          >
          <input
            type="url"
            id="imageUrl"
            v-model="historyData.imageUrl"
            class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-3 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            placeholder="http://yourcdn.com/path/to/image.png"
          />
          <p class="text-xs text-gray-500 mt-1">เมื่อมีการอัปโหลดไฟล์จริง URL นี้จะถูกแทนที่</p>
        </div>

        <div v-if="historyData.imageUrl" class="mt-6">
          <p class="text-sm font-semibold text-gray-700 mb-2">รูปภาพตัวอย่างปัจจุบัน:</p>
          <img
            :src="historyData.imageUrl"
            alt="Current History Image"
            class="max-w-xs h-auto rounded-lg shadow-md border border-gray-300"
          />
        </div>
      </div>

      <div class="pt-4 flex justify-end">
        <button
          type="submit"
          :disabled="isSaving"
          class="flex items-center bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition duration-300 text-lg shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <i class="fas fa-spinner fa-spin mr-2" v-if="isSaving"></i>
          <i class="fas fa-check-circle mr-2" v-else></i>
          {{ isSaving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
// 💡 ตรวจสอบว่าคุณมีไฟล์เหล่านี้ในโฟลเดอร์ src/types และ src/services แล้ว
import { fetchHistory, updateHistory } from '@/services/historyService'
import type { HistoryData } from '@/types/history'

const toast = useToast()

const historyData = ref<HistoryData>({
  id: 1,
  title: '',
  contentHtml: '',
  imageUrl: '',
})
const loading = ref(true)
const isSaving = ref(false)

// ------------------------------------------------------------------
// 1. DATA FETCHING
// ------------------------------------------------------------------

const loadHistory = async () => {
  loading.value = true
  try {
    const data = await fetchHistory()
    historyData.value = data
  } catch (e: unknown) {
    console.error('Failed to load history data:', e)
    toast.error('ไม่สามารถโหลดข้อมูลประวัติโรงพยาบาลได้')
  } finally {
    loading.value = false
  }
}

// ------------------------------------------------------------------
// 2. SAVE LOGIC
// ------------------------------------------------------------------

const saveHistorySettings = async () => {
  isSaving.value = true
  try {
    // ส่งข้อมูลที่แก้ไขแล้วไปยัง Service
    await updateHistory(historyData.value)
    toast.success('บันทึกประวัติโรงพยาบาลสำเร็จ!')
  } catch (e: unknown) {
    console.error('Error saving history settings:', e)
    toast.error('บันทึกประวัติล้มเหลว')
  } finally {
    isSaving.value = false
  }
}

onMounted(loadHistory)
</script>

<style scoped>
/* คุณสามารถเพิ่ม style ที่นี่ได้ */
</style>

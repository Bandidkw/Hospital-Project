<template>
  <div class="p-6 bg-white rounded-xl shadow-2xl transition duration-500">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-3xl font-extrabold text-gray-800 mb-2 flex items-center">
          <i class="fas fa-list mr-4 text-purple-600"></i> รายการตั้งค่าเว็บไซต์
        </h2>
        <p class="text-gray-600">ดูและจัดการข้อมูลการตั้งค่าเว็บไซต์ทั้งหมด</p>
      </div>
      <router-link
        to="/dashboard/website-settings"
        class="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
      >
        <i class="fas fa-plus mr-2"></i>
        สร้างการตั้งค่าใหม่
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-12">
      <i class="fas fa-spinner fa-spin text-6xl text-purple-500"></i>
      <p class="mt-4 text-lg text-gray-600">กำลังโหลดข้อมูล...</p>
    </div>

    <div v-else-if="allSettings.length === 0" class="text-center py-12">
      <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
      <p class="text-xl text-gray-500">ยังไม่มีข้อมูลการตั้งค่า</p>
      <router-link
        to="/dashboard/website-settings"
        class="inline-flex items-center mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <i class="fas fa-plus mr-2"></i>
        สร้างการตั้งค่าแรก
      </router-link>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(setting, index) in allSettings"
        :key="setting.id"
        class="bg-gray-50 p-6 rounded-lg border hover:shadow-lg transition cursor-pointer"
        @click="viewDetail(setting)"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <span class="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded">
                #{{ index + 1 }}
              </span>
              <h3 class="text-xl font-bold text-gray-800">{{ setting.hospitalNameTh }}</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="flex items-center text-gray-600">
                <i class="fas fa-hospital-alt w-5 mr-2 text-blue-500"></i>
                <span>{{ setting.hospitalNameEn }}</span>
              </div>
              <div class="flex items-center text-gray-600">
                <i class="fas fa-map-marker-alt w-5 mr-2 text-red-500"></i>
                <span>{{ setting.province }}</span>
              </div>
              <div class="flex items-center text-gray-600">
                <i class="fas fa-phone w-5 mr-2 text-green-500"></i>
                <span>{{ setting.telMain }}</span>
              </div>
              <div class="flex items-center text-gray-600">
                <i class="fas fa-envelope w-5 mr-2 text-yellow-500"></i>
                <span>{{ setting.emailMain }}</span>
              </div>
            </div>

            <div class="mt-3 text-xs text-gray-500">
              <span>ID: {{ setting.id }}</span>
            </div>
          </div>

          <div class="flex gap-2 ml-4">
            <button
              @click.stop="editSetting(setting)"
              class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              @click.stop="deleteSetting(setting.id)"
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { fetchAllSettings } from '@/services/settingsService'
import type { SettingsData } from '@/types/settings'

const router = useRouter()
const toast = useToast()

const loading = ref(true)
const allSettings = ref<SettingsData[]>([])

const loadAllSettings = async () => {
  loading.value = true
  try {
    const data = await fetchAllSettings()
    allSettings.value = data
    toast.success(`โหลดข้อมูลสำเร็จ (${data.length} รายการ)`)
  } catch (e) {
    toast.error('ไม่สามารถโหลดข้อมูลได้')
    console.error('Fetch all settings failed:', e)
  } finally {
    loading.value = false
  }
}

const viewDetail = (setting: SettingsData) => {
  toast.info(`ดูรายละเอียด: ${setting.hospitalNameTh}`)
  // TODO: Navigate to detail page or show modal
}

const editSetting = (setting: SettingsData) => {
  router.push({ path: '/dashboard/website-settings', query: { id: setting.id } })
}

const deleteSetting = async (id: string) => {
  if (!confirm('คุณต้องการลบข้อมูลนี้หรือไม่?')) return
  
  toast.warning('ฟังก์ชันลบยังไม่ได้เชื่อมต่อ API')
  // TODO: Implement delete API
}

onMounted(loadAllSettings)
</script>

<template>
  <div class="p-6 bg-white rounded-xl shadow-2xl transition duration-500">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-3xl font-extrabold text-gray-800 mb-2 flex items-center">
          <i class="fas fa-list mr-4 text-purple-600"></i> รายการตั้งค่าเว็บไซต์
        </h2>
        <p class="text-gray-600">
          ดูและจัดการข้อมูลการตั้งค่าเว็บไซต์ทั้งหมด
          <span v-if="allSettings.length > 0" class="ml-2">
            (เปิดใช้งาน:
            <span
              :class="activeCount === 1 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'"
            >
              {{ activeCount }}
            </span>
            / {{ allSettings.length }})
          </span>
        </p>
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
              <span
                :class="[
                  'text-xs font-semibold px-2 py-1 rounded',
                  setting.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600',
                ]"
              >
                {{ setting.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}
              </span>
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
              @click.stop="toggleSetting(setting.id)"
              :class="[
                'text-white px-4 py-2 rounded transition',
                setting.isActive
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gray-400 hover:bg-gray-500',
              ]"
              :title="setting.isActive ? 'ปิดการใช้งาน' : 'เปิดการใช้งาน'"
            >
              <i :class="setting.isActive ? 'fas fa-toggle-on' : 'fas fa-toggle-off'"></i>
            </button>
            <button
              @click.stop="editSetting(setting)"
              class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
              title="แก้ไข"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              @click.stop="deleteSetting(setting.id)"
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              title="ลบ"
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { fetchAllSettings, toggleSettings, deleteSettings } from '@/services/settingsService'
import type { SettingsData } from '@/types/settings'

const router = useRouter()
const toast = useToast()

const loading = ref(true)
const allSettings = ref<SettingsData[]>([])
const activeCount = computed(() => allSettings.value.filter((s) => s.isActive).length)

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

const toggleSetting = async (id: string) => {
  const setting = allSettings.value.find((s) => s.id === id)
  
  // ถ้ากำลังจะเปิดใช้งาน (จาก false -> true)
  if (setting && !setting.isActive) {
    const activeCount = allSettings.value.filter((s) => s.isActive).length
    
    if (activeCount >= 1) {
      toast.warning('สามารถเปิดใช้งานได้เพียง 1 การตั้งค่าเท่านั้น กรุณาปิดการตั้งค่าอื่นก่อน')
      return
    }
    
    const confirmed = confirm(
      `คุณต้องการเปิดใช้งานการตั้งค่า "${setting.hospitalNameTh}" หรือไม่?\n\nการตั้งค่านี้จะถูกใช้แสดงผลบนเว็บไซต์`,
    )
    if (!confirmed) return
  }
  
  // ถ้ากำลังจะปิดใช้งาน (จาก true -> false)
  if (setting && setting.isActive) {
    const confirmed = confirm(
      `คุณต้องการปิดใช้งานการตั้งค่า "${setting.hospitalNameTh}" หรือไม่?\n\nเว็บไซต์จะไม่แสดงข้อมูลการตั้งค่านี้`,
    )
    if (!confirmed) return
  }
  
  try {
    await toggleSettings(id)
    toast.success('เปลี่ยนสถานะการใช้งานสำเร็จ')
    // โหลดข้อมูลใหม่เพื่ออัพเดทสถานะ
    await loadAllSettings()
  } catch (e) {
    toast.error('ไม่สามารถเปลี่ยนสถานะได้')
    console.error('Toggle settings failed:', e)
  }
}

const editSetting = (setting: SettingsData) => {
  router.push({ path: '/dashboard/website-settings', query: { id: setting.id } })
}

const deleteSetting = async (id: string) => {
  const setting = allSettings.value.find((s) => s.id === id)
  
  // ตรวจสอบว่าเป็นการตั้งค่าที่กำลังใช้งานอยู่หรือไม่
  if (setting?.isActive) {
    toast.error('ไม่สามารถลบการตั้งค่าที่กำลังใช้งานอยู่ได้ กรุณาปิดการใช้งานก่อน')
    return
  }
  
  const confirmed = confirm(
    `คุณต้องการลบการตั้งค่า "${setting?.hospitalNameTh}" หรือไม่?\n\nการดำเนินการนี้ไม่สามารถย้อนกลับได้`,
  )
  if (!confirmed) return
  
  try {
    await deleteSettings(id)
    toast.success('ลบการตั้งค่าสำเร็จ')
    // โหลดข้อมูลใหม่
    await loadAllSettings()
  } catch (e) {
    toast.error('ไม่สามารถลบการตั้งค่าได้')
    console.error('Delete settings failed:', e)
  }
}

onMounted(loadAllSettings)
</script>

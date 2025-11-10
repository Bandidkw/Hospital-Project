// ใน src/stores/settings.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchSettings } from '@/services/settingsService'
import type { SettingsData } from '@/types/settings'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<SettingsData | null>(null)
  const loading = ref(false)

  async function loadSettings() {
    if (settings.value) return // ไม่ต้องโหลดซ้ำถ้ามีข้อมูลอยู่แล้ว

    loading.value = true
    try {
      const data = await fetchSettings()
      settings.value = data
    } catch (error) {
      console.error('Failed to load global settings:', error)
    } finally {
      loading.value = false
    }
  }

  return { settings, loading, loadSettings }
})

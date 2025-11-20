// ใน src/services/settingsService.ts

// 💡 1. Import SettingsApiResponse เข้ามาใช้
import type { SettingsData, SettingsApiResponse } from '@/types/settings'
import apiService from '@/services/apiService'

const SETTINGS_ID = 1
const GET_SETTINGS_URL = `/settings/public`
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PATCH_SETTINGS_URL = `/settings/${SETTINGS_ID}`

const mockSettings: SettingsData = {
  id: 'global-settings-1',
  hospitalNameTh: 'โรงพยาบาลแม่แตง', // ระบุให้ชัดเจนว่าใช้ Mock
  hospitalNameEn: 'Maetaeng Hospital',
  address: '300 หมู่ 7 ตำบลสันมหาพน อำเภอแม่แตง',
  zipCode: '50150',
  province: 'เชียงใหม่',
  telMain: '053 104 148',
  fax: '053-YYY-YYYY',
  emailMain: 'mail@maetaeng.go.th',
  facebookUrl: 'https://www.facebook.com/maetaenghospital',
  lineId: '@maetaenghospital',
  youtubeUrl: 'https://www.youtube.com/yourchannel',
  twitterUrl: 'https://twitter.com/yourhandle',
  googleMapIframe:
    '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.3150144296824!2d98.95756487583874!3d19.13768335003204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da11c8354bf1c3%3A0xea652096b64e4d34!2z4LmC4Lij4LiH4Lie4Lii4Liy4Lia4Liy4Lil4LmB4Lih4LmI4LmB4LiV4LiH!5e0!3m2!1sth!2sth!4v1762760203569!5m2!1sth!2sth" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  metaDescription:
    'โรงพยาบาลแม่แตง ให้บริการทางการแพทย์แผนปัจจุบันและแผนไทย เพื่อฟื้นฟูสุขภาพประชาชน...',
  keywords: 'โรงพยาบาล, แม่แตง, เชียงใหม่, สุขภาพ, แพทย์, พยาบาล',
}

/**
 * ดึงข้อมูลตั้งค่าเว็บไซต์ (Public)
 */
export async function fetchSettings(): Promise<SettingsData> {
  try {
    // ✅ 2. ใช้ SettingsApiResponse แทน SettingsData
    const response = await apiService.get<SettingsApiResponse>(GET_SETTINGS_URL)

    // 💡 ดึงข้อมูลจริงจาก Wrapper (response.data.data)
    const actualSettings = response.data.data

    // ✅ 3. ปรับ Logic การตรวจสอบให้เข้าถึง actualSettings
    // ตรวจสอบว่ามีข้อมูลจริง (actualSettings ไม่ใช่ null/undefined) และมี id
    if (actualSettings && (actualSettings as SettingsData).id) {
      return actualSettings as SettingsData
    }

    console.warn(
      'API returned success status but data was empty or invalid. Using mock data as fallback.',
    )
    return mockSettings
  } catch (error) {
    console.error('API Error: Failed to fetch settings. Using mock data as fallback.', error)
    return mockSettings
  }
}

/**
 * ดึงข้อมูลตั้งค่าเว็บไซต์ทั้งหมด (Get All)
 * ใช้ GET /settings
 */
export async function fetchAllSettings(): Promise<SettingsData[]> {
  try {
    // ✅ 4. ใช้ SettingsApiResponse แทน any
    const response = await apiService.get<SettingsApiResponse>('/settings')
    const actualData = response.data.data // 💡 ดึงข้อมูลจริงจาก Wrapper

    if (actualData && Array.isArray(actualData)) {
      return actualData
    }
    if (actualData && typeof actualData === 'object' && 'id' in actualData) {
      return [actualData as SettingsData]
    }

    console.warn('API returned success but data format is unexpected.')
    return []
  } catch (error) {
    console.error('API Error: Failed to fetch all settings', error)
    throw error
  }
}

/**
 * สร้างข้อมูลตั้งค่าเว็บไซต์ใหม่ (สำหรับ Admin Dashboard)
 * ใช้ POST /settings
 */
export async function createSettings(data: SettingsData): Promise<void> {
  try {
    // 💡 ไม่ต้องใช้ apiService.post<any>
    await apiService.post('/settings', data)
  } catch (error) {
    console.error('API Error: Failed to create settings', error)
    throw error
  }
}

/**
 * ดึงข้อมูลตั้งค่าเว็บไซต์ตาม ID
 */
export async function fetchSettingsById(id: string): Promise<SettingsData> {
  try {
    // ✅ 5. ใช้ SettingsApiResponse แทน any
    const response = await apiService.get<SettingsApiResponse>('/settings')
    const actualData = response.data.data // 💡 ดึงข้อมูลจริงจาก Wrapper

    if (actualData && typeof actualData === 'object' && !Array.isArray(actualData)) {
      // Logic สำหรับกรณีที่ API คืน Object เดียว (หรือเมื่อ !id)
      if ((actualData as SettingsData).id === id || !id) {
        return actualData as SettingsData
      }
    }
    if (Array.isArray(actualData)) {
      // ✅ 6. แก้ไข ESLint ใน Array.find โดยไม่ใช้ any
      const found = actualData.find((item) => (item as SettingsData).id === id)
      if (found) {
        return found as SettingsData
      }
    }
    if (actualData && typeof actualData === 'object' && 'id' in actualData) {
      console.warn(`Settings with id ${id} not found, using available data`)
      return actualData as SettingsData
    }

    throw new Error('Settings not found')
  } catch (error) {
    console.error('API Error: Failed to fetch settings by ID', error)
    throw error
  }
}

/**
 * อัปเดตข้อมูลตั้งค่าเว็บไซต์ (สำหรับ Admin Dashboard)
 * ใช้ PATCH /settings/:id
 */
export async function updateSettings(id: string, data: SettingsData): Promise<void> {
  try {
    await apiService.patch(`/settings/${id}`, data)
  } catch (error) {
    console.error('API Error: Failed to update settings', error)
    throw error
  }
}

/**
 * เปิด/ปิดการใช้งานการตั้งค่าเว็บไซต์
 * ใช้ PATCH /settings/:id/toggle
 */
export async function toggleSettings(id: string): Promise<void> {
  try {
    await apiService.patch(`/settings/${id}/toggle`)
  } catch (error) {
    console.error('API Error: Failed to toggle settings', error)
    throw error
  }
}

/**
 * ลบข้อมูลตั้งค่าเว็บไซต์
 * ใช้ DELETE /settings/:id
 */
export async function deleteSettings(id: string): Promise<void> {
  try {
    await apiService.delete(`/settings/${id}`)
  } catch (error) {
    console.error('API Error: Failed to delete settings', error)
    throw error
  }
}

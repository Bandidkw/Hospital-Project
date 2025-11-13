// ใน src/services/settingsService.ts

import type { SettingsData } from '@/types/settings'
import apiService from '@/services/apiService'

const SETTINGS_ID = 1
const GET_SETTINGS_URL = `/settings`
const PATCH_SETTINGS_URL = `/settings/${SETTINGS_ID}`

const mockSettings: SettingsData = {
  id: 'global-settings-1',
  hospitalNameTh: 'โรงพยาบาลแม่แตง', // ระบุให้ชัดเจนว่าใช้ Mock
  hospitalNameEn: 'Maetaeng Hospital',
  address: '300 หมู่ 7 ตำบลสันมหาพน อำเภอแม่แตง จังหวัดเชียงใหม่',
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
 * ดึงข้อมูลตั้งค่าเว็บไซต์
 * 🟢 ลองใช้ API จริงก่อน และ Fallback ไปใช้ Mockup เมื่อเกิดข้อผิดพลาด
 */
export async function fetchSettings(): Promise<SettingsData> {
  try {
    // 1. ลองเรียก API จริง (GET /settings)
    const response = await apiService.get<SettingsData>(GET_SETTINGS_URL) // 2. ตรวจสอบข้อมูลที่ได้มา หากถูกต้องให้ใช้ข้อมูลนั้น
    if (response.data && response.data.id) {
      return response.data
    } // 3. หาก API ตอบกลับ 200 แต่ข้อมูลว่างหรือผิดพลาด ใช้วิธี Fallback
    console.warn(
      'API returned success status but data was empty or invalid. Using mock data as fallback.',
    )
    return mockSettings
  } catch (error) {
    // 🔴 4. หากเกิด Error ในการเชื่อมต่อ (Network Error, 4xx, 5xx) ใช้วิธี Fallback
    console.error('API Error: Failed to fetch settings. Using mock data as fallback.', error) // 🟢 Fallback: ส่ง Mock Data กลับไปแทน
    return mockSettings
  }
}

/**
 * ดึงข้อมูลตั้งค่าเว็บไซต์ทั้งหมด (Get All)
 * ใช้ GET /settings
 * รองรับทั้งกรณีที่ API ส่งกลับมาเป็น array หรือ object เดี่ยว
 */
export async function fetchAllSettings(): Promise<SettingsData[]> {
  try {
    const response = await apiService.get<any>('/settings')
    
    // ข้อมูลจริงอยู่ที่ response.data.data (API wrapper format)
    const actualData = response.data?.data || response.data
    
    // กรณีที่ข้อมูลเป็น array
    if (actualData && Array.isArray(actualData)) {
      return actualData
    }
    
    // กรณีที่ข้อมูลเป็น object เดี่ยว ให้แปลงเป็น array
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
    await apiService.post('/settings', data)
  } catch (error) {
    console.error('API Error: Failed to create settings', error)
    throw error
  }
}

/**
 * ดึงข้อมูลตั้งค่าเว็บไซต์ตาม ID
 * เนื่องจาก API ไม่รองรับ GET /settings/:id จึงใช้ GET /settings แทน
 */
export async function fetchSettingsById(id: string): Promise<SettingsData> {
  try {
    // ใช้ GET /settings เพราะ API ไม่รองรับ GET /settings/:id
    const response = await apiService.get<any>('/settings')
    
    // ข้อมูลจริงอยู่ที่ response.data.data (API wrapper format)
    const actualData = response.data?.data || response.data
    
    // ถ้าข้อมูลเป็น object เดี่ยวและมี id ตรงกัน
    if (actualData && typeof actualData === 'object' && !Array.isArray(actualData)) {
      if (actualData.id === id || !id) {
        return actualData as SettingsData
      }
    }
    
    // ถ้าข้อมูลเป็น array ให้หา id ที่ตรงกัน
    if (Array.isArray(actualData)) {
      const found = actualData.find((item: any) => item.id === id)
      if (found) {
        return found as SettingsData
      }
    }
    
    // ถ้าไม่เจอ ให้ส่งข้อมูลแรกที่มี (fallback)
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

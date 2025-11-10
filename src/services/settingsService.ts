// ใน src/services/settingsService.ts

import type { SettingsData } from '@/types/settings'
// import apiService from '@/services/apiService'; // 💡 สำหรับใช้ API จริง

// 💡 Mock Data ที่อ้างอิงจากรูป image_19a820.png
const mockSettings: SettingsData = {
  id: 'global-settings-1',
  hospitalNameTh: 'โรงพยาบาลแม่แตง',
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
 * ดึงข้อมูลตั้งค่าเว็บไซต์ (ใช้ Mock Data)
 */
export async function fetchSettings(): Promise<SettingsData> {
  // 💡 จำลองการหน่วงเวลาของ API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSettings)
    }, 300)
  })
  // หากเชื่อมต่อ API จริง:
  // const response = await apiService.get('/api/settings');
  // return response.data.data;
}

/**
 * อัปเดตข้อมูลตั้งค่าเว็บไซต์ (สำหรับ Admin Dashboard)
 */
export async function updateSettings(data: SettingsData): Promise<void> {
  // 💡 Mock การอัปเดต
  console.log('Mock Update Settings:', data)
  return new Promise((resolve) => {
    setTimeout(resolve, 300)
  })
  // หากเชื่อมต่อ API จริง:
  // await apiService.patch('/api/settings/global-settings-1', data);
}

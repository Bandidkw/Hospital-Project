// ใน src/types/settings.ts

export interface SettingsData {
  id: string
  hospitalNameTh: string
  hospitalNameEn: string
  address: string
  zipCode: string
  province: string
  telMain: string
  fax: string
  emailMain: string
  facebookUrl: string
  lineId: string
  youtubeUrl: string
  twitterUrl: string
  googleMapIframe: string
  metaDescription: string
  keywords: string
  isActive?: boolean
}

// 💡 เพิ่ม: Interface สำหรับโครงสร้าง API Response Wrapper
export interface SettingsApiResponse {
  status: number
  name: string
  description: string
  // data สามารถเป็น Object เดียว, Array ของ Object, หรือ null
  data: SettingsData | SettingsData[] | null
  error: boolean
}

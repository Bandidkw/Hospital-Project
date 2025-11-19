// src/services/referralService.ts

import apiService from '@/services/apiService'
import type { ReferralFormData, ReferralResponse, Hospital, Clinic } from '@/types/referral'

// Endpoint หลัก (สามารถเปลี่ยนได้ตาม Backend ของคุณ)
const BASE_URL = '/referrals'

/**
 * ดึงรายชื่อโรงพยาบาล (Master Data)
 * ตอนนี้ใช้ Mockup จำลองการดีเลย์ (เปลี่ยนเป็น apiService.get ได้เลย)
 */
export async function getHospitals(): Promise<Hospital[]> {
  // TODO: เปลี่ยนเป็น await apiService.get<Hospital[]>('/master/hospitals') เมื่อมี API
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [
    { id: 'h01', name: 'โรงพยาบาลแม่แตง' },
    { id: 'h02', name: 'โรงพยาบาลนครพิงค์' },
    { id: 'h03', name: 'โรงพยาบาลมหาราชนครเชียงใหม่' },
  ]
}

/**
 * ดึงรายชื่อคลินิกตามโรงพยาบาล (Master Data)
 */
export async function getClinicsByHospital(hospitalId: string): Promise<Clinic[]> {
  // TODO: เปลี่ยนเป็น await apiService.get<Clinic[]>(`/master/hospitals/${hospitalId}/clinics`)
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Mock Data
  const mockClinics: Record<string, Clinic[]> = {
    h01: [
      { id: 'h01c01', name: 'คลินิกอายุรกรรม' },
      { id: 'h01c02', name: 'คลินิกศัลยกรรม' },
    ],
    h02: [
      { id: 'h02c01', name: 'แผนกโรคหัวใจ' },
      { id: 'h02c02', name: 'แผนกจักษุวิทยา' },
    ],
    h03: [{ id: 'h03c01', name: 'ศูนย์ความเป็นเลิศทางการแพทย์' }],
  }

  return mockClinics[hospitalId] || []
}

/**
 * สร้างใบส่งตัวผู้ป่วย (Create Referral)
 * รองรับการอัปโหลดไฟล์ (Multipart/Form-Data)
 */
export async function createReferral(data: ReferralFormData): Promise<ReferralResponse> {
  const formData = new FormData()

  // 1. Append ข้อมูลทั่วไป (Text Fields)
  formData.append('patientName', data.patientName)
  formData.append('patientHN', data.patientHN)
  formData.append('patientIdCard', data.patientIdCard)
  formData.append('patientTel', data.patientTel)
  formData.append('healthScheme', data.healthScheme)
  formData.append('originHospitalId', data.originHospitalId)

  // แปลงวันที่เป็น ISO String หรือ format ที่ Backend ต้องการ
  if (data.travelDate) {
    const dateStr =
      data.travelDate instanceof Date ? data.travelDate.toISOString() : data.travelDate
    formData.append('travelDate', dateStr)
  }

  // 2. Append ข้อมูลที่มีโครงสร้างซับซ้อน (Array/Object) -> ส่งเป็น JSON String
  // หมายเหตุ: Backend ต้อง parse JSON string ใน field 'destinations' นี้
  formData.append('destinations', JSON.stringify(data.destinations))

  // 3. Append ไฟล์ (Multiple Files)
  if (data.referralFiles && data.referralFiles.length > 0) {
    data.referralFiles.forEach((file) => {
      formData.append('referralFiles', file) // ใช้ชื่อ key เดียวกันเพื่อส่งเป็น array
    })
  }

  // 4. ส่ง Request
  // หมายเหตุ: axios จะตั้ง Content-Type เป็น multipart/form-data ให้อัตโนมัติเมื่อส่ง FormData
  const response = await apiService.post<{ data: ReferralResponse }>(BASE_URL, formData)

  return response.data.data
}

// src/services/referralService.ts

import apiService from '@/services/apiService'
import type { ReferralFormData, ReferralResponse, Hospital, Clinic } from '@/types/referral'

// Endpoint หลัก (สามารถเปลี่ยนได้ตาม Backend ของคุณ)
const BASE_URL = '/patient/public'

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

  // 💡 1. การจัดการ Date และ Time (แยก Booking Date & Time)
  let bookingDateStr: string = ''
  let bookingTimeStr: string = ''

  if (data.travelDate) {
    // ใช้ฟังก์ชัน util สำหรับ format วันที่/เวลา
    // เนื่องจากไม่มี util เราจะทำแบบง่ายๆ ที่นี่
    const dateObj = data.travelDate
    bookingDateStr = dateObj.toISOString().split('T')[0] // YYYY-MM-DD
    bookingTimeStr = `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}` // HH:MM
  }

  // 💡 2. Append และ Mapping ข้อมูลทั่วไป (Text Fields)
  formData.append('fullName', data.patientName) // patientName -> fullName
  formData.append('nationalId', data.patientIdCard) // patientIdCard -> nationalId
  formData.append('phoneNumber', data.patientTel) // patientTel -> phoneNumber
  formData.append('medicalRights', data.healthScheme) // healthScheme -> medicalRights
  formData.append('referralHospital', data.originHospitalId) // originHospitalId -> referralHospital
  formData.append('hospitalNumber', data.patientHN)
  formData.append('queueStatus', 'PENDING')

  // ข้อมูลนัดหมาย
  formData.append('bookingDate', bookingDateStr) // travelDate -> bookingDate
  formData.append('bookingTime', bookingTimeStr) // travelDate -> bookingTime

  // 💡 เพิ่ม Field ที่จำเป็นแต่ขาดไปใน ReferralFormData
  formData.append('queueStatus', 'PENDING') // สมมติค่าเริ่มต้นเป็น PENDING

  // 3. Append ข้อมูลที่มีโครงสร้างซับซ้อน (Array/Object) -> ส่งเป็น JSON String
  // destinations: { hospitalId, clinics: [{ clinicId }] }
  formData.append('destinations', JSON.stringify(data.destinations))

  // 4. Append ไฟล์ (Multiple Files)
  if (data.referralFiles && data.referralFiles.length > 0) {
    data.referralFiles.forEach((file) => {
      // 💡 เปลี่ยนชื่อ key จาก 'referralFiles' เป็น 'documents' ตามที่ Backend ต้องการ
      formData.append('documents', file)
    })
  }

  // 5. ส่ง Request
  // 💡 ปรับ Type Assertion เพื่อความปลอดภัย
  const response = await apiService.post<{ data: ReferralResponse }>(BASE_URL, formData)

  // หาก apiService คืนค่า JSON Body ทั้งหมดและ Response Structure คือ { data: { data: T } }
  return response.data.data
}

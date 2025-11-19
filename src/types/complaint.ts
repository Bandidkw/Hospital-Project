// complaint.ts

export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected'

/**
 * Interface สำหรับข้อมูลข้อร้องเรียนตามที่เราต้องการใช้งานใน Vue Component
 */
export interface ComplaintItem {
  id: string
  code: string
  subject: string
  description: string
  status: ComplaintStatus
  complainantName: string
  contactInfo: string
  createdAt: string
  updatedAt: string
  resolutionDetail?: string
}

/**
 * 🆕 NEW: Interface สำหรับข้อมูลดิบที่มาจาก API ก่อนการแปลง
 */
export interface RawComplaintApiItem {
  id: string
  complaintCode: string
  fullName: string
  contactInfo: string
  subject: string
  description: string
  status: string
  createdAt: string
  updatedAt: string
  resolutionDetail?: string | null
}

/**
 * Interface สำหรับ Response Structure ของ API
 */
export interface ComplaintApiResponse<T> {
  status: 'SUCCESS' | 'ERROR'
  name: string
  description: string
  data: T
  error: boolean
}

export interface ComplaintUpdatePayload {
  status?: ComplaintStatus
  resolutionDetail?: string
}

// 🟢 Export Interface ใหม่
export interface ComplaintFormData {
  subject: string
  description: string
  // 🟢 แก้ไข: เปลี่ยนชื่อ Field ให้ตรงกับ API
  fullName: string
  // ❌ ลบ Property 'complainantName' ออก

  contactInfo: string
  // 🟢 เพิ่ม: เพิ่ม status เข้าไปใน Payload
  status: string
}

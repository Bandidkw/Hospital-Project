// types/opd.ts

// --- Interface สำหรับ Stat Cards ---
export interface OpdStats {
  queueCount: number
  pendingResults: number
  todayAppointments: number
}

export interface PatientReferralInfo {
  // ข้อมูลส่วนตัว
  hn: string
  name: string
  phone: string
  status: string
  trackingCode: string
  originHospital: string
  destinationHospital: string
  destinationClinic: string
}

// --- 3. Interface ---
export interface SearchError {
  error: string
}

export interface ReferralQueueItemApi {
  id: string
  fullName: string
  hospitalNumber: string
  nationalId: string
  phoneNumber: string
  referralHospital: string
  destinationHospital: string
  department: string
  queueStatus: 'รอเรียก' | 'รออนุมัติ' | 'อนุมัติแล้ว' | 'ปฏิเสธ'
  bookingDate: string
  bookingTime: string
  medicalRights: string
  documents: unknown[]
  trackingCode?: string
  reason?: string
}

// Interface สำหรับ Full Response ที่มี Array ของ Item อยู่ใน data
export interface ReferralQueueResponse {
  status: string
  name: string
  description: string
  data: ReferralQueueItemApi[]
}

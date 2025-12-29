// types/opd.ts

// --- Interface สำหรับ Stat Cards ---
export interface OpdStats {
  totalNews: number
  totalITA: number
  queueCount: number
  pendingResults: number
  todayAppointments: number
}

export interface PatientReferralInfo {
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
  trackingCode?: string
  referralCode?: string
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

// Consolidated definition above; removed duplicate.

// 2. Type สำหรับ Response Structure จาก API
export interface ReferralQueueResponse {
  status: 'SUCCESS' | 'ERROR'
  description: string
  data: ReferralQueueItemApi[]
}

// 3. Type สำหรับ Local View Model ใน OpdQueueList.vue
export type QueueStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface QueueItem {
  id: string
  trackingCode: string
  hn: string
  patientName: string
  phone: string
  referralTime: string
  status: QueueStatus
  reason?: string
  bookingDate: string
  destinationClinic: string
  destinationHospital: string
  originHospital: string
}

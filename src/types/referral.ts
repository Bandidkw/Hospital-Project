// src/types/referral.ts

export interface Hospital {
  id: string
  name: string
}

export interface Clinic {
  id: string
  name: string
}

export interface ClinicSelection {
  clinicId: string
}

export interface ReferralDestination {
  hospitalId: string
  clinics: ClinicSelection[]
  availableClinics?: Clinic[]
}

export interface ReferralFormData {
  patientName: string
  patientHN: string
  patientIdCard: string
  patientTel: string
  patientBirthdate?: string
  healthScheme: string
  originHospitalId: string
  destinations: ReferralDestination[]
  travelDate: Date | null
  referralFiles: File[]
}

export interface ReferralResponse {
  id: string
  trackingCode: string
  status: string
  createdAt: string
}

/**
 * Interface สำหรับข้อมูลวันที่ในปฏิทินส่งตัวผู้ป่วย
 * (ใช้สำหรับ CustomCalendar.vue)
 */
export interface Day {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean

  // REQUIRED: ต้องมีค่าเสมอตาม logic การสร้าง array
  slotsRemaining: number

  isFull: boolean
  isPast: boolean
  isWeekend: boolean
}

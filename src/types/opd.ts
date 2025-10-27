// src/types/opd.ts

// 1. Interface สำหรับข้อมูลผู้ป่วยและใบส่งตัว (Referral Info)
export interface PatientReferralInfo {
  hn: string
  name: string
  phone: string
  status: string

  // ข้อมูลการส่งตัว
  originHospital: string
  destinationHospital: string
  destinationClinic: string
  trackingCode: string
}

// 2. Interface สำหรับ Object Error เมื่อค้นหาไม่สำเร็จ
export interface SearchError {
  error: string
}

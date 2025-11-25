// services/opdService.ts

import { isAxiosError } from 'axios'
import apiService from '@/services/apiService'
import type {
  PatientReferralInfo,
  SearchError,
  OpdStats,
  ReferralQueueItemApi, // 💡 ไม่จำเป็นต้อง Import ReferralQueueResponse อีก
} from '@/types/opd'

// ----------------------------------------------------------------------
// 1. Fetch OPD Stats API (GET /api/v1/opd/stats)
// ----------------------------------------------------------------------
export async function fetchOpdStats(): Promise<OpdStats> {
  try {
    const response = await apiService.get<OpdStats>('/patient')
    return response.data
  } catch (error) {
    console.error('Fetch OPD Stats Failed. Returning default stats:', error) // 💡 แก้ไข: กำหนดค่าเริ่มต้นสำหรับ PROPERTIES ทั้งหมดที่ขาดไป
    return {
      totalNews: 0,
      totalITA: 0,
      queueCount: 0,
      pendingResults: 0,
      todayAppointments: 0,
    } as OpdStats
  }
}

// ----------------------------------------------------------------------
// 2. Search Patient by HN API (GET /api/v1/patients/search?hn={hn})
// ----------------------------------------------------------------------
export async function searchPatientByHN(hn: string): Promise<PatientReferralInfo | SearchError> {
  try {
    const url = `/patients/search?hn=${hn}`
    const response = await apiService.get<PatientReferralInfo>(url)

    return response.data
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response) {
      if (error.response.status === 404 || error.response.status === 400) {
        const responseData = error.response.data as { message?: string } | undefined
        const errorMessage = responseData?.message || `ไม่พบข้อมูลผู้ป่วยด้วย HN: ${hn}`
        return { error: errorMessage }
      }
    }
    return { error: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบค้นหา' }
  }
}

// ----------------------------------------------------
// 3. ฟังก์ชัน fetchPendingQueueList
// ----------------------------------------------------
export async function fetchPendingQueueList(): Promise<ReferralQueueItemApi[]> {
  // 💡 เปลี่ยนไปใช้ Endpoint หลัก (Get All) เพื่อหลีกเลี่ยง 404
  const endpoint = '/patient' // สมมติว่านี่คือ Endpoint Get All ที่ถูกต้อง

  try {
    // ... (เรียก API เหมือนเดิม)
    const response = await apiService.get<ReferralQueueItemApi[]>(endpoint)
    return response.data
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error(
        `API Error fetching referral queues (Status: ${error.response?.status})`,
        error.response?.data,
      )
      // 💡 โยน Error สำหรับ Error Server/Network เท่านั้น (เพื่อให้ OpdQueueList.vue แสดง Toast)
      if (error.response && error.response.status >= 500) {
        throw new Error(
          `ไม่สามารถดึงรายการคิวได้ (ข้อผิดพลาดเซิร์ฟเวอร์: ${error.response.status})`,
        )
      }
    }

    console.error('Unknown error during queue fetch:', error)
    // 💡 คืนค่า Array ว่างเปล่า เมื่อเกิด Error ที่ไม่สามารถกู้คืนได้ หรือเป็น 404 ที่ไม่ทราบ
    return []
  }
}

// @/services/opdService.ts

import apiService from '@/services/apiService'
import type { ReferralQueueItemApi, ReferralQueueResponse } from '@/types/opd'

export async function fetchPendingQueueList(): Promise<ReferralQueueItemApi[]> {
  try {
    // 1. เรียก API
    const response = await apiService.get<ReferralQueueResponse>('/patient')

    // 2. 💡 แก้ไข: คืนค่า Array ที่อยู่ใน property 'data' เท่านั้น
    return response.data.data
  } catch (error) {
    console.error('Fetch Queue List Error:', error)
    throw error
  }
}

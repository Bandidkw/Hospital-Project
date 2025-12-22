// @/services/opdService.ts

import apiService from '@/services/apiService'
import type { ReferralQueueItemApi, ReferralQueueResponse } from '@/types/opd'

export async function fetchPendingQueueList(): Promise<ReferralQueueItemApi[]> {
  try {
    const response = await apiService.get<ReferralQueueResponse>('/patient')
    return response.data.data
  } catch (error) {
    console.error('Fetch Queue List Error:', error)
    throw error
  }
}

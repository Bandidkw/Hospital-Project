// src/services/facebookService.ts

import apiService from '@/services/apiService'
import type { FacebookPost, FacebookResponse } from '@/types/facebook'

/**
 * Service สำหรับเรียกข้อมูล Facebook Posts
 */
export const facebookService = {
  /**
   * ดึงโพสล่าสุดจาก Backend (ซึ่ง Backend ไปดึงจาก Facebook Graph API อีกที)
   * @param limit จำนวนโพสที่ต้องการ
   */
  async fetchLatestPosts(limit: number = 5): Promise<FacebookPost[]> {
    try {
      // เรียกใช้ Endpoint ที่ Backend เตรียมไว้
      const response = await apiService.get<FacebookResponse>(`/facebook/posts?limit=${limit}`)

      // สมมติว่า Backend ส่ง Array ของโพสมาใน property 'data'
      // ถ้า apiService คืนค่า JSON Body ทั้งหมด:
      return response.data // คืนค่า Array ของ FacebookPost
    } catch (error) {
      console.error('Fetch Facebook Posts Error:', error)
      // คืนค่า Array ว่างหากเกิด Error
      return []
    }
  },
}

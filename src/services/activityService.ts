// src/services/activityService.ts
import apiService from './apiService'
import type { ActivityLog } from '@/types/main' // ตรวจสอบว่า Path และชื่อไฟล์ Type ถูกต้อง
import { useToast } from 'vue-toastification'

const toast = useToast()

export const activityService = {
  /**
   * ดึงข้อมูลกิจกรรมล่าสุดจากเซิร์ฟเวอร์
   * @param limit จำนวนรายการที่ต้องการดึง (ค่าเริ่มต้นคือ 5)
   * @returns Promise<ActivityLog[]>
   */
  getRecentActivities: async (limit: number = 5): Promise<ActivityLog[]> => {
    try {
      const response = await apiService.get(`/dashboard/recent-activities?limit=${limit}`)
      // สมมติว่าข้อมูลที่ต้องการอยู่ใน response.data.data
      return response.data.data
    } catch (err: unknown) {
      console.error('Failed to fetch recent activities:', err)

      // จัดการ Error อย่างปลอดภัย
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error('เกิดข้อผิดพลาดที่ไม่คาดคิดในการดึงข้อมูลกิจกรรม')
      }

      // คืนค่าเป็น Array ว่างเปล่าเพื่อป้องกันไม่ให้หน้าเว็บพัง
      return []
    }
  },
}

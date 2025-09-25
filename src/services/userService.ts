// ใน src/services/userService.ts
import apiService from './apiService'

export interface User {
  // <-- เพิ่ม export ข้างหน้า
  id: string
  username: string
  fullName: string
  // ... field อื่นๆ ให้ครบ
}

/**
 * อัปเดตข้อมูลโปรไฟล์ผู้ใช้
 * @param userId - ไอดีของผู้ใช้ที่จะอัปเดต
 * @param data - ข้อมูลใหม่ที่จะส่งไป
 */
export async function updateUserProfile(userId: string, data: { fullName: string }) {
  const response = await apiService.patch(`/users/${userId}/profile`, data)
  return response.data
}

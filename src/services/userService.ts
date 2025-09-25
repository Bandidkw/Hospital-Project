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
 * อัปเดตข้อมูลโปรไฟล์ของผู้ใช้ที่ Login อยู่
 * @param data - ข้อมูลใหม่ที่จะส่งไป
 */
export async function updateUserProfile(data: { fullName: string }) {
  // ✨ 1. เปลี่ยน Endpoint เป็น /admin/profile
  // ✨ 2. ไม่ต้องใช้ userId ใน URL
  const response = await apiService.patch('/admin/profile', data)
  return response.data
}

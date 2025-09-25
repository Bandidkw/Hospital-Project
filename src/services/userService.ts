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
 * @param data - ข้อมูลใหม่ที่จะส่งไป (ต้องมี name และ username)
 */
export async function updateUserProfile(data: { name: string; username: string }) {
  // ✨ 1. เปลี่ยน method เป็น .put() ให้ตรงกับ Postman
  // ✨ 2. เปลี่ยน Endpoint เป็น /admin/profile
  const response = await apiService.put('/admin/profile', data)

  // สมมติว่า API ตอบกลับมาเป็น { status: 'success', data: { ...user } }
  return response.data.data
}

// ใน src/types/user.ts

export interface User {
  id: string // ✅ แก้ไขเป็น string เพื่อรองรับ GUID ของ API
  username: string
  password?: string
  role: string
  management?: string
  table?: string
}

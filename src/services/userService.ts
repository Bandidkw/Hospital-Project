// ใน src/services/userService.ts

import type { User } from '@/types/user'
import apiService from '@/services/apiService' // 💡 ต้องปรับ path ให้ถูกต้อง

// ------------------------------------------------------------------
// INTERFACES (ใช้ร่วมกับ DashboardUsersView.vue)
// ------------------------------------------------------------------

interface UserApiResponse {
  status: number
  name: string
  description: string
  data: Array<Omit<User, 'role'> & { role: string }> | null
  error: boolean
}

// ------------------------------------------------------------------
// API ENDPOINTS
// ------------------------------------------------------------------

const USERS_URL = '/super-admin/users'
const USER_BY_ID_URL = '/super-admin/users'

/**
 * ดึงรายการผู้ใช้งานทั้งหมด (GET /users)
 */
export async function fetchAllUsers(): Promise<User[]> {
  const response = await apiService.get<UserApiResponse>(USERS_URL)
  const actualData = response.data.data

  if (Array.isArray(actualData)) {
    return actualData.map((item) => ({
      ...item,
      // ❌ ไม่ต้องแปลง: role: parseInt(item.role, 10),
      id: item.id,
    })) as User[] // ตอนนี้ item.role (string) ถูก Assign เข้า User.role (string) โดยตรงแล้ว
  }
  return []
}

/**
 * ดึงข้อมูลผู้ใช้งานตาม ID (GET /super-admin/users/{id})
 * @param id รหัสผู้ใช้งาน (String GUID)
 */
export async function fetchUserById(id: string): Promise<User> {
  interface SingleUserApiResponse {
    status: number
    name: string
    description: string // data คือ Object เดียวของ User (role: string)
    data: (Omit<User, 'role'> & { role: string }) | null
    error: boolean
  }

  try {
    const response = await apiService.get<SingleUserApiResponse>(`${USER_BY_ID_URL}/${id}`)
    const actualData = response.data.data

    if (actualData && actualData.id) {
      // ✅ ไม่ต้องแปลง: role มาเป็น string อยู่แล้ว (ตาม API Response)
      // และ User.role ก็เป็น string แล้ว
      return {
        ...actualData, // ❌ ลบบรรทัดการแปลงค่า role ออกไป: role: parseInt(actualData.role, 10),
      } as User
    }

    throw new Error(`User with ID ${id} not found or data is invalid.`)
  } catch (error) {
    console.error(`API Error: Failed to fetch user by ID ${id}`, error)
    throw error
  }
}

/**
 * สร้างผู้ใช้งานใหม่ (POST /users)
 */
export async function createUser(userData: User): Promise<User> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...dataToSend } = userData
  await apiService.post('/super-admin/create-user', dataToSend)
  return userData
}

/**
 * อัปเดตรายละเอียดผู้ใช้งาน (PATCH /super-admin/users/{id})
 */
export async function updateUserDetails(id: string, dataToUpdate: Partial<User>): Promise<void> {
  // 💡 เนื่องจาก User.role เป็น string แล้ว เราไม่จำเป็นต้องใช้ UserUpdatePayload
  // แต่สามารถใช้ Partial<User> ได้เลย (ถ้าเรายอมรับการละเลย password/role ที่เป็น string ว่าง)
  // อย่างไรก็ตาม เราจะใช้ logic เดิมในการสร้าง Payload เพื่อควบคุมฟิลด์

  const { role, ...restOfData } = dataToUpdate

  // ❌ เปลี่ยนจาก UserUpdatePayload เป็น Partial<User> ถ้าเราลบ logic แปลงค่าแล้ว
  // หรือใช้ UserUpdatePayload เดิมที่ role? เป็น string? (ซึ่งเราแก้ role ใน User แล้ว)
  const payloadToSend: Partial<User> = { ...restOfData }

  if (role !== undefined) {
    // ✅ ไม่ต้องแปลง: payloadToSend.role = String(role)
    payloadToSend.role = role // ใช้ role (string) โดยตรง
  }

  if (payloadToSend.password === '') {
    delete payloadToSend.password
  }

  await apiService.patch(`${USER_BY_ID_URL}/${id}`, payloadToSend)
}

/**
 * ลบผู้ใช้งาน (DELETE /users/{id})
 */
export async function deleteUserById(id: string): Promise<void> {
  // ✅ แก้ไขเป็น string
  await apiService.delete(`/super-admin/users/${id}`)
}

/**
 * อัพเดท Profile ผู้ใช้งานปัจจุบัน
 */
export async function updateUserProfile(data: { name: string; username: string }, role: string) {
  let endpoint: string

  switch (role) {
    case 'superadmin':
      endpoint = '/super-admin/profile'
      break
    case 'admin':
      endpoint = '/admin/profile'
      break
    case 'opd':
      endpoint = '/opd/profile'
      break
    default:
      endpoint = '/admin/profile'
  }

  const response = await apiService.put(endpoint, data)
  return response.data.data
}

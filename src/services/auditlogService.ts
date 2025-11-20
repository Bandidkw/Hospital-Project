// services/auditlogService.ts
import type { AuditLog } from '@/types/auditlog'
import { AuditAction } from '@/types/auditlog'

/**
 * Mock Data: ข้อมูลตัวอย่าง Log ด้านความปลอดภัย
 */
const mockAuditLogs: AuditLog[] = [
  {
    id: 1,
    timestamp: '2024-07-16 10:00:00',
    userId: 'admin_001',
    action: AuditAction.USER_LOGIN,
    targetId: 'admin_001',
    details: { ip: '192.168.1.1', device: 'Desktop Chrome', status: 'SUCCESS' },
  },
  {
    id: 2,
    timestamp: '2024-07-16 10:05:30',
    userId: 'admin_001',
    action: AuditAction.USER_LOGOUT,
    targetId: 'admin_001',
    details: { duration: '5m 30s' },
  },
  {
    id: 3,
    timestamp: '2024-07-16 10:15:00',
    userId: 'system_auth',
    action: AuditAction.PASSWORD_RESET,
    targetId: 'user_support',
    details: { method: 'admin_override' },
  },
  {
    id: 4,
    timestamp: '2024-07-15 15:30:00',
    userId: 'guest',
    action: AuditAction.ACCESS_DENIED,
    targetId: 'login_page',
    details: { ip: '103.25.1.5', reason: 'Invalid credentials' },
  },
  {
    id: 5,
    timestamp: '2024-07-14 09:00:00',
    userId: 'user_support',
    action: AuditAction.USER_LOGIN,
    targetId: 'user_support',
    details: { ip: '192.168.1.50', device: 'Mobile Safari', status: 'SUCCESS' },
  },
  {
    id: 6,
    timestamp: '2024-07-14 09:05:00',
    userId: 'hacker_bot',
    action: AuditAction.USER_LOGIN,
    targetId: 'hacker_bot',
    details: { ip: '203.0.113.10', status: 'FAILED', reason: 'Incorrect Password' },
  },
]

/**
 * fetchAuditLogs: ดึงรายการ Audit Logs ทั้งหมด
 * (ใน Production จะเรียก Axios หรือ Fetch API ที่นี่)
 */
export const fetchAuditLogs = async (): Promise<AuditLog[]> => {
  // จำลองการหน่วงเวลาการเรียก API
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockAuditLogs
}

/**
 * formatLogDetails: ฟังก์ชันสำหรับแปลง Details Object ให้เป็น String ที่อ่านง่าย
 */
export const formatLogDetails = (log: AuditLog): string => {
  switch (log.action) {
    case AuditAction.USER_LOGIN:
      return log.details.status === 'SUCCESS'
        ? `เข้าสู่ระบบสำเร็จจาก IP: ${log.details.ip}, Device: ${log.details.device}`
        : `เข้าสู่ระบบล้มเหลวจาก IP: ${log.details.ip}, เหตุผล: ${log.details.reason || 'Unknown'}`
    case AuditAction.USER_LOGOUT:
      return `ออกจากระบบหลังใช้งานนาน: ${log.details.duration}`
    case AuditAction.PASSWORD_RESET:
      return `รีเซ็ตรหัสผ่านให้ User ID: ${log.targetId} ด้วยวิธี: ${log.details.method}`
    case AuditAction.ACCESS_DENIED:
      return `ถูกปฏิเสธการเข้าถึง Resource: ${log.targetId} จาก IP: ${log.details.ip}, เหตุผล: ${log.details.reason}`
    default:
      return JSON.stringify(log.details) || 'ไม่มีรายละเอียดเพิ่มเติม'
  }
}

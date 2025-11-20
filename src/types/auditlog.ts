// types/AuditLogTypes.ts

/**
 * AuditAction: ประเภทของกิจกรรมที่สำคัญด้านความปลอดภัยของ Dashboard
 */
export enum AuditAction {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  PASSWORD_RESET = 'PASSWORD_RESET',
  ACCESS_DENIED = 'ACCESS_DENIED',
}

/**
 * AuditLog: โครงสร้างข้อมูล Audit Log
 */
export interface AuditLog {
  id: number
  timestamp: string
  userId: string
  action: AuditAction
  targetId?: string
  details: Record<string, unknown>
}

/**
 * ACTION_DISPLAY_MAP: Mapping สำหรับการแสดงผลที่อ่านง่าย
 */
export const ACTION_DISPLAY_MAP: Record<AuditAction, string> = {
  [AuditAction.USER_LOGIN]: 'เข้าสู่ระบบ',
  [AuditAction.USER_LOGOUT]: 'ออกจากระบบ',
  [AuditAction.PASSWORD_RESET]: 'รีเซ็ตรหัสผ่าน',
  [AuditAction.ACCESS_DENIED]: 'ถูกปฏิเสธการเข้าถึง',
}

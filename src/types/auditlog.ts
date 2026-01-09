// types/AuditLogTypes.ts

/**
 * AuditAction: ประเภทของกิจกรรมที่สำคัญด้านความปลอดภัยของ Dashboard
 */
export enum AuditAction {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  PASSWORD_RESET = 'PASSWORD_RESET',
  ACCESS_DENIED = 'ACCESS_DENIED',
  // Action logs
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  FETCH = 'FETCH',
  OTHER = 'OTHER',
}

/**
 * AuditLog: โครงสร้างข้อมูล Audit Log
 */
export interface AuditLog {
  id: number | string
  timestamp: string
  userId: string
  action: AuditAction | string
  targetId?: string
  details: Record<string, any>
  ipAddress?: string
  userAgent?: string
  endpoint?: string
  resource?: string
}

/**
 * ACTION_DISPLAY_MAP: Mapping สำหรับการแสดงผลที่อ่านง่าย
 */
export const ACTION_DISPLAY_MAP: Record<AuditAction, string> = {
  [AuditAction.USER_LOGIN]: 'เข้าสู่ระบบ',
  [AuditAction.USER_LOGOUT]: 'ออกจากระบบ',
  [AuditAction.PASSWORD_RESET]: 'รีเซ็ตรหัสผ่าน',
  [AuditAction.ACCESS_DENIED]: 'ถูกปฏิเสธการเข้าถึง',
  [AuditAction.CREATE]: 'สร้างข้อมูล',
  [AuditAction.UPDATE]: 'แก้ไขข้อมูล',
  [AuditAction.DELETE]: 'ลบข้อมูล',
  [AuditAction.FETCH]: 'ดึงข้อมูล',
  [AuditAction.OTHER]: 'อื่นๆ',
}

/**
 * getAuditActionDisplay: แปลง Action เป็นชื่อที่เหมาะสมสำหรับการแสดงผล
 */
export const getAuditActionDisplay = (action: AuditAction | string): string => {
  if (action in ACTION_DISPLAY_MAP) {
    return ACTION_DISPLAY_MAP[action as AuditAction]
  }
  return String(action)
}

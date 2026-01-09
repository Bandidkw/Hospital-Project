import type { AuditLog } from '@/types/auditlog'
import { AuditAction } from '@/types/auditlog'
import apiService from '@/services/apiService'

/**
 * fetchAuditLogs: ดึงรายการ Audit Logs ทั้งจาก /logs/login และ /logs/action
 */
export const fetchAuditLogs = async (): Promise<AuditLog[]> => {
  try {
    const [loginLogsRes, actionLogsRes] = await Promise.all([
      apiService.get('/logs/login'),
      apiService.get('/logs/action'),
    ])

    const getResourceName = (resource?: string, endpoint?: string): string => {
      // ตรวจสอบจากฟิลด์ resource ตรงๆ ก่อน (ตามที่ user แจ้ง)
      if (resource) {
        const res = resource.toUpperCase()
        if (res === 'SETTINGS') return 'ตั้งค่าเว็บไซต์'
        if (res === 'NEWS') return 'จัดการข่าวสาร'
        if (res === 'USER' || res === 'USERS') return 'จัดการผู้ใช้'
        if (res === 'PERSONNEL') return 'โครงสร้างองค์กร'
        if (res === 'MOIT') return 'จัดการ ITA'
        if (res === 'QUARTER_DOCUMENT') return 'เอกสาร'
        if (res === 'COMPLAINT') return 'ส่วนการร้องเรียน'
      }

      if (!endpoint) return 'ทั่วไป'
      const path = endpoint.toLowerCase()
      if (path.includes('/login')) return 'ระบบเข้าสู่ระบบ'
      if (path.includes('/news')) return 'ข่าวสาร'
      if (path.includes('/settings')) return 'ตั้งค่าเว็บไซต์'
      if (path.includes('/users')) return 'จัดการผู้ใช้'
      if (path.includes('/ita')) return 'เอกสาร ITA'
      if (path.includes('/hospital') || path.includes('/history')) return 'ข้อมูลโรงพยาบาล'
      if (path.includes('/personnel')) return 'บุคลากร'
      if (path.includes('/complaint')) return 'ข้อร้องเรียน'
      if (path.includes('/opd')) return 'ระบบ OPD'
      return 'ระบบงาน'
    }

    const loginLogs: AuditLog[] = (loginLogsRes.data?.data?.logs || []).map((log: any) => ({
      id: `login-${log.id}`,
      timestamp: log.createdAt || log.timestamp,
      userId: log.username || log.userId || 'N/A',
      action: AuditAction.USER_LOGIN,
      resource: 'ระบบเข้าสู่ระบบ',
      details: {
        ip: log.ipAddress,
        userAgent: log.userAgent,
        status: log.status || 'SUCCESS',
        reason: log.message || log.reason,
      },
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
    }))

    const safeDetails = (details: any) => {
      if (typeof details === 'string') {
        try {
          return JSON.parse(details)
        } catch {
          return { raw: details }
        }
      }
      return details || {}
    }

    const actionLogs: AuditLog[] = (actionLogsRes.data?.data?.logs || []).map((log: any) => ({
      id: `action-${log.id}`,
      timestamp: log.createdAt || log.timestamp,
      userId: log.username || log.userId || 'N/A',
      action: log.action || AuditAction.OTHER,
      resource: getResourceName(log.resource, log.endpoint),
      targetId: log.targetId || log.resourceId,
      details: safeDetails(log.details),
      ipAddress: log.ipAddress,
      endpoint: log.endpoint,
    }))

    // รวมและเรียงลำดับตามเวลาล่าสุด
    return [...loginLogs, ...actionLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
  } catch (error) {
    console.error('Failed to fetch audit logs:', error)
    return []
  }
}

/**
 * formatLogDetails: ฟังก์ชันสำหรับแปลง Details Object ให้เป็น String ที่อ่านง่าย
 */
export const formatLogDetails = (log: AuditLog): string => {
  if (log.action === AuditAction.USER_LOGIN) {
    const status = log.details.status === 'SUCCESS' ? 'เข้าสู่ระบบสำเร็จ' : 'เข้าสู่ระบบล้มเหลว'
    const ip = log.details.ip || log.ipAddress || 'Unknown IP'
    return `${status} (IP: ${ip})`
  }

  // สร้างฟังก์ชันช่วยสำหรับแปลงค่าต่างๆ ให้เป็น string
  const formatValue = (val: any): string => {
    if (val === null || val === undefined) return '-'
    if (Array.isArray(val)) {
      if (val.length === 0) return '[]'
      // ถ้าเป็น array ของตัวเลขยาวๆ อาจจะเป็น ID หรือ Buffer
      return `[${val.map((v) => (typeof v === 'object' ? JSON.stringify(v) : v)).join(', ')}]`
    }
    if (typeof val === 'object') {
      try {
        return JSON.stringify(val)
      } catch {
        return '[Object]'
      }
    }
    return String(val)
  }

  // รวมข้อมูลพื้นฐานถ้ามี
  let baseInfo = ''
  if (log.endpoint) baseInfo += `Endpoint: ${log.endpoint}`

  // ดึงข้อมูลจาก details
  const detailsParts = Object.entries(log.details || {})
    // กรองฟิลด์ที่ซ้ำกับข้อมูลหลักออกเพื่อให้ตารางไม่รก
    .filter(([key]) => !['status', 'ip', 'reason', 'endpoint', 'targetId', 'id'].includes(key))
    .map(([key, value]) => `${key}: ${formatValue(value)}`)

  const detailsStr = detailsParts.join(', ')

  if (baseInfo && detailsStr) return `${baseInfo} (${detailsStr})`
  return baseInfo || detailsStr || 'ไม่มีรายละเอียดเพิ่มเติม'
}

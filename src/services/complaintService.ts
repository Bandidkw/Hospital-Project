// complaintService.ts

import apiService from '@/services/apiService'
import type {
  ComplaintItem,
  ComplaintApiResponse,
  ComplaintStatus,
  ComplaintUpdatePayload,
  RawComplaintApiItem,
  ComplaintFormData,
} from '@/types/complaint'

const BASE_URL = '/complaint'

/**
 * Helper function: เปลี่ยน Parameter ให้รับ RawComplaintApiItem
 */
function mapToComplaintItem(apiItem: RawComplaintApiItem): ComplaintItem {
  // ⬅️ แทนที่ 'any'
  return {
    id: apiItem.id,
    code: apiItem.complaintCode,
    subject: apiItem.subject,
    description: apiItem.description,
    status: apiItem.status.toLowerCase() as ComplaintStatus,
    complainantName: apiItem.fullName,
    contactInfo: apiItem.contactInfo,
    createdAt: apiItem.createdAt,
    updatedAt: apiItem.updatedAt,
    resolutionDetail: apiItem.resolutionDetail ?? undefined,
  }
}

/**
 * ส่งข้อร้องเรียนใหม่
 * @param payload ข้อมูลข้อร้องเรียนที่ต้องการสร้าง (ComplaintFormData)
 * @returns ข้อมูลข้อร้องเรียนที่ถูกสร้างขึ้น (ComplaintItem)
 */
export async function createComplaint(payload: ComplaintFormData): Promise<ComplaintItem> {
  const response = await apiService.post<ComplaintApiResponse<RawComplaintApiItem>>(
    `${BASE_URL}`,
    payload,
  )
  return mapToComplaintItem(response.data.data)
}

/**
 * ดึงข้อมูลข้อร้องเรียนทั้งหมด
 */
export async function getAllComplaints(): Promise<ComplaintItem[]> {
  // ⬅️ แทนที่ any[] ด้วย RawComplaintApiItem[]
  const response = await apiService.get<ComplaintApiResponse<RawComplaintApiItem[]>>(BASE_URL)
  const rawData = response.data.data
  return rawData.map(mapToComplaintItem)
}

/**
 * ดึงข้อมูลข้อร้องเรียนตาม ID
 */
export async function getComplaintById(id: string): Promise<ComplaintItem> {
  // ⬅️ แทนที่ any ด้วย RawComplaintApiItem
  const response = await apiService.get<ComplaintApiResponse<RawComplaintApiItem>>(
    `${BASE_URL}/${id}`,
  )
  return mapToComplaintItem(response.data.data)
}

/**
 * ดึงข้อมูลข้อร้องเรียนตามรหัส (Code)
 */
export async function getComplaintByCode(code: string): Promise<ComplaintItem> {
  // ⬅️ แทนที่ any ด้วย RawComplaintApiItem
  const response = await apiService.get<ComplaintApiResponse<RawComplaintApiItem>>(
    `${BASE_URL}/code/${code}`,
  )
  return mapToComplaintItem(response.data.data)
}

/**
 * อัปเดตสถานะหรือรายละเอียดการแก้ไขข้อร้องเรียน (PATCH Update)
 */
export async function updateComplaint(
  id: string,
  payload: ComplaintUpdatePayload,
): Promise<ComplaintItem> {
  // ⬅️ แทนที่ any ด้วย RawComplaintApiItem
  const response = await apiService.patch<ComplaintApiResponse<RawComplaintApiItem>>(
    `${BASE_URL}/${id}`,
    payload,
  )
  return mapToComplaintItem(response.data.data)
}

/**
 * ลบข้อร้องเรียน (DELETE)
 */
export async function deleteComplaint(id: string): Promise<void> {
  await apiService.delete(`${BASE_URL}/${id}`)
}

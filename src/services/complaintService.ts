// ใน src/services/complaintService.ts

import apiService from '@/services/apiService'
import type { ComplaintItem, ComplaintCreationData } from '@/types/complaint'

const COMPLAINT_URL = '/complaints'

export async function getComplaintList(): Promise<ComplaintItem[]> {
  const response = await apiService.get(COMPLAINT_URL)
  return response.data.data as ComplaintItem[]
}

export async function updateComplaintStatus(
  id: string,
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED',
): Promise<void> {
  await apiService.patch(`${COMPLAINT_URL}/${id}/status`, { status })
}

export async function deleteComplaintApi(id: string): Promise<void> {
  await apiService.delete(`${COMPLAINT_URL}/${id}`)
}

// 4. สร้างข้อร้องเรียน (สำหรับ Public View)
export async function createComplaint(data: ComplaintCreationData): Promise<void> {
  // 💡 ไม่จำเป็นต้องใช้ FormData เพราะไม่มีการอัปโหลดไฟล์
  await apiService.post(COMPLAINT_URL, data)
}

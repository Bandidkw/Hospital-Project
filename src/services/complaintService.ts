// ใน src/services/complaintService.ts (ฉบับปรับปรุงพร้อม Mockup/Fallback)

import apiService from '@/services/apiService'
import type { ComplaintItem, ComplaintCreationData, ComplaintStatus } from '@/types/complaint'

const COMPLAINT_URL = '/complaints'

// =========================================================
// 💡 MOCK DATA (ใช้สำหรับ Fallback และการจำลอง)
// =========================================================

const mockComplaints: ComplaintItem[] = [
  {
    id: 'C001',
    subject: 'พฤติกรรม/การบริการของบุคลากร',
    detail: 'พยาบาลแผนก OPD พูดจาไม่สุภาพในขณะที่ฉันถามคำถามเกี่ยวกับการเบิกจ่ายยา',
    reporterName: 'นายประสงค์ ดีงาม',
    reporterContact: '098-XXX-1234',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 วันที่แล้ว
    adminNotes: '',
  },
  {
    id: 'C002',
    subject: 'การรอคอย/ความล่าช้าในการรับบริการ',
    detail: 'ต้องรอพบแพทย์นานกว่า 3 ชั่วโมง ทั้งที่ได้ทำการนัดหมายล่วงหน้าแล้ว',
    reporterName: 'ไม่ประสงค์ออกนาม',
    reporterContact: 'test@mail.com',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 วันที่แล้ว
    adminNotes: 'ติดต่อผู้แจ้งแล้ว อยู่ระหว่างการสอบสวนข้อเท็จจริง',
  },
  {
    id: 'C003',
    subject: 'ความสะอาด/สุขอนามัยของสถานที่',
    detail: 'ห้องน้ำชั้น 2 มีกลิ่นเหม็นและพบขยะตกค้าง ควรปรับปรุงความสะอาดเร่งด่วน',
    reporterName: 'นางสาวสุขใจ',
    reporterContact: '081-XXX-5678',
    status: 'RESOLVED',
    createdAt: new Date(Date.now() - 604800000).toISOString(), // 7 วันที่แล้ว
    adminNotes: 'แก้ไขแล้ว: ทำความสะอาดใหญ่และเพิ่มรอบเวร',
  },
]

/**
 * 1. ดึงรายการข้อร้องเรียน (พร้อม Fallback)
 * 🟢 ลองใช้ API จริงก่อน และ Fallback ไปใช้ Mockup เมื่อเกิดข้อผิดพลาด
 */
export async function getComplaintList(): Promise<ComplaintItem[]> {
  try {
    // 🟢 ลองเรียก API จริง
    const response = await apiService.get(COMPLAINT_URL)
    // 💡 สมมติว่า API คืนค่าเป็น { data: { data: [...] } }
    if (response.data?.data) {
      return response.data.data as ComplaintItem[]
    }
    console.warn('API returned success status but data was empty. Using mock data as fallback.')
    return mockComplaints
  } catch (error) {
    // 🔴 หากเกิด Error ใช้วิธี Fallback
    console.error('API Error: Failed to fetch complaint list. Using mock data as fallback.', error)
    return mockComplaints
  }
}

/**
 * 2. อัปเดตสถานะและบันทึกของข้อร้องเรียน
 * 💡 ฟังก์ชันนี้ถูกปรับให้รองรับ adminNotes และสถานะ 'CLOSED'
 */
export async function updateComplaintStatus(
  id: string,
  status: ComplaintStatus, // ใช้ ComplaintStatus ที่รวม 'CLOSED'
  adminNotes: string, // รับ adminNotes เข้ามาด้วย
): Promise<void> {
  const data = { status, adminNotes } // รวม adminNotes เข้าไปใน Payload

  // 🟢 Mockup Logic: จำลองการอัปเดตใน Mock Data
  const complaint = mockComplaints.find((c) => c.id === id)
  if (complaint) {
    complaint.status = status
    complaint.adminNotes = adminNotes
    console.log(`Mock Update Complaint ${id}:`, data)
    return new Promise((resolve) => setTimeout(resolve, 300))
  }

  // 💡 API จริง (เมื่อเปิดใช้งาน)
  // await apiService.patch(`${COMPLAINT_URL}/${id}/status`, data)
}

/**
 * 3. ลบข้อร้องเรียน (ใช้ใน Dashboard)
 */
export async function deleteComplaintApi(id: string): Promise<void> {
  // 🟢 Mockup Logic: จำลองการลบใน Mock Data
  const index = mockComplaints.findIndex((c) => c.id === id)
  if (index !== -1) {
    mockComplaints.splice(index, 1)
    console.log(`Mock Delete Complaint ${id}`)
    return new Promise((resolve) => setTimeout(resolve, 300))
  }

  // 💡 API จริง (เมื่อเปิดใช้งาน)
  // await apiService.delete(`${COMPLAINT_URL}/${id}`)
}

/**
 * 4. สร้างข้อร้องเรียน (สำหรับ Public View)
 */
export async function createComplaint(data: ComplaintCreationData): Promise<void> {
  // 🟢 Mockup Logic: จำลองการสร้าง
  const newComplaint: ComplaintItem = {
    ...data,
    id: 'C' + (mockComplaints.length + 1).toString().padStart(3, '0'),
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    adminNotes: '',
  }
  mockComplaints.unshift(newComplaint) // เพิ่มรายการใหม่ไว้ด้านหน้า
  console.log('Mock Complaint Created (Public Form):', newComplaint)

  return new Promise((resolve) => setTimeout(resolve, 800))

  // 💡 API จริง (เมื่อเปิดใช้งาน)
  // await apiService.post(COMPLAINT_URL, data)
}

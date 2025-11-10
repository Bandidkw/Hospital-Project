// ใน src/types/vision.ts

export interface VisionData {
  id: number
  vision: string // วิสัยทัศน์ (ข้อความสั้นๆ)
  missionHtml: string // พันธกิจ (ใช้ HTML เพื่อรองรับ List/Formatting)
  coreValuesHtml: string // ค่านิยม (ใช้ HTML เพื่อรองรับ List/Formatting)
}

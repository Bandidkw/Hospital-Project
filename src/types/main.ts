export interface ActivityLog {
  id: number | string
  user_name: string
  action_type: 'CREATE' | 'UPDATE' | 'DELETE'
  target_type: string // เช่น "ข่าวสาร", "เอกสาร ITA"
  target_name?: string //(ชื่อของสิ่งที่ถูกกระทำ)
  details?: string // เก็บรายละเอียดอื่นๆ
  createdAt: string
}

// src/types/personnel.ts

export interface RawPersonnelItem {
  id: string
  name: string
  position: string | null
  specialty: string | null
  imageUrl: string | null
  tel: string | null
  isDirector: boolean
}

export interface PersonnelItem {
  id: string
  name: string
  position: string
  specialty?: string
  imageUrl?: string | null
  tel?: string
  isDirector: boolean
}

export interface PersonnelCreateUpdateData {
  name: string
  position: string
  specialty?: string
  tel?: string
  // 🟢 เพิ่ม File เข้ามาเพื่อรองรับการส่งรูปภาพ
  imageFile?: File | null
  isDirector: boolean
}

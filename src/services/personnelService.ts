// src/services/personnelService.ts

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import apiService, { isAxiosError } from '@/services/apiService'
import type { PersonnelItem, RawPersonnelItem, PersonnelCreateUpdateData } from '@/types/personnel'

// Mock Data สำหรับส่วน Public
const MOCK_PUBLIC_DATA: PersonnelItem[] = [
  {
    id: 'd0',
    name: 'กานต์สินี ศุทธวัฒน์พงษ์',
    position: 'นายแพทย์ชำนาญการ',
    specialty: 'รักษาการในตำแหน่ง ผู้อำนวยการ',
    imageUrl: 'https://placehold.co/150x150/f0f0f0/333333?text=Director',
    tel: '100',
    isDirector: true,
  },
  {
    id: 'd1',
    name: 'อัญมณี สีลอ',
    position: 'นักจัดการงานทั่วไปปฏิบัติการ',
    specialty: 'หัวหน้ากลุ่มบริหารทั่วไป',
    imageUrl: 'https://placehold.co/100x100/f0f0f0/333333?text=Doc1',
    tel: '145',
    isDirector: false,
  },
  {
    id: 'd2',
    name: 'ไชยา บุญสู',
    position: 'พยาบาลวิชาชีพชํานาญการ',
    specialty: 'หัวหน้างานประกันสุขภาพ',
    imageUrl: 'https://placehold.co/100x100/f0f0f0/333333?text=Doc2',
    tel: '333',
    isDirector: false,
  },
]

// Mock Data สำหรับส่วน Admin (มีไว้สำหรับกรณี API ล้มเหลวเท่านั้น)
const MOCK_ADMIN_DATA: PersonnelItem[] = [
  {
    id: 'a1',
    name: 'กานต์สินี ศุทธวัฒน์พงษ์',
    position: 'นายแพทย์ชำนาญการ',
    specialty: 'รักษาการผู้อำนวยการ',
    imageUrl: 'https://placehold.co/100x100/e0e0e0/333333?text=Dir',
    tel: '100',
    isDirector: true,
  },
  {
    id: 'a2',
    name: 'อัญมณี สีลอ',
    position: 'นักจัดการงานทั่วไปปฏิบัติการ',
    specialty: 'หัวหน้ากลุ่มบริหารทั่วไป',
    imageUrl: 'https://placehold.co/100x100/e0e0e0/333333?text=Adm1',
    tel: '145',
    isDirector: false,
  },
  {
    id: 'a3',
    name: 'ไชยา บุญสู',
    position: 'พยาบาลวิชาชีพชํานาญการ',
    specialty: 'หัวหน้างานประกันสุขภาพ',
    imageUrl: 'https://placehold.co/100x100/e0e0e0/333333?text=Adm2',
    tel: '333',
    isDirector: false,
  },
]

// ----------------------------------------------------------------------
// 🟢 Helper Function: Build Asset URL
// ----------------------------------------------------------------------

function buildAssetUrl(u?: string | null): string {
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u

  const fromEnv = (import.meta.env.VITE_API_BASE_URL || '').trim()
  const fromAxios = (apiService.defaults.baseURL || '').trim()
  let base = fromEnv || fromAxios
  if (!base && typeof window !== 'undefined') base = window.location.origin

  const root = base.replace(/\/+$/, '')
  const path = String(u).replace(/^\/+/, '')

  // ไม่ encode URL เพราะ backend ต้องการชื่อไฟล์ตามที่เป็นอยู่
  return `${root}/${path}`
}

// ----------------------------------------------------------------------
// 🟢 Helper Function: Map Raw Data to PersonnelItem
// ----------------------------------------------------------------------

function mapRawToPersonnel(rawList: RawPersonnelItem[]): PersonnelItem[] {
  return rawList.map((item) => {
    const isDirectorValue = item.isDirector

    return {
      id: item.id,
      name: item.name,
      position: item.position || 'ไม่ระบุตำแหน่ง',
      specialty: item.specialty || undefined,
      imageUrl: buildAssetUrl(item.imageUrl),
      tel: item.tel || undefined,
      isDirector: isDirectorValue,
    }
  })
}

// ----------------------------------------------------------------------
// 🟢 Public API: สำหรับ PersonnelView.vue
// ----------------------------------------------------------------------

export async function getPublicPersonnelList(): Promise<PersonnelItem[]> {
  try {
    const response = await apiService.get('/personnel')
    const rawData = (response.data.data || []) as RawPersonnelItem[]
    return mapRawToPersonnel(rawData)
  } catch (error) {
    console.error('Failed to fetch public personnel list:', error)
    return MOCK_PUBLIC_DATA
  }
}

// ----------------------------------------------------------------------
// 🟢 SuperAdmin API (CRUD): DashboardPersonnelView.vue
// ----------------------------------------------------------------------

// READ (Read All for Admin)
export async function getAdminPersonnelList(): Promise<PersonnelItem[]> {
  try {
    const response = await apiService.get('/personnel/all')
    const rawData = (response.data.data || []) as RawPersonnelItem[]
    return mapRawToPersonnel(rawData)
  } catch (error) {
    console.error('Failed to fetch admin personnel list:', error)
    return MOCK_ADMIN_DATA
  }
}

// ----------------------------------------------------------------------
// 🟢 CREATE
// ----------------------------------------------------------------------

export async function createPersonnel(data: PersonnelCreateUpdateData): Promise<PersonnelItem> {
  const formData = new FormData()

  formData.append('name', data.name)
  formData.append('position', data.position)
  if (data.specialty) {
    formData.append('specialty', data.specialty)
  }
  if (data.tel) {
    formData.append('tel', data.tel)
  }
  if (data.imageFile) {
    formData.append('file', data.imageFile, data.imageFile.name)
  }
  formData.append('isDirector', String(data.isDirector))

  const response = await apiService.post('/personnel', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data.data as PersonnelItem
}

// ----------------------------------------------------------------------
// 🟡 UPDATE
// ----------------------------------------------------------------------

export async function updatePersonnel(
  id: string,
  data: PersonnelCreateUpdateData,
): Promise<PersonnelItem> {
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('position', data.position)
  formData.append('isDirector', String(data.isDirector))

  if (data.specialty) {
    formData.append('specialty', data.specialty)
  }
  if (data.tel) {
    formData.append('tel', data.tel)
  }
  if (data.imageFile) {
    formData.append('file', data.imageFile, data.imageFile.name)
  }
  const response = await apiService.patch(`/personnel/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data.data as PersonnelItem
}

// ----------------------------------------------------------------------
// 🔴 DELETE
// ----------------------------------------------------------------------

export async function deletePersonnel(id: string): Promise<void> {
  await apiService.delete(`/personnel/${id}`)
}

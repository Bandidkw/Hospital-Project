// src/services/itaService.ts
import apiService from './apiService'
import type { YearIta, Moit, ItaDocument } from '@/types/ita'

/* ---------------------------------- Utils --------------------------------- */

/** อ่าน BASE URL ของ API แล้วแปลงเป็น absolute URL ให้ไฟล์ */
// ==== เพิ่ม/แก้ที่ด้านบนไฟล์ (ร่วมกับของเดิม) ====
type EnvShape = { env: { VITE_API_BASE_URL?: string } }
const API_BASE: string = ((import.meta as unknown as EnvShape).env.VITE_API_BASE_URL ?? '').replace(
  /\/$/,
  '',
)

const toAbsoluteUrl = (u?: string): string => {
  if (!u) return ''
  return /^https?:\/\//i.test(u) ? u : `${API_BASE}/${u.replace(/^\//, '')}`
}

function ensureId(name: string, v: unknown): void {
  if (v === undefined || v === null || v === '') throw new Error(`${name} is required`)
}

type ApiOk<T> = { data?: { data?: T; description?: string } }
function unwrap<T>(res: unknown, fallbackMsg: string): T {
  const obj = res as ApiOk<T>
  if (obj?.data && 'data' in obj.data!) return obj.data!.data as T
  throw new Error(obj?.data?.description || fallbackMsg)
}

// รองรับ doc ที่มี moit ซ้อนมาด้วย
function normalizeDoc(raw: unknown): ItaDocument {
  const r = raw as Record<string, unknown>
  const rawUrl =
    (r.fileUrl as string | undefined) ??
    (r.file_url as string | undefined) ??
    (r.filePath as string | undefined) ??
    (r.file_path as string | undefined) ??
    ''
  return {
    id: String(r.id ?? ''),
    moit_id: r.moit_id ? String(r.moit_id) : undefined,
    topic_id: r.topic_id ? String(r.topic_id) : undefined,
    title: String(r.title ?? ''),
    description:
      r.description === undefined || r.description === null ? undefined : String(r.description),
    sub_topic: String(r.sub_topic ?? ''),
    quarter: r.quarter === undefined || r.quarter === null ? undefined : String(r.quarter),
    fileName: (r.fileName as string | undefined) ?? (r.file_name as string | undefined),
    fileUrl: toAbsoluteUrl(rawUrl),
    createdAt: r.createdAt ? String(r.createdAt) : undefined,
    updatedAt: r.updatedAt ? String(r.updatedAt) : undefined,
  }
}

/* --------------------------------- Service -------------------------------- */

export const itaService = {
  /* ------------------------------- Year (ITA) ------------------------------ */

  async getYears(): Promise<YearIta[]> {
    try {
      const res = await apiService.get('/ita/year-moit')
      return unwrap<YearIta[]>(res, 'ไม่สามารถดึงข้อมูลปีงบประมาณได้')
    } catch (e: unknown) {
      console.error('getYears error:', e)
      throw new Error('ไม่สามารถดึงข้อมูลปีงบประมาณได้')
    }
  },

  async createYear(payload: {
    year: string
    title: string
    description: string
  }): Promise<YearIta> {
    try {
      const res = await apiService.post('/ita/year-moit', payload)
      return unwrap<YearIta>(res, 'ไม่สามารถสร้างปีงบประมาณใหม่ได้')
    } catch (e: unknown) {
      console.error('createYear error:', e)
      throw new Error('ไม่สามารถสร้างปีงบประมาณใหม่ได้')
    }
  },

  async getYearById(yearId: string | number): Promise<YearIta> {
    ensureId('yearId', yearId)
    try {
      const res = await apiService.get(`/ita/year-moit/${encodeURIComponent(String(yearId))}`)
      return unwrap<YearIta>(res, 'ไม่สามารถดึงข้อมูลปีที่เลือกได้')
    } catch (e: unknown) {
      console.error('getYearById error:', e)
      throw new Error('ไม่สามารถดึงข้อมูลปีที่เลือกได้')
    }
  },

  async updateYear(
    yearId: string | number,
    payload: { title: string; description: string },
  ): Promise<YearIta> {
    ensureId('yearId', yearId)
    try {
      const res = await apiService.put(
        `/ita/year-moit/${encodeURIComponent(String(yearId))}`,
        payload,
      )
      return unwrap<YearIta>(res, 'ไม่สามารถอัปเดตข้อมูลปีงบประมาณได้')
    } catch (e: unknown) {
      console.error('updateYear error:', e)
      throw new Error('ไม่สามารถอัปเดตข้อมูลปีงบประมาณได้')
    }
  },

  async deleteYear(yearId: string | number): Promise<void> {
    ensureId('yearId', yearId)
    try {
      await apiService.delete(`/ita/year-moit/${encodeURIComponent(String(yearId))}`)
    } catch (e: unknown) {
      console.error('deleteYear error:', e)
      throw new Error('ไม่สามารถลบปีงบประมาณได้')
    }
  },

  /* --------------------------------- MOIT --------------------------------- */

  async getAllTopics(): Promise<YearIta[]> {
    try {
      const res = await apiService.get('/user/year-moit')
      return unwrap<YearIta[]>(res, 'ไม่สามารถดึงข้อมูล ITA ทั้งหมดได้')
    } catch (e: unknown) {
      console.error('getAllTopics error:', e)
      throw new Error('ไม่สามารถดึงข้อมูล ITA ทั้งหมดได้')
    }
  },

  /** /moit/year/:moitId */
  async getMoitById(moitId: string | number): Promise<Moit> {
    ensureId('moitId', moitId)
    try {
      const res = await apiService.get(`/moit/year/${encodeURIComponent(String(moitId))}`)
      return unwrap<Moit>(res, 'ไม่สามารถดึงข้อมูลหัวข้อได้')
    } catch (e: unknown) {
      console.error('getMoitById error:', e)
      throw new Error('ไม่สามารถดึงข้อมูลหัวข้อได้')
    }
  },

  async createTopic(payload: {
    year_ita_id: string | number
    moit_name: string
    title: string
    description: string
  }): Promise<Moit> {
    try {
      const res = await apiService.post('/moit', payload)
      return unwrap<Moit>(res, 'ไม่สามารถสร้างหัวข้อใหม่ได้')
    } catch (e: unknown) {
      console.error('createTopic error:', e)
      throw new Error('ไม่สามารถสร้างหัวข้อใหม่ได้')
    }
  },

  async updateTopic(
    topicId: string | number,
    payload: { title: string; description: string; moit_name: string },
  ): Promise<Moit> {
    ensureId('topicId', topicId)
    try {
      const res = await apiService.put(`/moit/${encodeURIComponent(String(topicId))}`, payload)
      return unwrap<Moit>(res, 'ไม่สามารถอัปเดตข้อมูลหัวข้อได้')
    } catch (e: unknown) {
      console.error('updateTopic error:', e)
      throw new Error('ไม่สามารถอัปเดตข้อมูลหัวข้อได้')
    }
  },

  async deleteTopic(topicId: string | number): Promise<void> {
    ensureId('topicId', topicId)
    try {
      await apiService.delete(`/moit/${encodeURIComponent(String(topicId))}`)
    } catch (e: unknown) {
      console.error('deleteTopic error:', e)
      throw new Error('ไม่สามารถลบหัวข้อได้')
    }
  },

  /* ------------------------------- Documents ------------------------------- */
  // หมายเหตุ: ปรับ path ให้ตรงกับ backend ของคุณแล้ว:
  // - GET   /document/all
  // - GET   /documents?moit_id=...
  // - GET   /document/detail/:id
  // - POST  /document/create
  // - PUT   /document/update/:id
  // - DELETE/document/delete/:id

  async getDocumentsByMoitId(moitId: string | number): Promise<ItaDocument[]> {
    ensureId('moitId', moitId)
    try {
      // ✅ ใช้เส้นที่มีจริง
      const res = await apiService.get('/document/all')

      // payload อาจเป็น array ตรง ๆ หรืออยู่ใน fields ยอดนิยม
      const payload = unwrap<unknown>(res, 'ไม่สามารถดึงรายการเอกสารทั้งหมดได้')

      const toArray = (v: unknown): unknown[] => {
        if (Array.isArray(v)) return v
        if (v && typeof v === 'object') {
          const o = v as Record<string, unknown>
          if (Array.isArray(o.items)) return o.items as unknown[]
          if (Array.isArray(o.rows)) return o.rows as unknown[]
          if (Array.isArray(o.data)) return o.data as unknown[]
          if (Array.isArray(o.results)) return o.results as unknown[]
        }
        return []
      }

      const allRaw = toArray(payload)
      const allDocs = allRaw.map(normalizeDoc)
      const target = String(moitId)

      // ✅ กรองตาม moit_id ของหัวข้อปัจจุบัน
      return allDocs.filter((d) => d.moit_id === target)
    } catch (e: unknown) {
      console.error('getDocumentsByMoitId (filter frontend) error:', e)
      throw new Error('ไม่สามารถดึงรายการเอกสารของหัวข้อนี้ได้')
    }
  },
  /** ดึงเอกสารเดี่ยว (ตาม response ที่ให้มา) */
  async getDocumentById(docId: string | number): Promise<ItaDocument> {
    ensureId('docId', docId)
    try {
      const res = await apiService.get(`/document/detail/${encodeURIComponent(String(docId))}`)
      const raw = unwrap<unknown>(res, 'ไม่สามารถดึงข้อมูลเอกสารได้')
      return normalizeDoc(raw)
    } catch (e: unknown) {
      console.error('getDocumentById error:', e)
      throw new Error('ไม่สามารถดึงข้อมูลเอกสารได้')
    }
  },
  /** สร้างเอกสารใหม่ (อัปโหลดไฟล์) */
  async createDocument(moitId: string | number, formData: FormData): Promise<ItaDocument> {
    ensureId('moitId', moitId)
    try {
      formData.set('moit_id', String(moitId))
      // quarter เป็น string เสมอ
      const q = formData.get('quarter')
      formData.set('quarter', String(q ?? ''))
      // description optional → ลบออกถ้าไม่มี
      const desc = formData.get('description')
      if (desc == null || desc === '') formData.delete('description')

      const res = await apiService.post('/document/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const raw = unwrap<unknown>(res, 'ไม่สามารถเพิ่มเอกสารใหม่ได้')
      return normalizeDoc(raw)
    } catch (e: unknown) {
      console.error('createDocument error:', e)
      throw new Error('ไม่สามารถเพิ่มเอกสารใหม่ได้')
    }
  },
  /** แก้ไขเอกสาร */
  async updateDocument(docId: string | number, formData: FormData): Promise<ItaDocument> {
    ensureId('docId', docId)
    try {
      // quarter เป็น string ถ้าส่งมา
      const q = formData.get('quarter')
      if (q != null) formData.set('quarter', String(q))
      // description optional
      const desc = formData.get('description')
      if (desc == null || desc === '') formData.delete('description')

      const res = await apiService.put(
        `/document/update/${encodeURIComponent(String(docId))}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      const raw = unwrap<unknown>(res, 'ไม่สามารถบันทึกการแก้ไขเอกสารได้')
      return normalizeDoc(raw)
    } catch (e: unknown) {
      console.error('updateDocument error:', e)
      throw new Error('ไม่สามารถบันทึกการแก้ไขเอกสารได้')
    }
  },
  /** ลบเอกสาร */
  async deleteDocument(docId: string | number): Promise<void> {
    ensureId('docId', docId)
    try {
      await apiService.delete(`/document/delete/${encodeURIComponent(String(docId))}`)
    } catch (e: unknown) {
      console.error('deleteDocument error:', e)
      throw new Error('ไม่สามารถลบเอกสารได้')
    }
  },
}

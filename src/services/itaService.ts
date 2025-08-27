// src/services/itaService.ts
import apiService from './apiService'
import type { YearIta, Moit, ItaDocument } from '@/types/ita'

/**
 * YearIta (ย่อ) สำหรับใช้ใน Moit ตาม response จริง
 * เก็บ year เป็น string เพื่อรองรับปี พ.ศ. เช่น "2567"
 */
export type YearItaLite = {
  id?: string
  year: string
  title?: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * รูปร่างข้อมูลที่ View ใช้งานหลัง normalize แล้ว
 */
export type MoitWithYear = Moit & {
  year_ita: YearItaLite | null
  documents: ItaDocument[]
}

/**
 * รูปร่างดิบของ year_ita ที่ backend อาจส่งมา
 */
type RawYearIta =
  | ({ year: number | string } & Partial<YearItaLite>)
  | number
  | string
  | null
  | undefined

/**
 * รูปร่างดิบของ Moit ที่ backend อาจส่งมา
 */
type RawMoitWithYear = Moit & {
  year_ita?: RawYearIta
  documents?: ItaDocument[] | null
}

/**
 * Type เฉพาะ object ที่รับรองว่ามี year (ใช้กับ type guard)
 */
type RawYearItaObj = {
  year: number | string
  id?: string
  title?: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * Type guard: ตรวจว่า v เป็น object และมีฟิลด์ year
 */
function hasYearField(v: unknown): v is RawYearItaObj {
  return typeof v === 'object' && v !== null && 'year' in (v as Record<string, unknown>)
}

/**
 * แปลง year_ita ดิบให้เป็น YearItaLite | null
 */
function normalizeYearIta(yi: RawYearIta): YearItaLite | null {
  if (yi === null || yi === undefined) return null

  // เคส object (มี year แน่นอน)
  if (hasYearField(yi)) {
    return {
      id: 'id' in yi ? yi.id : undefined,
      year: String(yi.year),
      title: 'title' in yi ? yi.title : undefined,
      description: 'description' in yi ? yi.description : undefined,
      createdAt: 'createdAt' in yi ? yi.createdAt : undefined,
      updatedAt: 'updatedAt' in yi ? yi.updatedAt : undefined,
    }
  }

  // เคส backend ส่ง year เป็น number/string ตรง ๆ
  if (typeof yi === 'number' || typeof yi === 'string') {
    return { year: String(yi) }
  }

  return null
}

/**
 * แปลง RawMoitWithYear ให้เป็น MoitWithYear (documents เป็น array เสมอ)
 */
function normalizeMoitWithYear(raw: RawMoitWithYear): MoitWithYear {
  return {
    ...raw,
    year_ita: normalizeYearIta(raw.year_ita),
    documents: Array.isArray(raw.documents) ? raw.documents : [],
  }
}

export const itaService = {
  // --- 1) Year (ตารางปี ITA ระดับระบบ) ---
  async getYears(): Promise<YearIta[]> {
    try {
      const response = await apiService.get('/ita/year-moit')
      return response.data.data as YearIta[]
    } catch (error) {
      console.error('Error fetching ITA years:', error)
      throw new Error('ไม่สามารถดึงข้อมูลปีงบประมาณได้')
    }
  },

  async createYear(yearData: {
    year: string
    title: string
    description: string
  }): Promise<YearIta> {
    try {
      const response = await apiService.post('/ita/year-moit', yearData)
      return response.data.data as YearIta
    } catch (error) {
      console.error('Error creating ITA year:', error)
      throw new Error('ไม่สามารถสร้างปีงบประมาณใหม่ได้')
    }
  },

  async getTopicsByYearId(yearId: string | number): Promise<YearIta> {
    try {
      const response = await apiService.get(`/ita/year-moit/${yearId}`)
      return response.data.data as YearIta
    } catch (error) {
      console.error(`Error fetching topics for year ID ${yearId}:`, error)
      throw new Error('ไม่สามารถดึงข้อมูลหัวข้อสำหรับปีที่เลือกได้')
    }
  },

  async updateYear(
    yearId: string | number,
    yearData: { title: string; description: string },
  ): Promise<YearIta> {
    try {
      const response = await apiService.put(`/ita/year-moit/${yearId}`, yearData)
      return response.data.data as YearIta
    } catch (error) {
      console.error(`Error updating ITA year with ID ${yearId}:`, error)
      throw new Error('ไม่สามารถอัปเดตข้อมูลปีงบประมาณได้')
    }
  },

  async deleteYear(yearId: string | number): Promise<void> {
    try {
      await apiService.delete(`/ita/year-moit/${yearId}`)
    } catch (error) {
      console.error(`Error deleting ITA year with ID ${yearId}:`, error)
      throw new Error('ไม่สามารถลบปีงบประมาณได้')
    }
  },

  // --- 2) Topic (MOIT) ---
  async getAllTopics(): Promise<YearIta[]> {
    try {
      const response = await apiService.get('/user/year-moit')
      return response.data.data as YearIta[]
    } catch (error) {
      console.error('Error fetching all ITA data:', error)
      throw new Error('ไม่สามารถดึงข้อมูล ITA ทั้งหมดได้')
    }
  },

  /**
   * คืนข้อมูลหัวข้อ + ปี (normalize แล้ว)
   * หมายเหตุ: endpoint /moit/year/:id ตามที่คุณใช้อยู่
   */
  async getTopicById(topicOrYearId: string | number): Promise<MoitWithYear> {
    try {
      const response = await apiService.get(`/moit/year/${topicOrYearId}`)
      const raw = response.data.data as RawMoitWithYear
      return normalizeMoitWithYear(raw)
    } catch (error) {
      console.error(`Error fetching topics for year ID ${topicOrYearId}:`, error)
      throw new Error('ไม่สามารถดึงข้อมูลหัวข้อสำหรับปีที่เลือกได้')
    }
  },

  async createTopic(topicData: {
    year_ita_id: string | number
    moit_name: string
    title: string
    description: string
  }): Promise<Moit> {
    try {
      const response = await apiService.post('/moit', topicData)
      return response.data.data as Moit
    } catch (error) {
      console.error('Error creating ITA topic:', error)
      throw new Error('ไม่สามารถสร้างหัวข้อใหม่ได้')
    }
  },

  async updateTopic(
    topicId: string | number,
    topicData: { title: string; description: string; moit_name: string },
  ): Promise<Moit> {
    try {
      const response = await apiService.put(`/moit/${topicId}`, topicData)
      return response.data.data as Moit
    } catch (error) {
      console.error(`Error updating ITA topic with ID ${topicId}:`, error)
      throw new Error('ไม่สามารถอัปเดตข้อมูลหัวข้อได้')
    }
  },

  async deleteTopic(topicId: string | number): Promise<void> {
    try {
      await apiService.delete(`/moit/${topicId}`)
    } catch (error) {
      console.error(`Error deleting ITA topic with ID ${topicId}:`, error)
      throw new Error('ไม่สามารถลบหัวข้อได้')
    }
  },

  // --- 3) Documents (เอกสาร ITA) ---
  async createDocument(topicId: string | number, formData: FormData): Promise<ItaDocument> {
    try {
      const response = await apiService.post(`/ita-topics/${topicId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data.data as ItaDocument
    } catch (error) {
      console.error(`Error creating document for topic ID ${topicId}:`, error)
      throw new Error('ไม่สามารถเพิ่มเอกสารใหม่ได้')
    }
  },

  async updateDocument(docId: string | number, formData: FormData): Promise<ItaDocument> {
    try {
      const response = await apiService.post(`/ita-documents/${docId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data.data as ItaDocument
    } catch (error) {
      console.error(`Error updating document with ID ${docId}:`, error)
      throw new Error('ไม่สามารถบันทึกการแก้ไขเอกสารได้')
    }
  },

  async deleteDocument(docId: string | number): Promise<void> {
    try {
      await apiService.delete(`/ita-documents/${docId}`)
    } catch (error) {
      console.error(`Error deleting document with ID ${docId}:`, error)
      throw new Error('ไม่สามารถลบเอกสารได้')
    }
  },
}

// src/services/itaService.ts
import apiService from './apiService'
import type { YearIta, Moit, ItaDocument } from '@/types/ita'

// ===== Types that the View will use =====
export type MoitWithYear = Moit & {
  year_ita: { year: number } | null
  documents: ItaDocument[]
}

// ===== Raw shapes that backend might return =====
type RawYearIta = { year: number | string } | number | string | null | undefined

type RawMoitWithYear = Moit & {
  year_ita?: RawYearIta
  documents?: ItaDocument[] | null
}

// ----- Type guards -----
function hasYearField(v: unknown): v is { year: number | string } {
  return typeof v === 'object' && v !== null && 'year' in (v as Record<string, unknown>)
}

// ----- Normalizer -----
function normalizeMoitWithYear(raw: RawMoitWithYear): MoitWithYear {
  let year_ita: { year: number } | null = null

  const yi = raw.year_ita
  if (yi !== null && yi !== undefined) {
    if (hasYearField(yi)) {
      year_ita = { year: Number(yi.year) }
    } else if (typeof yi === 'number' || typeof yi === 'string') {
      year_ita = { year: Number(yi) }
    }
  }

  return {
    ...raw,
    year_ita,
    documents: Array.isArray(raw.documents) ? raw.documents : [],
  }
}

export const itaService = {
  // --- 1. Year (YearIta) ---
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

  // --- 2. Topic (Moit) ---
  async getAllTopics(): Promise<YearIta[]> {
    try {
      const response = await apiService.get('/user/year-moit')
      return response.data.data as YearIta[]
    } catch (error) {
      console.error('Error fetching all ITA data:', error)
      throw new Error('ไม่สามารถดึงข้อมูล ITA ทั้งหมดได้')
    }
  },

  // คืนค่าพร้อม normalize ให้ View ใช้งานได้เสถียร
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

  // --- 3. Documents (ItaDocument) ---
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

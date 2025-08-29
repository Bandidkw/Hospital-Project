// src/services/itaService.ts
import apiService from './apiService'
import type { YearIta, Moit, ItaDocument } from '@/types/ita'

// --- helper ป้องกันการส่ง id ว่าง/undefined ---
function ensureId(name: string, v: unknown) {
  if (v === undefined || v === null || v === '') {
    throw new Error(`${name} is required`)
  }
}

/* ... (ส่วน type/normalize ของคุณคงไว้เหมือนเดิม) ... */

export const itaService = {
  // --- 1) Year ---
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

  // 🔁 เปลี่ยนชื่อให้สื่อความหมาย
  async getYearById(yearId: string | number): Promise<YearIta> {
    ensureId('yearId', yearId)
    try {
      const response = await apiService.get(`/ita/year-moit/${encodeURIComponent(String(yearId))}`)
      return response.data.data as YearIta
    } catch (error) {
      console.error(`Error fetching year with ID ${yearId}:`, error)
      throw new Error('ไม่สามารถดึงข้อมูลปีที่เลือกได้')
    }
  },

  async updateYear(
    yearId: string | number,
    yearData: { title: string; description: string },
  ): Promise<YearIta> {
    ensureId('yearId', yearId)
    try {
      const response = await apiService.put(
        `/ita/year-moit/${encodeURIComponent(String(yearId))}`,
        yearData,
      )
      return response.data.data as YearIta
    } catch (error) {
      console.error(`Error updating ITA year with ID ${yearId}:`, error)
      throw new Error('ไม่สามารถอัปเดตข้อมูลปีงบประมาณได้')
    }
  },

  async deleteYear(yearId: string | number): Promise<void> {
    ensureId('yearId', yearId)
    try {
      await apiService.delete(`/ita/year-moit/${encodeURIComponent(String(yearId))}`)
    } catch (error) {
      console.error(`Error deleting ITA year with ID ${yearId}:`, error)
      throw new Error('ไม่สามารถลบปีงบประมาณได้')
    }
  },

  // --- 2) MOIT ---
  async getAllTopics(): Promise<YearIta[]> {
    try {
      const response = await apiService.get('/user/year-moit')
      return response.data.data as YearIta[]
    } catch (error) {
      console.error('Error fetching all ITA data:', error)
      throw new Error('ไม่สามารถดึงข้อมูล ITA ทั้งหมดได้')
    }
  },

  // ✅ เส้น /moit/year/:moitId
  async getMoitById(moitId: string | number): Promise<Moit> {
    ensureId('moitId', moitId)
    const response = await apiService.get(`/moit/year/${encodeURIComponent(String(moitId))}`)
    // ถ้าต้อง normalize:
    // return normalizeMoitWithYear(response.data.data as RawMoitWithYear)
    return response.data.data as Moit
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
    ensureId('topicId', topicId)
    try {
      const response = await apiService.put(
        `/moit/${encodeURIComponent(String(topicId))}`,
        topicData,
      )
      return response.data.data as Moit
    } catch (error) {
      console.error(`Error updating ITA topic with ID ${topicId}:`, error)
      throw new Error('ไม่สามารถอัปเดตข้อมูลหัวข้อได้')
    }
  },

  async deleteTopic(topicId: string | number): Promise<void> {
    ensureId('topicId', topicId)
    try {
      await apiService.delete(`/moit/${encodeURIComponent(String(topicId))}`)
    } catch (error) {
      console.error(`Error deleting ITA topic with ID ${topicId}:`, error)
      throw new Error('ไม่สามารถลบหัวข้อได้')
    }
  },

  // --- 3) Documents ---
  // async createDocument(moitId: string | number, formData: FormData): Promise<ItaDocument> {
  //   ensureId('moitId', moitId)
  //   try {
  //     formData.set('moit_id', String(moitId))
  //     const q = formData.get('quarter')
  //     if (q !== null) formData.set('quarter', String(q))

  //     const response = await apiService.post('/quarter/create', formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     })
  //     return response.data.data as ItaDocument
  //   } catch (error) {
  //     console.error(`Error creating document for MOIT ${moitId}:`, error)
  //     throw new Error('ไม่สามารถเพิ่มเอกสารใหม่ได้')
  //   }
  // },

  // async updateDocument(docId: string | number, formData: FormData): Promise<ItaDocument> {
  //   ensureId('docId', docId)
  //   try {
  //     const response = await apiService.post(
  //       `/ita-documents/${encodeURIComponent(String(docId))}`,
  //       formData,
  //       {
  //         headers: { 'Content-Type': 'multipart/form-data' },
  //       },
  //     )
  //     return response.data.data as ItaDocument
  //   } catch (error) {
  //     console.error(`Error updating document with ID ${docId}:`, error)
  //     throw new Error('ไม่สามารถบันทึกการแก้ไขเอกสารได้')
  //   }
  // },

  // async deleteDocument(docId: string | number): Promise<void> {
  //   ensureId('docId', docId)
  //   try {
  //     await apiService.delete(`/ita-documents/${encodeURIComponent(String(docId))}`)
  //   } catch (error) {
  //     console.error(`Error deleting document with ID ${docId}:`, error)
  //     throw new Error('ไม่สามารถลบเอกสารได้')
  //   }
  // },

  // Document API
  async getDocumentsByMoitId(moitId: string | number): Promise<ItaDocument[]> {
    const response = await apiService.get(`/documents?moit_id=${moitId}`)
    return response.data.data as ItaDocument[]
  },

  async getDocumentById(docId: string | number): Promise<ItaDocument> {
    const response = await apiService.get(`/documents/${docId}`)
    return response.data.data as ItaDocument
  },

  async createDocument(moitId: string | number, formData: FormData): Promise<ItaDocument> {
    formData.set('moit_id', String(moitId))
    const response = await apiService.post('/quarter/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data as ItaDocument
  },

  async updateDocument(docId: string | number, formData: FormData): Promise<ItaDocument> {
    const response = await apiService.put(
      `/quarter/update/${encodeURIComponent(String(docId))}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    )
    return response.data.data as ItaDocument
  },

  async deleteDocument(docId: string | number): Promise<void> {
    await apiService.delete(`/quarter/delete/${docId}`)
  },
}

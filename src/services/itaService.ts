// src/services/itaService.ts
import apiService from './apiService'
import type { YearIta, Moit, ItaDocument } from '@/types/ita'

// Type พิเศษสำหรับหน้า Edit ที่ต้องการข้อมูลปีมาด้วย
export interface MoitWithYear extends Moit {
  yearData: YearIta
}

export const itaService = {
  // --- 1. ฟังก์ชันสำหรับจัดการ "ปี" (YearIta) ---

  getYears: async (): Promise<YearIta[]> => {
    try {
      const response = await apiService.get('/ita/year-moit')
      return response.data.data
    } catch (error) {
      console.error('Error fetching ITA years:', error)
      throw new Error('ไม่สามารถดึงข้อมูลปีงบประมาณได้')
    }
  },
  createYear: async (yearData: {
    year: string
    title: string
    description: string
  }): Promise<YearIta> => {
    try {
      const response = await apiService.post('/ita/year-moit', yearData)
      return response.data.data
    } catch (error) {
      console.error('Error creating ITA year:', error)
      throw new Error('ไม่สามารถสร้างปีงบประมาณใหม่ได้')
    }
  },
  getTopicsByYearId: async (yearId: string | number): Promise<YearIta> => {
    try {
      const response = await apiService.get(`/ita/year-moit/${yearId}`)
      return response.data.data
    } catch (error) {
      console.error(`Error fetching topics for year ID ${yearId}:`, error)
      throw new Error('ไม่สามารถดึงข้อมูลหัวข้อสำหรับปีที่เลือกได้')
    }
  },
  // --- เพิ่มฟังก์ชันนี้เข้าไปครับ ---
  /**
   * อัปเดตข้อมูลปีงบประมาณ
   * @param yearId ID ของปีที่ต้องการแก้ไข
   * @param yearData ข้อมูลที่ต้องการอัปเดต
   * @returns ข้อมูลปีที่อัปเดตแล้ว
   */
  updateYear: async (
    yearId: string | number,
    yearData: { title: string; description: string },
  ): Promise<YearIta> => {
    try {
      const response = await apiService.put(`/ita/year-moit/${yearId}`, yearData)
      return response.data.data
    } catch (error) {
      console.error(`Error updating ITA year with ID ${yearId}:`, error)
      throw new Error('ไม่สามารถอัปเดตข้อมูลปีงบประมาณได้')
    }
  },

  // --- 2. ฟังก์ชันสำหรับจัดการ "หัวข้อ" (Moit) ---

  getAllTopics: async (): Promise<YearIta[]> => {
    try {
      const response = await apiService.get('/ita-topics')
      return response.data.data
    } catch (error) {
      console.error('Error fetching all ITA data:', error)
      throw new Error('ไม่สามารถดึงข้อมูล ITA ทั้งหมดได้')
    }
  },
  getTopicById: async (topicId: string | number): Promise<MoitWithYear> => {
    try {
      const response = await apiService.get(`/ita-topics/${topicId}`)
      return response.data.data
    } catch (error) {
      console.error(`Error fetching ITA topic with ID ${topicId}:`, error)
      throw new Error('ไม่สามารถดึงข้อมูลหัวข้อได้')
    }
  },
  createTopic: async (topicData: { yearId: string | number; title: string }): Promise<Moit> => {
    try {
      const response = await apiService.post('/ita-topics', topicData)
      return response.data.data
    } catch (error) {
      console.error('Error creating ITA topic:', error)
      throw new Error('ไม่สามารถสร้างหัวข้อใหม่ได้')
    }
  },
  deleteTopic: async (topicId: string | number): Promise<void> => {
    try {
      await apiService.delete(`/ita-topics/${topicId}`)
    } catch (error) {
      console.error(`Error deleting ITA topic with ID ${topicId}:`, error)
      throw new Error('ไม่สามารถลบหัวข้อได้')
    }
  },

  // --- 3. ฟังก์ชันสำหรับจัดการ "เอกสาร" (ItaDocument) ---

  createDocument: async (topicId: string | number, formData: FormData): Promise<ItaDocument> => {
    try {
      const response = await apiService.post(`/ita-topics/${topicId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data.data
    } catch (error) {
      console.error(`Error creating document for topic ID ${topicId}:`, error)
      throw new Error('ไม่สามารถเพิ่มเอกสารใหม่ได้')
    }
  },
  updateDocument: async (docId: string | number, formData: FormData): Promise<ItaDocument> => {
    try {
      const response = await apiService.post(`/ita-documents/${docId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data.data
    } catch (error) {
      console.error(`Error updating document with ID ${docId}:`, error)
      throw new Error('ไม่สามารถบันทึกการแก้ไขเอกสารได้')
    }
  },
  deleteDocument: async (docId: string | number): Promise<void> => {
    try {
      // Endpoint นี้ควรจะเป็น /ita-documents/ ไม่ใช่ /ita/year-moit/
      await apiService.delete(`/ita-documents/${docId}`)
    } catch (error) {
      console.error(`Error deleting document with ID ${docId}:`, error)
      throw new Error('ไม่สามารถลบเอกสารได้')
    }
  },
}

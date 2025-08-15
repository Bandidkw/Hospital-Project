// src/services/itaService.ts
import apiService from './apiService'
import type { YearIta, Moit, ItaDocument } from '@/types/ita'

// Type พิเศษสำหรับหน้า Edit
export interface MoitWithYear extends Moit {
  yearData: YearIta
}

export const itaService = {
  // --- Functions for Year ---
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

  // --- Functions for Topic (MOIT) ---
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

  // --- Functions for Document ---
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
      await apiService.delete(`/ita-documents/${docId}`)
    } catch (error) {
      console.error(`Error deleting document with ID ${docId}:`, error)
      throw new Error('ไม่สามารถลบเอกสารได้')
    }
  },
}

// src/services/itaService.ts
import apiService from './apiService'
// ตรวจสอบว่า Path ถูกต้อง และในไฟล์ ita.ts มีครบทั้ง 3 interfaces
import type { YearIta, Moit, ItaDocument } from '@/types/ita'

// สร้าง Type ใหม่สำหรับ Response ที่รวม Moit และ YearIta เข้าด้วยกัน
// เพื่อใช้ในหน้า Edit ที่ต้องการแสดงข้อมูลปีด้วย
export interface MoitWithYear extends Moit {
  yearData: YearIta // หรือชื่ออะไรก็ได้ที่ Backend ส่งมาพร้อมกับ Moit
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
  createYear: async (yearData: { year: number }): Promise<YearIta> => {
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
      const response = await apiService.get('/ita/year-moit')
      return response.data.data
    } catch (error) {
      console.error('Error fetching all ITA data:', error)
      throw new Error('ไม่สามารถดึงข้อมูล ITA ทั้งหมดได้')
    }
  },
  // ปรับปรุง Return Type ให้เป็น MoitWithYear
  getTopicById: async (topicId: string | number): Promise<MoitWithYear> => {
    try {
      const response = await apiService.get(`/ita/year-moit/${topicId}`)
      return response.data.data
    } catch (error) {
      console.error(`Error fetching ITA topic with ID ${topicId}:`, error)
      throw new Error('ไม่สามารถดึงข้อมูลหัวข้อได้')
    }
  },
  createTopic: async (topicData: {
    yearId: string | number
    title: string
    description?: string
  }): Promise<Moit> => {
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
      await apiService.delete(`/ita/year-moit/${topicId}`)
    } catch (error) {
      console.error(`Error deleting ITA topic with ID ${topicId}:`, error)
      throw new Error('ไม่สามารถลบหัวข้อได้')
    }
  },

  // --- Functions for Document ---
  createDocument: async (topicId: string | number, formData: FormData): Promise<ItaDocument> => {
    try {
      const response = await apiService.post(`/ita-topics/${topicId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

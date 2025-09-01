// src/services/newsService.ts
import apiService from './apiService'

export interface News {
  id: string
  title: string
  content: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
  // ถ้ามี field เพิ่ม (category, isPublished ฯลฯ) ใส่ตรงนี้ได้เลย
}

type ListEnvelope<T> = { status: number; error: boolean; description?: string; data: T }

export const newsService = {
  async getAll(): Promise<News[]> {
    const res = await apiService.get('/news')
    const body = res.data as ListEnvelope<News[]>
    return body.data ?? []
  },
  async getById(id: string): Promise<News> {
    const res = await apiService.get(`/news/${encodeURIComponent(id)}`)
    const body = res.data as ListEnvelope<News>
    return body.data
  },
  async create(formData: FormData): Promise<News> {
    const res = await apiService.post('/news', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    const body = res.data as ListEnvelope<News>
    return body.data
  },
  async update(id: string, formData: FormData): Promise<News> {
    const res = await apiService.put(`/news/${encodeURIComponent(id)}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    const body = res.data as ListEnvelope<News>
    return body.data
  },
  async remove(id: string): Promise<void> {
    await apiService.delete(`/news/${encodeURIComponent(id)}`)
  },
}

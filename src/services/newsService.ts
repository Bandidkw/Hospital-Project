// src/services/newsService.ts

import apiService from './apiService'

export interface NewsItem {
  id: string
  title: string
  content: string
  excerpt?: string
  date: string // 'YYYY-MM-DD'
  imageUrl?: string | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateNewsPayload {
  title: string
  content: string
  date: string // 'YYYY-MM-DD'
  imageUrl?: string | null
  isPublished: boolean
}

/** POST /news — สร้างข่าวใหม่ */
export async function createNews(payload: CreateNewsPayload): Promise<NewsItem> {
  const res = await apiService.post<{ status: 'success'; data: NewsItem }>('/news', payload)
  return res.data.data
}

export async function getAllNews(): Promise<NewsItem[]> {
  const res = await apiService.get('/news')
  return res.data.data as NewsItem[]
}

export async function getNewsById(id: string): Promise<NewsItem> {
  const res = await apiService.get(`/news/${id}`)
  return res.data.data as NewsItem
}

export async function updateNews(id: string, payload: Partial<NewsItem>): Promise<NewsItem> {
  const res = await apiService.put(`/news/${id}`, payload)
  return res.data.data as NewsItem
}

export async function togglePublish(id: string, isPublished: boolean): Promise<NewsItem> {
  const res = await apiService.patch(`/news/${id}/toggle-publish`, { isPublished })
  return res.data.data as NewsItem
}

// ❗ ยังไม่มี deleteNews เพราะ backend ยังไม่ทำ
// export async function deleteNews(id: string): Promise<void> {
//   await apiService.delete(`/news/${id}`)
// }

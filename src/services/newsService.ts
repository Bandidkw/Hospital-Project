// src/services/newsService.ts
import apiService from './apiService'

/** --------------------------------
 * Types
 * -------------------------------- */
export type IdLike = string

export interface NewsItem {
  id: IdLike
  title: string
  content: string
  excerpt?: string
  category?: string
  date: string
  imageUrl?: string | null
  pdfUrl?: string | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface ApiSuccess<T> {
  status: 'success'
  data: T
}

export interface CreateNewsFormPayload {
  title: string
  content: string
  category: string
  excerpt: string
  date: string
  image?: File | null
  pdf?: File | null // รับมาทั้งคู่ แต่จะเลือกใช้แค่อย่างใดอย่างหนึ่ง
}

export interface UpdateNewsPayload {
  title?: string
  content?: string
  category?: string
  excerpt?: string
  date?: string
  isPublished?: boolean
  image?: File | null
  pdf?: File | null // รับมาทั้งคู่ แต่จะเลือกใช้แค่อย่างใดอย่างหนึ่ง
}

/** --------------------------------
 * Helpers
 * -------------------------------- */

function appendIfDefined(fd: FormData, key: string, value?: string | Blob | null): void {
  if (value != null) fd.append(key, value)
}

function buildAssetUrl(u?: string | null): string {
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u

  const fromEnv = (import.meta.env.VITE_API_BASE_URL || '').trim()
  const fromAxios = (apiService.defaults.baseURL || '').trim()
  let base = fromEnv || fromAxios
  if (!base && typeof window !== 'undefined') base = window.location.origin

  const root = base.replace(/\/+$/, '')
  const path = String(u).replace(/^\/+/, '')
  const alreadyEncoded = /%[0-9A-Fa-f]{2}/.test(path)
  const encodedPath = alreadyEncoded ? path : encodeURI(path)

  return `${root}/${encodedPath}`
}

/** ✨ map ทั้ง imageUrl และ pdfUrl และเปลี่ยนชื่อให้ชัดเจน */
function mapAssetUrls<T extends { imageUrl?: string | null; pdfUrl?: string | null }>(obj: T): T {
  return {
    ...obj,
    imageUrl: buildAssetUrl(obj.imageUrl),
    pdfUrl: buildAssetUrl(obj.pdfUrl),
  }
}

/** --------------------------------
 * API Calls
 * -------------------------------- */

export async function getAllNews(): Promise<NewsItem[]> {
  const res = await apiService.get<ApiSuccess<NewsItem[]>>('/news')
  const items = res.data.data ?? []
  return items.map(mapAssetUrls)
}

export async function getNewsById(id: IdLike): Promise<NewsItem> {
  const res = await apiService.get<ApiSuccess<NewsItem>>(`/news/${id}`)
  return mapAssetUrls(res.data.data)
}

export async function createNews(payload: CreateNewsFormPayload): Promise<NewsItem> {
  const fd = new FormData()
  fd.append('title', payload.title)
  fd.append('content', payload.content)
  fd.append('category', payload.category)
  fd.append('excerpt', payload.excerpt ?? '')
  fd.append('date', payload.date)

  const fileToUpload = payload.pdf || payload.image
  appendIfDefined(fd, 'image', fileToUpload)

  const res = await apiService.post<ApiSuccess<NewsItem>>('/news', fd)
  return mapAssetUrls(res.data.data)
}

export async function updateNews(id: IdLike, payload: UpdateNewsPayload): Promise<NewsItem> {
  const hasFile = !!payload.image || !!payload.pdf

  if (hasFile) {
    const fd = new FormData()
    appendIfDefined(fd, 'title', payload.title)
    appendIfDefined(fd, 'content', payload.content)
    appendIfDefined(fd, 'category', payload.category)
    fd.append('excerpt', payload.excerpt ?? '')
    appendIfDefined(fd, 'date', payload.date)
    if (payload.isPublished !== undefined) {
      fd.append('isPublished', String(payload.isPublished))
    }
    //
    const fileToUpload = payload.pdf || payload.image
    appendIfDefined(fd, 'image', fileToUpload)
    const res = await apiService.put<ApiSuccess<NewsItem>>(`/news/${id}`, fd)
    return mapAssetUrls(res.data.data)
  }

  // ── JSON (ถ้าไม่มีไฟล์) ──
  const body = { ...payload }
  delete (body as Partial<UpdateNewsPayload>).image
  delete (body as Partial<UpdateNewsPayload>).pdf

  const res = await apiService.put<ApiSuccess<NewsItem>>(`/news/${id}`, body)
  return mapAssetUrls(res.data.data)
}

export async function togglePublish(id: IdLike, isPublished: boolean): Promise<NewsItem> {
  const res = await apiService.patch<ApiSuccess<NewsItem>>(`/news/${id}/toggle-publish`, {
    isPublished,
  })
  return mapAssetUrls(res.data.data)
}

export async function deleteNews(id: IdLike): Promise<void> {
  await apiService.delete(`/news/${id}`)
}

// --- Public types ---

export type NewsCategory =
  | 'general'
  | 'activity'
  | 'procurement'
  | 'recruitment'
  | 'forms'
  | 'staff'
export interface PublicNewsItem {
  id: string
  title: string
  excerpt?: string
  content?: string
  category?: string
  date: string
  imageUrl?: string | null
  pdfUrl?: string | null
}

export type PublicNewsEx = PublicNewsItem & {
  isPublished?: boolean
  createdAt?: string
  updatedAt?: string
}

export async function getPublicNews(): Promise<PublicNewsItem[]> {
  const params = { _: new Date().getTime() }
  const res = await apiService.get<ApiSuccess<PublicNewsItem[]>>('/news/public', { params })
  const items = res.data.data ?? []
  return items.map(mapAssetUrls)
}

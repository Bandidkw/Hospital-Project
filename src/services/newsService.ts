// src/services/newsService.ts
import apiService from './apiService'

/** --------- Types --------- */
export type IdLike = string

export interface NewsItem {
  id: IdLike
  title: string
  content: string
  excerpt?: string
  date: string // YYYY-MM-DD
  imageUrl?: string | null
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
  excerpt?: string
  date: string // YYYY-MM-DD
  image?: File | null
}

/** ใช้สำหรับอัปเดต (รองรับไฟล์ใหม่ด้วย) */
export interface UpdateNewsPayload {
  title?: string
  content?: string
  excerpt?: string
  date?: string
  isPublished?: boolean
  image?: File | null // ถ้ามีไฟล์ → ส่งแบบ multipart
}

/** --------- Helpers --------- */
function appendIfDefined(fd: FormData, key: string, value?: string | Blob | null) {
  if (value != null) {
    fd.append(key, value)
  }
}

/** --------- API Calls --------- */

/** GET /news — ดึงทั้งหมด (ไม่มีหน้า) */
export async function getAllNews(): Promise<NewsItem[]> {
  const res = await apiService.get<ApiSuccess<NewsItem[]>>('/news')
  return res.data.data
}

/** GET /news/:id — ดึงตาม id */
export async function getNewsById(id: IdLike): Promise<NewsItem> {
  const res = await apiService.get<ApiSuccess<NewsItem>>(`/news/${id}`)
  return res.data.data
}

/** POST /news — สร้างข่าวใหม่ (multipart/form-data) */
export async function createNews(payload: CreateNewsFormPayload): Promise<NewsItem> {
  const fd = new FormData()
  fd.append('title', payload.title)
  fd.append('content', payload.content)
  appendIfDefined(fd, 'excerpt', payload.excerpt)
  fd.append('date', payload.date)
  appendIfDefined(fd, 'image', payload.image ?? null)

  const res = await apiService.post<ApiSuccess<NewsItem>>('/news', fd)
  return res.data.data
}

/** PUT /news/:id — แก้ไขข่าว
 *  ถ้ามี image ใหม่ → ส่ง multipart; ถ้าไม่มีก็ส่ง JSON ปกติ (ถ้า backend รองรับ)
 */
export async function updateNews(id: IdLike, payload: UpdateNewsPayload): Promise<NewsItem> {
  if (payload.image) {
    const fd = new FormData()
    if (payload.title !== undefined) fd.append('title', payload.title)
    if (payload.content !== undefined) fd.append('content', payload.content)
    if (payload.excerpt !== undefined) fd.append('excerpt', payload.excerpt)
    if (payload.date !== undefined) fd.append('date', payload.date)
    if (payload.isPublished !== undefined) fd.append('isPublished', String(payload.isPublished))
    fd.append('image', payload.image)

    const res = await apiService.put<ApiSuccess<NewsItem>>(`/news/${id}`, fd)
    return res.data.data
  }

  // ไม่มีไฟล์ → ส่ง JSON
  const res = await apiService.put<ApiSuccess<NewsItem>>(`/news/${id}`, payload)
  return res.data.data
}

/** PATCH /news/:id/toggle-publish — สลับสถานะเผยแพร่ */
export async function togglePublish(id: IdLike, isPublished: boolean): Promise<NewsItem> {
  const res = await apiService.patch<ApiSuccess<NewsItem>>(`/news/${id}/toggle-publish`, {
    isPublished,
  })
  return res.data.data
}

/* หมายเหตุ:
   - ตอนนี้ backend ยังไม่มี DELETE /news/:id
     ถ้าเพิ่มเมื่อไรให้เสริมฟังก์ชันนี้:

export async function deleteNews(id: IdLike): Promise<void> {
  await apiService.delete(`/news/${id}`)
}

*/

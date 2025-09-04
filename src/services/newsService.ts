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

/** สร้างข่าวใหม่ (multipart/form-data) */
export interface CreateNewsFormPayload {
  title: string
  content: string
  /** backend บังคับ → ต้องส่งเสมอ (ฝั่ง caller ควรจัดให้ไม่ว่าง; ถ้าไม่กรอกให้สร้างจาก content แล้วส่งมา) */
  excerpt: string
  date: string // YYYY-MM-DD
  image?: File | null
}

/** อัปเดตข่าว (ถ้ามี image ใหม่จะส่ง multipart) */
export interface UpdateNewsPayload {
  title?: string
  content?: string
  /** backend บังคับ → ถึงจะ optional แต่เราจะเติม fallback เป็น '' ให้เสมอ */
  excerpt?: string
  date?: string
  isPublished?: boolean
  image?: File | null
}

/** --------------------------------
 * Helpers
 * -------------------------------- */
function appendIfDefined(fd: FormData, key: string, value?: string | Blob | null): void {
  if (value != null) {
    fd.append(key, value)
  }
}

/** --------------------------------
 * API Calls
 * -------------------------------- */

/** GET /news — ดึงทั้งหมด */
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
  // ฟิลด์ที่ backend บังคับ → append ตรง ๆ
  fd.append('title', payload.title)
  fd.append('content', payload.content)
  fd.append('excerpt', payload.excerpt ?? '') // การันตีไม่เป็น undefined
  fd.append('date', payload.date)
  // ฟิลด์ optional → ใช้ helper
  appendIfDefined(fd, 'image', payload.image ?? null)

  const res = await apiService.post<ApiSuccess<NewsItem>>('/news', fd)
  return res.data.data
}

/** PUT /news/:id — แก้ไขข่าว
 *  - ถ้ามี image ใหม่ → ส่ง multipart
 *  - ถ้าไม่มี image → ส่ง JSON (ตัด field image ออก และการันตี excerpt)
 */
export async function updateNews(id: IdLike, payload: UpdateNewsPayload): Promise<NewsItem> {
  const hasFile = !!payload.image

  if (hasFile) {
    // ── multipart/form-data ──
    const fd = new FormData()
    appendIfDefined(fd, 'title', payload.title)
    appendIfDefined(fd, 'content', payload.content)

    // excerpt เป็น required ทาง backend → ส่งเสมอ (fallback เป็น '')
    fd.append('excerpt', payload.excerpt ?? '')

    appendIfDefined(fd, 'date', payload.date)

    if (payload.isPublished !== undefined) {
      fd.append('isPublished', String(payload.isPublished))
    }

    // มีไฟล์แน่นอนในทางเดินนี้
    fd.append('image', payload.image as File)

    const res = await apiService.put<ApiSuccess<NewsItem>>(`/news/${id}`, fd)
    return res.data.data
  }

  // ── JSON ──
  // ตัด image ออก แล้วการันตี excerpt ไม่เป็น undefined
  const body: Omit<UpdateNewsPayload, 'image'> & { excerpt: string } = {
    ...payload,
    excerpt: payload.excerpt ?? '',
  }
  // ลบ field image ออกให้ชัดเจน (กัน backend reject)
  delete (body as unknown as { image?: unknown }).image

  const res = await apiService.put<ApiSuccess<NewsItem>>(`/news/${id}`, body)
  return res.data.data
}

/** PATCH /news/:id/toggle-publish — สลับสถานะเผยแพร่ */
export async function togglePublish(id: IdLike, isPublished: boolean): Promise<NewsItem> {
  const res = await apiService.patch<ApiSuccess<NewsItem>>(`/news/${id}/toggle-publish`, {
    isPublished,
  })
  return res.data.data
}

/** หมายเหตุ:
 * - ขณะนี้ backend ยังไม่มี DELETE /news/:id
 *   เมื่อพร้อมสามารถเพิ่มฟังก์ชันนี้ได้:
 *
 * export async function deleteNews(id: IdLike): Promise<void> {
 *   await apiService.delete(`/news/${id}`)
 * }
 */

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
  excerpt: string
  date: string // YYYY-MM-DD
  image?: File | null
}

/** อัปเดตข่าว (ถ้ามี image ใหม่จะส่ง multipart) */
export interface UpdateNewsPayload {
  title?: string
  content?: string
  excerpt?: string
  date?: string
  isPublished?: boolean
  image?: File | null
}

/** --------------------------------
 * Helpers
 * -------------------------------- */

/** append ลง FormData เฉพาะกรณีค่ามีจริง */
function appendIfDefined(fd: FormData, key: string, value?: string | Blob | null): void {
  if (value != null) fd.append(key, value)
}

// ใช้ base แบบรวม /api/v1 เพราะ backend เสิร์ฟ uploads ใต้ /api/v1
function buildAssetUrl(u?: string | null): string {
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u

  const fromEnv = (import.meta.env.VITE_API_BASE_URL || '').trim()
  const fromAxios = (apiService.defaults.baseURL || '').trim()
  let base = fromEnv || fromAxios
  if (!base && typeof window !== 'undefined') base = window.location.origin

  const root = base.replace(/\/+$/, '') // ❗️อย่า strip /api/v1 ออก

  // กันชื่อไฟล์ภาษาไทย/ช่องว่าง — encode เฉพาะเมื่อยังไม่ได้ encode
  const cleaned = String(u).replace(/^\/+/, '')
  const alreadyEncoded = /%[0-9A-Fa-f]{2}/.test(cleaned)
  const path = alreadyEncoded ? cleaned : encodeURI(cleaned)

  return `${root}/${path}`
}

/** map ให้ imageUrl เป็น absolute */
function mapImage<T extends { imageUrl?: string | null }>(obj: T): T {
  return { ...obj, imageUrl: buildAssetUrl(obj.imageUrl ?? '') }
}

/** --------------------------------
 * API Calls
 * -------------------------------- */

/** GET /news — ดึงทั้งหมด */
export async function getAllNews(): Promise<NewsItem[]> {
  const res = await apiService.get<ApiSuccess<NewsItem[]>>('/news')
  const items = res.data.data ?? []
  return items.map(mapImage)
}

/** GET /news/:id — ดึงตาม id */
export async function getNewsById(id: IdLike): Promise<NewsItem> {
  const res = await apiService.get<ApiSuccess<NewsItem>>(`/news/${id}`)
  return mapImage(res.data.data)
}

/** POST /news — สร้างข่าวใหม่ (multipart/form-data) */
export async function createNews(payload: CreateNewsFormPayload): Promise<NewsItem> {
  const fd = new FormData()
  fd.append('title', payload.title)
  fd.append('content', payload.content)
  fd.append('excerpt', payload.excerpt ?? '')
  fd.append('date', payload.date)
  appendIfDefined(fd, 'image', payload.image ?? null)

  const res = await apiService.post<ApiSuccess<NewsItem>>('/news', fd)
  return mapImage(res.data.data)
}

/** PUT /news/:id — แก้ไขข่าว
 */
export async function updateNews(id: IdLike, payload: UpdateNewsPayload): Promise<NewsItem> {
  const hasFile = !!payload.image

  if (hasFile) {
    // ── multipart/form-data ──
    const fd = new FormData()
    appendIfDefined(fd, 'title', payload.title)
    appendIfDefined(fd, 'content', payload.content)
    fd.append('excerpt', payload.excerpt ?? '') // excerpt required ฝั่ง backend
    appendIfDefined(fd, 'date', payload.date)
    if (payload.isPublished !== undefined) {
      fd.append('isPublished', String(payload.isPublished))
    }
    fd.append('image', payload.image as File)

    const res = await apiService.put<ApiSuccess<NewsItem>>(`/news/${id}`, fd)
    return mapImage(res.data.data)
  }

  // ── JSON ──
  const body: Omit<UpdateNewsPayload, 'image'> & { excerpt: string } = {
    ...payload,
    excerpt: payload.excerpt ?? '',
  }
  delete (body as unknown as { image?: unknown }).image

  const res = await apiService.put<ApiSuccess<NewsItem>>(`/news/${id}`, body)
  return mapImage(res.data.data)
}

/** PATCH /news/:id/toggle-publish — สลับสถานะเผยแพร่ */
export async function togglePublish(id: IdLike, isPublished: boolean): Promise<NewsItem> {
  const res = await apiService.patch<ApiSuccess<NewsItem>>(`/news/${id}/toggle-publish`, {
    isPublished,
  })
  return mapImage(res.data.data)
}

/** DELETE /news/:id */
export async function deleteNews(id: IdLike): Promise<void> {
  await apiService.delete(`/news/${id}`)
}

// --- Public types ---
export interface PublicNewsItem {
  id: string
  title: string
  excerpt?: string
  content?: string
  date: string
  imageUrl?: string | null
}

/** GET /news/public — รายการสำหรับหน้าเว็บสาธารณะ */
export async function getPublicNews(): Promise<PublicNewsItem[]> {
  const res = await apiService.get<ApiSuccess<PublicNewsItem[]>>('/news/public')
  const items = res.data.data ?? []
  return items.map(mapImage)
}

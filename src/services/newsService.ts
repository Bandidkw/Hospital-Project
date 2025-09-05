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

/** append ลง FormData เฉพาะกรณีค่ามีจริง */
function appendIfDefined(fd: FormData, key: string, value?: string | Blob | null): void {
  if (value != null) fd.append(key, value)
}

/** ทำ URL รูปให้เป็น absolute จากค่า VITE_API_BASE_URL ที่ลงท้าย /api[/vN] */
function buildAssetUrl(u?: string | null): string {
  if (!u) return ''
  // ถ้าเป็น URL เต็มอยู่แล้ว ก็ใช้เลย
  if (/^https?:\/\//i.test(u)) return u

  // 1) base priority: ENV > axios baseURL > window.origin
  const fromEnv = (import.meta.env.VITE_API_BASE_URL || '').trim()
  const fromAxios = (apiService.defaults.baseURL || '').trim()
  let base = fromEnv || fromAxios
  if (!base && typeof window !== 'undefined') {
    base = window.location.origin
  }

  // 2) ตัด /api หรือ /api/v{n} ที่ท้าย base ให้เหลือ root
  const root = base.replace(/\/+$/, '').replace(/\/api(\/v\d+)?$/i, '')

  // 3) encode พาธ (รองรับชื่อไฟล์ไทย/ช่องว่าง) แต่คงเครื่องหมาย /
  const cleaned = String(u).replace(/^\/+/, '')
  const encoded = encodeURI(cleaned)

  return `${root}/${encoded}`
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

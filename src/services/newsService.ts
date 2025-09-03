// src/services/newsService.ts
import type { AxiosResponse } from 'axios'
import apiService from './apiService'

/** -------------------------------
 *  Types
 *  ------------------------------- */
export interface NewsItem {
  id: string
  title: string
  content: string
  date: string
  imageUrl?: string | null
  isPublished: boolean
  createdAt?: string
  updatedAt?: string
  // ฟิลด์ที่ backend ส่งมา แต่ frontend ไม่จำเป็นต้องใช้ก็ได้
  excerpt?: string | null
  fileName?: string | null
}

export interface PageMeta {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: PageMeta
}

/** -------------------------------
 *  Helpers
 *  ------------------------------- */
function hasDataKey(x: unknown): x is { data: unknown } {
  return typeof x === 'object' && x !== null && 'data' in (x as Record<string, unknown>)
}

function unwrap<T>(res: AxiosResponse<unknown>): T {
  const body = res.data
  return hasDataKey(body) ? (body.data as T) : (body as T)
}

/** แปลง relative path -> absolute URL */
// newsService.ts
function toAbsoluteUrl(path?: string | null): string | null {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path

  // ยึด baseURL ตรง ๆ (เช่น https://.../api/v1)
  const base = apiService.defaults.baseURL || window.location.origin
  try {
    // ใช้ WHATWG URL ให้ resolve ถูกต้องเสมอ
    // base: https://host/api/v1
    // path: uploads/ABC.jpg  => https://host/api/v1/uploads/ABC.jpg
    const u = new URL(path.replace(/^\/+/, ''), base.endsWith('/') ? base : base + '/')
    return u.toString()
  } catch {
    // fallback ง่าย ๆ
    return base.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '')
  }
}

/** Normalize object ที่ backend ส่งมา */
function normalizeNews(row: Record<string, unknown>): NewsItem {
  return {
    id: String(row.id ?? ''),
    title: String(row.title ?? ''),
    content: String(row.content ?? ''),
    date: String(row.date ?? ''),
    imageUrl: toAbsoluteUrl((row.imageUrl as string) ?? null),
    isPublished: Boolean(row.isPublished),
    createdAt: row.createdAt as string | undefined,
    updatedAt: row.updatedAt as string | undefined,
    excerpt: (row.excerpt as string) ?? null,
    fileName: (row.fileName as string) ?? null,
  }
}

/** -------------------------------
 *  Admin APIs
 *  ------------------------------- */
export async function getAdminNewsList(
  page = 1,
  pageSize = 100,
): Promise<PaginatedResponse<NewsItem>> {
  const res = await apiService.get('/news')
  const rows = unwrap<unknown[]>(res)

  const normalized = rows.map((r) => normalizeNews(r as Record<string, unknown>))
  const total = normalized.length

  return {
    items: normalized,
    meta: {
      page,
      pageSize,
      totalItems: total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  }
}

export async function getAdminNewsDetail(id: string): Promise<NewsItem> {
  const res = await apiService.get(`/news/${id}`)
  const row = unwrap<Record<string, unknown>>(res)
  return normalizeNews(row)
}

export async function createNews(payload: {
  title: string
  content: string
  date: string
  imageUrl?: string | null
  isPublished?: boolean
}): Promise<NewsItem> {
  const res = await apiService.post('/news', payload)
  const row = unwrap<Record<string, unknown>>(res)
  return normalizeNews(row)
}

export async function updateNews(
  id: string,
  payload: Partial<Pick<NewsItem, 'title' | 'content' | 'date' | 'imageUrl' | 'isPublished'>>,
): Promise<NewsItem> {
  const res = await apiService.put(`/news/${id}`, payload)
  const row = unwrap<Record<string, unknown>>(res)
  return normalizeNews(row)
}

export async function patchNews(
  id: string,
  payload: Partial<Pick<NewsItem, 'title' | 'content' | 'date' | 'imageUrl' | 'isPublished'>>,
): Promise<NewsItem> {
  const res = await apiService.patch(`/news/${id}`, payload)
  const row = unwrap<Record<string, unknown>>(res)
  return normalizeNews(row)
}

export async function publishNews(id: string, isPublished: boolean): Promise<NewsItem> {
  const res = await apiService.patch(`/news/${id}/publish`, { isPublished })
  const row = unwrap<Record<string, unknown>>(res)
  return normalizeNews(row)
}

export async function deleteNews(id: string): Promise<void> {
  await apiService.delete(`/news/${id}`)
}

/** -------------------------------
 *  Public APIs
 *  ------------------------------- */
export async function getPublicNewsList(): Promise<PaginatedResponse<NewsItem>> {
  const res = await apiService.get('/news/public')
  const rows = unwrap<unknown[]>(res)
  const items = rows.map((r) => normalizeNews(r as Record<string, unknown>))
  return {
    items,
    meta: { page: 1, pageSize: items.length, totalItems: items.length, totalPages: 1 },
  }
}

export async function getPublicNewsDetail(id: string): Promise<NewsItem> {
  const res = await apiService.get(`/news/public/${id}`)
  const row = unwrap<Record<string, unknown>>(res)
  return normalizeNews(row)
}

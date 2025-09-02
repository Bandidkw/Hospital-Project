// News core
export interface NewsItem {
  id: string // uuid / snowflake
  title: string // 4–120 chars
  content: string // >=10 chars (รองรับ markdown/plain)
  date: string // ISO date (YYYY-MM-DD) // วันที่เผยแพร่
  imageUrl?: string | null // absolute URL
  isPublished: boolean // true=เผยแพร่, false=ฉบับร่าง
  slug?: string // สำหรับ public/SEO (ออปชัน)
  createdAt: string // ISO datetime
  updatedAt: string // ISO datetime
  createdBy?: string // user id/username (ออปชัน)
  updatedBy?: string // user id/username (ออปชัน)
}

export interface NewsCreate {
  title: string
  content: string
  date: string // ISO date
  imageUrl?: string | null
  isPublished?: boolean // default: false
}

export interface NewsUpdate {
  title?: string
  content?: string
  date?: string
  imageUrl?: string | null
  isPublished?: boolean
}

// มาตรฐานตอบกลับแบบมีหน้า (pagination)
export interface PageMeta {
  page: number // เริ่มที่ 1
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface Paginated<T> {
  items: T[]
  meta: PageMeta
}

// รูปแบบ response แนะนำ (เรียบง่ายและสม่ำเสมอ)
export interface ApiOk<T> {
  data: T
  message?: string
}

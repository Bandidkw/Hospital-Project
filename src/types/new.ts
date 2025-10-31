// src/types/news.ts

export interface PublicNewsItem {
  id: string
  slug: string
  title: string
  content: string
  excerpt?: string
  date: string
  category?: string
  filename?: string
  imageUrl?: string | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
  pdfUrl?: string | null
}

export interface NewsDetailItem extends PublicNewsItem {
  content: string
}

export type CategoryKey = 'general' | 'activity' | 'procurement' | 'recruitment' | 'forms' | 'staff'

export type NewsWithCategory = Omit<PublicNewsItem, 'imageUrl'> & {
  imageUrl: string | null
  excerpt?: string
  category: CategoryKey
}

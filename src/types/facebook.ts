// src/types/facebook.ts

// Type สำหรับรายการโพส Facebook แต่ละโพส
export interface FacebookPost {
  id: string
  message?: string
  full_picture?: string
  created_time: string
  permalink_url?: string
}

export interface FacebookPaging {
  cursors?: {
    before: string
    after: string
  }
  next?: string
  previous?: string
}

export interface FacebookResponse {
  data: FacebookPost[]
  paging: FacebookPaging
}

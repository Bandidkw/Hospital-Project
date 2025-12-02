// src/types/facebook.ts

// Type สำหรับรายการโพส Facebook แต่ละโพส
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

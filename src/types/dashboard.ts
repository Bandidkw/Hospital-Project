export interface DashboardStats {
  newsCount: number
  itaDocumentCount: number
  userCount: number
  personnelCount: number
}
export interface ApiResponse<T> {
  status: string
  data: T
  totalCount?: number
}

import apiService from '@/services/apiService'
import type { DashboardStats, ApiResponse } from '@/types/dashboard'
import type { YearIta } from '@/types/ita'

interface NewsResponseItem {
  id: string
  title: string
}
export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    let newsCount = 0
    try {
      const newsRes = await apiService.get<ApiResponse<NewsResponseItem[]>>('/dashboard/news')
      if (newsRes.data) {
        newsCount = newsRes.data.length
      }
    } catch (err) {
      console.error('Error fetching news count, setting to 0:', err)
      newsCount = 0
    }
    let itaDocumentCount = 0
    try {
      const itaRes = await apiService.get<ApiResponse<YearIta[]>>('/dashboard/ita')
      itaDocumentCount = (itaRes as { totalCount?: number }).totalCount ?? 0
    } catch (err) {
      console.error('Error fetching ITA document count, setting to 0:', err)
      itaDocumentCount = 0
    }

    // --- 3. รวบรวมผลลัพธ์ ---
    return {
      newsCount,
      itaDocumentCount,
      userCount: 12,
      personnelCount: 230,
    } as DashboardStats
  },
}

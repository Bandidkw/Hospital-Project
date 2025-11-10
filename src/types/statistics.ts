// ใน src/types/statistics.ts

export interface SummaryStats {
  dailyVisitors: number
  dailyChange: string
  itaDownloads: number
  monthlyItaDownloads: number
}

export interface TopMenuItem {
  menu: string
  views: number
}

export interface StatisticsData {
  summary: SummaryStats
  topMenus: TopMenuItem[]
}

// ใน src/services/statisticsService.ts

import type { StatisticsData } from '@/types/statistics'

// 💡 Mock Data สำหรับทดสอบ
const mockStatisticsData: StatisticsData = {
  summary: {
    dailyVisitors: 5432,
    dailyChange: '+15',
    itaDownloads: 1876,
    monthlyItaDownloads: 255,
  },
  topMenus: [
    { menu: 'หน้าหลัก', views: 52000 },
    { menu: 'บุคลากร', views: 35400 },
    { menu: 'บริการ', views: 25100 },
    { menu: 'ติดต่อเรา', views: 18700 },
    { menu: 'ITA', views: 12000 },
  ],
}

/**
 * ดึงข้อมูลสถิติแบบง่าย (ใช้ Mock Data)
 * หากต้องการเชื่อมต่อ API จริง ให้เปลี่ยน logic ในฟังก์ชันนี้
 */
export async function fetchStatistics(): Promise<StatisticsData> {
  // 💡 จำลองการหน่วงเวลาของ API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStatisticsData)
    }, 500)
  })
  // หากเชื่อมต่อ API จริง:
  // const response = await apiService.get('/stats/simple');
  // return response.data.data;
}

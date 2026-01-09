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
  trends: {
    dates: ['03 ม.ค.', '04 ม.ค.', '05 ม.ค.', '06 ม.ค.', '07 ม.ค.', '08 ม.ค.', '09 ม.ค.'],
    visitors: [4200, 4800, 5100, 4900, 5300, 5800, 5432],
  },
  distribution: {
    labels: ['หน้าหลัก', 'ข่าวสาร', 'ITA', 'บุคลากร', 'อื่นๆ'],
    values: [40, 25, 15, 12, 8],
  },
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

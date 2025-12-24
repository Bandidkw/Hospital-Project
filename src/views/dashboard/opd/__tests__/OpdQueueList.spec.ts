// src/views/dashboard/opd/__tests__/OpdQueueList.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import OpdQueueList from '@/views/dashboard/opd/OpdQueueList.vue'
import * as opdService from '@/services/opdService'

// Mock toast
vi.mock('vue-toastification', () => ({
  useToast: () => ({
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  }),
}))

// Mock service
vi.mock('@/services/opdService', () => ({
  fetchPendingQueueList: vi.fn(),
}))

describe('OpdQueueList.vue', () => {
  const mockData = [
    {
      id: '1',
      trackingCode: 'TR001',
      hospitalNumber: 'HN001',
      fullName: 'John Doe',
      phoneNumber: '0123456789',
      referralHospital: 'Hospital A',
      destinationHospital: 'Hospital B',
      department: 'Cardiology',
      queueStatus: 'รออนุมัติ' as const,
      bookingDate: '2025-12-01',
      bookingTime: '09:00',
      medicalRights: '',
      documents: [],
      nationalId: '1234567890123',
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  beforeEach(() => {
    vi.mocked(opdService.fetchPendingQueueList).mockResolvedValue(mockData)
  })

  it('แสดง loading spinner ในตอนแรก', async () => {
    const wrapper = mount(OpdQueueList, { attachTo: document.body })
    expect(wrapper.text()).toContain('กำลังโหลดรายการคิว')
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('table').exists()).toBe(true)
  })

  it('แสดงสถานะว่างเมื่อไม่มีรายการ', async () => {
    vi.mocked(opdService.fetchPendingQueueList).mockResolvedValue([])
    const wrapper = mount(OpdQueueList)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('ไม่มีรายการคิวที่รออนุมัติ')
  })

  it('แสดงรายการคิวอย่างถูกต้อง', async () => {
    const wrapper = mount(OpdQueueList)
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(1)
    const firstRow = rows[0]
    expect(firstRow.text()).toContain('John Doe')
    expect(firstRow.text()).toContain('HN001')
    expect(firstRow.text()).toContain('รออนุมัติ')
  })
})

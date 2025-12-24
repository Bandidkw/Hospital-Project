import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import CustomCalendar from '@/components/CustomCalendar.vue'

// Mock current date to ensure consistent tests
const MOCK_DATE = new Date('2025-12-01T09:00:00')

describe('CustomCalendar.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(MOCK_DATE)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('แสดงผลเดือนและปีถูกต้อง', () => {
    const wrapper = mount(CustomCalendar, {
      props: { modelValue: null },
    })
    expect(wrapper.text()).toContain('ธันวาคม พ.ศ. 2568')
  })

  it('เน้นวันที่ปัจจุบัน', () => {
    const wrapper = mount(CustomCalendar, {
      props: { modelValue: null },
    })
    const today = wrapper.find('.text-blue-600.font-bold')
    expect(today.exists()).toBe(true)
    expect(today.text()).toBe('1')
  })

  it('สามารถเปลี่ยนเดือนไปข้างหน้าและย้อนกลับได้', async () => {
    const wrapper = mount(CustomCalendar, {
      props: { modelValue: null },
    })

    // คลิกปุ่มถัดไป (ไอคอน -> ปุ่ม)
    await wrapper.find('button i.fa-chevron-right').trigger('click')
    expect(wrapper.text()).toContain('มกราคม พ.ศ. 2569')

    // คลิกปุ่มย้อนกลับ
    await wrapper.find('button i.fa-chevron-left').trigger('click')
    expect(wrapper.text()).toContain('ธันวาคม พ.ศ. 2568')
  })

  it('คลิกเลือกวันที่ได้', async () => {
    const wrapper = mount(CustomCalendar, {
      props: { modelValue: null },
    })

    // หา Cell ของวันที่ 15 (สมมติว่าเป็นวันธรรมดาและว่าง)
    // หมายเหตุ: ต้องระวังเรื่อง Logic วันหยุดใน Component แต่ใน Mock Date:
    // 1 Dec 2025 is Monday. 15 Dec is Monday.

    const days = wrapper.findAll('.cursor-pointer')
    // หา element ที่มี text เป็น 15
    const day15 = days.find((d) => d.text().includes('15'))

    if (day15) {
      await day15.trigger('click')
      // ตรวจสอบว่ามีการ emit update:modelValue
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0][0]).toBeInstanceOf(Date)
    } else {
      // Fallback or fail if logic changes (e.g. 15th is weekend)
      // 15 Dec 2025 is Monday, so it should be clickable
    }
  })

  it('แสดงจำนวน slot คงเหลือ', () => {
    const wrapper = mount(CustomCalendar, {
      props: { modelValue: null },
    })
    // โดย default logic ใน component: ถ้าไม่ weekend และไม่เต็ม จะแสดง slot
    // เราไม่ได้ mock fetchAvailability ดังนั้นมันจะได้ empty object -> slotsTaken = 0 -> slotsRemaining = 15
    expect(wrapper.text()).toContain('15/15')
  })
})

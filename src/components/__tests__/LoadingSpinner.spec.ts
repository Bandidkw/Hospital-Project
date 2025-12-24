import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '../LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  it('renders the loading spinner', () => {
    const wrapper = mount(LoadingSpinner)
    
    expect(wrapper.find('.fa-spinner').exists()).toBe(true)
    expect(wrapper.text()).toContain('กำลังโหลด...')
  })

  it('has correct CSS classes for styling', () => {
    const wrapper = mount(LoadingSpinner)
    
    const spinner = wrapper.find('.fa-spinner')
    expect(spinner.classes()).toContain('fa-spin')
    expect(spinner.classes()).toContain('text-blue-600')
  })

  it('displays loading text', () => {
    const wrapper = mount(LoadingSpinner)
    
    const text = wrapper.find('p')
    expect(text.exists()).toBe(true)
    expect(text.text()).toBe('กำลังโหลด...')
  })

  it('has fixed positioning overlay', () => {
    const wrapper = mount(LoadingSpinner)
    
    const overlay = wrapper.find('.fixed.inset-0')
    expect(overlay.exists()).toBe(true)
    expect(overlay.classes()).toContain('flex')
    expect(overlay.classes()).toContain('items-center')
    expect(overlay.classes()).toContain('justify-center')
  })
})


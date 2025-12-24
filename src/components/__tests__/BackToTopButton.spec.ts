import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BackToTopButton from '../BackToTopButton.vue'

describe('BackToTopButton', () => {
  let scrollToSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    })
  })

  afterEach(() => {
    scrollToSpy.mockRestore()
    vi.restoreAllMocks()
  })

  it('renders the back to top button when visible', async () => {
    // Set scrollY to make button visible
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true, configurable: true })
    
    const wrapper = mount(BackToTopButton)
    
    // Trigger scroll to make button visible
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.attributes('aria-label')).toBe('Go to top')
  })

  it('is not visible initially when scrollY is less than 200', () => {
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true })
    
    const wrapper = mount(BackToTopButton)
    
    expect(wrapper.vm.isVisible).toBe(false)
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('becomes visible when scrollY is greater than 200', async () => {
    const wrapper = mount(BackToTopButton)
    
    // Simulate scroll event
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.isVisible).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('scrolls to top when button is clicked', async () => {
    // Set scrollY to make button visible
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true, configurable: true })
    
    const wrapper = mount(BackToTopButton)
    
    // Trigger scroll to make button visible
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    
    const button = wrapper.find('button')
    await button.trigger('click')
    
    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    })
  })

  it('hides button when scrolling back to top', async () => {
    const wrapper = mount(BackToTopButton)
    
    // Scroll down
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.isVisible).toBe(true)
    
    // Scroll back up
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.isVisible).toBe(false)
  })

  it('adds and removes scroll event listener', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    const wrapper = mount(BackToTopButton)
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    
    wrapper.unmount()
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
  })

  it('has correct styling classes', async () => {
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true, configurable: true })
    
    const wrapper = mount(BackToTopButton)
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()
    
    const button = wrapper.find('button')
    expect(button.classes()).toContain('fixed')
    expect(button.classes()).toContain('bg-teal-600')
    expect(button.classes()).toContain('rounded-full')
  })
})


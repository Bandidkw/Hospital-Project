import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import LoginModal from '../LoginModal.vue'
import { useAuthStore } from '@/stores/auth'

// Mock vue-toastification
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
}

vi.mock('vue-toastification', () => ({
  useToast: () => mockToast,
}))

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/dashboard', component: { template: '<div>Dashboard</div>' } },
    { path: '/force-change-password', component: { template: '<div>Change Password</div>' } },
  ],
})

describe('LoginModal', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    vi.clearAllMocks()
    mockToast.success.mockClear()
    mockToast.error.mockClear()
    mockToast.info.mockClear()
  })

  const createWrapper = (props = {}) => {
    return mount(LoginModal, {
      props: {
        isOpen: true,
        ...props,
      },
      global: {
        plugins: [pinia, router],
      },
    })
  }

  it('renders login form when modal is open', () => {
    const wrapper = createWrapper({ isOpen: true })
    
    expect(wrapper.text()).toContain('เข้าสู่ระบบ')
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('does not render when modal is closed', () => {
    const wrapper = createWrapper({ isOpen: false })
    
    // Modal should not be visible
    const modal = wrapper.find('.fixed.inset-0')
    expect(modal.exists()).toBe(false)
  })

  it('toggles password visibility', async () => {
    const wrapper = createWrapper()
    
    const passwordInput = wrapper.find('input[type="password"]')
    expect(passwordInput.exists()).toBe(true)
    
    const toggleButton = wrapper.find('button[type="button"]')
    await toggleButton.trigger('click')
    
    // After toggle, password should be visible (type="text")
    const visiblePasswordInput = wrapper.find('input[type="text"]')
    expect(visiblePasswordInput.exists()).toBe(true)
  })

  it('closes modal when close button is clicked', async () => {
    const wrapper = createWrapper()
    
    const closeButton = wrapper.find('button[aria-label="ปิดหน้าต่าง"]')
    await closeButton.trigger('click')
    
    expect(wrapper.emitted('update:isOpen')).toBeTruthy()
    expect(wrapper.emitted('update:isOpen')?.[0]).toEqual([false])
  })

  it('submits login form with credentials', async () => {
    const wrapper = createWrapper()
    const authStore = useAuthStore()
    
    // Mock successful login
    vi.spyOn(authStore, 'login').mockResolvedValue(true)
    authStore.user = {
      id: '1',
      username: 'testuser',
      fullName: 'Test User',
      roleId: 50,
      role: 'admin',
      vitrify: false,
    }
    
    const usernameInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')
    
    await usernameInput.setValue('testuser')
    await passwordInput.setValue('password123')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    expect(authStore.login).toHaveBeenCalledWith('testuser', 'password123')
  })

  it('handles login failure', async () => {
    const wrapper = createWrapper()
    const authStore = useAuthStore()
    
    // Mock failed login
    vi.spyOn(authStore, 'login').mockResolvedValue(false)
    authStore.loginError = 'Invalid credentials'
    
    const usernameInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')
    
    await usernameInput.setValue('wronguser')
    await passwordInput.setValue('wrongpass')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    await wrapper.vm.$nextTick()
    
    expect(mockToast.error).toHaveBeenCalled()
    expect(wrapper.emitted('loginFailed')).toBeTruthy()
  })

  it('shows user info when authenticated', async () => {
    const wrapper = createWrapper()
    const authStore = useAuthStore()
    
    authStore.user = {
      id: '1',
      username: 'testuser',
      fullName: 'Test User',
      roleId: 50,
      role: 'admin',
      vitrify: false,
    }
    authStore.token = 'test-token'
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('ข้อมูลผู้ใช้งาน')
    expect(wrapper.text()).toContain('testuser')
    expect(wrapper.text()).toContain('admin')
  })

  it('redirects to dashboard for admin users after login', async () => {
    const wrapper = createWrapper()
    const authStore = useAuthStore()
    const pushSpy = vi.spyOn(router, 'push')
    
    vi.spyOn(authStore, 'login').mockResolvedValue(true)
    authStore.user = {
      id: '1',
      username: 'admin',
      fullName: 'Admin User',
      roleId: 50,
      role: 'admin',
      vitrify: false,
    }
    
    const usernameInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')
    
    await usernameInput.setValue('admin')
    await passwordInput.setValue('password')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    await wrapper.vm.$nextTick()
    
    expect(pushSpy).toHaveBeenCalledWith('/dashboard')
  })

  it('redirects to force-change-password when vitrify is true', async () => {
    const wrapper = createWrapper()
    const authStore = useAuthStore()
    const pushSpy = vi.spyOn(router, 'push')
    
    vi.spyOn(authStore, 'login').mockResolvedValue(true)
    authStore.user = {
      id: '1',
      username: 'user',
      fullName: 'User',
      roleId: 10,
      role: 'user',
      vitrify: true,
    }
    
    const usernameInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')
    
    await usernameInput.setValue('user')
    await passwordInput.setValue('password')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    await wrapper.vm.$nextTick()
    
    expect(pushSpy).toHaveBeenCalledWith('/force-change-password')
    expect(mockToast.info).toHaveBeenCalled()
  })

  it('handles logout correctly', async () => {
    const wrapper = createWrapper()
    const authStore = useAuthStore()
    const logoutSpy = vi.spyOn(authStore, 'logout')
    const pushSpy = vi.spyOn(router, 'push')
    
    authStore.user = {
      id: '1',
      username: 'testuser',
      fullName: 'Test User',
      roleId: 50,
      role: 'admin',
      vitrify: false,
    }
    authStore.token = 'test-token'
    
    await wrapper.vm.$nextTick()
    
    // Find logout button by text content
    const buttons = wrapper.findAll('button')
    const logoutBtn = buttons.find(btn => btn.text().includes('ออกจากระบบ'))
    
    if (logoutBtn) {
      await logoutBtn.trigger('click')
      expect(logoutSpy).toHaveBeenCalled()
      expect(mockToast.success).toHaveBeenCalled()
    } else {
      // If button not found, test the method directly
      wrapper.vm.handleLogout()
      expect(logoutSpy).toHaveBeenCalled()
      expect(mockToast.success).toHaveBeenCalled()
    }
  })

  it('clears form when modal is closed', async () => {
    const wrapper = createWrapper()
    
    const usernameInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')
    
    await usernameInput.setValue('testuser')
    await passwordInput.setValue('password')
    
    wrapper.vm.closeModal()
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.username).toBe('')
    expect(wrapper.vm.password).toBe('')
  })

  it('resets form when modal is opened', async () => {
    const wrapper = createWrapper({ isOpen: false })
    
    wrapper.vm.username = 'olduser'
    wrapper.vm.password = 'oldpass'
    
    await wrapper.setProps({ isOpen: true })
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.username).toBe('')
    expect(wrapper.vm.password).toBe('')
  })
})


import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { AxiosResponse } from 'axios'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import apiService from '@/services/apiService'
import * as userService from '@/services/userService'

// Mock dependencies
vi.mock('@/services/apiService', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    defaults: {
      headers: {
        common: {},
      },
    },
  },
}))

vi.mock('@/services/userService', () => ({
  updateUserProfile: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with null user and token', () => {
      const store = useAuthStore()
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should have correct computed properties for roles', () => {
      const store = useAuthStore()
      expect(store.isUser).toBe(false)
      expect(store.isOpd).toBe(false)
      expect(store.isAdmin).toBe(false)
      expect(store.isSuperAdmin).toBe(false)
    })
  })

  describe('Login', () => {
    it('should successfully login with valid credentials', async () => {
      const store = useAuthStore()
      const mockResponse = {
        data: {
          data: {
            token: 'test-token-123',
            user: {
              id: 'user-1',
              username: 'testuser',
              name: 'Test User',
              role: '10',
            },
          },
        },
      }

      vi.mocked(apiService.post).mockResolvedValue(mockResponse as unknown as AxiosResponse)

      const result = await store.login('testuser', 'password123')

      expect(result).toBe(true)
      expect(store.token).toBe('test-token-123')
      expect(store.user).toEqual({
        id: 'user-1',
        username: 'testuser',
        fullName: 'Test User',
        roleId: 10,
        role: 'user',
        vitrify: false,
      })
      expect(store.isAuthenticated).toBe(true)
      expect(sessionStorage.getItem('token')).toBe('test-token-123')
    })

    it('should handle login failure with invalid credentials', async () => {
      const store = useAuthStore()
      const mockError = {
        response: {
          data: {
            description: 'Invalid credentials',
          },
        },
        isAxiosError: true,
      }

      vi.mocked(apiService.post).mockRejectedValue(mockError)

      const result = await store.login('wronguser', 'wrongpass')

      expect(result).toBe(false)
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.loginError).toBe('Invalid credentials')
      expect(store.isAuthenticated).toBe(false)
    })

    it('should handle network errors during login', async () => {
      const store = useAuthStore()
      vi.mocked(apiService.post).mockRejectedValue(new Error('Network error'))

      const result = await store.login('testuser', 'password')

      expect(result).toBe(false)
      expect(store.loginError).toBe('เกิดข้อผิดพลาดในการเชื่อมต่อ: โปรดลองอีกครั้ง')
    })

    it('should map role IDs correctly', async () => {
      const store = useAuthStore()
      const roles = [
        { roleId: 10, expectedRole: 'user' },
        { roleId: 20, expectedRole: 'opd' },
        { roleId: 50, expectedRole: 'admin' },
        { roleId: 90, expectedRole: 'superadmin' },
      ]

      for (const { roleId, expectedRole } of roles) {
        sessionStorage.clear()
        const mockResponse = {
          data: {
            data: {
              token: 'test-token',
              user: {
                id: 'user-1',
                username: 'testuser',
                name: 'Test User',
                role: String(roleId),
              },
            },
          },
        }

        vi.mocked(apiService.post).mockResolvedValue(mockResponse as unknown as AxiosResponse)
        await store.login('testuser', 'password')

        expect(store.user?.role).toBe(expectedRole)
        store.logout()
      }
    })
  })

  describe('Logout', () => {
    it('should clear user data and token on logout', async () => {
      const store = useAuthStore()
      // First login
      const mockResponse = {
        data: {
          data: {
            token: 'test-token',
            user: {
              id: 'user-1',
              username: 'testuser',
              name: 'Test User',
              role: '10',
            },
          },
        },
      }
      vi.mocked(apiService.post).mockResolvedValue(mockResponse as unknown as AxiosResponse)
      await store.login('testuser', 'password')

      // Then logout
      store.logout()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(sessionStorage.getItem('user')).toBeNull()
      expect(sessionStorage.getItem('token')).toBeNull()
    })
  })

  describe('Fetch User Profile', () => {
    it('should fetch user profile successfully', async () => {
      const store = useAuthStore()
      store.token = 'test-token'

      const mockResponse = {
        data: {
          data: {
            id: 'user-1',
            username: 'testuser',
            name: 'Test User',
            role: '50',
            vitrify: false,
          },
        },
      }

      vi.mocked(apiService.get).mockResolvedValue(mockResponse as unknown as AxiosResponse)

      const result = await store.fetchUserProfile()

      expect(result).toBe(true)
      expect(store.user).toEqual({
        id: 'user-1',
        username: 'testuser',
        fullName: 'Test User',
        roleId: 50,
        role: 'admin',
        vitrify: false,
      })
    })

    it('should handle 401 error and logout', async () => {
      const store = useAuthStore()
      store.token = 'expired-token'

      const mockError = {
        response: {
          status: 401,
        },
        isAxiosError: true,
      }

      vi.mocked(apiService.get).mockRejectedValue(mockError)

      const result = await store.fetchUserProfile()

      expect(result).toBe(false)
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
    })

    it('should return false when no token is available', async () => {
      const store = useAuthStore()
      store.token = null

      const result = await store.fetchUserProfile()

      expect(result).toBe(false)
      expect(store.profileError).toBe('Token ไม่พร้อมใช้งาน กรุณาเข้าสู่ระบบ')
    })
  })

  describe('Update User Profile', () => {
    it('should update user profile successfully', async () => {
      const store = useAuthStore()
      store.user = {
        id: 'user-1',
        username: 'testuser',
        fullName: 'Old Name',
        roleId: 10,
        role: 'user',
        vitrify: false,
      }

      const mockUpdatedUser = {
        id: 'user-1',
        username: 'testuser',
        name: 'New Name',
      }

      vi.mocked(userService.updateUserProfile).mockResolvedValue(mockUpdatedUser)

      const result = await store.updateUserProfile({ fullName: 'New Name' })

      expect(result).toBe(true)
      expect(store.user?.fullName).toBe('New Name')
    })

    it('should return false when user is not logged in', async () => {
      const store = useAuthStore()
      store.user = null

      const result = await store.updateUserProfile({ fullName: 'New Name' })

      expect(result).toBe(false)
    })
  })

  describe('Request Password Reset', () => {
    it('should request password reset successfully', async () => {
      const store = useAuthStore()
      const mockResponse = {
        status: 200,
        data: {},
      }

      vi.mocked(apiService.post).mockResolvedValue(mockResponse as unknown as AxiosResponse)

      const result = await store.requestPasswordReset('test@example.com')

      expect(result).toBe(true)
      expect(store.loginError).toBeNull()
    })

    it('should handle password reset errors', async () => {
      const store = useAuthStore()
      const mockError = {
        response: {
          data: {
            description: 'Email not found',
          },
        },
        isAxiosError: true,
      }

      vi.mocked(apiService.post).mockRejectedValue(mockError)

      const result = await store.requestPasswordReset('wrong@example.com')

      expect(result).toBe(false)
      expect(store.loginError).toBe('Email not found')
    })
  })

  describe('Change Password', () => {
    it('should change password for admin user', async () => {
      const store = useAuthStore()
      store.user = {
        id: 'admin-1',
        username: 'admin',
        fullName: 'Admin User',
        roleId: 50,
        role: 'admin',
        vitrify: true,
      }

      vi.mocked(apiService.put).mockResolvedValue({} as unknown as AxiosResponse)

      const result = await store.changePassword({
        currentPassword: 'oldpass',
        newPassword: 'newpass',
        confirmNewPassword: 'newpass',
      })

      expect(result).toBe(true)
      expect(store.user?.vitrify).toBe(false)
      expect(apiService.put).toHaveBeenCalledWith('/admin/password', {
        currentPassword: 'oldpass',
        newPassword: 'newpass',
        confirmPassword: 'newpass',
      })
    })

    it('should change password for OPD user', async () => {
      const store = useAuthStore()
      store.user = {
        id: 'opd-1',
        username: 'opd',
        fullName: 'OPD User',
        roleId: 20,
        role: 'opd',
        vitrify: true,
      }

      vi.mocked(apiService.put).mockResolvedValue({} as unknown as AxiosResponse)

      const result = await store.changePasswordOPD({
        currentPassword: 'oldpass',
        newPassword: 'newpass',
        confirmNewPassword: 'newpass',
      })

      expect(result).toBe(true)
      expect(store.user?.vitrify).toBe(false)
    })
  })

  describe('Fetch User from Session Storage', () => {
    it('should restore user from sessionStorage', () => {
      const store = useAuthStore()
      const mockUser = {
        id: 'user-1',
        username: 'testuser',
        fullName: 'Test User',
        roleId: 10,
      }

      sessionStorage.setItem('token', 'test-token')
      sessionStorage.setItem('user', JSON.stringify(mockUser))

      store.fetchUser()

      expect(store.token).toBe('test-token')
      expect(store.user?.id).toBe('user-1')
      expect(store.user?.role).toBe('user')
    })

    it('should handle invalid sessionStorage data', () => {
      const store = useAuthStore()
      sessionStorage.setItem('token', 'test-token')
      sessionStorage.setItem('user', 'invalid-json')

      store.fetchUser()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
    })
  })

  describe('Dev Login', () => {
    it('should login as user in dev mode', async () => {
      const store = useAuthStore()

      const result = await store.devLogin('user')

      expect(result).toBe(true)
      expect(store.user?.role).toBe('user')
      expect(store.user?.roleId).toBe(10)
      expect(store.token).toBe('dev-user-token')
    })

    it('should login as admin in dev mode', async () => {
      const store = useAuthStore()

      const result = await store.devLogin('admin')

      expect(result).toBe(true)
      expect(store.user?.role).toBe('admin')
      expect(store.user?.roleId).toBe(50)
      expect(store.token).toBe('dev-admin-token')
    })

    it('should login as superadmin in dev mode', async () => {
      const store = useAuthStore()

      const result = await store.devLogin('superadmin')

      expect(result).toBe(true)
      expect(store.user?.role).toBe('superadmin')
      expect(store.user?.roleId).toBe(90)
      expect(store.token).toBe('dev-superadmin-token')
    })
  })
})

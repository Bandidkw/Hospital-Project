// auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/apiService'
import { isAxiosError } from 'axios'
import { updateUserProfile as apiUpdateUserProfile } from '@/services/userService'

// Interface สำหรับข้อมูล User ที่เก็บใน Store
interface User {
  id: string
  username: string
  fullName: string
  roleId: number
  role: string
  vitrify: boolean
}

// Map สำหรับแปลง roleId เป็นชื่อ Role ที่อ่านง่าย
const ROLE_MAPPING: { [key: number]: string } = {
  10: 'user',
  20: 'opd',
  50: 'admin',
  90: 'superadmin',
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  // --- State Variables ---
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  // const isAuthenticated = ref(false);
  const isAuthenticating = ref(false)
  const loginError = ref<string | null>(null)
  const profileError = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value && !!token.value)

  // --- Computed Properties ---
  const getIsAuthenticated = computed(() => isAuthenticated.value)
  const getUser = computed(() => user.value)
  const getToken = computed(() => token.value)
  const isUser = computed(() => user.value?.role === 'user')
  const isOpd = computed(() => user.value?.role === 'opd')
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isSuperAdmin = computed(() => user.value?.role === 'superadmin')

  const login = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    isAuthenticating.value = true
    loginError.value = null

    try {
      const response = await apiService.post('/auth/login', {
        username: usernameInput,
        password: passwordInput,
      })

      const authToken = response.data.data.token
      if (typeof authToken === 'string' && authToken) {
        token.value = authToken // เก็บ Token ที่เป็น String โดยตรง
        sessionStorage.setItem('token', token.value) // เก็บ Token ใน sessionStorage
        apiService.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
        const loginData = response.data.data
        if (loginData.user) {
          const roleIdFromBackend = parseInt(loginData.user.role || loginData.role, 10)
          const userRole = ROLE_MAPPING[roleIdFromBackend] || 'user'

          user.value = {
            id: loginData.user.id || loginData.userId,
            username: loginData.user.username || loginData.username,
            fullName: loginData.user.name || loginData.user.fullName || loginData.username,
            roleId: roleIdFromBackend,
            role: userRole,
            vitrify: loginData.user.vitrify || false,
          }

          sessionStorage.setItem('user', JSON.stringify(user.value))
          return true
        } else {
          // หากไม่มีข้อมูล user ใน response ให้ลองเรียก fetchUserProfile
          const profileFetched = await fetchUserProfile()
          if (profileFetched) {
            return true
          } else {
            loginError.value = 'เข้าสู่ระบบสำเร็จแต่ไม่สามารถดึงข้อมูลโปรไฟล์ได้'
            logout()
            return false
          }
        }
      } else {
        loginError.value =
          'ข้อมูลการเข้าสู่ระบบไม่สมบูรณ์จากเซิร์ฟเวอร์ (ไม่ได้รับ Token ที่ถูกต้อง)'
        return false
      }
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        loginError.value = error.response.data.description || 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง'
        console.error('ข้อผิดพลาด API การเข้าสู่ระบบ:', error.response.data)
      } else {
        loginError.value = 'เกิดข้อผิดพลาดในการเชื่อมต่อ: โปรดลองอีกครั้ง'
        console.error('ข้อผิดพลาดเครือข่ายการเข้าสู่ระบบ:', error)
      }
      user.value = null
      token.value = null
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('token')

      return false
    } finally {
      isAuthenticating.value = false
    }
  }

  const updateUserProfile = async (newProfileData: { fullName: string }): Promise<boolean> => {
    if (!user.value) {
      console.error('ไม่สามารถอัปเดตโปรไฟล์ได้: ไม่มีผู้ใช้งานในระบบ')
      return false
    }

    try {
      const payload = {
        name: newProfileData.fullName,
        username: user.value.username,
      }
      const updatedUserData = await apiUpdateUserProfile(payload)
      if (updatedUserData) {
        user.value.fullName = updatedUserData.name || updatedUserData.fullName
        sessionStorage.setItem('user', JSON.stringify(user.value))
      }

      console.log('อัปเดตโปรไฟล์สำเร็จ:', user.value)
      return true
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์:', error)
      return false
    }
  }
  const requestPasswordReset = async (email: string): Promise<boolean> => {
    isAuthenticating.value = true
    loginError.value = null

    try {
      const response = await apiService.post('/forgot-password', { email })

      if (response.status === 200 || response.status === 204) {
        console.log('ส่งคำขอรีเซ็ตรหัสผ่านสำเร็จสำหรับอีเมล:', email)
        return true
      } else {
        const errorData = response.data
        loginError.value = errorData.message || 'ไม่สามารถส่งคำขอรีเซ็ตรหัสผ่านได้'
        return false
      }
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        loginError.value =
          error.response.data.description || 'ไม่สามารถส่งคำขอรีเซ็ตรหัสผ่านได้: กรุณาตรวจสอบอีเมล'
        console.error('ข้อผิดพลาด API การรีเซ็ตรหัสผ่าน:', error.response.data)
      } else {
        loginError.value = 'เกิดข้อผิดพลาดในการเชื่อมต่อ: โปรดลองอีกครั้ง'
        console.error('ข้อผิดพลาดเครือข่ายการรีเซ็ตรหัสผ่าน:', error)
      }
      return false
    } finally {
      isAuthenticating.value = false
    }
  }
  const fetchUserProfile = async (): Promise<boolean> => {
    profileError.value = null // เคลียร์ error เก่าก่อนเริ่ม
    if (!token.value) {
      profileError.value = 'Token ไม่พร้อมใช้งาน กรุณาเข้าสู่ระบบ'
      return false
    }
    try {
      const response = await apiService.get('/auth/profile')
      const backendUser = response.data.data // จาก Response ล่าสุดของ /auth/profile, response.data.data คือ Object ผู้ใช้

      if (backendUser) {
        const roleIdFromBackend = parseInt(backendUser.role, 10)
        const userRole = ROLE_MAPPING[roleIdFromBackend] || 'user'
        user.value = {
          id: backendUser.id,
          username: backendUser.username,
          fullName: backendUser.name || backendUser.fullName,
          roleId: roleIdFromBackend,
          role: userRole,
          vitrify: backendUser.vitrify || false,
        }
        sessionStorage.setItem('user', JSON.stringify(user.value))
        return true
      } else {
        profileError.value = 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้: ข้อมูลไม่สมบูรณ์'
        return false
      }
    } catch (error: unknown) {
      console.error('การดึงข้อมูลโปรไฟล์ผู้ใช้ล้มเหลว:', error)
      if (isAxiosError(error) && error.response && error.response.status === 401) {
        logout() // Logout อัตโนมัติเมื่อ Token หมดอายุ
        profileError.value = 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง'
      } else {
        profileError.value = 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้: เกิดข้อผิดพลาด'
      }
      return false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    // isAuthenticated.value = false;
    loginError.value = null
    profileError.value = null
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('token')
    delete apiService.defaults.headers.common['Authorization']
    router.push('/')
  }

  const devLogin = async (role: 'user' | 'admin' | 'superadmin'): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let devUser: User | null = null
        let devToken: string | null = null

        if (role === 'user') {
          devUser = {
            id: 'dev-user-1',
            username: 'dev_user',
            fullName: 'Dev User',
            roleId: 10,
            role: 'user',
            vitrify: false,
          }
          devToken = 'dev-user-token'
        } else if (role === 'admin') {
          devUser = {
            id: 'dev-admin-1',
            username: 'dev_admin',
            fullName: 'Dev Admin',
            roleId: 50,
            role: 'admin',
            vitrify: false,
          }
          devToken = 'dev-admin-token'
        } else if (role === 'superadmin') {
          devUser = {
            id: 'dev-superadmin-1',
            username: 'dev_superadmin',
            fullName: 'Dev Super Admin',
            roleId: 90,
            role: 'superadmin',
            vitrify: false,
          }
          devToken = 'dev-superadmin-token'
        }

        if (devUser && devToken) {
          user.value = devUser
          token.value = devToken
          // isAuthenticated.value = true;
          if (user.value) {
            sessionStorage.setItem('user', JSON.stringify(user.value))
          }
          if (token.value) {
            sessionStorage.setItem('token', token.value)
          }
          // ตั้งค่า Authorization Header สำหรับ Dev Login
          apiService.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
          resolve(true)
        } else {
          loginError.value = 'บทบาท Dev ไม่ถูกต้อง'
          // isAuthenticated.value = false;
          user.value = null
          token.value = null
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
          resolve(false)
        }
      }, 300)
    })
  }

  const fetchUser = () => {
    const storedUser = sessionStorage.getItem('user')
    const storedToken = sessionStorage.getItem('token')
    if (storedToken) {
      // ตรวจสอบแค่ token ก่อน
      token.value = storedToken
      // ตั้งค่า Authorization Header ทันทีที่พบ Token
      apiService.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

      // ถ้ามี user ใน sessionStorage ด้วย ก็ดึงมาใช้
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          if (
            parsedUser &&
            typeof parsedUser.id === 'string' &&
            typeof parsedUser.username === 'string' &&
            typeof parsedUser.fullName === 'string' &&
            typeof parsedUser.roleId === 'number'
          ) {
            const userRole = ROLE_MAPPING[parsedUser.roleId] || 'user'
            user.value = { ...parsedUser, role: userRole }
            // isAuthenticated.value = true;
            // console.log('ดึงข้อมูลผู้ใช้จาก sessionStorage สำเร็จ:', user.value)
          } else {
            console.warn('ข้อมูลผู้ใช้ใน sessionStorage ไม่ถูกต้อง ล้างข้อมูล...')
            logout() // ล้างข้อมูลหากไม่ถูกต้อง
          }
        } catch (e) {
          console.error('ไม่สามารถแยกวิเคราะห์ข้อมูลผู้ใช้จาก sessionStorage:', e)
          logout() // ล้างข้อมูลหากเกิดข้อผิดพลาดในการแยกวิเคราะห์
        }
      } else {
        // ถ้ามี Token แต่ไม่มี User ใน sessionStorage ให้เรียก fetchUserProfile เพื่อดึงข้อมูล
        console.log('พบ Token แต่ไม่มีข้อมูล User ใน sessionStorage, กำลังดึงข้อมูลโปรไฟล์...')
        fetchUserProfile() // ไม่ต้อง await เพราะไม่ต้องการบล็อกการทำงาน
      }
    } else {
      // isAuthenticated.value = false;
      user.value = null
      token.value = null
    }
  }

  const changePassword = async (passwords: {
    currentPassword: string
    newPassword: string
    confirmNewPassword: string
  }): Promise<boolean> => {
    try {
      const payload = {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmNewPassword,
      }
      let apiUrl: string
      const userRole = user.value?.role

      if (userRole === 'admin') {
        apiUrl = '/admin/password'
      } else if (userRole === 'opd') {
        apiUrl = '/opd/change-password'
      } else if (userRole === 'superadmin') {
        apiUrl = '/super-admin/password'
      } else {
        console.error('ไม่พบ role ที่ถูกต้องสำหรับการเปลี่ยนรหัสผ่าน')
        return false
      }
      await apiService.put(apiUrl, payload)
      if (user.value) {
        user.value.vitrify = false
      }
      console.log('เปลี่ยนรหัสผ่านสำเร็จ')
      return true
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน:', error)
      return false
    }
  }

  const changePasswordOPD = async (passwords: {
    currentPassword: string
    newPassword: string
    confirmNewPassword: string
  }): Promise<boolean> => {
    try {
      const payload = {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmNewPassword,
      }
      await apiService.put('/opd/change-password', payload)
      if (user.value) {
        user.value.vitrify = false
      }
      console.log('เปลี่ยนรหัสผ่านสำเร็จ')
      return true
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน:', error)
      return false
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isAuthenticating,
    loginError,
    profileError,
    getIsAuthenticated,
    getUser,
    getToken,
    isUser,
    isOpd,
    isAdmin,
    isSuperAdmin,
    login,
    logout,
    fetchUserProfile,
    devLogin,
    fetchUser,
    requestPasswordReset,
    changePassword,
    changePasswordOPD,
    updateUserProfile,
  }
})

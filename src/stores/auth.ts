/**
 * Auth Store - จัดการระบบการยืนยันตัวตนและข้อมูลผู้ใช้
 * ใช้ Pinia สำหรับจัดการ state ของการเข้าสู่ระบบ
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/apiService'
import { isAxiosError } from 'axios'
import { updateUserProfile as apiUpdateUserProfile } from '@/services/userService'

/**
 * Interface สำหรับข้อมูลผู้ใช้ที่เก็บใน Store
 * @interface User
 * @property {string} id - รหัสผู้ใช้
 * @property {string} username - ชื่อผู้ใช้สำหรับเข้าสู่ระบบ
 * @property {string} fullName - ชื่อเต็มของผู้ใช้
 * @property {number} roleId - รหัสบทบาทผู้ใช้ (10=user, 20=opd, 50=admin, 90=superadmin)
 * @property {string} role - ชื่อบทบาทผู้ใช้ในรูปแบบข้อความ
 * @property {boolean} vitrify - สถานะการยืนยันตัวตน (ต้องเปลี่ยนรหัสผ่านหรือไม่)
 */
interface User {
  id: string
  username: string
  fullName: string
  roleId: number
  role: string
  vitrify: boolean
}

/**
 * แผนที่สำหรับแปลงรหัสบทบาท (roleId) เป็นชื่อบทบาทที่อ่านง่าย
 * 10 = ผู้ใช้ทั่วไป, 20 = หน่วยงาน OPD, 50 = ผู้ดูแลระบบ, 90 = ผู้ดูแลระบบสูงสุด
 */
const ROLE_MAPPING: { [key: number]: string } = {
  10: 'user',
  20: 'opd',
  50: 'admin',
  90: 'superadmin',
}

/**
 * Auth Store - ระบบจัดการการยืนยันตัวตนและข้อมูลผู้ใช้
 * ใช้ Composition API pattern ของ Pinia
 */
export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  // ===== ตัวแปร State หลัก =====

  /** ข้อมูลผู้ใช้ปัจจุบัน - null หากยังไม่ได้เข้าสู่ระบบ */
  const user = ref<User | null>(null)

  /** Token สำหรับการยืนยันตัวตน - ใช้ในการเรียก API */
  const token = ref<string | null>(null)

  /** สถานะการกำลังเข้าสู่ระบบ - ใช้แสดง loading */
  const isAuthenticating = ref(false)

  /** ข้อความแสดงข้อผิดพลาดจากการเข้าสู่ระบบ */
  const loginError = ref<string | null>(null)

  /** ข้อความแสดงข้อผิดพลาดจากการดึงข้อมูลโปรไฟล์ */
  const profileError = ref<string | null>(null)

  // ===== Computed Properties =====

  /** ตรวจสอบว่าผู้ใช้เข้าสู่ระบบแล้วหรือไม่ (มีทั้ง user และ token) */
  const isAuthenticated = computed(() => !!user.value && !!token.value)

  /** Getter สำหรับสถานะการเข้าสู่ระบบ */
  const getIsAuthenticated = computed(() => isAuthenticated.value)

  /** Getter สำหรับข้อมูลผู้ใช้ */
  const getUser = computed(() => user.value)

  /** Getter สำหรับ token */
  const getToken = computed(() => token.value)

  /** ตรวจสอบว่าผู้ใช้เป็น user ทั่วไปหรือไม่ */
  const isUser = computed(() => user.value?.role === 'user')

  /** ตรวจสอบว่าผู้ใช้เป็น OPD หรือไม่ */
  const isOpd = computed(() => user.value?.role === 'opd')

  /** ตรวจสอบว่าผู้ใช้เป็น admin หรือไม่ */
  const isAdmin = computed(() => user.value?.role === 'admin')

  /** ตรวจสอบว่าผู้ใช้เป็น superadmin หรือไม่ */
  const isSuperAdmin = computed(() => user.value?.role === 'superadmin')

  // ===== ฟังก์ชันหลัก =====

  /**
   * ฟังก์ชันเข้าสู่ระบบ
   * @param usernameInput - ชื่อผู้ใช้
   * @param passwordInput - รหัสผ่าน
   * @returns Promise<boolean> - true หากเข้าสู่ระบบสำเร็จ, false หากล้มเหลว
   */
  const login = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    // เริ่มต้นกระบวนการเข้าสู่ระบบ
    isAuthenticating.value = true
    loginError.value = null

    try {
      // เรียก API เพื่อเข้าสู่ระบบ
      const response = await apiService.post('/auth/login', {
        username: usernameInput,
        password: passwordInput,
      })

      // ดึง token จาก response
      const authToken = response.data.data.token
      if (typeof authToken === 'string' && authToken) {
        // เก็บ token และตั้งค่า authorization header
        token.value = authToken
        sessionStorage.setItem('token', token.value)
        apiService.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

        const loginData = response.data.data
        if (loginData.user) {
          // แปลง roleId จากเซิร์ฟเวอร์เป็นชื่อบทบาท
          const roleIdFromBackend = parseInt(loginData.user.role || loginData.role, 10)
          const userRole = ROLE_MAPPING[roleIdFromBackend] || 'user'

          // สร้างข้อมูลผู้ใช้และเก็บใน store
          user.value = {
            id: loginData.user.id || loginData.userId,
            username: loginData.user.username || loginData.username,
            fullName: loginData.user.name || loginData.user.fullName || loginData.username,
            roleId: roleIdFromBackend,
            role: userRole,
            vitrify: loginData.user.vitrify || false,
          }

          // เก็บข้อมูลผู้ใช้ใน sessionStorage
          sessionStorage.setItem('user', JSON.stringify(user.value))
          return true
        } else {
          // หากไม่มีข้อมูล user ใน response ให้ลองดึงจาก profile API
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
      // จัดการข้อผิดพลาดจากการเข้าสู่ระบบ
      if (isAxiosError(error) && error.response) {
        loginError.value = error.response.data.description || 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง'
        console.error('ข้อผิดพลาด API การเข้าสู่ระบบ:', error.response.data)
      } else {
        loginError.value = 'เกิดข้อผิดพลาดในการเชื่อมต่อ: โปรดลองอีกครั้ง'
        console.error('ข้อผิดพลาดเครือข่ายการเข้าสู่ระบบ:', error)
      }

      // ล้างข้อมูลเมื่อเข้าสู่ระบบล้มเหลว
      user.value = null
      token.value = null
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('token')

      return false
    } finally {
      // สิ้นสุดกระบวนการเข้าสู่ระบบ
      isAuthenticating.value = false
    }
  }

  /**
   * อัปเดตข้อมูลโปรไฟล์ผู้ใช้
   * @param newProfileData - ข้อมูลโปรไฟล์ใหม่ที่ต้องการอัปเดต
   * @returns Promise<boolean> - true หากอัปเดตสำเร็จ, false หากล้มเหลว
   */
  const updateUserProfile = async (newProfileData: {
    fullName: string
    username: string
  }): Promise<boolean> => {
    // ตรวจสอบว่ามีผู้ใช้เข้าสู่ระบบอยู่หรือไม่
    if (!user.value) {
      console.error('ไม่สามารถอัปเดตโปรไฟล์ได้: ไม่มีผู้ใช้งานในระบบ')
      return false
    }

    try {
      // เตรียมข้อมูลสำหรับส่งไปยัง API
      const payload = {
        name: newProfileData.fullName,
        username: newProfileData.username,
      }

      // เรียก API เพื่ออัปเดตโปรไฟล์ โดยส่ง role ไปด้วยเพื่อให้เลือก endpoint ถูกต้อง
      const updatedUserData = await apiUpdateUserProfile(payload, user.value.role)
      if (updatedUserData) {
        // อัปเดตข้อมูลใน store และ sessionStorage
        user.value.fullName = updatedUserData.name || updatedUserData.fullName
        user.value.username = updatedUserData.username || user.value.username
        sessionStorage.setItem('user', JSON.stringify(user.value))
      }

      console.log('อัปเดตโปรไฟล์สำเร็จ:', user.value)
      return true
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์:', error)
      return false
    }
  }
  /**
   * ส่งคำขอรีเซ็ตรหัสผ่านผ่านอีเมล
   * @param email - อีเมลของผู้ใช้ที่ต้องการรีเซ็ตรหัสผ่าน
   * @returns Promise<boolean> - true หากส่งคำขอสำเร็จ, false หากล้มเหลว
   */
  const requestPasswordReset = async (email: string): Promise<boolean> => {
    // เริ่มต้นกระบวนการส่งคำขอ
    isAuthenticating.value = true
    loginError.value = null

    try {
      // เรียก API เพื่อส่งคำขอรีเซ็ตรหัสผ่าน
      const response = await apiService.post('/forgot-password', { email })

      // ตรวจสอบสถานะการตอบกลับ
      if (response.status === 200 || response.status === 204) {
        console.log('ส่งคำขอรีเซ็ตรหัสผ่านสำเร็จสำหรับอีเมล:', email)
        return true
      } else {
        const errorData = response.data
        loginError.value = errorData.message || 'ไม่สามารถส่งคำขอรีเซ็ตรหัสผ่านได้'
        return false
      }
    } catch (error: unknown) {
      // จัดการข้อผิดพลาดจากการส่งคำขอ
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
      // สิ้นสุดกระบวนการส่งคำขอ
      isAuthenticating.value = false
    }
  }
  /**
   * ดึงข้อมูลโปรไฟล์ผู้ใช้จาก API
   * ใช้เมื่อมี token แต่ไม่มีข้อมูลผู้ใช้ หรือต้องการรีเฟรชข้อมูล
   * @returns Promise<boolean> - true หากดึงข้อมูลสำเร็จ, false หากล้มเหลว
   */
  const fetchUserProfile = async (): Promise<boolean> => {
    // เคลียร์ข้อผิดพลาดเก่าก่อนเริ่ม
    profileError.value = null

    // ตรวจสอบว่ามี token หรือไม่
    if (!token.value) {
      profileError.value = 'Token ไม่พร้อมใช้งาน กรุณาเข้าสู่ระบบ'
      return false
    }

    try {
      // เรียก API เพื่อดึงข้อมูลโปรไฟล์
      const response = await apiService.get('/auth/profile')
      const backendUser = response.data.data // ข้อมูลผู้ใช้จาก API

      if (backendUser) {
        // แปลง roleId และสร้างข้อมูลผู้ใช้
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

        // เก็บข้อมูลใน sessionStorage
        sessionStorage.setItem('user', JSON.stringify(user.value))
        return true
      } else {
        profileError.value = 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้: ข้อมูลไม่สมบูรณ์'
        return false
      }
    } catch (error: unknown) {
      console.error('การดึงข้อมูลโปรไฟล์ผู้ใช้ล้มเหลว:', error)

      // จัดการกรณี token หมดอายุ (401 Unauthorized)
      if (isAxiosError(error) && error.response && error.response.status === 401) {
        logout() // ออกจากระบบอัตโนมัติเมื่อ token หมดอายุ
        profileError.value = 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง'
      } else {
        profileError.value = 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้: เกิดข้อผิดพลาด'
      }
      return false
    }
  }

  /**
   * ออกจากระบบ - ล้างข้อมูลทั้งหมดและเปลี่ยนเส้นทางไปหน้าแรก
   * ลบข้อมูลจาก store, sessionStorage และ authorization header
   */
  const logout = () => {
    // ล้างข้อมูลใน store
    user.value = null
    token.value = null
    loginError.value = null
    profileError.value = null

    // ลบข้อมูลจาก sessionStorage
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('token')

    // ลบ authorization header จาก API service
    delete apiService.defaults.headers.common['Authorization']

    // เปลี่ยนเส้นทางไปหน้าแรก
    router.push('/')
  }

  /**
   * ฟังก์ชันเข้าสู่ระบบสำหรับการพัฒนา (Development Login)
   * ใช้สำหรับทดสอบระบบโดยไม่ต้องเชื่อมต่อกับเซิร์ฟเวอร์จริง
   * @param role - บทบาทที่ต้องการทดสอบ ('user' | 'admin' | 'superadmin')
   * @returns Promise<boolean> - true หากสร้างผู้ใช้ทดสอบสำเร็จ
   */
  const devLogin = async (role: 'user' | 'admin' | 'superadmin'): Promise<boolean> => {
    return new Promise((resolve) => {
      // จำลองการหน่วงเวลาของการเรียก API
      setTimeout(() => {
        let devUser: User | null = null
        let devToken: string | null = null

        // สร้างข้อมูลผู้ใช้ทดสอบตามบทบาทที่เลือก
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

        // ตั้งค่าข้อมูลผู้ใช้และ token หากสร้างสำเร็จ
        if (devUser && devToken) {
          user.value = devUser
          token.value = devToken

          // เก็บข้อมูลใน sessionStorage
          sessionStorage.setItem('user', JSON.stringify(user.value))
          sessionStorage.setItem('token', token.value)

          // ตั้งค่า authorization header สำหรับ dev login
          apiService.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
          resolve(true)
        } else {
          // จัดการกรณีบทบาทไม่ถูกต้อง
          loginError.value = 'บทบาท Dev ไม่ถูกต้อง'
          user.value = null
          token.value = null
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
          resolve(false)
        }
      }, 300) // หน่วงเวลา 300ms เพื่อจำลองการเรียก API
    })
  }

  /**
   * ดึงข้อมูลผู้ใช้จาก sessionStorage เมื่อเริ่มต้นแอปพลิเคชัน
   * ใช้เพื่อกู้คืนสถานะการเข้าสู่ระบบเมื่อผู้ใช้รีเฟรชหน้าเว็บ
   */
  const fetchUser = () => {
    const storedUser = sessionStorage.getItem('user')
    const storedToken = sessionStorage.getItem('token')

    if (storedToken) {
      // ตั้งค่า token และ authorization header ทันที
      token.value = storedToken
      apiService.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

      // ตรวจสอบและดึงข้อมูลผู้ใช้จาก sessionStorage
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)

          // ตรวจสอบความถูกต้องของข้อมูลผู้ใช้
          if (
            parsedUser &&
            typeof parsedUser.id === 'string' &&
            typeof parsedUser.username === 'string' &&
            typeof parsedUser.fullName === 'string' &&
            typeof parsedUser.roleId === 'number'
          ) {
            // แปลง roleId เป็นชื่อบทบาทและตั้งค่าข้อมูลผู้ใช้
            const userRole = ROLE_MAPPING[parsedUser.roleId] || 'user'
            user.value = { ...parsedUser, role: userRole }
          } else {
            console.warn('ข้อมูลผู้ใช้ใน sessionStorage ไม่ถูกต้อง ล้างข้อมูล...')
            logout() // ล้างข้อมูลหากไม่ถูกต้อง
          }
        } catch (e) {
          console.error('ไม่สามารถแยกวิเคราะห์ข้อมูลผู้ใช้จาก sessionStorage:', e)
          logout() // ล้างข้อมูลหากเกิดข้อผิดพลาดในการแยกวิเคราะห์
        }
      } else {
        // หากมี token แต่ไม่มีข้อมูลผู้ใช้ ให้ดึงจาก API
        console.log('พบ Token แต่ไม่มีข้อมูล User ใน sessionStorage, กำลังดึงข้อมูลโปรไฟล์...')
        fetchUserProfile() // ไม่ต้อง await เพราะไม่ต้องการบล็อกการทำงาน
      }
    } else {
      // หากไม่มี token ให้ล้างข้อมูลทั้งหมด
      user.value = null
      token.value = null
    }
  }

  /**
   * เปลี่ยนรหัสผ่านสำหรับผู้ใช้ทุกบทบาท (ยกเว้น OPD)
   * เลือก API endpoint ตามบทบาทของผู้ใช้
   * @param passwords - ข้อมูลรหัสผ่านเก่าและใหม่
   * @returns Promise<boolean> - true หากเปลี่ยนรหัสผ่านสำเร็จ
   */
  const changePassword = async (passwords: {
    currentPassword: string
    newPassword: string
    confirmNewPassword: string
  }): Promise<boolean> => {
    try {
      // เตรียมข้อมูลสำหรับส่งไปยัง API
      const payload = {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmNewPassword,
      }

      // เลือก API endpoint ตามบทบาทของผู้ใช้
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

      // เรียก API เพื่อเปลี่ยนรหัสผ่าน
      await apiService.put(apiUrl, payload)

      // อัปเดตสถานะ vitrify เป็น false (ไม่ต้องเปลี่ยนรหัสผ่านอีก)
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

  /**
   * เปลี่ยนรหัสผ่านสำหรับผู้ใช้ OPD โดยเฉพาะ
   * ใช้ API endpoint เฉพาะสำหรับ OPD
   * @param passwords - ข้อมูลรหัสผ่านเก่าและใหม่
   * @returns Promise<boolean> - true หากเปลี่ยนรหัสผ่านสำเร็จ
   */
  const changePasswordOPD = async (passwords: {
    currentPassword: string
    newPassword: string
    confirmNewPassword: string
  }): Promise<boolean> => {
    try {
      // เตรียมข้อมูลสำหรับส่งไปยัง API
      const payload = {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmNewPassword,
      }

      // เรียก API เฉพาะสำหรับ OPD
      await apiService.put('/opd/change-password', payload)

      // อัปเดตสถานะ vitrify เป็น false
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

  // ===== Return Object =====
  // ส่งออกฟังก์ชันและตัวแปรทั้งหมดที่ต้องการใช้งานภายนอก store

  return {
    // ===== State Variables =====
    user, // ข้อมูลผู้ใช้ปัจจุบัน
    token, // Token สำหรับการยืนยันตัวตน
    isAuthenticated, // สถานะการเข้าสู่ระบบ
    isAuthenticating, // สถานะการกำลังเข้าสู่ระบบ
    loginError, // ข้อผิดพลาดจากการเข้าสู่ระบบ
    profileError, // ข้อผิดพลาดจากการดึงโปรไฟล์

    // ===== Computed Properties =====
    getIsAuthenticated, // Getter สำหรับสถานะการเข้าสู่ระบบ
    getUser, // Getter สำหรับข้อมูลผู้ใช้
    getToken, // Getter สำหรับ token
    isUser, // ตรวจสอบบทบาท user
    isOpd, // ตรวจสอบบทบาท OPD
    isAdmin, // ตรวจสอบบทบาท admin
    isSuperAdmin, // ตรวจสอบบทบาท superadmin

    // ===== Functions =====
    login, // ฟังก์ชันเข้าสู่ระบบ
    logout, // ฟังก์ชันออกจากระบบ
    fetchUserProfile, // ดึงข้อมูลโปรไฟล์จาก API
    devLogin, // เข้าสู่ระบบสำหรับการพัฒนา
    fetchUser, // ดึงข้อมูลจาก sessionStorage
    requestPasswordReset, // ส่งคำขอรีเซ็ตรหัสผ่าน
    changePassword, // เปลี่ยนรหัสผ่าน (ทุกบทบาท)
    changePasswordOPD, // เปลี่ยนรหัสผ่าน (OPD เฉพาะ)
    updateUserProfile, // อัปเดตข้อมูลโปรไฟล์
  }
})

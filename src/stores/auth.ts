import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Interface สำหรับ User Object
interface User {
  id: string
  username: string
  fullName: string
  email?: string
  roleId: number
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)
  const isAuthenticating = ref(false)
  const loginError = ref<string | null>(null)

  // Getters (Computed Properties)
  const getIsAuthenticated = computed(() => isAuthenticated.value)
  const getUser = computed(() => user.value)
  const getToken = computed(() => token.value)

  // Computed properties สำหรับบทบาทต่างๆ
  const isUser = computed(() => user.value?.role === 'user')
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isSuperAdmin = computed(() => user.value?.role === 'superadmin')

  // Actions
  const login = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    isAuthenticating.value = true
    loginError.value = null // Reset error on new login attempt

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        let loggedInUser: User | null = null;
        let authToken: string | null = null;

        if (usernameInput === 'user' && passwordInput === 'password') {
          loggedInUser = {
            id: '1',
            username: 'user',
            fullName: 'User One',
            roleId: 1,
            role: 'user',
          }
          authToken = 'user-token-123'
        } else if (usernameInput === 'admin' && passwordInput === 'adminpass') {
          loggedInUser = {
            id: '2',
            username: 'admin',
            fullName: 'Admin User',
            roleId: 2,
            role: 'admin',
          }
          authToken = 'admin-token-456'
        } else if (usernameInput === 'superadmin' && passwordInput === 'superadminpass') {
          loggedInUser = {
            id: '3',
            username: 'superadmin',
            fullName: 'Super Admin',
            roleId: 3,
            role: 'superadmin',
          }
          authToken = 'superadmin-token-789'
        }

        if (loggedInUser && authToken) {
          user.value = loggedInUser;
          token.value = authToken;
          isAuthenticated.value = true;
          // Save user and token to localStorage
          localStorage.setItem('user', JSON.stringify(user.value));
          localStorage.setItem('token', token.value);
          resolve(true)
        } else {
          loginError.value = 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง'
          isAuthenticated.value = false
          user.value = null
          token.value = null
          localStorage.removeItem('user'); // Clear localStorage on failed login
          localStorage.removeItem('token'); // Clear localStorage on failed login
          resolve(false)
        }
        isAuthenticating.value = false
      }, 1000)
    })
  }

  const logout = () => {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    loginError.value = null
    localStorage.removeItem('user'); // Remove user from localStorage
    localStorage.removeItem('token'); // Remove token from localStorage
    console.log('Logged out - localStorage cleared.')
  }

  // Dev Login สำหรับการทดสอบ
  const devLogin = async (role: 'user' | 'admin' | 'superadmin'): Promise<boolean> => {
    isAuthenticating.value = true
    loginError.value = null
    return new Promise((resolve) => {
      setTimeout(() => {
        let devUser: User | null = null;
        let devToken: string | null = null;

        if (role === 'user') {
          devUser = {
            id: 'dev-user-1',
            username: 'dev_user',
            fullName: 'Dev User',
            roleId: 10,
            role: 'user',
          }
          devToken = 'dev-user-token'
        } else if (role === 'admin') {
          devUser = {
            id: 'dev-admin-1',
            username: 'dev_admin',
            fullName: 'Dev Admin',
            roleId: 50,
            role: 'admin',
          }
          devToken = 'dev-admin-token'
        } else if (role === 'superadmin') {
          devUser = {
            id: 'dev-superadmin-1',
            username: 'dev_superadmin',
            fullName: 'Dev Super Admin',
            roleId: 90,
            role: 'superadmin',
          }
          devToken = 'dev-superadmin-token'
        }

        if (devUser && devToken) {
            user.value = devUser;
            token.value = devToken;
            isAuthenticated.value = true;
            localStorage.setItem('user', JSON.stringify(user.value));
            localStorage.setItem('token', token.value);
            resolve(true);
        } else {
            loginError.value = 'บทบาท Dev ไม่ถูกต้อง';
            isAuthenticated.value = false;
            user.value = null;
            token.value = null;
            localStorage.removeItem('user'); // Clear localStorage on failed dev login
            localStorage.removeItem('token'); // Clear localStorage on failed dev login
            resolve(false);
        }
        isAuthenticating.value = false;
      }, 300)
    })
  }

  // เพิ่ม action สำหรับดึงข้อมูลผู้ใช้จาก Local Storage หรือ API
  const fetchUser = () => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Basic validation for parsedUser to ensure it's a valid User object
        if (parsedUser && typeof parsedUser.id === 'string' && typeof parsedUser.username === 'string' && typeof parsedUser.role === 'string') {
            user.value = parsedUser;
            token.value = storedToken;
            isAuthenticated.value = true;
            console.log('User fetched from localStorage:', user.value);
        } else {
            console.warn('Invalid user data in localStorage. Clearing...');
            logout(); // Clear invalid data
        }
      } catch (e) {
        console.error('Failed to parse user or token from localStorage:', e);
        logout(); // Clear invalid data
      }
    } else {
      isAuthenticated.value = false;
      user.value = null;
      token.value = null;
    }
  };


  return {
    user,
    token,
    isAuthenticated,
    isAuthenticating,
    loginError,
    getIsAuthenticated,
    getUser,
    getToken,
    isUser,
    isAdmin,
    isSuperAdmin,
    login,
    logout,
    devLogin,
    fetchUser,
  }
})

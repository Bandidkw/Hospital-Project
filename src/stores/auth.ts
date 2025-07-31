import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  roleId: number;
  role: string;
}

const ROLE_MAPPING: { [key: number]: string } = {
  10: 'user',
  50: 'admin',
  90: 'superadmin',
};

// VITE_API_BASE_URL มาจากไฟล์ .env.development
const API_BASE_URL = 'https://test-hospital-project-backend.wnimqo.easypanel.host';
console.log('API_BASE_URL loaded from .env:', API_BASE_URL);

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isAuthenticated = ref(false);
  const isAuthenticating = ref(false);
  const loginError = ref<string | null>(null);

  const getIsAuthenticated = computed(() => isAuthenticated.value);
  const getUser = computed(() => user.value);
  const getToken = computed(() => token.value);

  const isUser = computed(() => user.value?.role === 'user');
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isSuperAdmin = computed(() => user.value?.role === 'superadmin');

  const login = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    isAuthenticating.value = true;
    loginError.value = null;

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username: usernameInput,
        password: passwordInput,
      });

      const { user: backendUser, token: authToken } = response.data;

      if (backendUser && authToken) {
        const userRole = ROLE_MAPPING[backendUser.roleId] || 'user';

        const loggedInUser: User = {
          id: backendUser.id,
          username: backendUser.username,
          fullName: backendUser.fullName || backendUser.username,
          email: backendUser.email,
          roleId: backendUser.roleId,
          role: userRole,
        };

        user.value = loggedInUser;
        token.value = authToken;
        isAuthenticated.value = true;

        localStorage.setItem('user', JSON.stringify(user.value));
        if (token.value) {
          localStorage.setItem('token', token.value);
        }
        console.log('Login successful:', loggedInUser);
        return true;
      } else {
        loginError.value = 'ข้อมูลการเข้าสู่ระบบไม่สมบูรณ์จากเซิร์ฟเวอร์';
        return false;
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        loginError.value = error.response.data.message || 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง';
        console.error('Login API Error:', error.response.data);
      } else {
        loginError.value = 'เกิดข้อผิดพลาดในการเชื่อมต่อ: โปรดลองอีกครั้ง';
        console.error('Login Network Error:', error);
      }
      isAuthenticated.value = false;
      user.value = null;
      token.value = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return false;
    } finally {
      isAuthenticating.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    loginError.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log('Logged out - localStorage cleared.');
    router.push('/');
  };

  const devLogin = async (role: 'user' | 'admin' | 'superadmin'): Promise<boolean> => {
    isAuthenticating.value = true;
    loginError.value = null;
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
          };
          devToken = 'dev-user-token';
        } else if (role === 'admin') {
          devUser = {
            id: 'dev-admin-1',
            username: 'dev_admin',
            fullName: 'Dev Admin',
            roleId: 50,
            role: 'admin',
          };
          devToken = 'dev-admin-token';
        } else if (role === 'superadmin') {
          devUser = {
            id: 'dev-superadmin-1',
            username: 'dev_superadmin',
            fullName: 'Dev Super Admin',
            roleId: 90,
            role: 'superadmin',
          };
          devToken = 'dev-superadmin-token';
        }

        if (devUser && devToken) {
            user.value = devUser;
            token.value = devToken;
            isAuthenticated.value = true;
            if (user.value) {
              localStorage.setItem('user', JSON.stringify(user.value));
            }
            if (token.value) {
              localStorage.setItem('token', token.value);
            }
            resolve(true);
        } else {
            loginError.value = 'บทบาท Dev ไม่ถูกต้อง';
            isAuthenticated.value = false;
            user.value = null;
            token.value = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            resolve(false);
        }
        isAuthenticating.value = false;
      }, 300);
    });
  };

  const fetchUser = () => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser.id === 'string' && typeof parsedUser.username === 'string' && typeof parsedUser.roleId === 'number') {
            const userRole = ROLE_MAPPING[parsedUser.roleId] || 'user';
            user.value = { ...parsedUser, role: userRole };
            token.value = storedToken;
            isAuthenticated.value = true;
            console.log('User fetched from localStorage:', user.value);
        } else {
            console.warn('Invalid user data in localStorage. Clearing...');
            logout();
        }
      } catch (e) {
        console.error('Failed to parse user or token from localStorage:', e);
        logout();
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
  };
});

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  fullName: string;
  email?: string; //มีหรือไม่มีก็ได้
  roleId: number;
  role: string;
}

// Interface สำหรับโครงสร้าง Response จาก Backend
interface ApiResponse {
  status: number;
  name: string;
  description: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      username: string;
      fullName: string;
      email?: string;
      roleId: number;
    };
  };
  error: boolean;
}

const ROLE_MAPPING: { [key: number]: string } = {
  10: 'user',
  50: 'admin',
  90: 'superadmin',
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isAuthenticated = ref(false);
  const isAuthenticating = ref(false);
  const loginError = ref<string | null>(null);
  const lastApiResponse = ref<ApiResponse | null>(null); // *** เพิ่มตัวแปรใหม่สำหรับเก็บ Response ทั้งก้อน ***

  const getIsAuthenticated = computed(() => isAuthenticated.value);
  const getUser = computed(() => user.value);
  const getToken = computed(() => token.value);
  const getLastApiResponse = computed(() => lastApiResponse.value); // *** เพิ่ม computed property ***

  const isUser = computed(() => user.value?.role === 'user');
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isSuperAdmin = computed(() => user.value?.role === 'superadmin');

  const login = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    isAuthenticating.value = true;
    loginError.value = null;
    lastApiResponse.value = null; // *** เคลียร์ค่าเก่าก่อนเริ่ม Request ใหม่ ***

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username: usernameInput,
        password: passwordInput,
      });

      lastApiResponse.value = response.data; // *** เก็บ Response ทั้งก้อนไว้ที่นี่ ***

      const responseData = response.data.data;
      const authToken = responseData?.accessToken;
      const backendUser = responseData?.user;

      if (backendUser && authToken) {
        const userRole = ROLE_MAPPING[backendUser.roleId] || 'user';
        user.value = { ...backendUser, role: userRole };
        token.value = authToken;
        isAuthenticated.value = true;

        localStorage.setItem('user', JSON.stringify(user.value));
        if (token.value) {
          localStorage.setItem('token', token.value);
        }
        console.log('Login successful:', user.value);
        return true;
      } else {
        loginError.value = 'ข้อมูลการเข้าสู่ระบบไม่สมบูรณ์จากเซิร์ฟเวอร์';
        return false;
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        lastApiResponse.value = error.response.data; // *** เก็บ Error Response ทั้งก้อนไว้ที่นี่ด้วย ***
        loginError.value = error.response.data.description || 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง';
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
    lastApiResponse.value = null; // *** เคลียร์ค่าเมื่อ Logout ***
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log('Logged out - localStorage cleared.');
    router.push('/');
  };

  const devLogin = async (role: 'user' | 'admin' | 'superadmin'): Promise<boolean> => {
    isAuthenticating.value = true;
    loginError.value = null;
    lastApiResponse.value = null; // *** เคลียร์ค่าเมื่อ Dev Login ***
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
            // *** สำหรับ devLogin เราอาจจะสร้าง mock response ขึ้นมาเก็บก็ได้
            lastApiResponse.value = {
              status: 200,
              name: 'DEV_LOGIN_SUCCESS',
              description: `Dev login successful for role: ${role}`,
              data: {
                accessToken: devToken,
                user: {
                  id: devUser.id,
                  username: devUser.username,
                  fullName: devUser.fullName,
                  roleId: devUser.roleId,
                }
              },
              error: false
            };
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
    lastApiResponse,
    getIsAuthenticated,
    getUser,
    getToken,
    getLastApiResponse,
    isUser,
    isAdmin,
    isSuperAdmin,
    login,
    logout,
    devLogin,
    fetchUser,
  };
});

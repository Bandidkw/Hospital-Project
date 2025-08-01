import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/apiService';
import { isAxiosError } from 'axios';

// Interface สำหรับข้อมูล User ที่เก็บใน Store
interface User {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  roleId: number;
  role: string;
}

// Map สำหรับแปลง roleId เป็นชื่อ Role ที่อ่านง่าย
const ROLE_MAPPING: { [key: number]: string } = {
  10: 'user',
  50: 'admin',
  90: 'superadmin',
};

// กำหนด Pinia Store สำหรับจัดการสถานะการยืนยันตัวตน (Authentication)
export const useAuthStore = defineStore('auth', () => {
  const router = useRouter(); // สำหรับจัดการการเปลี่ยนเส้นทาง (routing)

  // --- State Variables (สถานะของ Store) ---
  const user = ref<User | null>(null); // ข้อมูลผู้ใช้ที่เข้าสู่ระบบ
  const token = ref<string | null>(null); // Access Token สำหรับการเรียก API
  const isAuthenticated = ref(false); // สถานะการเข้าสู่ระบบ (true หากเข้าสู่ระบบแล้ว)
  const isAuthenticating = ref(false); // สถานะกำลังดำเนินการ Login
  const loginError = ref<string | null>(null); // ข้อความ Error จากการ Login
  const profileError = ref<string | null>(null); // ข้อความ Error จากการดึงข้อมูล Profile

  // --- Computed Properties (ค่าที่คำนวณจาก State) ---
  const getIsAuthenticated = computed(() => isAuthenticated.value);
  const getUser = computed(() => user.value);
  const getToken = computed(() => token.value);
  const isUser = computed(() => user.value?.role === 'user');
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isSuperAdmin = computed(() => user.value?.role === 'superadmin');

  /**
   * @Action: login
   * ใช้สำหรับเข้าสู่ระบบผู้ใช้โดยเรียก API
   * - อัปเดตสถานะ isAuthenticating, loginError
   * - เก็บข้อมูล user และ token ใน State และ localStorage หากสำเร็จ
   * - จัดการข้อผิดพลาดจาก API และ Network
   */
  const login = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    isAuthenticating.value = true;
    loginError.value = null;

    try {
      const response = await apiService.post('/login', { username: usernameInput, password: passwordInput });
      const responseData = response.data.data;
      const authToken = responseData?.accessToken;
      const backendUser = responseData?.user;

      if (backendUser && authToken) {
        const userRole = ROLE_MAPPING[backendUser.roleId] || 'user';
        user.value = { ...backendUser, role: userRole };
        token.value = authToken;
        isAuthenticated.value = true;
        localStorage.setItem('user', JSON.stringify(user.value));
        if (token.value) { localStorage.setItem('token', token.value); }
        console.log('Login successful:', user.value);
        return true;
      } else {
        loginError.value = 'ข้อมูลการเข้าสู่ระบบไม่สมบูรณ์จากเซิร์ฟเวอร์';
        return false;
      }
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
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

  /**
   * @Action: fetchUserProfile
   * ใช้สำหรับดึงข้อมูลโปรไฟล์ผู้ใช้จาก API โดยใช้ Token ที่มีอยู่
   * - อัปเดตข้อมูล user ใน State และ localStorage
   * - จัดการข้อผิดพลาด เช่น Token หมดอายุ (401) และทำการ logout อัตโนมัติ
   */
  const fetchUserProfile = async (): Promise<boolean> => {
    if (!token.value) {
      profileError.value = 'Token ไม่พร้อมใช้งาน กรุณาเข้าสู่ระบบ';
      return false;
    }
    profileError.value = null;

    try {
      const response = await apiService.get('/users/profile'); // เปลี่ยน Endpoint ตาม Backend ของคุณ
      const backendUser = response.data.data;

      if (backendUser) {
        const userRole = ROLE_MAPPING[backendUser.roleId] || 'user';
        user.value = { ...backendUser, role: userRole };
        isAuthenticated.value = true;
        localStorage.setItem('user', JSON.stringify(user.value));
        console.log('User profile fetched successfully:', user.value);
        return true;
      } else {
        profileError.value = 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้: ข้อมูลไม่สมบูรณ์';
        return false;
      }
    } catch (error: any) {
      console.error('Fetch user profile failed:', error);
      profileError.value = 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้: เกิดข้อผิดพลาด';
      if (isAxiosError(error) && error.response && error.response.status === 401) {
        logout(); // Logout อัตโนมัติเมื่อ Token หมดอายุ
        profileError.value = 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง';
      }
      return false;
    }
  };

  /**
   * @Action: logout
   * ใช้สำหรับออกจากระบบ
   * - ล้างข้อมูล user และ token ใน State และ localStorage
   * - Redirect ไปยังหน้าแรก
   */
  const logout = () => {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    loginError.value = null;
    profileError.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log('Logged out - localStorage cleared.');
    router.push('/');
  };

  /**
   * @Action: devLogin
   * ใช้สำหรับจำลองการเข้าสู่ระบบในโหมด Dev (เพื่อการทดสอบ)
   * - กำหนด user และ token ตาม role ที่ระบุ
   */
  const devLogin = async (role: 'user' | 'admin' | 'superadmin'): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let devUser: User | null = null;
            let devToken: string | null = null;

            if (role === 'user') {
                devUser = { id: 'dev-user-1', username: 'dev_user', fullName: 'Dev User', roleId: 10, role: 'user' };
                devToken = 'dev-user-token';
            } else if (role === 'admin') {
                devUser = { id: 'dev-admin-1', username: 'dev_admin', fullName: 'Dev Admin', roleId: 50, role: 'admin' };
                devToken = 'dev-admin-token';
            } else if (role === 'superadmin') {
                devUser = { id: 'dev-superadmin-1', username: 'dev_superadmin', fullName: 'Dev Super Admin', roleId: 90, role: 'superadmin' };
                devToken = 'dev-superadmin-token';
            }

            if (devUser && devToken) {
                user.value = devUser;
                token.value = devToken;
                isAuthenticated.value = true;
                if (user.value) { localStorage.setItem('user', JSON.stringify(user.value)); }
                if (token.value) { localStorage.setItem('token', token.value); }
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
        }, 300);
    });
  };

  /**
   * @Action: fetchUser
   * ใช้สำหรับดึงข้อมูลผู้ใช้และ Token จาก localStorage เมื่อแอปพลิเคชันโหลด
   * - คงสถานะการเข้าสู่ระบบไว้หากมีข้อมูลที่ถูกต้อง
   */
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

  // คืนค่า State, Computed Properties และ Actions ที่จะถูกเรียกใช้จาก Component อื่นๆ
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
    isAdmin,
    isSuperAdmin,
    login,
    logout,
    fetchUserProfile,
    devLogin,
    fetchUser,
  };
});

// auth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/apiService'; // ตรวจสอบให้แน่ใจว่า apiService ถูกตั้งค่ามาอย่างถูกต้อง
import { isAxiosError } from 'axios';

// Interface สำหรับข้อมูล User ที่เก็บใน Store
interface User {
  id: string;
  username: string;
  fullName: string;
  email?: string; // เพิ่ม email เข้ามาใน User interface หากต้องการใช้ในอนาคต
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
  const isAuthenticating = ref(false); // สถานะกำลังดำเนินการ Login หรือ Password Reset
  const loginError = ref<string | null>(null); // ข้อความ Error จากการ Login หรือ Password Reset
  const profileError = ref<string | null>(null); // ข้อความ Error จากการดึงข้อมูล Profile

  // --- Computed Properties (ค่าที่คำนวณจาก State) ---
  // การใช้ computed property เพื่อเข้าถึง state โดยตรงเป็นแนวทางที่ดี
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
    loginError.value = null; // เคลียร์ error เก่าก่อนเริ่ม

    try {
      const response = await apiService.post('/login', { username: usernameInput, password: passwordInput });
      const responseData = response.data.data; // สมมติว่าข้อมูลผู้ใช้อยู่ใน response.data.data
      const authToken = responseData?.accessToken;
      const backendUser = responseData?.user;

      if (backendUser && authToken) {
        const userRole = ROLE_MAPPING[backendUser.roleId] || 'user';
        user.value = { ...backendUser, role: userRole };
        token.value = authToken;
        isAuthenticated.value = true;
        localStorage.setItem('user', JSON.stringify(user.value));
        if (token.value) { localStorage.setItem('token', token.value); } // ตรวจสอบ token.value ก่อนเก็บ
        console.log('เข้าสู่ระบบสำเร็จ:', user.value);
        return true;
      } else {
        loginError.value = 'ข้อมูลการเข้าสู่ระบบไม่สมบูรณ์จากเซิร์ฟเวอร์';
        return false;
      }
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        // ข้อผิดพลาดจาก API (เช่น 400, 401)
        loginError.value = error.response.data.description || 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง';
        console.error('ข้อผิดพลาด API การเข้าสู่ระบบ:', error.response.data);
      } else {
        // ข้อผิดพลาดเครือข่ายหรืออื่นๆ
        loginError.value = 'เกิดข้อผิดพลาดในการเชื่อมต่อ: โปรดลองอีกครั้ง';
        console.error('ข้อผิดพลาดเครือข่ายการเข้าสู่ระบบ:', error);
      }
      // รีเซ็ตสถานะการยืนยันตัวตนเมื่อเกิดข้อผิดพลาด
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
   * @Action: requestPasswordReset
   * ใช้สำหรับส่งคำขอรีเซ็ตรหัสผ่านโดยเรียก API
   * - อัปเดตสถานะ isAuthenticating, loginError
   * - จัดการข้อผิดพลาดจาก API และ Network
   */
  const requestPasswordReset = async (email: string): Promise<boolean> => {
    isAuthenticating.value = true;
    loginError.value = null; // เคลียร์ error เก่าก่อนเริ่ม

    try {
      // ใช้ apiService.post เพื่อความสอดคล้อง
      // ตรวจสอบให้แน่ใจว่า Backend ของคุณมี Endpoint นี้
      const response = await apiService.post('/forgot-password', { email }); // สมมติ Endpoint คือ /forgot-password

      if (response.status === 200 || response.status === 204) { // 200 OK หรือ 204 No Content
        console.log('ส่งคำขอรีเซ็ตรหัสผ่านสำเร็จสำหรับอีเมล:', email);
        return true;
      } else {
        // กรณี Backend ส่งสถานะอื่นที่ไม่ใช่ 2xx แต่ไม่ใช่ error ที่ Axios จับได้
        const errorData = response.data;
        loginError.value = errorData.message || 'ไม่สามารถส่งคำขอรีเซ็ตรหัสผ่านได้';
        return false;
      }
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        // ข้อผิดพลาดจาก API (เช่น 404, 400 ถ้าอีเมลไม่ถูกต้อง)
        loginError.value = error.response.data.description || 'ไม่สามารถส่งคำขอรีเซ็ตรหัสผ่านได้: กรุณาตรวจสอบอีเมล';
        console.error('ข้อผิดพลาด API การรีเซ็ตรหัสผ่าน:', error.response.data);
      } else {
        // ข้อผิดพลาดเครือข่ายหรืออื่นๆ
        loginError.value = 'เกิดข้อผิดพลาดในการเชื่อมต่อ: โปรดลองอีกครั้ง';
        console.error('ข้อผิดพลาดเครือข่ายการรีเซ็ตรหัสผ่าน:', error);
      }
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
    profileError.value = null; // เคลียร์ error เก่าก่อนเริ่ม

    try {
      const response = await apiService.get('/profile'); // เปลี่ยน Endpoint ตาม Backend ของคุณ
      const backendUser = response.data.data; // สมมติว่าข้อมูลผู้ใช้อยู่ใน response.data.data

      if (backendUser) {
        const userRole = ROLE_MAPPING[backendUser.roleId] || 'user';
        user.value = { ...backendUser, role: userRole };
        isAuthenticated.value = true;
        localStorage.setItem('user', JSON.stringify(user.value));
        console.log('ดึงข้อมูลโปรไฟล์ผู้ใช้สำเร็จ:', user.value);
        return true;
      } else {
        profileError.value = 'ไม่สามารถดึงข้อมูลโปรไฟล์ได้: ข้อมูลไม่สมบูรณ์';
        return false;
      }
    } catch (error: any) {
      console.error('การดึงข้อมูลโปรไฟล์ผู้ใช้ล้มเหลว:', error);
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
    console.log('ออกจากระบบแล้ว - ล้าง localStorage.');
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
      }, 300); // จำลองการหน่วงเวลา
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
        // ตรวจสอบความถูกต้องของข้อมูลที่ดึงมาจาก localStorage อย่างละเอียด
        if (
          parsedUser &&
          typeof parsedUser.id === 'string' &&
          typeof parsedUser.username === 'string' &&
          typeof parsedUser.fullName === 'string' && // เพิ่มการตรวจสอบ fullName
          typeof parsedUser.roleId === 'number'
        ) {
          const userRole = ROLE_MAPPING[parsedUser.roleId] || 'user';
          user.value = { ...parsedUser, role: userRole };
          token.value = storedToken;
          isAuthenticated.value = true;
          console.log('ดึงข้อมูลผู้ใช้จาก localStorage สำเร็จ:', user.value);
        } else {
          console.warn('ข้อมูลผู้ใช้ใน localStorage ไม่ถูกต้อง ล้างข้อมูล...');
          logout();
        }
      } catch (e) {
        console.error('ไม่สามารถแยกวิเคราะห์ข้อมูลผู้ใช้หรือ token จาก localStorage:', e);
        logout();
      }
    } else {
      // หากไม่มีข้อมูลใน localStorage ให้ตั้งค่าสถานะเริ่มต้น
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
    requestPasswordReset,
  };
});

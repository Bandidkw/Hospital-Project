// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import router from '../router';

interface User {
  username: string;
  email: string; // เพิ่มบรรทัดนี้
  fullName: string; // เพิ่มบรรทัดนี้
  role: 'admin' | 'editor' | 'user'; // เพิ่ม role
  token?: string; //token จาก backend
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null); // เก็บข้อมูลผู้ใช้ที่ล็อกอิน
  const isAuthenticated = ref(false); // สถานะยืนยันตัวตน
  const loginError = ref<string | null>(null);

  const initializeAuth = () => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        user.value = parsedUser;
        isAuthenticated.value = true;
        console.log("Auth Store Initialized: User logged in.");
      } catch (e) {
        console.error("Failed to parse stored user data:", e);
        logout(); // ข้อมูลเสียหาย ให้ logout
      }
    }
  };

  // ฟังก์ชันสำหรับ Login (Mockup)
  const login = async (usernameInput: string, passwordInput: string) => {
    loginError.value = null; // เคลียร์ error ก่อน
    try {
      // --- จำลองการเรียก API ---
      await new Promise(resolve => setTimeout(resolve, 500)); // จำลองการดีเลย์ของ API

      if (usernameInput === 'admin' && passwordInput === 'password') {
        // เพิ่ม email และ fullName ใน object ผู้ใช้
        user.value = { username: usernameInput, email: 'admin@example.com', fullName: 'ผู้ดูแลระบบ', role: 'admin', token: 'mock-admin-token' };
        isAuthenticated.value = true;
        localStorage.setItem('user', JSON.stringify(user.value));
        localStorage.setItem('token', user.value.token || '');

        console.log("Login successful in store:", user.value);
        router.push('/dashboard'); // Path ของ Route ที่ถูกต้อง
        return true;
      } else if (usernameInput === 'editor' && passwordInput === 'password') {
        // เพิ่ม email และ fullName ใน object ผู้ใช้
        user.value = { username: usernameInput, email: 'editor@example.com', fullName: 'ผู้แก้ไขข้อมูล', role: 'editor', token: 'mock-editor-token' };
        isAuthenticated.value = true;
        localStorage.setItem('user', JSON.stringify(user.value));
        localStorage.setItem('token', user.value.token || '');

        console.log("Login successful in store:", user.value);
        router.push('/dashboard'); // Path ของ Route ที่ถูกต้อง
        return true;
      }
      else {
        loginError.value = 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง';
        isAuthenticated.value = false;
        user.value = null;
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      loginError.value = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      isAuthenticated.value = false;
      user.value = null;
      return false;
    }
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log("Logged out.");
    router.push('/'); // กลับไปหน้าแรกหลังจาก logout
  };

  initializeAuth();

  return {
    user,
    isAuthenticated,
    loginError,
    login,
    logout,
  };
});

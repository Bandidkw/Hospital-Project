// ตัวอย่างการแก้ไขใน src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import router from '@/router';
import { useToast } from "vue-toastification";

// เพิ่มหรือแก้ไข User Interface
export interface User {
  username: string;
  role: "user" | "admin" | "editor";
  token?: string;
  fullName?: string; // <--- เพิ่มบรรทัดนี้
  email?: string;    // <--- เพิ่มบรรทัดนี้
  // เพิ่ม properties อื่นๆ ที่ User object อาจจะมี
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null); // ใช้ User interface ที่แก้ไขแล้ว
  const loginError = ref<string | null>(null);
  const isAuthenticated = ref(false); // Add isAuthenticated state
  const toast = useToast();

  // Load user from localStorage on store initialization
  const loadUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        user.value = parsedUser;
        isAuthenticated.value = true;
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        logout(); // Clear invalid data
      }
    }
  };

  // Call this once on store creation
  loadUserFromLocalStorage();

  const login = async (usernameInput: string, passwordInput: string): Promise<boolean> => {
    loginError.value = null; // Clear previous errors
    try {
      // Simulate API call
      const response = await new Promise<any>((resolve, reject) => {
        setTimeout(() => {
          if (usernameInput === 'admin' && passwordInput === 'password') {
            resolve({
              username: 'admin',
              role: 'admin',
              token: 'fake-admin-token',
              fullName: 'Admin User', // <--- ตัวอย่างข้อมูล
              email: 'admin@example.com' // <--- ตัวอย่างข้อมูล
            });
          } else if (usernameInput === 'editor' && passwordInput === 'password') {
            resolve({
              username: 'editor',
              role: 'editor',
              token: 'fake-editor-token',
              fullName: 'Editor User', // <--- ตัวอย่างข้อมูล
              email: 'editor@example.com' // <--- ตัวอย่างข้อมูล
            });
          } else if (usernameInput === 'user' && passwordInput === 'password') {
            resolve({
              username: 'user',
              role: 'user',
              token: 'fake-user-token',
              fullName: 'Regular User', // <--- ตัวอย่างข้อมูล
              email: 'user@example.com' // <--- ตัวอย่างข้อมูล
            });
          } else {
            reject(new Error('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง'));
          }
        }, 1000);
      });

      user.value = response;
      isAuthenticated.value = true;
      localStorage.setItem('user', JSON.stringify(user.value));
      router.push('/dashboard'); // Navigate to dashboard on success
      return true;
    } catch (error: any) {
      loginError.value = error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      isAuthenticated.value = false;
      return false;
    }
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('user');
    router.push('/'); // Navigate to home on logout
    toast.info('ออกจากระบบเรียบร้อยแล้ว');
  };

  return { user, loginError, isAuthenticated, login, logout };
});

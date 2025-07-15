<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative">
      <button
        @click="closeModal"
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition duration-300 focus:outline-none"
      >
        <i class="fas fa-times text-xl"></i>
      </button>

      <div>
        <h2 class="mt-2 text-center text-2xl font-extrabold text-gray-900">
          เข้าสู่ระบบเจ้าหน้าที่
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          กรุณาเข้าสู่ระบบด้วยบัญชีผู้ใช้งานของคุณ
        </p>
      </div>
      <form class="mt-6 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="modal-username" class="sr-only">ชื่อผู้ใช้งาน</label>
            <input
              id="modal-username"
              name="username"
              type="text"
              autocomplete="username"
              required
              v-model="username"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="ชื่อผู้ใช้งาน"
            />
          </div>
          <div>
            <label for="modal-password" class="sr-only">รหัสผ่าน</label>
            <input
              id="modal-password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="รหัสผ่าน"
            />
          </div>
        </div>

        <div v-if="authStore.loginError" class="text-red-600 text-sm text-center">
          {{ authStore.loginError }}
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="fas fa-sign-in-alt group-hover:text-blue-200" aria-hidden="true"></i>
            </span>
            เข้าสู่ระบบ
          </button>
        </div>
      </form>
      <div class="text-center text-sm mt-4">
        <a href="#" @click.prevent="showForgotPassword" class="font-medium text-blue-600 hover:text-blue-500">
          ลืมรหัสผ่าน?
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
// ไม่จำเป็นต้องใช้ useRouter ตรงนี้แล้ว เพราะ authStore จะจัดการการ redirect เอง
// import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth'; // <--- เพิ่มการนำเข้า authStore

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['update:isOpen', 'loginSuccess']);

const username = ref('');
const password = ref('');
// ไม่จำเป็นต้องมี loginError ใน component แล้ว เพราะจะใช้จาก store
// const loginError = ref('');

// สร้าง instance ของ authStore
const authStore = useAuthStore();
// ไม่จำเป็นต้องมี router ใน component แล้ว
// const router = useRouter();

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    username.value = '';
    password.value = '';
    // เคลียร์ error จาก store เมื่อเปิด modal
    authStore.loginError = null;
  }
});

const handleLogin = async () => { // <--- เพิ่ม async
  // ลบบรรทัดนี้: loginError.value = '';

  // เรียกใช้ฟังก์ชัน login จาก authStore
  const success = await authStore.login(username.value, password.value);

  if (success) {
    emit('loginSuccess');
    closeModal(); // ปิด Modal หลังจาก Login สำเร็จ
  }
  // ไม่ต้องมี else เพื่อ set loginError เพราะ authStore จะจัดการเอง
};

const closeModal = () => {
  emit('update:isOpen', false);
};

const showForgotPassword = () => {
  alert('ฟังก์ชันลืมรหัสผ่านจะถูกพัฒนาต่อไป');
};
</script>

<style scoped>
/* คุณสามารถเพิ่ม custom styles ได้ที่นี่ หาก Tailwind CSS ไม่ครอบคลุม */
</style>

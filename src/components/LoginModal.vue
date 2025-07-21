<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]" @click.self="closeModal">
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
      <h2 class="text-2xl font-bold mb-4 text-center text-my-custom-gray">เข้าสู่ระบบ</h2>
      <form @submit.prevent="submitLogin">
        <div class="mb-4">
          <label for="username" class="block text-my-custom-gray text-sm font-bold mb-2">ชื่อผู้ใช้งาน:</label>
          <input
            type="text"
            id="username"
            v-model="username"
            class="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
        </div>
        <div class="mb-6">
          <label for="password" class="block text-my-custom-gray text-sm font-bold mb-2">รหัสผ่าน:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
        </div>
        <p v-if="authStore.loginError" class="text-red-500 text-xs italic mb-4">{{ authStore.loginError }}</p>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            :disabled="isLoading"
          >
            {{ isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
          </button>
          <button
            type="button"
            @click="closeModal"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useToast } from "vue-toastification";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['update:isOpen', 'loginSuccess', 'loginFailed']);

const authStore = useAuthStore();
const toast = useToast();
const username = ref('');
const password = ref('');
const isLoading = ref(false);

const closeModal = () => {
  emit('update:isOpen', false);
  username.value = '';
  password.value = '';
  authStore.loginError = null;
};

const submitLogin = async () => {
  isLoading.value = true;
  const success = await authStore.login(username.value, password.value);
  isLoading.value = false;

  if (success) {
    emit('loginSuccess');
    toast.success("เข้าสู่ระบบสำเร็จ!");
    closeModal();
  } else {
    emit('loginFailed', authStore.loginError || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
    toast.error(authStore.loginError || 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
  }
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    username.value = '';
    password.value = '';
    authStore.loginError = null;
  }
});
</script>

<style scoped></style>

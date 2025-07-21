<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-user-circle mr-3 text-gray-500"></i> โปรไฟล์ผู้ใช้งาน
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับดูและแก้ไขข้อมูลโปรไฟล์ส่วนตัวของคุณ.</p>

    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">ข้อมูลส่วนตัว</h3>
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">ชื่อผู้ใช้งาน:</label>
          <input type="text" id="username" v-model="profile.username" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" disabled>
          <p class="text-xs text-gray-500 mt-1">ชื่อผู้ใช้งานไม่สามารถแก้ไขได้</p>
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">อีเมล:</label>
          <input type="email" id="email" v-model="profile.email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="fullName" class="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล:</label>
          <input type="text" id="fullName" v-model="profile.fullName" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">บทบาท:</label>
          <input type="text" id="role" v-model="profile.role" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" disabled>
          <p class="text-xs text-gray-500 mt-1">บทบาทผู้ใช้งานไม่สามารถแก้ไขได้</p>
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            <i class="fas fa-save mr-2"></i> บันทึกข้อมูลโปรไฟล์
          </button>
        </div>
      </form>
    </div>

    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">เปลี่ยนรหัสผ่าน</h3>
      <form @submit.prevent="changePassword" class="space-y-4">
        <div>
          <label for="currentPassword" class="block text-sm font-medium text-gray-700">รหัสผ่านปัจจุบัน:</label>
          <input type="password" id="currentPassword" v-model="passwordForm.currentPassword" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="newPassword" class="block text-sm font-medium text-gray-700">รหัสผ่านใหม่:</label>
          <input type="password" id="newPassword" v-model="passwordForm.newPassword" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700">ยืนยันรหัสผ่านใหม่:</label>
          <input type="password" id="confirmNewPassword" v-model="passwordForm.confirmNewPassword" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            <i class="fas fa-key mr-2"></i> เปลี่ยนรหัสผ่าน
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';

const toast = useToast();
const authStore = useAuthStore();

interface UserProfile {
  username: string;
  email: string;
  fullName: string;
  role: string;
}

const profile = ref<UserProfile>({
  username: authStore.user?.username || 'admin',
  email: authStore.user?.email || 'admin@example.com',
  fullName: authStore.user?.fullName || 'ผู้ดูแลระบบ',
  role: authStore.user?.role || 'admin',
});


const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
});

const updateProfile = () => {
  console.log('Updating profile:', profile.value);
  toast.success('บันทึกข้อมูลโปรไฟล์สำเร็จ!');
};

const changePassword = () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmNewPassword) {
    toast.error('รหัสผ่านใหม่และยืนยันรหัสผ่านใหม่ไม่ตรงกัน!');
    return;
  }
  if (passwordForm.value.newPassword.length < 6) {
    toast.error('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร!');
    return;
  }
  console.log('Changing password...');
  toast.success('เปลี่ยนรหัสผ่านสำเร็จ!');
  passwordForm.value = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
};
</script>

<style scoped></style>

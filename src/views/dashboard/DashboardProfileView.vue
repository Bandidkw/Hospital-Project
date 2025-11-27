<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 p-6">
    <div class="max-w-5xl mx-auto">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-lg border-t-4 border-teal-600 mb-6 overflow-hidden">
        <div class="bg-gradient-to-r from-teal-600 to-blue-600 px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
                class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <i class="fas fa-user-circle text-4xl text-teal-600"></i>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-white">โปรไฟล์ผู้ใช้งาน</h1>
                <p class="text-teal-100 text-sm mt-1">จัดการข้อมูลส่วนตัวและความปลอดภัย</p>
              </div>
            </div>
            <div
              class="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg"
            >
              <i class="fas fa-shield-alt text-white"></i>
              <span class="text-white text-sm font-medium">ระบบปลอดภัย</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Information Card -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
        <div class="bg-gradient-to-r from-teal-50 to-blue-50 px-8 py-4 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <i class="fas fa-id-card text-white"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">ข้อมูลส่วนตัว</h2>
              <p class="text-sm text-gray-600">แก้ไขข้อมูลประจำตัวของคุณ</p>
            </div>
          </div>
        </div>

        <div class="p-8">
          <form @submit.prevent="updateProfile" class="space-y-6">
            <!-- Username Field -->
            <div class="relative">
              <label for="username" class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-user text-teal-600 mr-2"></i>ชื่อผู้ใช้งาน
              </label>
              <div class="relative">
                <input
                  type="text"
                  id="username"
                  v-model="profile.username"
                  class="block w-full border-2 border-gray-300 rounded-lg shadow-sm p-3 pl-10 bg-gray-100 cursor-not-allowed text-gray-600 font-medium"
                  disabled
                />
                <i
                  class="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                ></i>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <span
                  class="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                >
                  <i class="fas fa-info-circle"></i>
                  ไม่สามารถแก้ไขได้
                </span>
              </div>
            </div>

            <!-- Full Name Field -->
            <div class="relative">
              <label for="fullName" class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-id-badge text-teal-600 mr-2"></i>ชื่อ-นามสกุล
                <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  type="text"
                  id="fullName"
                  v-model="profile.fullName"
                  class="block w-full border-2 border-gray-300 rounded-lg shadow-sm p-3 pl-10 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  required
                />
                <i
                  class="fas fa-edit absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 text-sm"
                ></i>
              </div>
            </div>

            <!-- Role Field -->
            <div class="relative">
              <label for="role" class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-user-tag text-teal-600 mr-2"></i>บทบาท
              </label>
              <div class="relative">
                <input
                  type="text"
                  id="role"
                  v-model="profile.role"
                  class="block w-full border-2 border-gray-300 rounded-lg shadow-sm p-3 pl-10 bg-gray-100 cursor-not-allowed text-gray-600 font-medium"
                  disabled
                />
                <i
                  class="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                ></i>
              </div>
              <div class="flex items-center gap-2 mt-2">
                <span
                  class="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                >
                  <i class="fas fa-info-circle"></i>
                  ไม่สามารถแก้ไขได้
                </span>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                class="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium flex items-center gap-2"
              >
                <i class="fas fa-save"></i>
                <span>บันทึกข้อมูลโปรไฟล์</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Change Password Card -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-50 to-teal-50 px-8 py-4 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <i class="fas fa-key text-white"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">เปลี่ยนรหัสผ่าน</h2>
              <p class="text-sm text-gray-600">อัปเดตรหัสผ่านเพื่อความปลอดภัย</p>
            </div>
          </div>
        </div>

        <div class="p-8">
          <div
            class="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg flex items-start gap-3"
          >
            <i class="fas fa-exclamation-triangle text-amber-600 mt-0.5"></i>
            <div class="text-sm text-amber-800">
              <p class="font-semibold mb-1">คำแนะนำด้านความปลอดภัย:</p>
              <ul class="list-disc list-inside space-y-1 text-xs">
                <li>รหัสผ่านควรมีความยาวอย่างน้อย 5 ตัวอักษร</li>
                <li>ใช้ตัวอักษรพิมพ์เล็ก พิมพ์ใหญ่ ตัวเลข และอักขระพิเศษ</li>
                <li>ไม่ควรใช้รหัสผ่านเดียวกันกับบัญชีอื่น</li>
              </ul>
            </div>
          </div>

          <form @submit.prevent="changePassword" class="space-y-6">
            <!-- Current Password -->
            <div class="relative">
              <label for="currentPassword" class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-lock text-blue-600 mr-2"></i>รหัสผ่านปัจจุบัน
                <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  :type="passwordFieldTypes.current"
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  class="block w-full border-2 border-gray-300 rounded-lg shadow-sm p-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  @click="togglePasswordVisibility('current')"
                  class="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500 hover:text-blue-600 transition-colors"
                  aria-label="Toggle current password visibility"
                >
                  <i
                    class="fas"
                    :class="passwordFieldTypes.current === 'password' ? 'fa-eye' : 'fa-eye-slash'"
                  ></i>
                </button>
              </div>
            </div>

            <!-- New Password -->
            <div class="relative">
              <label for="newPassword" class="block text-sm font-semibold text-gray-700 mb-2">
                <i class="fas fa-key text-blue-600 mr-2"></i>รหัสผ่านใหม่
                <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  :type="passwordFieldTypes.new"
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  class="block w-full border-2 border-gray-300 rounded-lg shadow-sm p-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  @click="togglePasswordVisibility('new')"
                  class="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500 hover:text-blue-600 transition-colors"
                  aria-label="Toggle new password visibility"
                >
                  <i
                    class="fas"
                    :class="passwordFieldTypes.new === 'password' ? 'fa-eye' : 'fa-eye-slash'"
                  ></i>
                </button>
              </div>
            </div>

            <!-- Confirm New Password -->
            <div class="relative">
              <label
                for="confirmNewPassword"
                class="block text-sm font-semibold text-gray-700 mb-2"
              >
                <i class="fas fa-check-circle text-blue-600 mr-2"></i>ยืนยันรหัสผ่านใหม่
                <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  :type="passwordFieldTypes.confirm"
                  id="confirmNewPassword"
                  v-model="passwordForm.confirmNewPassword"
                  class="block w-full border-2 border-gray-300 rounded-lg shadow-sm p-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  @click="togglePasswordVisibility('confirm')"
                  class="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500 hover:text-blue-600 transition-colors"
                  aria-label="Toggle confirm new password visibility"
                >
                  <i
                    class="fas"
                    :class="passwordFieldTypes.confirm === 'password' ? 'fa-eye' : 'fa-eye-slash'"
                  ></i>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                class="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium flex items-center gap-2"
              >
                <i class="fas fa-key"></i>
                <span>เปลี่ยนรหัสผ่าน</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600 flex items-center justify-center gap-2">
          <i class="fas fa-info-circle text-teal-600"></i>
          <span>หากพบปัญหาในการใช้งาน กรุณาติดต่อผู้ดูแลระบบ</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()

const authStore = useAuthStore()

interface UserProfile {
  username: string
  fullName: string
  role: string
}

const profile = ref<UserProfile>({
  username: authStore.user?.username || '',
  fullName: authStore.user?.fullName || '',
  role: authStore.user?.role || '',
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

const passwordFieldTypes = reactive({
  current: 'password',
  new: 'password',
  confirm: 'password',
})

//ฟังก์ชันสำหรับสลับการแสดงผล
const togglePasswordVisibility = (field: keyof typeof passwordFieldTypes) => {
  passwordFieldTypes[field] = passwordFieldTypes[field] === 'password' ? 'text' : 'password'
}

const updateProfile = async () => {
  if (!profile.value.fullName.trim()) {
    toast.error('กรุณากรอกชื่อ-นามสกุล')
    return
  }

  const success = await authStore.updateUserProfile({
    fullName: profile.value.fullName,
  })

  if (success) {
    toast.success('บันทึกข้อมูลโปรไฟล์สำเร็จ!')
  } else {
    toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
  }
}

const changePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
    toast.error('รหัสผ่านใหม่และยืนยันรหัสผ่านใหม่ไม่ตรงกัน!')
    return
  }
  if (passwordForm.newPassword.length < 5) {
    toast.error('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 5 ตัวอักษร!')
    return
  }
  const success = await authStore.changePassword({
    currentPassword: passwordForm.currentPassword,
    newPassword: passwordForm.newPassword,
    confirmNewPassword: passwordForm.confirmNewPassword,
  })
  if (success) {
    toast.success('เปลี่ยนรหัสผ่านสำเร็จ!')
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmNewPassword = ''
    await router.push({ path: '/dashboard' })
  } else {
    toast.error('เปลี่ยนรหัสผ่านไม่สำเร็จ! อาจเป็นเพราะรหัสผ่านปัจจุบันไม่ถูกต้อง')
  }
}
</script>

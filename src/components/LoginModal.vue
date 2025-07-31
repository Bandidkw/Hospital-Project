<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
    @click.self="closeModal"
  >
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
      <h2 class="text-2xl font-bold mb-4 text-center text-my-custom-gray">
        {{ authStore.isAuthenticated ? 'ข้อมูลผู้ใช้งาน' : 'เข้าสู่ระบบ' }}
      </h2>

      <div v-if="authStore.isAuthenticated" class="text-center">
        <p class="mb-2"><strong>ชื่อผู้ใช้งาน:</strong> {{ authStore.user?.username }}</p>
        <p class="mb-4"><strong>บทบาท:</strong> {{ authStore.user?.role }}</p>
        <button
          @click="handleLogout"
          class="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
        >
          ออกจากระบบ
        </button>
        <button
          type="button"
          @click="closeModal"
          class="w-full mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
        >
          ปิด
        </button>
      </div>

      <div v-else>
        <form @submit.prevent="submitLogin">
          <div class="mb-4">
            <label for="username" class="block text-my-custom-gray text-sm font-bold mb-2"
              >ชื่อผู้ใช้งาน:</label
            >
            <input
              type="text"
              id="username"
              v-model="username"
              class="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div class="mb-6">
            <label for="password" class="block text-my-custom-gray text-sm font-bold mb-2"
              >รหัสผ่าน:</label
            >
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                class="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                required
              />
              <button
                type="button"
                @click="toggleShowPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 focus:outline-none"
              >
                <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
              </button>
            </div>
          </div>
          <p v-if="authStore.loginError" class="text-red-500 text-xs italic mb-4">
            {{ authStore.loginError }}
          </p>
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['update:isOpen', 'loginSuccess', 'loginFailed'])

const authStore = useAuthStore()
const toast = useToast()
const router = useRouter()

const isProduction = import.meta.env.PROD

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

const closeModal = () => {
  emit('update:isOpen', false)
  username.value = ''
  password.value = ''
  authStore.loginError = null
  showPassword.value = false
}

const submitLogin = async () => {
  isLoading.value = true
  const success = await authStore.login(username.value, password.value)
  isLoading.value = false

  if (success) {
    emit('loginSuccess')
    toast.success('เข้าสู่ระบบสำเร็จ!')
    closeModal()

    console.log('Login Success! Checking roles...')
    console.log('User Role:', authStore.user?.role)
    console.log('Is User:', authStore.isUser)
    console.log('Is Admin:', authStore.isAdmin)
    console.log('Is SuperAdmin:', authStore.isSuperAdmin)

    try {
      if (authStore.isAdmin || authStore.isSuperAdmin) {
        console.log('เงื่อนไขบทบาทเป็นจริง: กำลังนำทางไปที่ /dashboard')
        router.push('/dashboard').catch((err) => {
          console.error('เกิดข้อผิดพลาดในการนำทางไป Dashboard:', err)
        })
      } else {
        console.log('บทบาทผู้ใช้ทั่วไป: กำลังนำทางไปที่ /')
        router.push('/').catch((err) => {
          console.error('เกิดข้อผิดพลาดในการนำทางไป Home:', err)
        })
      }
    } catch (e) {
      console.error('ข้อผิดพลาดที่ไม่คาดคิดใน Logic การนำทาง:', e)
    }
  } else {
    emit('loginFailed', authStore.loginError || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ')
    toast.error(authStore.loginError || 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง')
  }
}

const handleDevLogin = async (role: 'user' | 'admin' | 'superadmin') => {
  const success = await authStore.devLogin(role)
  if (success) {
    toast.success(`เข้าสู่ระบบในฐานะ ${role} สำเร็จ!`)
    if (role === 'admin' || role === 'superadmin') {
      router.push('/dashboard').catch((err) => {
        console.error('เกิดข้อผิดพลาดในการนำทางไป Dashboard (Dev Login):', err)
      })
    } else {
      router.push('/').catch((err) => {
        console.error('เกิดข้อผิดพลาดในการนำทางไป Home (Dev Login):', err)
      })
    }
    closeModal()
  } else {
    toast.error('Dev Login ไม่สำเร็จ')
  }
}

const handleLogout = () => {
  authStore.logout()
  toast.success('ออกจากระบบสำเร็จ!')
  closeModal()
  router.push('/')
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      username.value = ''
      password.value = ''
      authStore.loginError = null
      showPassword.value = false
    }
  },
)
</script>

<style scoped></style>

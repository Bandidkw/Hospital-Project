<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <div>
      <label for="username" class="block text-sm font-bold text-gray-800 mb-1">
        <i class="fas fa-user mr-2 text-indigo-500"></i> ชื่อผู้ใช้งาน:
      </label>
      <input
        type="text"
        id="username"
        v-model="userForm.username"
        class="block w-full border border-gray-300 rounded-lg shadow-sm p-3 bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        required
        :disabled="opdUser"
        :class="{ 'bg-gray-100 text-gray-500': opdUser }"
      />
      <p v-if="opdUser" class="text-xs text-red-500 mt-1">**ไม่สามารถแก้ไขชื่อผู้ใช้งานได้**</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="password" class="block text-sm font-bold text-gray-800 mb-1">
          <i class="fas fa-lock mr-2 text-indigo-500"></i> รหัสผ่าน:
        </label>
        <input
          type="password"
          id="password"
          v-model="userForm.password"
          class="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          :required="!opdUser"
        />
        <p v-if="opdUser" class="text-xs text-gray-500 mt-1">
          เว้นว่างไว้หาก **ไม่ต้องการเปลี่ยน** รหัสผ่าน
        </p>
      </div>

      <div>
        <label for="role" class="block text-sm font-bold text-gray-800 mb-1">
          <i class="fas fa-crown mr-2 text-indigo-500"></i> บทบาท:
        </label>
        <div class="relative">
          <select
            id="role"
            v-model="userForm.role"
            class="block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none pr-10 transition duration-150"
            required
          >
            <option value="20">OPD (เจ้าหน้าที่)</option>
            <option value="50">Admin (ผู้ดูแล)</option>
            <option value="90">Superadmin (ผู้ดูแลสูงสุด)</option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
          >
            <i class="fas fa-chevron-down text-xs"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-3 pt-6 border-t border-gray-100">
      <button
        type="submit"
        class="bg-indigo-600 text-white font-bold tracking-wide px-8 py-2.5 rounded-xl shadow-lg hover:bg-indigo-800 transition duration-300 transform hover:scale-105"
      >
        <i class="fas fa-save mr-2"></i> {{ opdUser ? 'บันทึกการแก้ไข' : 'เพิ่มผู้ใช้งาน' }}
      </button>

      <button
        v-if="opdUser"
        type="button"
        @click="$emit('cancelEdit')"
        class="bg-gray-200 text-gray-700 font-semibold px-8 py-2.5 rounded-xl shadow-md hover:bg-gray-300 transition duration-300"
      >
        <i class="fas fa-times mr-2"></i> ยกเลิก
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import type { User } from '@/types/user'

const props = defineProps<{
  currentUser: User
  opdUser: boolean
}>()

const emit = defineEmits(['saveUser', 'cancelEdit'])

const userForm = ref<User>({ ...props.currentUser })

watch(
  () => props.currentUser,
  (newUser) => {
    userForm.value = { ...newUser }
  },
  { deep: true },
)

const submitForm = () => {
  emit('saveUser', userForm.value)
}
</script>

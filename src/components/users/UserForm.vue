<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <div>
      <label for="username" class="block text-sm font-semibold text-gray-700 mb-1"
        >ชื่อผู้ใช้งาน:</label
      >
      <input
        type="text"
        id="username"
        v-model="userForm.username"
        class="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        required
        :disabled="opdUser"
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-semibold text-gray-700 mb-1">รหัสผ่าน:</label>
      <input
        type="password"
        id="password"
        v-model="userForm.password"
        class="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
        :required="!opdUser"
      />
      <p v-if="opdUser" class="text-xs text-gray-500 mt-1">
        เว้นว่างไว้หากไม่ต้องการเปลี่ยนรหัสผ่าน
      </p>
    </div>

    <div>
      <label for="role" class="block text-sm font-semibold text-gray-700 mb-1">บทบาท:</label>
      <select
        id="role"
        v-model.number="userForm.role"
        class="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none transition duration-150"
        required
      >
        <option :value="20">OPD</option>
        <option :value="50">Admin</option>
        <option :value="90">Superadmin</option>
      </select>
    </div>

    <div class="flex justify-end space-x-3 pt-6 border-t border-gray-100">
      <button
        type="submit"
        class="bg-indigo-600 text-white font-semibold px-8 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
      >
        <i class="fas fa-save mr-2"></i> {{ opdUser ? 'บันทึกการแก้ไข' : 'เพิ่มผู้ใช้งาน' }}
      </button>

      <button
        v-if="opdUser"
        type="button"
        @click="$emit('cancelEdit')"
        class="bg-gray-300 text-gray-700 font-semibold px-8 py-2.5 rounded-lg shadow-md hover:bg-gray-400 transition duration-300"
      >
        <i class="fas fa-times mr-2"></i> ยกเลิก
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

interface User {
  id: number
  username: string
  password?: string
  role: number
  management?: string
}

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

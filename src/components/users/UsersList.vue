<template>
  <div class="card bg-white p-6 rounded-lg shadow-xl">
    <h3 class="text-2xl font-bold text-gray-800 mb-5">รายการผู้ใช้งาน</h3>
    <div class="overflow-x-auto border border-gray-200 rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr class="text-left text-gray-600 uppercase text-xs tracking-wider">
            <th class="py-3 px-6 text-left font-bold">#</th>
            <th class="py-3 px-6 text-left font-bold">ชื่อผู้ใช้งาน</th>
            <th class="py-3 px-6 text-left font-bold">บทบาท (Role)</th>
            <th class="py-3 px-6 text-left font-bold">การจัดการ</th>
            <th class="py-3 px-6 text-center font-bold">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-sm">
          <tr v-for="(user, index) in usersList" :key="user.id" class="hover:bg-blue-50/50">
            <td class="py-3 px-6 whitespace-nowrap">{{ index + 1 }}</td>
            <td class="py-3 px-6 whitespace-nowrap font-medium text-gray-900">
              {{ user.username }}
            </td>
            <td class="py-3 px-6 whitespace-nowrap">
              <span :class="getRoleBadgeClass(user.role)">
                {{ roleMapping[user.role] ? roleMapping[user.role].toUpperCase() : 'N/A' }}
              </span>
            </td>
            <td class="py-3 px-6 whitespace-nowrap">{{ user.management || '-' }}</td>
            <td class="py-3 px-6 text-center whitespace-nowrap">
              <button
                @click="$emit('editUser', user)"
                class="text-indigo-600 p-2 rounded-full hover:bg-indigo-100 transition duration-150"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="$emit('confirmDeleteUser', user.id)"
                class="text-red-600 p-2 rounded-full hover:bg-red-100 transition duration-150 ml-1"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
          <tr v-if="usersList.length === 0">
            <td colspan="5" class="py-8 text-center text-gray-500 text-base">
              <i class="fas fa-info-circle mr-2"></i> ยังไม่มีผู้ใช้งานในระบบ.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface User {
  id: number
  username: string
  password?: string
  role: number
  management?: string
}

const getRoleBadgeClass = (role: number) => {
  switch (role) {
    case 90: // Superadmin
      return 'inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'
    case 50: // Admin
      return 'inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'
    case 20: // OPD
    case 10: // User
      return 'inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
    default:
      return 'inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
  }
}

defineProps<{
  usersList: User[]
  roleMapping: { [key: number]: string }
}>()

defineEmits(['editUser', 'confirmDeleteUser'])
</script>

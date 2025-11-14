<template>
  <div class="overflow-x-auto shadow-md rounded-lg">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
          >
            ชื่อผู้ใช้งาน
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
          >
            บทบาท
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
          >
            ขอบเขตการจัดการ
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider"
          >
            การกระทำ
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="users.length === 0">
          <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
            ยังไม่มีข้อมูลผู้ใช้งานในระบบ
          </td>
        </tr>
        <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition duration-150">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {{ user.username }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <span
              :class="getRoleBadgeClass(user.role)"
              class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
            >
              {{ roleMapping[user.role] || 'ไม่ระบุ' }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ user.table }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
            <button
              @click="$emit('edit', user)"
              class="text-indigo-600 hover:text-indigo-900 mr-4 transition duration-150"
              title="แก้ไข"
            >
              <i class="fas fa-edit text-lg"></i>
            </button>
            <button
              @click="$emit('delete', user.id)"
              class="text-red-600 hover:text-red-900 transition duration-150"
              title="ลบ"
            >
              <i class="fas fa-trash-alt text-lg"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
// ✅ Import Interface User จากไฟล์กลาง
import type { User } from '@/types/user'

// Props: รับรายการผู้ใช้งานและ Role Mapping เข้ามา
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  users: User[] // 🎯 เปลี่ยน Key จาก number เป็น string
  roleMapping: { [key: string]: string }
}>()

// Events: ส่งเหตุการณ์ Edit (User object) และ Delete (string ID) ออกไป
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits(['edit', 'delete'])

/**
 * กำหนดสี Badge ตาม Role ID
 */
const getRoleBadgeClass = (roleId: string) => {
  switch (roleId) {
    case '90': // Superadmin
      return 'bg-purple-100 text-purple-800 border border-purple-300'
    case '50': // Admin
      return 'bg-blue-100 text-blue-800 border border-blue-300'
    case '20': // OPD
      return 'bg-green-100 text-green-800 border border-green-300'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>

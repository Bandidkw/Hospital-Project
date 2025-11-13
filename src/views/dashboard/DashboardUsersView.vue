<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-3xl font-extrabold text-gray-900 mb-2 flex items-center">
      <i class="fas fa-user-shield mr-3 text-indigo-600"></i> การจัดการบัญชีและสิทธิ์
    </h2>
    <p class="text-gray-600 mb-8">
      ดูแล เพิ่ม แก้ไข และกำหนดบทบาท (Role) ให้กับผู้ใช้งานระบบทั้งหมด
    </p>

    <div class="mb-8 pt-4 border-t border-gray-100 text-right">
      <button
        @click="showAddUserModal"
        class="bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
      >
        <i class="fas fa-plus mr-2"></i> เพิ่มผู้ใช้งานใหม่
      </button>
    </div>

    <UsersList
      :users-list="usersList"
      :role-mapping="ROLE_MAPPING"
      @edit-user="editUser"
      @confirm-delete-user="confirmDeleteUser"
    />

    <div
      v-if="showFormModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-2xl w-full max-w-lg">
        <div class="p-5 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-xl font-bold text-gray-800">
            {{ opduser ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่' }}
          </h3>
          <button @click="closeFormModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="p-5">
          <UserForm
            :current-user="currentUser"
            :opd-user="opduser"
            @save-user="saveAndCloseModal"
            @cancel-edit="closeFormModal"
          />
        </div>
      </div>
    </div>

    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานนี้?</p>
        <div class="flex justify-center space-x-4">
          <button
            @click="deleteUser"
            class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300"
          >
            <i class="fas fa-trash-alt mr-2"></i> ลบ
          </button>
          <button
            @click="cancelDelete"
            class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300"
          >
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import UserForm from '@/components/users/UserForm.vue'
import UsersList from '@/components/users/UsersList.vue'

const toast = useToast()

// 💡 ROLE MAPPING
const ROLE_MAPPING: { [key: number]: string } = {
  10: 'user',
  20: 'opd',
  50: 'admin',
  90: 'superadmin',
}

interface User {
  id: number
  username: string
  password?: string
  role: number
  management?: string
}

const initialUser: User = {
  id: 0,
  username: '',
  management: '',
  password: '',
  role: 20, // ค่าเริ่มต้น OPD
}

// ------------------------------------------------------------------
// 1. STATE MANAGEMENT (Mock Data)
// ------------------------------------------------------------------
const usersList = ref<User[]>([
  { id: 1, username: 'superadmin', role: 90, management: 'all' },
  { id: 2, username: 'admin_user', role: 50, management: 'limited' },
  { id: 3, username: 'opd_staff', role: 20, management: '' },
])

const currentUser = ref<User>({ ...initialUser })
const opduser = ref(false) // สถานะโหมดแก้ไข
const userToDeleteId = ref<number | null>(null)
const showConfirmModal = ref(false)
const showFormModal = ref(false)

// ------------------------------------------------------------------
// 2. MODAL CONTROLS
// ------------------------------------------------------------------

const showAddUserModal = () => {
  resetForm()
  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
  resetForm()
}

// ------------------------------------------------------------------
// 3. FORM ACTIONS (Mock Logic)
// ------------------------------------------------------------------

const saveUser = (user: User) => {
  // ในการทำงานจริง Logic นี้ควรเรียกใช้ API Service
  if (opduser.value) {
    // โหมดแก้ไข
    const index = usersList.value.findIndex((u) => u.id === user.id)
    if (index !== -1) {
      // ✅ แก้ไขปัญหา ESLint โดยใช้ _password และปิดกฎ no-unused-vars
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _password, ...rest } = user

      usersList.value[index] = { ...usersList.value[index], ...rest }
    }
    toast.success('แก้ไขข้อมูลผู้ใช้งานสำเร็จ!')
  } else {
    // โหมดสร้างใหม่
    const newId = usersList.value.length > 0 ? Math.max(...usersList.value.map((u) => u.id)) + 1 : 1
    usersList.value.push({ ...user, id: newId })
    toast.success('เพิ่มผู้ใช้งานใหม่สำเร็จ!')
  }
}

const saveAndCloseModal = (user: User) => {
  saveUser(user)
  closeFormModal()
}

const editUser = (user: User) => {
  currentUser.value = { ...user, password: '' }
  opduser.value = true
  showFormModal.value = true
}

// ------------------------------------------------------------------
// 4. DELETE ACTIONS (ยังคงเดิม)
// ------------------------------------------------------------------

const confirmDeleteUser = (id: number) => {
  userToDeleteId.value = id
  showConfirmModal.value = true
}

const deleteUser = () => {
  if (userToDeleteId.value !== null) {
    usersList.value = usersList.value.filter((u) => u.id !== userToDeleteId.value)
    toast.success('ลบผู้ใช้งานสำเร็จ!')
  }
  resetDeleteConfirm()
}

const cancelDelete = () => {
  resetDeleteConfirm()
}

// ------------------------------------------------------------------
// 5. UTILITY (ยังคงเดิม)
// ------------------------------------------------------------------

const resetForm = () => {
  currentUser.value = { ...initialUser }
  opduser.value = false
}

const resetDeleteConfirm = () => {
  userToDeleteId.value = null
  showConfirmModal.value = false
}
</script>

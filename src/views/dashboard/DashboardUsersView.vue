<template>
  <div class="p-6 bg-white rounded-lg shadow-xl">
    <h1 class="text-3xl font-bold text-gray-800 mb-6 flex items-center">
      <i class="fas fa-users-cog mr-3 text-indigo-600"></i>
      จัดการผู้ใช้งาน
    </h1>

    <div class="mb-6 flex justify-end">
      <button
        @click="showAddUserModal"
        class="bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105"
      >
        <i class="fas fa-plus-circle mr-2"></i> เพิ่มผู้ใช้งาน
      </button>
    </div>

    <UsersList
      :users="usersList"
      :role-mapping="ROLE_MAPPING"
      @edit="editUser"
      @delete="confirmDeleteUser"
    />

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showFormModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          @click.self="closeFormModal"
        >
          <div
            class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg transition-all transform duration-300 scale-100 opacity-100"
          >
            <div class="flex justify-between items-center border-b pb-3 mb-4">
              <h3 class="text-xl font-bold text-gray-800">
                {{ opduser ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่' }}
              </h3>
              <button @click="closeFormModal" class="text-gray-400 hover:text-gray-600">
                <i class="fas fa-times text-xl"></i>
              </button>
            </div>

            <UserForm
              :current-user="currentUser"
              :opd-user="opduser"
              @save-user="saveAndCloseModal"
              @cancel-edit="closeFormModal"
            />
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showConfirmModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          @click.self="cancelDelete"
        >
          <div class="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm text-center">
            <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
            <h3 class="text-lg font-bold mb-2">ยืนยันการลบผู้ใช้งาน</h3>
            <p class="text-gray-600 mb-6">คุณแน่ใจหรือไม่ที่จะลบผู้ใช้งานคนนี้?</p>
            <div class="flex justify-center space-x-4">
              <button
                @click="deleteUser"
                class="bg-red-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-red-700 transition"
              >
                ยืนยันการลบ
              </button>
              <button
                @click="cancelDelete"
                class="bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import UserForm from '@/components/users/UserForm.vue'
import UsersList from '@/components/users/UsersList.vue'
import type { User } from '@/types/user'

// 💡 Import Service Layer ที่เชื่อมต่อ API จริง
import {
  fetchAllUsers,
  createUser,
  updateUserDetails,
  deleteUserById,
  fetchUserById,
} from '@/services/userService'

const toast = useToast()

const ROLE_MAPPING: { [key: string]: string } = {
  '20': 'OPD',
  '50': 'Admin',
  '90': 'Superadmin',
}

// 💡 ใช้ User Interface ที่ Import มา
const initialUser: User = {
  id: '',
  username: '',
  role: '20',
  management: '',
}

// ------------------------------------------------------------------
// STATE MANAGEMENT
// ------------------------------------------------------------------
const usersList = ref<User[]>([])
const currentUser = ref<User>({ ...initialUser })
const opduser = ref(false)
const showConfirmModal = ref(false)
const showFormModal = ref(false)
const userToDeleteId = ref<string | null>(null) // ID เป็น string GUID

// ------------------------------------------------------------------
// DATA FETCHING
// ------------------------------------------------------------------

const fetchUsers = async () => {
  try {
    usersList.value = await fetchAllUsers()
  } catch (error) {
    toast.error('ไม่สามารถดึงข้อมูลผู้ใช้งานได้')
    console.error(error)
  }
}

// ------------------------------------------------------------------
// MODAL & FORM ACTIONS
// ------------------------------------------------------------------

const showAddUserModal = () => {
  currentUser.value = { ...initialUser }
  opduser.value = false
  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
  resetForm()
}

const editUser = async (user: User) => {
  try {
    // 💡 ดึงข้อมูลผู้ใช้งานล่าสุดจาก API ด้วย ID
    const fetchedUser = await fetchUserById(user.id)

    currentUser.value = { ...fetchedUser }
    opduser.value = true
    showFormModal.value = true
  } catch (error) {
    toast.error('ไม่สามารถโหลดข้อมูลผู้ใช้งานเพื่อแก้ไขได้')
    console.error(error)
  }
}

const saveUser = async (user: User) => {
  try {
    if (opduser.value) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, username: _username, password, ...dataToUpdate } = user
      await updateUserDetails(id, dataToUpdate)
      toast.success('แก้ไขข้อมูลผู้ใช้งานสำเร็จ!')
    } else {
      await createUser(user)
      toast.success('เพิ่มผู้ใช้งานใหม่สำเร็จ!')
    }
    await fetchUsers()
  } catch (error) {
    toast.error('บันทึกข้อมูลไม่สำเร็จ')
    console.error(error)
  }
}

const saveAndCloseModal = (user: User) => {
  saveUser(user)
  closeFormModal()
}

// ------------------------------------------------------------------
// DELETE ACTIONS
// ------------------------------------------------------------------

const confirmDeleteUser = (id: string) => {
  userToDeleteId.value = id
  showConfirmModal.value = true
}

const cancelDelete = () => {
  resetDeleteConfirm()
}

const deleteUser = async () => {
  if (userToDeleteId.value !== null) {
    try {
      await deleteUserById(userToDeleteId.value)
      toast.success('ลบผู้ใช้งานสำเร็จ!')
      await fetchUsers()
    } catch (error) {
      toast.error('ลบผู้ใช้งานไม่สำเร็จ')
      console.error(error)
    }
  }
  resetDeleteConfirm()
}

// ------------------------------------------------------------------
// UTILITY & LIFECYCLE
// ------------------------------------------------------------------
const resetForm = () => {
  currentUser.value = { ...initialUser }
  opduser.value = false
}

const resetDeleteConfirm = () => {
  userToDeleteId.value = null
  showConfirmModal.value = false
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

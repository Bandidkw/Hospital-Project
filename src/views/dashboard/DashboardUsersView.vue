<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-users-cog mr-3 text-yellow-300"></i> จัดการผู้ใช้งาน
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับเพิ่ม, แก้ไข, และลบข้อมูลผู้ใช้งานระบบ (เจ้าหน้าที่).</p>

    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ editingUser ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่' }}</h3>
      <form @submit.prevent="saveUser" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">ชื่อผู้ใช้งาน:</label>
          <input type="text" id="username" v-model="currentUser.username" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required :disabled="editingUser">
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">อีเมล:</label>
          <input type="email" id="email" v-model="currentUser.email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">รหัสผ่าน:</label>
          <input type="password" id="password" v-model="currentUser.password" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" :required="!editingUser">
          <p v-if="editingUser" class="text-xs text-gray-500 mt-1">เว้นว่างไว้หากไม่ต้องการเปลี่ยนรหัสผ่าน</p>
        </div>
        <div>
          <label for="role" class="block text-sm font-medium text-gray-700">บทบาท:</label>
          <select id="role" v-model="currentUser.role" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
            </select>
        </div>
        <div class="flex justify-end space-x-3">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            <i class="fas fa-save mr-2"></i> {{ editingUser ? 'บันทึกการแก้ไข' : 'เพิ่มผู้ใช้งาน' }}
          </button>
          <button v-if="editingUser" type="button" @click="cancelEdit" class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300">
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </form>
    </div>

    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รายการผู้ใช้งาน</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">#</th>
              <th class="py-3 px-6 text-left">ชื่อผู้ใช้งาน</th>
              <th class="py-3 px-6 text-left">อีเมล</th>
              <th class="py-3 px-6 text-left">บทบาท</th>
              <th class="py-3 px-6 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-for="(user, index) in usersList" :key="user.id" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="py-3 px-6 text-left">{{ index + 1 }}</td>
              <td class="py-3 px-6 text-left">{{ user.username }}</td>
              <td class="py-3 px-6 text-left">{{ user.email }}</td>
              <td class="py-3 px-6 text-left">{{ user.role }}</td>
              <td class="py-3 px-6 text-center">
                <button @click="editUser(user)" class="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs hover:bg-yellow-600 transition duration-300 mr-2">
                  <i class="fas fa-edit"></i> แก้ไข
                </button>
                <button @click="confirmDeleteUser(user.id)" class="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition duration-300">
                  <i class="fas fa-trash-alt"></i> ลบ
                </button>
              </td>
            </tr>
            <tr v-if="usersList.length === 0">
              <td colspan="5" class="py-8 text-center text-gray-500">ยังไม่มีผู้ใช้งานในระบบ.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งานนี้?</p>
        <div class="flex justify-center space-x-4">
          <button @click="deleteUser" class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300">
            <i class="fas fa-trash-alt mr-2"></i> ลบ
          </button>
          <button @click="cancelDelete" class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300">
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'vue-toastification'; // นำเข้า useToast

const toast = useToast(); // สร้าง instance ของ toast

interface User {
  id: number;
  username: string;
  email: string;
  password?: string; // Optional for editing
  role: string;
}

const usersList = ref<User[]>([
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' },
  { id: 2, username: 'editor', email: 'editor@example.com', role: 'editor' },
]);

const currentUser = ref<User>({
  id: 0,
  username: '',
  email: '',
  password: '',
  role: 'viewer',
});
const editingUser = ref(false);
const userToDeleteId = ref<number | null>(null);
const showConfirmModal = ref(false);

const saveUser = () => {
  if (editingUser.value) {
    const index = usersList.value.findIndex(u => u.id === currentUser.value.id);
    if (index !== -1) {
      // Remove password before saving if not changed
      const { password, ...rest } = currentUser.value;
      usersList.value[index] = { ...rest };
    }
    toast.success('แก้ไขผู้ใช้งานสำเร็จ!'); // เปลี่ยนจาก alert เป็น toast.success
  } else {
    currentUser.value.id = usersList.value.length > 0 ? Math.max(...usersList.value.map(u => u.id)) + 1 : 1;
    usersList.value.push({ ...currentUser.value });
    toast.success('เพิ่มผู้ใช้งานสำเร็จ!'); // เปลี่ยนจาก alert เป็น toast.success
  }
  resetForm();
};

const editUser = (user: User) => {
  currentUser.value = { ...user, password: '' }; // Clear password when editing
  editingUser.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const confirmDeleteUser = (id: number) => {
  userToDeleteId.value = id;
  showConfirmModal.value = true;
};

const deleteUser = () => {
  if (userToDeleteId.value !== null) {
    usersList.value = usersList.value.filter(u => u.id !== userToDeleteId.value);
    toast.success('ลบผู้ใช้งานสำเร็จ!'); // เปลี่ยนจาก alert เป็น toast.success
  }
  resetDeleteConfirm();
};

const cancelDelete = () => {
  resetDeleteConfirm();
};

const resetForm = () => {
  currentUser.value = { id: 0, username: '', email: '', password: '', role: 'viewer' };
  editingUser.value = false;
};

const resetDeleteConfirm = () => {
  userToDeleteId.value = null;
  showConfirmModal.value = false;
};

// In a real application, you would fetch initial users from an API on mount
// onMounted(() => {
//   fetchUsers();
// });
// const fetchUsers = async () => { /* ... */ };
</script>

<style scoped>
/* Specific styles for this page */
</style>

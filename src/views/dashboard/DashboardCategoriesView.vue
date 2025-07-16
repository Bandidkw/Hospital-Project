<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-tags mr-3 text-yellow-500"></i> จัดการหมวดหมู่
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับเพิ่ม, แก้ไข, และลบหมวดหมู่สำหรับข่าวสารหรือเอกสารต่างๆ.</p>

    <!-- Form for Adding/Editing Category -->
    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ editingCategory ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่' }}</h3>
      <form @submit.prevent="saveCategory" class="space-y-4">
        <div>
          <label for="categoryName" class="block text-sm font-medium text-gray-700">ชื่อหมวดหมู่</label>
          <input type="text" id="categoryName" v-model="currentCategory.name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div class="flex justify-end space-x-3">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            <i class="fas fa-save mr-2"></i> {{ editingCategory ? 'บันทึกการแก้ไข' : 'เพิ่มหมวดหมู่' }}
          </button>
          <button v-if="editingCategory" type="button" @click="cancelEdit" class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300">
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </form>
    </div>

    <!-- List of Categories -->
    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รายการหมวดหมู่</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">#</th>
              <th class="py-3 px-6 text-left">ชื่อหมวดหมู่</th>
              <th class="py-3 px-6 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-for="(category, index) in categoriesList" :key="category.id" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="py-3 px-6 text-left">{{ index + 1 }}</td>
              <td class="py-3 px-6 text-left">{{ category.name }}</td>
              <td class="py-3 px-6 text-center">
                <button @click="editCategory(category)" class="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs hover:bg-yellow-600 transition duration-300 mr-2">
                  <i class="fas fa-edit"></i> แก้ไข
                </button>
                <button @click="confirmDeleteCategory(category.id)" class="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition duration-300">
                  <i class="fas fa-trash-alt"></i> ลบ
                </button>
              </td>
            </tr>
            <tr v-if="categoriesList.length === 0">
              <td colspan="3" class="py-8 text-center text-gray-500">ยังไม่มีหมวดหมู่ในขณะนี้.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Custom Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?</p>
        <div class="flex justify-center space-x-4">
          <button @click="deleteCategory" class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300">
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

interface Category {
  id: number;
  name: string;
}

const categoriesList = ref<Category[]>([
  { id: 1, name: 'ข่าวประชาสัมพันธ์' },
  { id: 2, name: 'ระเบียบและข้อบังคับ' },
  { id: 3, name: 'รายงานประจำปี' },
]);

const currentCategory = ref<Category>({ id: 0, name: '' });
const editingCategory = ref(false);
const categoryToDeleteId = ref<number | null>(null);
const showConfirmModal = ref(false);

const saveCategory = () => {
  if (editingCategory.value) {
    const index = categoriesList.value.findIndex(c => c.id === currentCategory.value.id);
    if (index !== -1) {
      categoriesList.value[index] = { ...currentCategory.value };
    }
    alert('แก้ไขหมวดหมู่สำเร็จ!');
  } else {
    currentCategory.value.id = categoriesList.value.length > 0 ? Math.max(...categoriesList.value.map(c => c.id)) + 1 : 1;
    categoriesList.value.push({ ...currentCategory.value });
    alert('เพิ่มหมวดหมู่สำเร็จ!');
  }
  resetForm();
};

const editCategory = (category: Category) => {
  currentCategory.value = { ...category };
  editingCategory.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const confirmDeleteCategory = (id: number) => {
  categoryToDeleteId.value = id;
  showConfirmModal.value = true;
};

const deleteCategory = () => {
  if (categoryToDeleteId.value !== null) {
    categoriesList.value = categoriesList.value.filter(c => c.id !== categoryToDeleteId.value);
    alert('ลบหมวดหมู่สำเร็จ!');
  }
  resetDeleteConfirm();
};

const cancelDelete = () => {
  resetDeleteConfirm();
};

const resetForm = () => {
  currentCategory.value = { id: 0, name: '' };
  editingCategory.value = false;
};

const resetDeleteConfirm = () => {
  categoryToDeleteId.value = null;
  showConfirmModal.value = false;
};
</script>

<style scoped>
/* Specific styles for this page */
</style>

<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-link mr-3 text-pink-400"></i> จัดการลิงก์ท้ายหน้า
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับเพิ่ม, แก้ไข, และลบลิงก์ที่แสดงในส่วนท้าย (Footer) ของเว็บไซต์.</p>

    <!-- Form for Adding/Editing Footer Link -->
    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ editingLink ? 'แก้ไขลิงก์' : 'เพิ่มลิงก์ใหม่' }}</h3>
      <form @submit.prevent="saveLink" class="space-y-4">
        <div>
          <label for="linkText" class="block text-sm font-medium text-gray-700">ข้อความลิงก์</label>
          <input type="text" id="linkText" v-model="currentLink.text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="linkUrl" class="block text-sm font-medium text-gray-700">URL ลิงก์</label>
          <input type="url" id="linkUrl" v-model="currentLink.url" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="linkOrder" class="block text-sm font-medium text-gray-700">ลำดับการแสดงผล</label>
          <input type="number" id="linkOrder" v-model.number="currentLink.order" class="mt-1 block w-24 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div class="flex justify-end space-x-3">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            <i class="fas fa-save mr-2"></i> {{ editingLink ? 'บันทึกการแก้ไข' : 'เพิ่มลิงก์' }}
          </button>
          <button v-if="editingLink" type="button" @click="cancelEdit" class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300">
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </form>
    </div>

    <!-- List of Footer Links -->
    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รายการลิงก์ท้ายหน้า</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">#</th>
              <th class="py-3 px-6 text-left">ข้อความ</th>
              <th class="py-3 px-6 text-left">URL</th>
              <th class="py-3 px-6 text-center">ลำดับ</th>
              <th class="py-3 px-6 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-for="(link, index) in linksList" :key="link.id" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="py-3 px-6 text-left">{{ index + 1 }}</td>
              <td class="py-3 px-6 text-left">{{ link.text }}</td>
              <td class="py-3 px-6 text-left truncate max-w-xs">
                <a :href="link.url" target="_blank" class="text-blue-600 hover:underline">{{ link.url }}</a>
              </td>
              <td class="py-3 px-6 text-center">{{ link.order }}</td>
              <td class="py-3 px-6 text-center">
                <button @click="editLink(link)" class="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs hover:bg-yellow-600 transition duration-300 mr-2">
                  <i class="fas fa-edit"></i> แก้ไข
                </button>
                <button @click="confirmDeleteLink(link.id)" class="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition duration-300">
                  <i class="fas fa-trash-alt"></i> ลบ
                </button>
              </td>
            </tr>
            <tr v-if="linksList.length === 0">
              <td colspan="5" class="py-8 text-center text-gray-500">ยังไม่มีลิงก์ท้ายหน้าในขณะนี้.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Custom Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบลิงก์นี้?</p>
        <div class="flex justify-center space-x-4">
          <button @click="deleteLink" class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300">
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

interface FooterLink {
  id: number;
  text: string;
  url: string;
  order: number;
}

const linksList = ref<FooterLink[]>([
  { id: 1, text: 'นโยบายความเป็นส่วนตัว', url: '#privacy', order: 1 },
  { id: 2, text: 'ข้อกำหนดและเงื่อนไข', url: '#terms', order: 2 },
  { id: 3, text: 'แผนที่โรงพยาบาล', url: '#map', order: 3 },
]);

const currentLink = ref<FooterLink>({
  id: 0,
  text: '',
  url: '',
  order: 0,
});
const editingLink = ref(false);
const linkToDeleteId = ref<number | null>(null);
const showConfirmModal = ref(false);

const saveLink = () => {
  if (editingLink.value) {
    const index = linksList.value.findIndex(l => l.id === currentLink.value.id);
    if (index !== -1) {
      linksList.value[index] = { ...currentLink.value };
    }
    alert('แก้ไขลิงก์สำเร็จ!');
  } else {
    currentLink.value.id = linksList.value.length > 0 ? Math.max(...linksList.value.map(l => l.id)) + 1 : 1;
    linksList.value.push({ ...currentLink.value });
    alert('เพิ่มลิงก์สำเร็จ!');
  }
  resetForm();
};

const editLink = (link: FooterLink) => {
  currentLink.value = { ...link };
  editingLink.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const confirmDeleteLink = (id: number) => {
  linkToDeleteId.value = id;
  showConfirmModal.value = true;
};

const deleteLink = () => {
  if (linkToDeleteId.value !== null) {
    linksList.value = linksList.value.filter(l => l.id !== linkToDeleteId.value);
    alert('ลบลิงก์สำเร็จ!');
  }
  resetDeleteConfirm();
};

const cancelDelete = () => {
  resetDeleteConfirm();
};

const resetForm = () => {
  currentLink.value = { id: 0, text: '', url: '', order: 0 };
  editingLink.value = false;
};

const resetDeleteConfirm = () => {
  linkToDeleteId.value = null;
  showConfirmModal.value = false;
};
</script>

<style scoped>
/* Specific styles for this page */
</style>

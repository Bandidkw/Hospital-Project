<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-users mr-3 text-purple-500"></i> จัดการบุคลากร
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับเพิ่ม, แก้ไข, และลบข้อมูลบุคลากรของโรงพยาบาล.</p>

    <!-- Form for Adding/Editing Personnel -->
    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ editingPersonnel ? 'แก้ไขข้อมูลบุคลากร' : 'เพิ่มบุคลากรใหม่' }}</h3>
      <form @submit.prevent="savePersonnel" class="space-y-4">
        <div>
          <label for="personnelName" class="block text-sm font-medium text-gray-700">ชื่อ-นามสกุล:</label>
          <input type="text" id="personnelName" v-model="currentPersonnel.name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="position" class="block text-sm font-medium text-gray-700">ตำแหน่ง:</label>
          <input type="text" id="position" v-model="currentPersonnel.position" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="department" class="block text-sm font-medium text-gray-700">แผนก:</label>
          <input type="text" id="department" v-model="currentPersonnel.department" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="contact" class="block text-sm font-medium text-gray-700">ข้อมูลติดต่อ (อีเมล/โทรศัพท์):</label>
          <input type="text" id="contact" v-model="currentPersonnel.contact" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="personnelImage" class="block text-sm font-medium text-gray-700">รูปภาพบุคลากร:</label>
          <input type="file" id="personnelImage" @change="handleImageUpload" accept="image/*" class="mt-1 block w-full text-gray-700" :required="!editingPersonnel">
          <p v-if="currentPersonnel.imageUrl" class="text-sm text-gray-500 mt-2">รูปภาพปัจจุบัน: <a :href="currentPersonnel.imageUrl" target="_blank" class="text-blue-500 hover:underline">ดูรูป</a></p>
        </div>
        <div class="flex justify-end space-x-3">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            <i class="fas fa-save mr-2"></i> {{ editingPersonnel ? 'บันทึกการแก้ไข' : 'เพิ่มบุคลากร' }}
          </button>
          <button v-if="editingPersonnel" type="button" @click="cancelEdit" class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300">
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </form>
    </div>

    <!-- List of Personnel -->
    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รายการบุคลากร</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">#</th>
              <th class="py-3 px-6 text-left">รูปภาพ</th>
              <th class="py-3 px-6 text-left">ชื่อ-นามสกุล</th>
              <th class="py-3 px-6 text-left">ตำแหน่ง</th>
              <th class="py-3 px-6 text-left">แผนก</th>
              <th class="py-3 px-6 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-for="(personnel, index) in personnelList" :key="personnel.id" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="py-3 px-6 text-left">{{ index + 1 }}</td>
              <td class="py-3 px-6 text-left">
                <img :src="personnel.imageUrl" alt="Personnel Image" class="w-12 h-12 object-cover rounded-full">
              </td>
              <td class="py-3 px-6 text-left">{{ personnel.name }}</td>
              <td class="py-3 px-6 text-left">{{ personnel.position }}</td>
              <td class="py-3 px-6 text-left">{{ personnel.department }}</td>
              <td class="py-3 px-6 text-center">
                <button @click="editPersonnel(personnel)" class="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs hover:bg-yellow-600 transition duration-300 mr-2">
                  <i class="fas fa-edit"></i> แก้ไข
                </button>
                <button @click="confirmDeletePersonnel(personnel.id)" class="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition duration-300">
                  <i class="fas fa-trash-alt"></i> ลบ
                </button>
              </td>
            </tr>
            <tr v-if="personnelList.length === 0">
              <td colspan="6" class="py-8 text-center text-gray-500">ยังไม่มีข้อมูลบุคลากร.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Custom Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลบุคลากรนี้?</p>
        <div class="flex justify-center space-x-4">
          <button @click="deletePersonnel" class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300">
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

interface PersonnelItem {
  id: number;
  name: string;
  position: string;
  department: string;
  contact: string;
  imageUrl: string;
}

const personnelList = ref<PersonnelItem[]>([
  { id: 1, name: 'นายแพทย์ สมชาย สุขภาพดี', position: 'ผู้อำนวยการ', department: 'บริหาร', contact: 'somchai@example.com', imageUrl: 'https://placehold.co/100x100/e0e0e0/333333?text=Doc1' },
  { id: 2, name: 'นางสาว ดวงพร พยาบาล', position: 'หัวหน้าพยาบาล', department: 'การพยาบาล', contact: 'duangporn@example.com', imageUrl: 'https://placehold.co/100x100/e0e0e0/333333?text=Nurse1' },
]);

const currentPersonnel = ref<PersonnelItem>({
  id: 0,
  name: '',
  position: '',
  department: '',
  contact: '',
  imageUrl: '',
});
const editingPersonnel = ref(false);
const personnelToDeleteId = ref<number | null>(null);
const showConfirmModal = ref(false);

const savePersonnel = () => {
  if (editingPersonnel.value) {
    const index = personnelList.value.findIndex(p => p.id === currentPersonnel.value.id);
    if (index !== -1) {
      personnelList.value[index] = { ...currentPersonnel.value };
    }
    alert('แก้ไขข้อมูลบุคลากรสำเร็จ!');
  } else {
    currentPersonnel.value.id = personnelList.value.length > 0 ? Math.max(...personnelList.value.map(p => p.id)) + 1 : 1;
    personnelList.value.push({ ...currentPersonnel.value });
    alert('เพิ่มบุคลากรสำเร็จ!');
  }
  resetForm();
};

const editPersonnel = (personnel: PersonnelItem) => {
  currentPersonnel.value = { ...personnel };
  editingPersonnel.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const confirmDeletePersonnel = (id: number) => {
  personnelToDeleteId.value = id;
  showConfirmModal.value = true;
};

const deletePersonnel = () => {
  if (personnelToDeleteId.value !== null) {
    personnelList.value = personnelList.value.filter(p => p.id !== personnelToDeleteId.value);
    alert('ลบข้อมูลบุคลากรสำเร็จ!');
  }
  resetDeleteConfirm();
};

const cancelDelete = () => {
  resetDeleteConfirm();
};

const resetForm = () => {
  currentPersonnel.value = { id: 0, name: '', position: '', department: '', contact: '', imageUrl: '' };
  editingPersonnel.value = false;
  const fileInput = document.getElementById('personnelImage') as HTMLInputElement;
  if (fileInput) fileInput.value = '';
};

const resetDeleteConfirm = () => {
  personnelToDeleteId.value = null;
  showConfirmModal.value = false;
};

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      currentPersonnel.value.imageUrl = e.target?.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }
};
</script>

<style scoped>
/* Specific styles for this page */
</style>

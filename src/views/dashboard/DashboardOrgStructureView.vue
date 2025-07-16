<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-sitemap mr-3 text-purple-400"></i> จัดการโครงสร้างองค์กร
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับเพิ่ม, แก้ไข, และลบข้อมูลหน่วยงาน/ตำแหน่งในโครงสร้างองค์กร.</p>

    <!-- Form for Adding/Editing Organizational Unit -->
    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ editingUnit ? 'แก้ไขหน่วยงาน/ตำแหน่ง' : 'เพิ่มหน่วยงาน/ตำแหน่งใหม่' }}</h3>
      <form @submit.prevent="saveOrgUnit" class="space-y-4">
        <div>
          <label for="unitName" class="block text-sm font-medium text-gray-700">ชื่อหน่วยงาน/ตำแหน่ง:</label>
          <input type="text" id="unitName" v-model="currentOrgUnit.name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="unitType" class="block text-sm font-medium text-gray-700">ประเภท:</label>
          <select id="unitType" v-model="currentOrgUnit.type" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
            <option value="">-- เลือกประเภท --</option>
            <option value="Department">แผนก</option>
            <option value="Division">ฝ่าย</option>
            <option value="Unit">หน่วย</option>
            <option value="Position">ตำแหน่ง</option>
          </select>
        </div>
        <div>
          <label for="parentUnit" class="block text-sm font-medium text-gray-700">หน่วยงานแม่ (ถ้ามี):</label>
          <select id="parentUnit" v-model="currentOrgUnit.parentId" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
            <option :value="null">-- ไม่มี --</option>
            <option v-for="unit in orgUnits" :key="unit.id" :value="unit.id">{{ unit.name }} ({{ unit.type }})</option>
          </select>
        </div>
        <div>
          <label for="unitHead" class="block text-sm font-medium text-gray-700">หัวหน้า (ไม่บังคับ):</label>
          <input type="text" id="unitHead" v-model="currentOrgUnit.head" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="unitDescription" class="block text-sm font-medium text-gray-700">คำอธิบาย (ไม่บังคับ):</label>
          <textarea id="unitDescription" v-model="currentOrgUnit.description" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div class="flex justify-end space-x-3">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            <i class="fas fa-save mr-2"></i> {{ editingUnit ? 'บันทึกการแก้ไข' : 'เพิ่มหน่วยงาน' }}
          </button>
          <button v-if="editingUnit" type="button" @click="cancelEdit" class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300">
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </form>
    </div>

    <!-- List of Organizational Units -->
    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รายการหน่วยงาน/ตำแหน่ง</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">ชื่อ</th>
              <th class="py-3 px-6 text-left">ประเภท</th>
              <th class="py-3 px-6 text-left">หน่วยงานแม่</th>
              <th class="py-3 px-6 text-left">หัวหน้า</th>
              <th class="py-3 px-6 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-for="unit in sortedOrgUnits" :key="unit.id" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="py-3 px-6 text-left">{{ unit.name }}</td>
              <td class="py-3 px-6 text-left">{{ unit.type }}</td>
              <td class="py-3 px-6 text-left">{{ getParentName(unit.parentId) || '-' }}</td>
              <td class="py-3 px-6 text-left">{{ unit.head || '-' }}</td>
              <td class="py-3 px-6 text-center">
                <button @click="editOrgUnit(unit)" class="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs hover:bg-yellow-600 transition duration-300 mr-2">
                  <i class="fas fa-edit"></i> แก้ไข
                </button>
                <button @click="confirmDeleteOrgUnit(unit.id)" class="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition duration-300">
                  <i class="fas fa-trash-alt"></i> ลบ
                </button>
              </td>
            </tr>
            <tr v-if="orgUnits.length === 0">
              <td colspan="5" class="py-8 text-center text-gray-500">ยังไม่มีหน่วยงาน/ตำแหน่งในโครงสร้างองค์กร.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Custom Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบหน่วยงาน/ตำแหน่งนี้?</p>
        <div class="flex justify-center space-x-4">
          <button @click="deleteOrgUnit" class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300">
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
import { ref, computed } from 'vue';
import { useToast } from 'vue-toastification'; // Assuming you have vue-toastification installed

const toast = useToast();

// Define a union type for organizational unit types
type OrgUnitType = 'Department' | 'Division' | 'Unit' | 'Position';

// Interface for an organizational unit item
interface OrgUnitItem {
  id: number;
  name: string;
  type: OrgUnitType; // This is the property causing the error in the user's image
  parentId: number | null; // For hierarchical structure
  head?: string; // Optional: Name of the head of this unit/position
  description?: string; // Optional: Description of the unit/position
}

// Mock data for organizational units
const orgUnits = ref<OrgUnitItem[]>([
  { id: 1, name: 'ผู้อำนวยการโรงพยาบาล', type: 'Position', parentId: null, head: 'นายแพทย์ สมชาย สุขภาพดี' },
  { id: 2, name: 'ฝ่ายบริหาร', type: 'Division', parentId: 1, head: 'นางสาว ดวงพร พยาบาล' },
  { id: 3, name: 'ฝ่ายการพยาบาล', type: 'Division', parentId: 1, head: 'นางสาว จริยา จิตใจดี' },
  { id: 4, name: 'แผนกบุคคล', type: 'Department', parentId: 2, head: 'นาย มานะ มั่นคง' },
  { id: 5, name: 'แผนกการเงิน', type: 'Department', parentId: 2, head: 'นางสาว รวยริน เงินทอง' },
  { id: 6, name: 'หน่วยผู้ป่วยนอก', type: 'Unit', parentId: 3, head: 'นางสาว อารี รักษา' },
  { id: 7, name: 'หน่วยผู้ป่วยใน', type: 'Unit', parentId: 3, head: 'นางสาว เมตตา ดูแล' },
]);

// Reactive state for the form
const currentOrgUnit = ref<OrgUnitItem>({
  id: 0,
  name: '',
  type: 'Department', // Initialize with a valid OrgUnitType to prevent the error
  parentId: null,
  head: '',
  description: '',
});

const editingUnit = ref(false);
const unitToDeleteId = ref<number | null>(null);
const showConfirmModal = ref(false);

// Computed property to sort organizational units (e.g., by ID or type)
const sortedOrgUnits = computed(() => {
  return [...orgUnits.value].sort((a, b) => a.id - b.id); // Simple sort by ID
});

// Function to get parent unit name for display
const getParentName = (parentId: number | null) => {
  if (parentId === null) return null;
  const parent = orgUnits.value.find(unit => unit.id === parentId);
  return parent ? parent.name : 'Unknown';
};

// CRUD Operations
const saveOrgUnit = () => {
  if (editingUnit.value) {
    const index = orgUnits.value.findIndex(unit => unit.id === currentOrgUnit.value.id);
    if (index !== -1) {
      orgUnits.value[index] = { ...currentOrgUnit.value };
      toast.success('แก้ไขหน่วยงาน/ตำแหน่งสำเร็จ!');
    }
  } else {
    currentOrgUnit.value.id = orgUnits.value.length > 0 ? Math.max(...orgUnits.value.map(unit => unit.id)) + 1 : 1;
    orgUnits.value.push({ ...currentOrgUnit.value });
    toast.success('เพิ่มหน่วยงาน/ตำแหน่งใหม่สำเร็จ!');
  }
  resetForm();
};

const editOrgUnit = (unit: OrgUnitItem) => {
  currentOrgUnit.value = { ...unit };
  editingUnit.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const confirmDeleteOrgUnit = (id: number) => {
  unitToDeleteId.value = id;
  showConfirmModal.value = true;
};

const deleteOrgUnit = () => {
  if (unitToDeleteId.value !== null) {
    orgUnits.value = orgUnits.value.filter(unit => unit.id !== unitToDeleteId.value);
    toast.success('ลบหน่วยงาน/ตำแหน่งสำเร็จ!');
  }
  resetDeleteConfirm();
};

const cancelDelete = () => {
  resetDeleteConfirm();
};

const resetForm = () => {
  currentOrgUnit.value = {
    id: 0,
    name: '',
    type: 'Department',
    parentId: null,
    head: '',
    description: '',
  };
  editingUnit.value = false;
};

const resetDeleteConfirm = () => {
  unitToDeleteId.value = null;
  showConfirmModal.value = false;
};

// In a real application, you would fetch initial data from an API on mount
// onMounted(() => {
//   fetchOrgUnits();
// });
// const fetchOrgUnits = async () => { /* ... */ };
</script>

<style scoped>
/* Specific styles for this page */
</style>

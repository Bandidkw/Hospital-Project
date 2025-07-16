<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-sitemap mr-3 text-emerald-600"></i> จัดการโครงสร้างองค์การ
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับจัดการข้อมูลโครงสร้างแผนกและตำแหน่งต่างๆ ภายในโรงพยาบาล.</p>


    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ editingUnit ? 'แก้ไขหน่วยงาน/ตำแหน่ง' : 'เพิ่มหน่วยงาน/ตำแหน่งใหม่' }}</h3>
      <form @submit.prevent="saveOrgUnit" class="space-y-4">
        <div>
          <label for="unitName" class="block text-sm font-medium text-gray-700">ชื่อหน่วยงาน/ตำแหน่ง:</label>
          <input type="text" id="unitName" v-model="currentUnit.name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="unitType" class="block text-sm font-medium text-gray-700">ประเภท:</label>
          <select id="unitType" v-model="currentUnit.type" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
            <option value="">-- เลือกประเภท --</option>
            <option value="Hospital">โรงพยาบาล</option>
            <option value="Department">แผนก</option>
            <option value="Division">หน่วยงาน</option>
            <option value="Position">ตำแหน่ง</option>

            </select>
        </div>
        <div>
          <label for="parentUnit" class="block text-sm font-medium text-gray-700">อยู่ภายใต้ (Parent Unit):</label>
          <select id="parentUnit" v-model="currentUnit.parentId" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
            <option :value="null">-- ไม่มี -- (หน่วยงานระดับบนสุด)</option>
            <option v-for="unit in orgStructureList" :key="unit.id" :value="unit.id">
              {{ unit.name }} ({{ unit.type }})
            </option>
          </select>
          <p class="text-xs text-gray-500 mt-1">เลือกหน่วยงานที่อยู่เหนือขึ้นไปในโครงสร้าง</p>
        </div>
        <div>
          <label for="unitHead" class="block text-sm font-medium text-gray-700">หัวหน้า/ผู้รับผิดชอบ (Optional):</label>
          <input type="text" id="unitHead" v-model="currentUnit.head" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
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


    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">โครงสร้างองค์การ (รายการ)</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">ชื่อ</th>
              <th class="py-3 px-6 text-left">ประเภท</th>
              <th class="py-3 px-6 text-left">ภายใต้</th>
              <th class="py-3 px-6 text-left">หัวหน้า/ผู้รับผิดชอบ</th>
              <th class="py-3 px-6 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-for="unit in sortedOrgStructureList" :key="unit.id" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="py-3 px-6 text-left" :style="{ paddingLeft: (unit.level * 20) + 'px' }">
                {{ unit.name }}
              </td>
              <td class="py-3 px-6 text-left">{{ unit.type }}</td>
              <td class="py-3 px-6 text-left">
                {{ getParentName(unit.parentId) || '-' }}
              </td>
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
            <tr v-if="orgStructureList.length === 0">
              <td colspan="5" class="py-8 text-center text-gray-500">ยังไม่มีข้อมูลโครงสร้างองค์การในระบบ.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


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
import { useToast } from 'vue-toastification';

const toast = useToast();

type OrgUnitType = 'Hospital' | 'Department' | 'Division' | 'Position';

interface OrgUnitItem {
  id: number;
  name: string;
  type: OrgUnitType;
  parentId: number | null;
  head?: string;
}

const orgStructureList = ref<OrgUnitItem[]>([
  { id: 1, name: 'โรงพยาบาลแม่แตง', type: 'Hospital', parentId: null, head: 'ผู้อำนวยการ' },
  { id: 2, name: 'ฝ่ายการแพทย์', type: 'Department', parentId: 1, head: 'รองผู้อำนวยการฝ่ายการแพทย์' },
  { id: 3, name: 'ฝ่ายบริหาร', type: 'Department', parentId: 1, head: 'รองผู้อำนวยการฝ่ายบริหาร' },
  { id: 4, name: 'แผนกอายุรกรรม', type: 'Division', parentId: 2, head: 'หัวหน้าแผนกอายุรกรรม' },
  { id: 5, name: 'แผนกศัลยกรรม', type: 'Division', parentId: 2, head: 'หัวหน้าแผนกศัลยกรรม' },
  { id: 6, name: 'พยาบาลวิชาชีพ', type: 'Position', parentId: 4, head: 'พยาบาลอาวุโส' },
]);

const currentUnit = ref<OrgUnitItem>({
  id: 0,
  name: '',
  type: '', // will be cast to OrgUnitType
  parentId: null,
  head: '',
});
const editingUnit = ref(false);
const unitToDeleteId = ref<number | null>(null);
const showConfirmModal = ref(false);

const getParentName = (parentId: number | null) => {
  if (parentId === null) return null;
  const parent = orgStructureList.value.find(unit => unit.id === parentId);
  return parent ? parent.name : 'Unknown';
};

// Computed property to sort and add level for hierarchical display
const sortedOrgStructureList = computed(() => {
  const listWithLevels: (OrgUnitItem & { level: number })[] = [];
  const map = new Map<number, OrgUnitItem & { level: number }>();

  // Add all units to map with initial level 0
  orgStructureList.value.forEach(unit => {
    map.set(unit.id, { ...unit, level: 0 });
  });

  // Calculate levels for all units
  function calculateLevel(unitId: number, currentLevel: number): number {
    const unit = map.get(unitId);
    if (unit) {
      unit.level = currentLevel;
      return currentLevel;
    }
    return 0; // Should not happen for valid IDs
  }

  // Recursive function to build the hierarchical list
  function buildHierarchy(parentId: number | null, level: number) {
    orgStructureList.value
      .filter(unit => unit.parentId === parentId)
      .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
      .forEach(unit => {
        const unitWithLevel = map.get(unit.id)!;
        unitWithLevel.level = level;
        listWithLevels.push(unitWithLevel);
        buildHierarchy(unit.id, level + 1);
      });
  }

  // Start building from top-level units (parentId = null)
  buildHierarchy(null, 0);

  return listWithLevels;
});


const saveOrgUnit = () => {
  if (editingUnit.value) {
    const index = orgStructureList.value.findIndex(u => u.id === currentUnit.value.id);
    if (index !== -1) {
      orgStructureList.value[index] = { ...currentUnit.value };
    }
    toast.success('แก้ไขข้อมูลโครงสร้างสำเร็จ!');
  } else {
    currentUnit.value.id = orgStructureList.value.length > 0 ? Math.max(...orgStructureList.value.map(u => u.id)) + 1 : 1;
    orgStructureList.value.push({ ...currentUnit.value });
    toast.success('เพิ่มหน่วยงาน/ตำแหน่งใหม่สำเร็จ!');
  }
  resetForm();
};

const editOrgUnit = (unit: OrgUnitItem) => {
  currentUnit.value = { ...unit };
  editingUnit.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const confirmDeleteOrgUnit = (id: number) => {
  // Check if this unit has children before allowing delete
  const hasChildren = orgStructureList.value.some(unit => unit.parentId === id);
  if (hasChildren) {
    toast.error('ไม่สามารถลบได้! หน่วยงานนี้มีหน่วยงานย่อยภายใต้.');
    return;
  }
  unitToDeleteId.value = id;
  showConfirmModal.value = true;
};

const deleteOrgUnit = () => {
  if (unitToDeleteId.value !== null) {
    orgStructureList.value = orgStructureList.value.filter(u => u.id !== unitToDeleteId.value);
    toast.success('ลบหน่วยงาน/ตำแหน่งสำเร็จ!');
  }
  resetDeleteConfirm();
};

const cancelDelete = () => {
  resetDeleteConfirm();
};

const resetForm = () => {
  currentUnit.value = {
    id: 0,
    name: '',
    type: '',
    parentId: null,
    head: '',
  };
  editingUnit.value = false;
};

const resetDeleteConfirm = () => {
  unitToDeleteId.value = null;
  showConfirmModal.value = false;
};

// In a real application, you would fetch initial org structure from an API on mount
// onMounted(() => {
//   fetchOrgStructure();
// });
// const fetchOrgStructure = async () => { /* ... */ };
</script>

<style scoped>
/* Specific styles for this page */
</style>

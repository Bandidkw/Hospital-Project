<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
      <i class="fas fa-hand-holding-medical mr-3 text-cyan-600"></i> จัดการบริการ
    </h2>
    <p class="text-gray-700 mb-6">หน้านี้ใช้สำหรับเพิ่ม, แก้ไข, และลบข้อมูลบริการทางการแพทย์ของโรงพยาบาล.</p>

    <div class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ editingService ? 'แก้ไขบริการ' : 'เพิ่มบริการใหม่' }}</h3>
      <form @submit.prevent="saveService" class="space-y-4">
        <div>
          <label for="serviceName" class="block text-sm font-medium text-gray-700">ชื่อบริการ:</label>
          <input type="text" id="serviceName" v-model="currentService.name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
        </div>
        <div>
          <label for="serviceDescription" class="block text-sm font-medium text-gray-700">คำอธิบายบริการ:</label>
          <textarea id="serviceDescription" v-model="currentService.description" rows="4" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required></textarea>
        </div>
        <div>
          <label for="serviceCategory" class="block text-sm font-medium text-gray-700">หมวดหมู่บริการ:</label>
          <select id="serviceCategory" v-model="currentService.category" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" required>
            <option value="">-- เลือกหมวดหมู่ --</option>
            <option value="คลินิกเฉพาะทาง">คลินิกเฉพาะทาง</option>
            <option value="ตรวจสุขภาพ">ตรวจสุขภาพ</option>
            <option value="ฉุกเฉิน">ฉุกเฉิน</option>
            <option value="ทันตกรรม">ทันตกรรม</option>
            </select>
        </div>
        <div>
          <label for="servicePrice" class="block text-sm font-medium text-gray-700">ราคา (โดยประมาณ):</label>
          <input type="number" id="servicePrice" v-model.number="currentService.price" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
          <p class="text-xs text-gray-500 mt-1">ใส่ 0 หากไม่มีค่าใช้จ่าย หรือไม่ระบุ</p>
        </div>
        <div class="flex justify-end space-x-3">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
            <i class="fas fa-save mr-2"></i> {{ editingService ? 'บันทึกการแก้ไข' : 'เพิ่มบริการ' }}
          </button>
          <button v-if="editingService" type="button" @click="cancelEdit" class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300">
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </form>
    </div>

    <div class="card bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">รายการบริการ</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th class="py-3 px-6 text-left">#</th>
              <th class="py-3 px-6 text-left">ชื่อบริการ</th>
              <th class="py-3 px-6 text-left">หมวดหมู่</th>
              <th class="py-3 px-6 text-right">ราคา (บาท)</th>
              <th class="py-3 px-6 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="text-gray-600 text-sm font-light">
            <tr v-for="(service, index) in servicesList" :key="service.id" class="border-b border-gray-200 hover:bg-gray-50">
              <td class="py-3 px-6 text-left">{{ index + 1 }}</td>
              <td class="py-3 px-6 text-left">{{ service.name }}</td>
              <td class="py-3 px-6 text-left">{{ service.category }}</td>
              <td class="py-3 px-6 text-right">{{ service.price ? service.price.toLocaleString() : '-' }}</td>
              <td class="py-3 px-6 text-center">
                <button @click="editService(service)" class="bg-yellow-500 text-white px-3 py-1 rounded-md text-xs hover:bg-yellow-600 transition duration-300 mr-2">
                  <i class="fas fa-edit"></i> แก้ไข
                </button>
                <button @click="confirmDeleteService(service.id)" class="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition duration-300">
                  <i class="fas fa-trash-alt"></i> ลบ
                </button>
              </td>
            </tr>
            <tr v-if="servicesList.length === 0">
              <td colspan="5" class="py-8 text-center text-gray-500">ยังไม่มีบริการในระบบ.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-xl font-bold text-gray-800 mb-4">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบบริการนี้?</p>
        <div class="flex justify-center space-x-4">
          <button @click="deleteService" class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300">
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

interface ServiceItem {
  id: number;
  name: string;
  description: string;
  category: string;
  price?: number;
}

const servicesList = ref<ServiceItem[]>([
  { id: 1, name: 'ตรวจสุขภาพประจำปี', description: 'แพ็คเกจตรวจสุขภาพสำหรับบุคคลทั่วไป', category: 'ตรวจสุขภาพ', price: 1500 },
  { id: 2, name: 'คลินิกโรคเบาหวาน', description: 'บริการให้คำปรึกษาและรักษาโรคเบาหวาน', category: 'คลินิกเฉพาะทาง', price: 300 },
]);

const currentService = ref<ServiceItem>({
  id: 0,
  name: '',
  description: '',
  category: '',
  price: undefined,
});
const editingService = ref(false);
const serviceToDeleteId = ref<number | null>(null);
const showConfirmModal = ref(false);

const saveService = () => {
  if (editingService.value) {
    const index = servicesList.value.findIndex(s => s.id === currentService.value.id);
    if (index !== -1) {
      servicesList.value[index] = { ...currentService.value };
    }
    toast.success('แก้ไขบริการสำเร็จ!'); // เปลี่ยนจาก alert เป็น toast.success
  } else {
    currentService.value.id = servicesList.value.length > 0 ? Math.max(...servicesList.value.map(s => s.id)) + 1 : 1;
    servicesList.value.push({ ...currentService.value });
    toast.success('เพิ่มบริการใหม่สำเร็จ!'); // เปลี่ยนจาก alert เป็น toast.success
  }
  resetForm();
};

const editService = (service: ServiceItem) => {
  currentService.value = { ...service };
  editingService.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const confirmDeleteService = (id: number) => {
  serviceToDeleteId.value = id;
  showConfirmModal.value = true;
};

const deleteService = () => {
  if (serviceToDeleteId.value !== null) {
    servicesList.value = servicesList.value.filter(s => s.id !== serviceToDeleteId.value);
    toast.success('ลบบริการสำเร็จ!'); // เปลี่ยนจาก alert เป็น toast.success
  }
  resetDeleteConfirm();
};

const cancelDelete = () => {
  resetDeleteConfirm();
};

const resetForm = () => {
  currentService.value = {
    id: 0,
    name: '',
    description: '',
    category: '',
    price: undefined,
  };
  editingService.value = false;
};

const resetDeleteConfirm = () => {
  serviceToDeleteId.value = null;
  showConfirmModal.value = false;
};

// In a real application, you would fetch initial services from an API on mount
// onMounted(() => {
//   fetchServices();
// });
// const fetchServices = async () => { /* ... */ };
</script>

<style scoped>
/* Specific styles for this page */
</style>

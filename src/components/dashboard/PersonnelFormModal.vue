<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 transition-opacity"
    >
      <div class="bg-white p-6 rounded-xl shadow-xl max-w-2xl w-full mx-4" @click.stop>
        <div class="flex justify-between items-center border-b pb-3 mb-4">
          <h3 class="text-2xl font-bold text-gray-800">
            {{ editing ? 'แก้ไขข้อมูลบุคลากร' : 'เพิ่มบุคลากรใหม่' }}
          </h3>
          <button @click="emit('close')" class="text-gray-500 hover:text-gray-800">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label for="personnelName" class="block text-sm font-medium text-gray-700"
              >ชื่อ-นามสกุล:</label
            >
            <input
              type="text"
              id="personnelName"
              v-model="formData.name"
              class="input-field"
              required
            />
          </div>
          <div>
            <label for="position" class="block text-sm font-medium text-gray-700"
              >ตำแหน่งราชการ:</label
            >
            <input
              type="text"
              id="position"
              v-model="formData.position"
              class="input-field"
              required
            />
          </div>
          <div>
            <label for="specialty" class="block text-sm font-medium text-gray-700"
              >ความเชี่ยวชาญ/หัวหน้ากลุ่มงาน:</label
            >
            <input type="text" id="specialty" v-model="formData.specialty" class="input-field" />
          </div>
          <div>
            <label for="tel" class="block text-sm font-medium text-gray-700">เบอร์โทรภายใน:</label>
            <input type="text" id="tel" v-model="formData.tel" class="input-field" />
          </div>
          <div class="flex items-center space-x-4">
            <input
              type="checkbox"
              id="isDirector"
              v-model="formData.isDirector"
              class="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label for="isDirector" class="text-sm font-medium text-gray-700"
              >เป็นผู้บริหาร/ผู้อำนวยการ</label
            >
          </div>

          <div>
            <label for="personnelImage" class="block text-sm font-medium text-gray-700"
              >รูปภาพบุคลากร:</label
            >
            <input
              type="file"
              id="personnelImage"
              @change="handleImageUpload"
              accept="image/*"
              class="mt-1 block w-full text-gray-700"
              :required="!editing && !formData.imageUrl"
            />

            <p v-if="formData.imageUrl" class="text-sm text-gray-500 mt-2">
              รูปภาพปัจจุบัน:
              <a
                :href="absoluteImage(formData.imageUrl)"
                target="_blank"
                class="text-blue-500 hover:underline"
                >ดูรูป</a
              >
              <img
                :src="absoluteImage(formData.imageUrl)"
                alt="รูปภาพตัวอย่าง"
                class="w-16 h-16 object-cover rounded-full mt-2"
              />
            </p>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="emit('close')" class="btn-secondary">
              <i class="fas fa-times mr-2"></i> ยกเลิก
            </button>
            <button type="submit" class="btn-primary" :disabled="isSaving">
              <i
                class="fas fa-save mr-2"
                :class="{ 'fa-spin': isSaving, 'fa-save': !isSaving }"
              ></i>
              {{ editing ? 'บันทึกการแก้ไข' : 'เพิ่มบุคลากร' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PersonnelItem } from '@/types/personnel'

// 🎯 Type สำหรับ Form (รวม imageFile)
type PersonnelFormType = PersonnelItem & { imageFile: File | null }

// ------------------------------------------------------------------
// PROPS & EMITS
// ------------------------------------------------------------------

interface Props {
  isOpen: boolean // สถานะเปิด/ปิด Modal
  personnelData: PersonnelFormType // ข้อมูลที่ผูกกับ Form
  editing: boolean // สถานะการแก้ไข (True/False)
  isSaving: boolean // สถานะกำลังบันทึก (ป้องกันการกดซ้ำ)
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'save']) // close: ปิด Modal, save: ส่งข้อมูลไปบันทึก

// ------------------------------------------------------------------
// LOCAL STATE & LOGIC
// ------------------------------------------------------------------

// 💡 สร้าง Local ref เพื่อผูกกับ v-model (ดีกว่าการผูก prop โดยตรง)
const formData = ref<PersonnelFormType>({ ...props.personnelData })

// Watcher: อัปเดต formData เมื่อ props.personnelData เปลี่ยน (เช่น เมื่อกดปุ่มแก้ไข)
watch(
  () => props.personnelData,
  (newValue) => {
    formData.value = { ...newValue }
  },
  { deep: true },
)

// ฟังก์ชันแปลง URL รูปภาพ (ย้ายมาจาก DashboardPersonnelView.vue)
function absoluteImage(u?: string | null): string {
  if (!u) return 'https://placehold.co/100x100/e0e0e0/333333?text=N/A'
  if (/^https?:\/\//i.test(u)) return u
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
  const root = base.replace(/\/api(\/v\d+)?$/i, '')
  return `${root}/${String(u).replace(/^\/+/, '')}`
}

// Logic การอัปโหลดรูปภาพ (ย้ายมาจาก DashboardPersonnelView.vue)
const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    formData.value.imageFile = file
    const reader = new FileReader()
    reader.onload = (e) => {
      // แสดงตัวอย่างรูปภาพ
      formData.value.imageUrl = e.target?.result as string
    }
    reader.readAsDataURL(file)
  } else {
    formData.value.imageFile = null
    // เก็บ imageUrl เดิมไว้ถ้าเป็นการแก้ไข และไม่มีไฟล์ใหม่
    if (!props.editing) {
      formData.value.imageUrl = null
    }
  }
}

// การส่ง Form
const submitForm = () => {
  emit('save', formData.value)
}
</script>

<style scoped>
.input-field {
  /* mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 */
  margin-top: 0.25rem;
  display: block;
  width: 100%;
  border-width: 1px;
  border-style: solid;
  border-color: #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 0.5rem;
}
.input-field:focus {
  outline: none;
  /* focus:ring-purple-500 focus:border-purple-500 */
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
  border-color: #7c3aed;
}

.btn-primary {
  /* bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition duration-300 */
  background-color: #7c3aed;
  color: #ffffff;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s;
}
.btn-primary:hover {
  background-color: #6d28d9;
}

.btn-secondary {
  /* bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-300 */
  background-color: #9ca3af;
  color: #ffffff;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s;
}
.btn-secondary:hover {
  background-color: #6b7280;
}

/* ------------------------------------------- */
/* ⚡ Animation Styles */
/* ------------------------------------------- */

/* 1. Animation สำหรับ Overlay (Fade In/Out) */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* 2. Animation สำหรับ Modal Content (Slide In/Out) */
.modal-slide-enter-active {
  transition: all 0.3s ease-out;
}

.modal-slide-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.modal-slide-enter-from,
.modal-slide-leave-to {
  /* เริ่มต้นจากด้านบนเล็กน้อยและโปร่งใส */
  transform: translateY(-50px);
  opacity: 0;
}
</style>

<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="emit('close')"
    >
      <Transition name="modal-slide">
        <div
          v-if="isOpen"
          class="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <!-- Header Section -->
          <div class="bg-white border-b-2 border-gray-200 p-6 rounded-t-lg">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-2xl font-bold text-gray-800 flex items-center">
                  <i class="fas fa-user-circle text-blue-600 mr-3"></i>
                  {{ editing ? 'แก้ไขข้อมูลบุคลากร' : 'เพิ่มบุคลากรใหม่' }}
                </h3>
                <p class="text-gray-500 text-sm mt-2">
                  กรุณากรอกข้อมูลให้ครบถ้วน ช่องที่มีเครื่องหมาย
                  <span class="text-red-600">*</span> จำเป็นต้องระบุ
                </p>
              </div>
              <button
                @click="emit('close')"
                class="text-gray-400 hover:text-gray-600 transition-colors"
                title="ปิด"
              >
                <i class="fas fa-times text-2xl"></i>
              </button>
            </div>
          </div>

          <!-- Form Content -->
          <form @submit.prevent="submitForm" class="p-6">
            <div class="space-y-6">
              <!-- ข้อมูลพื้นฐาน -->
              <div class="space-y-4">
                <h4 class="text-base font-semibold text-gray-700 border-l-4 border-blue-600 pl-3">
                  ข้อมูลพื้นฐาน
                </h4>

                <!-- ชื่อ-นามสกุล -->
                <div>
                  <label for="personnelName" class="block text-sm font-medium text-gray-700 mb-1.5">
                    ชื่อ-นามสกุล <span class="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="personnelName"
                    v-model="formData.name"
                    class="form-input"
                    placeholder="ระบุชื่อและนามสกุล"
                    required
                  />
                </div>

                <!-- ตำแหน่งราชการ -->
                <div>
                  <label for="position" class="block text-sm font-medium text-gray-700 mb-1.5">
                    ตำแหน่งราชการ <span class="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="position"
                    v-model="formData.position"
                    class="form-input"
                    placeholder="ระบุตำแหน่งราชการ"
                    required
                  />
                </div>
              </div>

              <!-- ข้อมูลเพิ่มเติม -->
              <div class="space-y-4 pt-4 border-t border-gray-200">
                <h4 class="text-base font-semibold text-gray-700 border-l-4 border-blue-600 pl-3">
                  ข้อมูลเพิ่มเติม
                </h4>

                <!-- ความเชี่ยวชาญ -->
                <div>
                  <label for="specialty" class="block text-sm font-medium text-gray-700 mb-1.5">
                    ความเชี่ยวชาญ/หัวหน้ากลุ่มงาน
                  </label>
                  <input
                    type="text"
                    id="specialty"
                    v-model="formData.specialty"
                    class="form-input"
                    placeholder="ระบุความเชี่ยวชาญหรือกลุ่มงาน (ถ้ามี)"
                  />
                </div>

                <!-- เบอร์โทรภายใน -->
                <div>
                  <label for="tel" class="block text-sm font-medium text-gray-700 mb-1.5">
                    เบอร์โทรภายใน
                  </label>
                  <input
                    type="text"
                    id="tel"
                    v-model="formData.tel"
                    class="form-input"
                    placeholder="ระบุเบอร์โทรภายใน (ถ้ามี)"
                  />
                </div>

                <!-- สถานะผู้บริหาร -->
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label class="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      id="isDirector"
                      v-model="formData.isDirector"
                      class="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div class="ml-3">
                      <span class="text-sm font-medium text-gray-700"
                        >เป็นผู้บริหาร/ผู้อำนวยการ</span
                      >
                      <p class="text-xs text-gray-500 mt-0.5">
                        เลือกหากบุคคลนี้ดำรงตำแหน่งผู้บริหารของโรงพยาบาล
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- รูปภาพ -->
              <div class="space-y-4 pt-4 border-t border-gray-200">
                <h4 class="text-base font-semibold text-gray-700 border-l-4 border-blue-600 pl-3">
                  รูปภาพบุคลากร
                </h4>

                <div>
                  <label
                    for="personnelImage"
                    class="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    อัปโหลดรูปภาพ
                    <span v-if="!editing && !formData.imageUrl" class="text-red-600">*</span>
                  </label>
                  <input
                    type="file"
                    id="personnelImage"
                    @change="handleImageUpload"
                    accept="image/*"
                    class="file-input"
                    :required="!editing && !formData.imageUrl"
                  />
                  <p class="text-xs text-gray-500 mt-1.5">
                    รองรับไฟล์: JPG, PNG, GIF (ขนาดแนะนำ 400x400 พิกเซล)
                  </p>
                </div>

                <!-- Image Preview -->
                <div
                  v-if="formData.imageUrl"
                  class="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <p class="text-sm font-medium text-gray-700 mb-3">ตัวอย่างรูปภาพ</p>
                  <div class="flex items-center space-x-4">
                    <img
                      :src="absoluteImage(formData.imageUrl)"
                      alt="รูปภาพบุคลากร"
                      class="w-20 h-20 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
                    />
                    <a
                      :href="absoluteImage(formData.imageUrl)"
                      target="_blank"
                      class="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                    >
                      <i class="fas fa-external-link-alt mr-1"></i>
                      ดูรูปภาพขนาดเต็ม
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
              <button type="button" @click="emit('close')" class="btn-cancel">
                <i class="fas fa-times mr-2"></i>
                ยกเลิก
              </button>
              <button type="submit" class="btn-submit" :disabled="isSaving">
                <i class="mr-2" :class="isSaving ? 'fas fa-spinner fa-spin' : 'fas fa-check'"></i>
                {{ editing ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูล' }}
              </button>
            </div>
          </form>
        </div>
      </Transition>
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
/* Form Input - เรียบง่าย เป็นทางการ */
.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.5;
  transition: all 0.15s ease;
  background-color: #ffffff;
}

.form-input:hover {
  border-color: #9ca3af;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

/* File Input - เรียบง่าย */
.file-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
  background-color: #ffffff;
}

.file-input:hover {
  border-color: #2563eb;
  background-color: #f9fafb;
}

.file-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Cancel Button - สีเทาเรียบง่าย */
.btn-cancel {
  background-color: #f3f4f6;
  color: #374151;
  padding: 0.625rem 1.25rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.15s ease;
  border: 1px solid #e5e7eb;
}

.btn-cancel:hover {
  background-color: #e5e7eb;
  border-color: #d1d5db;
}

.btn-cancel:active {
  background-color: #d1d5db;
}

/* Submit Button - สีน้ำเงินเป็นทางการ */
.btn-submit {
  background-color: #2563eb;
  color: #ffffff;
  padding: 0.625rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.15s ease;
  border: 1px solid #2563eb;
}

.btn-submit:hover:not(:disabled) {
  background-color: #1d4ed8;
  border-color: #1d4ed8;
}

.btn-submit:active:not(:disabled) {
  background-color: #1e40af;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ------------------------------------------- */
/* Modal Animations - เรียบง่าย */
/* ------------------------------------------- */

/* Fade Animation for Overlay */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Slide Animation for Modal Content */
.modal-slide-enter-active {
  transition: all 0.25s ease-out;
}

.modal-slide-leave-active {
  transition: all 0.2s ease-in;
}

.modal-slide-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.modal-slide-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

/* Scrollbar Styling - เรียบง่าย */
.max-h-\[90vh\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[90vh\]::-webkit-scrollbar-track {
  background: #f3f4f6;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.max-h-\[90vh\]::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>

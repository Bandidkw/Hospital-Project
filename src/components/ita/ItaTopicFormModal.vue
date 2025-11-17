<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50"
      @click.self="emit('close')"
    >
      <Transition name="modal-slide">
        <div
          v-if="isOpen"
          class="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4"
          @click.stop
        >
          <div class="flex justify-between items-center border-b pb-3 mb-6">
            <h2 class="text-2xl font-bold text-gray-800">
              {{ isEditing ? 'แก้ไขหัวข้อ' : `สร้างหัวข้อใหม่สำหรับปี ${year}` }}
            </h2>
            <button @click="emit('close')" class="text-gray-500 hover:text-gray-800">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <form @submit.prevent="submitForm" class="space-y-6">
            <div v-if="!isEditing">
              <label for="moit-template" class="block text-gray-700 font-bold mb-2"
                >เลือกแม่แบบหัวข้อ (MOIT):</label
              >
              <select
                id="moit-template"
                :value="localFormData.templateValue"
                @change="handleTemplateChange"
                class="shadow border rounded-lg w-full py-3 px-4 text-gray-700 transition duration-150 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option disabled value="">-- กรุณาเลือกหัวข้อ --</option>
                <option
                  v-for="template in moitTemplates"
                  :key="template.value"
                  :value="template.value"
                >
                  {{ template.value }}: {{ template.text.substring(0, 100) }}...
                </option>
              </select>
            </div>

            <div class="space-y-4">
              <div>
                <label for="moit_name" class="block text-gray-700 font-bold mb-2">MOIT:</label>
                <input
                  id="moit_name"
                  type="text"
                  v-model="localFormData.moit_name"
                  :readonly="!!(!isEditing && localFormData.moit_name)"
                  class="shadow border rounded-lg w-full py-3 px-4 text-gray-700 transition duration-150"
                  :class="{ 'bg-gray-100': !isEditing && localFormData.moit_name }"
                  required
                />
              </div>
              <div>
                <label for="title" class="block text-gray-700 font-bold mb-2">ชื่อหัวข้อ:</label>
                <input
                  id="title"
                  type="text"
                  v-model="localFormData.title"
                  class="shadow border rounded-lg w-full py-3 px-4 text-gray-700 transition duration-150"
                  required
                />
              </div>
              <div>
                <label for="description" class="block text-gray-700 font-bold mb-2"
                  >คำอธิบาย:</label
                >
                <textarea
                  id="description"
                  v-model="localFormData.description"
                  rows="3"
                  class="shadow border rounded-lg w-full py-3 px-4 text-gray-700 transition duration-150"
                ></textarea>
              </div>
            </div>

            <div class="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                @click="emit('close')"
                class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-full transition duration-150"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-150"
              >
                บันทึก
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

// 💡 Interface สำหรับ Prop: formData
interface TopicFormData {
  id: string
  templateValue: string
  moit_name: string
  title: string
  description: string
}

// --------------------------------------------------
// PROPS & EMITS
// --------------------------------------------------
interface Props {
  isOpen: boolean
  isEditing: boolean
  year: number
  formData: TopicFormData
  moitTemplates: Array<{ value: string; text: string }>
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'save'])

// --------------------------------------------------
// LOCAL STATE
// --------------------------------------------------
// ใช้ Local Ref เพื่อแก้ไขข้อมูลใน Modal โดยไม่กระทบ Parent โดยตรง
const localFormData = ref<TopicFormData>({ ...props.formData })

// Watcher เพื่ออัปเดต localFormData เมื่อ props.formData เปลี่ยนจาก Parent (เช่น เมื่อกด Edit)
watch(
  () => props.formData,
  (newVal) => {
    localFormData.value = { ...newVal }
  },
  { deep: true },
)

// --------------------------------------------------
// LOGIC
// --------------------------------------------------

// Logic การเลือก Template (ในโหมดสร้าง)
const updateTemplate = (value: string) => {
  localFormData.value.templateValue = value
  const selectedTemplate = props.moitTemplates.find((t) => t.value === value)
  // ... (Logic การ set localFormData ต่อไป) ...
  if (selectedTemplate) {
    localFormData.value.moit_name = selectedTemplate.value
    localFormData.value.title = selectedTemplate.text
    localFormData.value.description = `รายละเอียดของ ${selectedTemplate.value}`
  } else {
    localFormData.value.moit_name = ''
    localFormData.value.title = ''
    localFormData.value.description = ''
  }
}

// 💡 [ฟังก์ชันใหม่] เพื่อจัดการ Event และ Type
const handleTemplateChange = (event: Event) => {
  // 1. ตรวจสอบว่า target มีค่าและเป็น HTMLSelectElement หรือไม่
  const target = event.target as HTMLSelectElement | null

  if (target && target.value !== undefined) {
    updateTemplate(target.value)
  }
}

// Logic การส่ง Form
const submitForm = () => {
  // ส่ง localFormData กลับไปให้ Parent
  emit('save', localFormData.value)
}
</script>

<style scoped>
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
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Springy effect */
}

.modal-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.6, -0.28, 0.735, 0.045);
}

.modal-slide-enter-from,
.modal-slide-leave-to {
  transform: translateY(-50px);
  opacity: 0;
}
</style>

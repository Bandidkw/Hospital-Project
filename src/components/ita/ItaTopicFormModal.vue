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
            <!-- Custom MOIT Dropdown -->
            <div v-if="!isEditing" class="relative">
              <label for="moit-template" class="block text-gray-700 font-bold mb-2">
                เลือกแม่แบบหัวข้อ (MOIT):
              </label>

              <!-- Custom Trigger -->
              <div
                id="moit-template"
                class="premium-input flex items-center justify-between cursor-pointer bg-white relative z-0"
                :class="{
                  'border-blue-500 ring-4 ring-blue-500/10': isMoitDropdownOpen,
                }"
                @click="isMoitDropdownOpen = !isMoitDropdownOpen"
                tabindex="0"
                @blur="onBlurMoit"
              >
                <span class="text-slate-700 font-medium truncate pr-2">
                  {{
                    localFormData.templateValue
                      ? `${localFormData.templateValue}: ${getSelectedMoitText()}`
                      : 'กรุณาเลือกหัวข้อ...'
                  }}
                </span>
                <span
                  class="transition-transform duration-300 text-slate-400 flex-shrink-0"
                  :class="{ 'rotate-180 text-blue-500': isMoitDropdownOpen }"
                >
                  <i class="fas fa-chevron-down text-xs"></i>
                </span>
              </div>

              <!-- Custom Menu -->
              <transition name="dropdown-scale">
                <div
                  v-if="isMoitDropdownOpen"
                  class="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden origin-top max-h-96 overflow-y-auto custom-scrollbar"
                >
                  <!-- Search Box -->
                  <div class="sticky top-0 bg-white border-b border-slate-100 p-3 z-10">
                    <div class="relative">
                      <input
                        v-model="moitSearchQuery"
                        type="text"
                        placeholder="ค้นหา MOIT..."
                        class="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        @click.stop
                      />
                      <i
                        class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
                      ></i>
                    </div>
                  </div>

                  <!-- MOIT List -->
                  <ul class="py-1.5">
                    <li
                      v-for="template in filteredMoitTemplates"
                      :key="template.value"
                      @click.stop="selectMoit(template.value)"
                      class="px-4 py-3 hover:bg-blue-50 cursor-pointer group/item transition-colors border-b border-slate-50 last:border-0"
                      :class="{ 'bg-blue-50/50': localFormData.templateValue === template.value }"
                    >
                      <div class="flex items-start gap-3">
                        <span
                          class="w-2 h-2 rounded-full bg-slate-200 transition-colors group-hover/item:bg-blue-400 mt-1.5 flex-shrink-0"
                          :class="{
                            '!bg-blue-600': localFormData.templateValue === template.value,
                          }"
                        ></span>
                        <div class="flex-1 min-w-0">
                          <div
                            class="font-semibold text-sm mb-1"
                            :class="{
                              'text-blue-700': localFormData.templateValue === template.value,
                              'text-slate-700 group-hover/item:text-blue-700':
                                localFormData.templateValue !== template.value,
                            }"
                          >
                            {{ template.value }}
                          </div>
                          <div class="text-xs text-slate-500 line-clamp-2">
                            {{ template.text }}
                          </div>
                        </div>
                        <i
                          v-if="localFormData.templateValue === template.value"
                          class="fas fa-check text-blue-600 text-sm mt-1 flex-shrink-0"
                        ></i>
                      </div>
                    </li>
                    <li
                      v-if="filteredMoitTemplates.length === 0"
                      class="px-4 py-8 text-center text-slate-500 text-sm"
                    >
                      <i class="fas fa-search text-2xl mb-2 text-slate-300"></i>
                      <p>ไม่พบหัวข้อที่ค้นหา</p>
                    </li>
                  </ul>
                </div>
              </transition>
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
import { ref, watch, computed } from 'vue'

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

// Custom Dropdown State
const isMoitDropdownOpen = ref(false)
const moitSearchQuery = ref('')

// Watcher เพื่ออัปเดต localFormData เมื่อ props.formData เปลี่ยนจาก Parent (เช่น เมื่อกด Edit)
watch(
  () => props.formData,
  (newVal) => {
    localFormData.value = { ...newVal }
  },
  { deep: true },
)

// Reset search when dropdown closes
watch(isMoitDropdownOpen, (isOpen) => {
  if (!isOpen) {
    moitSearchQuery.value = ''
  }
})

// --------------------------------------------------
// COMPUTED
// --------------------------------------------------
const filteredMoitTemplates = computed(() => {
  if (!moitSearchQuery.value.trim()) {
    return props.moitTemplates
  }

  const query = moitSearchQuery.value.toLowerCase()
  return props.moitTemplates.filter(
    (template) =>
      template.value.toLowerCase().includes(query) || template.text.toLowerCase().includes(query),
  )
})

// --------------------------------------------------
// METHODS
// --------------------------------------------------
function getSelectedMoitText(): string {
  const selected = props.moitTemplates.find((t) => t.value === localFormData.value.templateValue)
  if (!selected) return ''

  // แสดงข้อความแบบย่อ (50 ตัวอักษร)
  const shortText =
    selected.text.length > 50 ? selected.text.substring(0, 50) + '...' : selected.text
  return shortText
}

function selectMoit(value: string) {
  updateTemplate(value)
  isMoitDropdownOpen.value = false
}

function onBlurMoit(event: FocusEvent) {
  // ปิด dropdown เมื่อ blur แต่ต้องตรวจสอบว่าไม่ได้คลิกภายใน dropdown
  const relatedTarget = event.relatedTarget as HTMLElement
  if (!relatedTarget || !relatedTarget.closest('.absolute')) {
    setTimeout(() => {
      isMoitDropdownOpen.value = false
    }, 200)
  }
}

// Logic การเลือก Template (ในโหมดสร้าง)
const updateTemplate = (value: string) => {
  localFormData.value.templateValue = value
  const selectedTemplate = props.moitTemplates.find((t) => t.value === value)

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

// 💡 [ฟังก์ชันใหม่] เพื่อจัดการ Event และ Type (เก็บไว้สำหรับ backward compatibility)
const handleTemplateChange = (event: Event) => {
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

/* ------------------------------------------- */
/* 🎨 Custom Dropdown Styles */
/* ------------------------------------------- */

/* Premium Input Style */
.premium-input {
  @apply shadow-sm border-2 border-slate-200 rounded-xl px-4 py-3
         transition-all duration-200 ease-in-out
         hover:border-slate-300 hover:shadow-md;
}

.premium-input:focus {
  @apply outline-none;
}

.premium-input.input-error {
  @apply border-red-400 ring-4 ring-red-400/10;
}

/* Dropdown Scale Animation */
.dropdown-scale-enter-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dropdown-scale-leave-active {
  transition: all 0.15s cubic-bezier(0.4, 0, 1, 1);
}

.dropdown-scale-enter-from {
  opacity: 0;
  transform: scaleY(0.8) translateY(-10px);
}

.dropdown-scale-leave-to {
  opacity: 0;
  transform: scaleY(0.95) translateY(-5px);
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
  transition: background 0.2s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Line Clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-700 bg-opacity-50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="id + '-title'"
  >
    <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
      <h3 :id="id + '-title'" class="text-xl font-bold text-gray-800 mb-3">{{ title }}</h3>
      <p class="text-gray-700 mb-6">{{ message }}</p>
      <div class="flex justify-center gap-3">
        <button
          @click="$emit('confirm')"
          class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
        >
          <i v-if="confirmIcon" :class="[confirmIcon, 'mr-2']"></i> {{ confirmText }}
        </button>
        <button
          @click="$emit('cancel')"
          class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition"
        >
          <i v-if="cancelIcon" :class="[cancelIcon, 'mr-2']"></i> {{ cancelText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  id?: string
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  confirmIcon?: string
  cancelIcon?: string
}

withDefaults(defineProps<Props>(), {
  id: 'confirm-modal',
  title: 'ยืนยันการดำเนินการ',
  message: 'คุณแน่ใจหรือไม่?',
  confirmText: 'ยืนยัน',
  cancelText: 'ยกเลิก',
  confirmIcon: 'fas fa-check',
  cancelIcon: 'fas fa-times',
})

defineEmits(['confirm', 'cancel'])
</script>

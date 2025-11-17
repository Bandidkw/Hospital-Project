<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50"
      @click.self="emit('close')"
    >
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4" @click.stop>
        <h3 class="text-2xl font-bold text-red-700 mb-4 flex items-center">
          <i class="fas fa-exclamation-triangle mr-3"></i>ยืนยันการลบ
        </h3>
        <p class="text-gray-700 mb-6 text-lg">
          คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้:
          <br />
          <strong class="text-black block mt-1">"{{ itemTitle }}"</strong>?
          <br />
          <span class="text-sm text-red-600">การกระทำนี้ไม่สามารถกู้คืนได้</span>
        </p>
        <div class="flex justify-end space-x-4">
          <button
            @click="emit('close')"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-full transition duration-150"
          >
            ยกเลิก
          </button>
          <button
            @click="emit('confirm')"
            class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-full transition duration-150"
          >
            ยืนยันการลบ
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
// 💡 [Interface ต้องคงไว้]
interface Props {
  isOpen: boolean
  itemTitle: string // ชื่อรายการที่ต้องการลบ
}

// 🛑 [ลบ 'const props =' ออก]
defineProps<Props>()

const emit = defineEmits(['close', 'confirm'])
</script>

<style scoped>
/* ------------------------------------------- */
/* ⚡ Animation Styles (สำหรับ Overlay เท่านั้น) */
/* ------------------------------------------- */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>

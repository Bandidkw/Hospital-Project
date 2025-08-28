<template>
  <div class="bg-white p-6 rounded-lg shadow-xl mt-12">
    <h2 class="text-2xl font-semibold text-blue-700 mb-6">รายการเอกสารทั้งหมดในหัวข้อนี้</h2>

    <div class="flex items-center space-x-4 mb-4">
      <div class="flex-grow">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="พิมพ์ชื่อเอกสารเพื่อค้นหา..."
          class="w-full px-4 py-2 border rounded-lg"
        />
      </div>
    </div>

    <div class="overflow-x-auto rounded-lg border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-blue-100">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              ชื่อเอกสาร
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              หัวข้อย่อย
            </th>
            <th
              class="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              ไตรมาส
            </th>
            <th
              class="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              การจัดการ
            </th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="filteredDocuments.length === 0">
            <td colspan="4" class="px-6 py-10 text-center text-gray-500">
              ไม่พบเอกสารที่ตรงกับเงื่อนไข
            </td>
          </tr>

          <tr v-for="doc in filteredDocuments" :key="doc.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <template v-if="doc.fileUrl">
                <a
                  :href="doc.fileUrl"
                  target="_blank"
                  class="font-medium text-blue-600 hover:underline"
                >
                  {{ doc.title }}
                </a>
              </template>
              <template v-else>
                <span class="font-medium text-gray-800">{{ doc.title }}</span>
              </template>
              <p v-if="doc.description" class="text-sm text-gray-500 mt-1">{{ doc.description }}</p>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-gray-700">
              {{ doc.sub_topic }}
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-center text-gray-700">
              {{ doc.quarter ?? '-' }}
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
              <button
                @click="emitEdit(doc)"
                class="text-indigo-600 hover:text-indigo-900 p-2"
                title="แก้ไข"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                @click="emitDelete(doc)"
                class="text-red-600 hover:text-red-900 p-2 ml-2"
                title="ลบ"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ItaDocument } from '@/types/ita'

// ✅ รับได้ทั้ง array/null/undefined และตั้งค่าเริ่มต้นเป็น [] ด้วย withDefaults
const props = withDefaults(
  defineProps<{
    documents?: ItaDocument[] | null
  }>(),
  {
    documents: () => [],
  },
)

// ✅ type-safe emits
const emit = defineEmits<{
  (e: 'edit', doc: ItaDocument): void
  (e: 'delete', doc: ItaDocument): void
}>()

const searchQuery = ref('')

// คืนเป็น array เสมอ (กัน null/undefined)
const filteredDocuments = computed<ItaDocument[]>(() => {
  const list = props.documents ?? []
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return list
  return list.filter((doc) => doc.title.toLowerCase().includes(q))
})

const emitEdit = (doc: ItaDocument) => emit('edit', doc)
const emitDelete = (doc: ItaDocument) => emit('delete', doc)
</script>

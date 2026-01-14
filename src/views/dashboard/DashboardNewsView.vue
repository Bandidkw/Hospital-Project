<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <header class="mb-6 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <i class="fas fa-newspaper mr-3 text-blue-500"></i>
          จัดการข่าวสาร (News Management)
        </h2>
        <p class="text-gray-600">เพิ่ม / แก้ไข / สลับสถานะเผยแพร่ข่าวสาร</p>
      </div>
      <button
        type="button"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center shadow-md disabled:opacity-50"
        @click="openCreateModal"
        :disabled="loading"
      >
        <i class="fas fa-plus mr-2"></i> เพิ่มข่าวสารใหม่
      </button>
    </header>

    <div
      v-if="errorMsg"
      class="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700 flex items-center justify-between"
    >
      <div class="flex items-center gap-2">
        <i class="fas fa-exclamation-triangle"></i>
        <span>{{ errorMsg }}</span>
      </div>
      <button
        @click="fetchNews"
        class="px-3 py-1 rounded-md border border-red-300 hover:bg-white text-sm"
      >
        ลองใหม่
      </button>
    </div>

    <!-- News Table Component -->
    <NewsTable
      :newsList="newsList"
      @edit="openEditModal"
      @delete="confirmDeleteNews"
      @toggle-publish="togglePublishStatus"
    />

    <!-- Create News Modal - ปรับให้เป็นทางการ -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="createNewsTitle"
      @keydown.esc="closeCreateModal"
      @click="closeCreateModal"
    >
      <div
        class="bg-white w-full max-w-5xl rounded-lg overflow-hidden shadow-xl border border-gray-200"
        @click.stop
      >
        <header class="sticky top-0 z-10 bg-white border-b-2 border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h3
                id="createNewsTitle"
                class="text-xl font-semibold text-gray-800 flex items-center"
              >
                <i class="fas fa-newspaper text-blue-600 mr-3"></i>
                เพิ่มข่าวสารใหม่
              </h3>
              <p class="text-sm text-gray-500 mt-1">กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง</p>
            </div>
            <button
              class="text-gray-400 hover:text-gray-600 transition-colors p-2"
              @click="closeCreateModal"
              aria-label="ปิดหน้าต่างสร้างข่าวสาร"
            >
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
        </header>
        <div class="max-h-[75vh] overflow-y-auto px-6 py-6 bg-gray-50">
          <NewsCreateForm @newsSaved="handleNewsSaved" />
        </div>
      </div>
    </div>

    <!-- Edit News Modal Component -->
    <NewsEditModal
      :show="showEditModal"
      :newsItem="editTarget"
      :saving="savingEdit"
      @close="closeEditModal"
      @save="handleUpdateNews"
    />

    <!-- Delete Confirmation Modal Component -->
    <ConfirmModal
      :show="showConfirmModal"
      title="ยืนยันการลบ"
      message="คุณแน่ใจหรือไม่ว่าต้องการลบข่าวสารนี้?"
      confirmText="ลบ"
      @confirm="deleteNews"
      @cancel="cancelDelete"
    />

    <!-- Loading Overlay -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-white/40 backdrop-blur-[1px] z-40 flex items-center justify-center"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        class="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-500"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { isAxiosError } from 'axios'

// Services
import {
  getAllNews,
  updateNews,
  togglePublish,
  deleteNews as apiDeleteNews,
  type NewsItem,
} from '@/services/newsService'
import { attachCategory } from '@/features/news/categories'

// Components
import NewsCreateForm from '@/components/news/NewsCreateForm.vue'
import NewsTable from '@/components/news/NewsTable.vue'
import NewsEditModal from '@/components/news/NewsEditModal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

/* =========================================================================
 * State
 * ========================================================================= */
const toast = useToast()
const newsList = ref<NewsItem[]>([])
const loading = ref(false)
const errorMsg = ref<string | null>(null)

// Modal States
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showConfirmModal = ref(false)

const savingEdit = ref(false)
const editTarget = ref<NewsItem | null>(null)
const newsToDeleteId = ref<string | null>(null)

/* =========================================================================
 * Utils
 * ========================================================================= */
function makeExcerpt(title: string, content: string, max = 200): string {
  const t = title.trim()
  const c = content.trim()
  const base = (t ? `${t} — ` : '') + c
  if (base.length <= max) return base
  const cut = base.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…'
}

function getSortTime(n: { updatedAt?: string; createdAt?: string; date?: string }) {
  return new Date(n.updatedAt || n.createdAt || n.date || 0).getTime()
}

function sortByUpdatedDesc(arr: NewsItem[]) {
  return [...arr].sort((a, b) => getSortTime(b) - getSortTime(a))
}

/* =========================================================================
 * Methods
 * ========================================================================= */
async function fetchNews() {
  loading.value = true
  errorMsg.value = null
  try {
    const items = await getAllNews()
    newsList.value = sortByUpdatedDesc(attachCategory(items))
  } catch (e) {
    if (isAxiosError(e)) {
      errorMsg.value = e.response?.data?.message || e.message
    } else {
      errorMsg.value = 'ไม่สามารถดึงรายการข่าวได้'
    }
  } finally {
    loading.value = false
  }
}

// Create Handlers
function openCreateModal() {
  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
}

function handleNewsSaved() {
  fetchNews()
  closeCreateModal()
}

// Edit Handlers
function openEditModal(news: NewsItem) {
  editTarget.value = news
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editTarget.value = null
}

async function handleUpdateNews({ form, imageFile, pdfFile }: any) {
  if (savingEdit.value) return
  if (!form.title.trim() || !form.content.trim() || !form.date || !form.category) {
    toast.error('กรุณากรอกข้อมูลให้ครบทุกช่องที่มีเครื่องหมาย *')
    return
  }

  savingEdit.value = true
  try {
    const base = {
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category,
      excerpt: (form.excerpt?.trim() || makeExcerpt(form.title, form.content)).slice(0, 200),
      date: form.date,
    }

    let updated = await updateNews(form.id, {
      ...base,
      image: imageFile,
      pdf: pdfFile,
    })

    // Handle Publish status toggle if changed during edit
    if (updated.isPublished !== form.isPublished) {
      try {
        const toggled = await togglePublish(form.id, form.isPublished)
        updated = { ...updated, ...toggled }
      } catch {
        toast.error('บันทึกแล้ว แต่เปลี่ยนสถานะเผยแพร่ไม่สำเร็จ')
      }
    }

    // Update local list
    const idx = newsList.value.findIndex((n) => String(n.id) === String(form.id))
    if (idx !== -1) {
      newsList.value[idx] = { ...newsList.value[idx], ...attachCategory([updated])[0] }
    }

    toast.success('บันทึกการแก้ไขเรียบร้อย')
    newsList.value = sortByUpdatedDesc(newsList.value)
    closeEditModal()
  } catch (err) {
    if (isAxiosError(err)) {
      toast.error(err.response?.data?.message ?? 'บันทึกการแก้ไขไม่สำเร็จ')
    } else {
      toast.error('บันทึกการแก้ไขไม่สำเร็จ')
    }
  } finally {
    savingEdit.value = false
  }
}

// Delete Handlers
function confirmDeleteNews(id: string) {
  newsToDeleteId.value = id
  showConfirmModal.value = true
}

function cancelDelete() {
  newsToDeleteId.value = null
  showConfirmModal.value = false
}

async function deleteNews() {
  if (!newsToDeleteId.value) return
  const id = newsToDeleteId.value
  const snapshot = [...newsList.value]
  newsList.value = newsList.value.filter((n) => n.id !== id)

  try {
    await apiDeleteNews(id)
    toast.success('ลบข่าวสารสำเร็จ!')
  } catch (e) {
    newsList.value = snapshot
    if (isAxiosError(e)) {
      toast.error(e.response?.data?.message ?? 'ลบข่าวสารไม่สำเร็จ')
    } else {
      toast.error('ลบข่าวสารไม่สำเร็จ')
    }
  } finally {
    newsToDeleteId.value = null
    showConfirmModal.value = false
  }
}

// Toggle Status Handler
async function togglePublishStatus(news: NewsItem) {
  const prev = news.isPublished
  const next = !prev
  news.isPublished = next
  try {
    const updated = await togglePublish(news.id, next)
    Object.assign(news, updated)
    toast.success(next ? 'เผยแพร่ข่าวแล้ว' : 'ยกเลิกเผยแพร่แล้ว')
    newsList.value = sortByUpdatedDesc(newsList.value)
  } catch {
    news.isPublished = prev
    toast.error('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ')
  }
}

/* =========================================================================
 * Lifecycle
 * ========================================================================= */
onMounted(fetchNews)
</script>

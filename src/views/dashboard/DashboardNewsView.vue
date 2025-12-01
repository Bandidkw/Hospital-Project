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

    <section class="card bg-white p-6 rounded-lg shadow-md">
      <div class="flex items-center justify-between mb-5">
        <h3 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <i class="fas fa-list text-blue-500"></i> รายการข่าวสาร
        </h3>
        <div class="flex items-center gap-2">
          <div class="relative">
            <input
              type="search"
              v-model.trim="query"
              placeholder="ค้นหาหัวข้อข่าว..."
              class="pl-9 pr-3 py-1.5 text-sm rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <i
              class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
            ></i>
          </div>
          <select
            v-model="sortKey"
            class="border rounded-md text-sm py-1.5 px-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="updated">อัปเดตล่าสุด</option>
            <option value="date">วันที่</option>
            <option value="title">หัวข้อ</option>
            <option value="status">สถานะ</option>
          </select>
          <button
            class="p-2 border rounded-md hover:bg-gray-50"
            @click="sortAsc = !sortAsc"
            :title="sortAsc ? 'เรียง น้อย→มาก' : 'เรียง มาก→น้อย'"
          >
            <i :class="sortAsc ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
          </button>
        </div>
      </div>
      <div class="overflow-x-auto rounded-lg border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50 text-gray-600 uppercase text-xs font-medium">
            <tr>
              <th class="px-4 py-3 text-left w-12">#</th>
              <th class="px-4 py-3 text-left">หัวข้อ</th>
              <th class="px-4 py-3 text-left">หมวดหมู่</th>
              <th class="px-4 py-3 text-left w-32">วันที่</th>
              <th class="px-4 py-3 text-left w-28">สถานะ</th>
              <th class="px-4 py-3 text-center w-40">การจัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="(news, index) in pagedSortedNews"
              :key="news.id"
              class="hover:bg-blue-50/40 transition"
            >
              <td class="px-4 py-3 text-gray-500">{{ (page - 1) * pageSize + index + 1 }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3 max-w-xs">
                  <img
                    v-if="news.imageUrl"
                    :src="absoluteImage(news.imageUrl)"
                    :alt="news.title"
                    class="w-10 h-10 rounded object-cover border"
                    @error="onImgError"
                  />
                  <div
                    v-else-if="news.pdfUrl"
                    class="w-10 h-10 flex items-center justify-center bg-red-50 rounded text-red-600 border border-red-200"
                  >
                    <i class="fas fa-file-pdf text-xl"></i>
                  </div>
                  <div
                    v-else
                    class="w-10 h-10 flex items-center justify-center bg-gray-100 rounded text-gray-400 border"
                  >
                    <i class="far fa-image"></i>
                  </div>
                  <span class="font-medium ...">{{ news.title }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-gray-600">
                <span class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                  {{ categoryLabels[news.category ?? 'general'] || news.category }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-600 whitespace-nowrap">{{ prettyDate(news.date) }}</td>
              <td class="px-4 py-3">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                  :class="
                    news.isPublished
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  "
                >
                  {{ news.isPublished ? 'เผยแพร่แล้ว' : 'ฉบับร่าง' }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <div class="flex justify-center gap-2">
                  <div class="flex items-center justify-center">
                    <label :for="`toggle-${news.id}`" class="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        :id="`toggle-${news.id}`"
                        :checked="news.isPublished"
                        @change="togglePublishStatus(news)"
                        class="sr-only"
                      />

                      <div
                        class="relative w-10 h-5 rounded-full transition duration-300 shadow-inner"
                        :class="news.isPublished ? 'bg-green-500' : 'bg-gray-300'"
                        :title="news.isPublished ? 'สถานะ: เผยแพร่แล้ว' : 'สถานะ: ซ่อน'"
                      >
                        <div
                          class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-md"
                          :class="{ 'translate-x-5': news.isPublished }"
                        >
                          <i
                            class="fas w-full h-full flex items-center justify-center text-xs"
                            :class="
                              news.isPublished
                                ? 'fa-check text-green-500'
                                : 'fa-times text-gray-500'
                            "
                          ></i>
                        </div>
                      </div>
                    </label>
                  </div>
                  <button
                    @click="openEditModal(news)"
                    class="p-2 rounded-md hover:bg-amber-50 text-amber-600"
                    title="แก้ไข"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="confirmDeleteNews(news.id)"
                    class="p-2 rounded-md hover:bg-red-50 text-red-600"
                    title="ลบ"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="pagedSortedNews.length === 0">
              <td colspan="6" class="py-10 text-center text-gray-500">
                <i class="fas fa-info-circle mr-2"></i> ไม่พบข่าวสาร
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex items-center justify-between mt-4 text-sm text-gray-600">
        <p>
          แสดง {{ (page - 1) * pageSize + 1 }} –
          {{ Math.min(page * pageSize, sortedNews.length) }} จาก {{ sortedNews.length }} รายการ
        </p>
        <div class="flex items-center gap-2">
          <button
            class="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            :disabled="page <= 1"
            @click="page--"
          >
            ก่อนหน้า
          </button>
          <span>หน้า {{ page }}</span>
          <button
            class="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            :disabled="page * pageSize >= sortedNews.length"
            @click="page++"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </section>

    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="createNewsTitle"
      @keydown.esc="closeCreateModal"
    >
      <div
        class="bg-white w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10 animate-[fadeIn_.18s_ease-out]"
      >
        <header class="sticky top-0 z-10 bg-white/95 backdrop-blur border-b px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 id="createNewsTitle" class="text-xl font-bold text-gray-900 truncate">
              เพิ่มข่าวสารใหม่
            </h3>
            <button
              class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              @click="closeCreateModal"
              aria-label="ปิดหน้าต่างสร้างข่าวสาร"
            >
              <i class="fas fa-times text-gray-700"></i>
            </button>
          </div>
        </header>
        <div class="max-h-[75vh] overflow-y-auto px-6 py-6">
          <NewsCreateForm @newsSaved="handleNewsSaved" />
        </div>
      </div>
    </div>

    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-gray-700 bg-opacity-50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmTitle"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 id="confirmTitle" class="text-xl font-bold text-gray-800 mb-3">ยืนยันการลบ</h3>
        <p class="text-gray-700 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบข่าวสารนี้?</p>
        <div class="flex justify-center gap-3">
          <button
            @click="deleteNews"
            class="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
          >
            <i class="fas fa-trash-alt mr-2"></i> ลบ
          </button>
          <button
            @click="cancelDelete"
            class="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition"
          >
            <i class="fas fa-times mr-2"></i> ยกเลิก
          </button>
        </div>
      </div>
    </div>

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

    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="editNewsTitle"
      @keydown.esc="closeEditModal"
      @click.self="closeEditModal"
    >
      <div
        class="bg-white w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10 animate-[fadeIn_.18s_ease-out]"
      >
        <header class="sticky top-0 z-10 bg-white/95 backdrop-blur border-b px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="min-w-0">
              <h3 id="editNewsTitle" class="text-xl font-bold text-gray-900 truncate">
                แก้ไขข่าวสาร
              </h3>
              <p class="text-xs text-gray-500 mt-0.5">ปรับรายละเอียดแล้วกด “บันทึกการแก้ไข”</p>
            </div>
            <button
              class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              @click="closeEditModal"
              aria-label="ปิดหน้าต่างแก้ไข"
            >
              <i class="fas fa-times text-gray-700"></i>
            </button>
          </div>
        </header>
        <div class="max-h-[75vh] overflow-y-auto px-6 py-6">
          <form @submit.prevent="submitEdit" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-5">
              <div>
                <label for="editNewsTitle" class="block text-sm font-medium text-gray-700"
                  >หัวข้อข่าวสาร <span class="text-red-500">*</span></label
                >
                <div class="mt-1 relative">
                  <input
                    id="editNewsTitle"
                    type="text"
                    v-model.trim="editForm.title"
                    required
                    maxlength="120"
                    autocomplete="off"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-14 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="เช่น ประกาศวันหยุดราชการ"
                  />
                  <span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400"
                    >{{ (editForm.title ?? '').length }}/120</span
                  >
                </div>
              </div>
              <div>
                <label for="editNewsCategory" class="block text-sm font-medium text-gray-700"
                  >หมวดหมู่ข่าวสาร <span class="text-red-500">*</span></label
                >
                <select
                  id="editNewsCategory"
                  v-model="editForm.category"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option disabled value="">-- กรุณาเลือกหมวดหมู่ --</option>
                  <option v-for="cat in CATEGORY_LIST" :key="cat.key" :value="cat.key">
                    {{ cat.label }}
                  </option>
                </select>
              </div>
              <div>
                <label for="editNewsContent" class="block text-sm font-medium text-gray-700"
                  >เนื้อหาข่าวสาร <span class="text-red-500">*</span></label
                >
                <textarea
                  id="editNewsContent"
                  v-model.trim="editForm.content"
                  rows="7"
                  required
                  maxlength="2000"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="เนื้อหาข่าวโดยย่อ…"
                ></textarea>
              </div>
              <div>
                <label for="editNewsExcerpt" class="block text-sm font-medium text-gray-700"
                  >คำโปรย</label
                >
                <div class="mt-1 relative">
                  <input
                    id="editNewsExcerpt"
                    type="text"
                    v-model.trim="editForm.excerpt"
                    maxlength="200"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-14 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ข้อความสั้น ๆ สรุปข่าว"
                  />
                  <span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400"
                    >{{ (editForm.excerpt ?? '').length }}/200</span
                  >
                </div>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="editNewsDate" class="block text-sm font-medium text-gray-700"
                    >วันที่เผยแพร่ <span class="text-red-500">*</span></label
                  >
                  <input
                    id="editNewsDate"
                    type="date"
                    v-model="editForm.date"
                    :min="minDate"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >สถานะการเผยแพร่</label
                  >
                  <button
                    type="button"
                    class="inline-flex items-center px-3 py-2 rounded-md border transition select-none"
                    :class="
                      editForm.isPublished
                        ? 'bg-green-50 border-green-300 text-green-800'
                        : 'bg-gray-50 border-gray-300 text-gray-700'
                    "
                    @click="editForm.isPublished = !editForm.isPublished"
                  >
                    <i
                      class="fas mr-2"
                      :class="editForm.isPublished ? 'fa-toggle-on' : 'fa-toggle-off'"
                    ></i>
                    {{ editForm.isPublished ? 'เผยแพร่แล้ว' : 'ฉบับร่าง' }}
                  </button>
                </div>
              </div>
              <div v-if="showEditImageUpload">
                <label class="block text-sm font-medium text-gray-700 mb-1">รูปภาพประกอบ</label>
                <div
                  class="rounded-lg border border-dashed p-4 bg-gray-50 hover:bg-gray-100 transition text-center"
                >
                  <p class="text-sm text-gray-600">
                    ลากรูปมาวางที่นี่ หรือ
                    <label class="text-blue-600 font-medium cursor-pointer hover:underline"
                      >เลือกไฟล์<input
                        type="file"
                        accept="image/*"
                        class="sr-only"
                        @change="onEditFileChange"
                    /></label>
                  </p>
                </div>
              </div>
              <div v-if="showEditPdfUpload">
                <label for="editNewsPdfFile" class="block text-sm font-medium text-gray-700"
                  >ไฟล์เอกสารแนบ (PDF)</label
                >
                <input
                  id="editNewsPdfFile"
                  type="file"
                  accept=".pdf, application/pdf"
                  @change="onEditPdfFileChange"
                  class="mt-1 block w-full text-sm"
                />
                <div v-if="editForm.pdfUrl && !editPdfFile" class="mt-2 text-sm">
                  <a
                    :href="absoluteImage(editForm.pdfUrl)"
                    target="_blank"
                    class="text-blue-600 hover:underline"
                  >
                    <i class="fas fa-file-pdf mr-2"></i> ดูไฟล์ PDF ปัจจุบัน
                  </a>
                </div>
                <p v-if="editPdfFile" class="mt-1 text-xs text-gray-500">
                  ไฟล์ใหม่ที่เลือก: {{ editPdfFile.name }}
                </p>
              </div>
            </div>
            <aside>
              <div class="bg-gray-50 border rounded-lg p-4 sticky top-4">
                <h4 class="font-semibold text-gray-800 mb-3">พรีวิว</h4>
                <div
                  class="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center"
                >
                  <img
                    v-if="editPreviewSrc"
                    :src="editPreviewSrc"
                    :alt="editForm.title || 'รูปภาพพรีวิวข่าว'"
                    class="w-full h-full object-cover"
                    @error="onImgError"
                  />
                  <div v-else class="text-gray-400 text-sm flex flex-col items-center">
                    <i class="far fa-image text-3xl mb-2"></i>ไม่มีรูปภาพ
                  </div>
                </div>
                <div class="mt-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500">{{ prettyDate(editForm.date) }}</span>
                    <span
                      class="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                      :class="
                        editForm.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-200 text-gray-700'
                      "
                    >
                      {{ editForm.isPublished ? 'เผยแพร่แล้ว' : 'ฉบับร่าง' }}
                    </span>
                  </div>
                  <h5 class="font-semibold mt-1 text-gray-800 line-clamp-2">
                    {{ editForm.title || 'หัวข้อข่าว…' }}
                  </h5>
                  <p class="text-gray-600 text-sm mt-1 line-clamp-3">
                    {{ editForm.content || 'พิมพ์เนื้อหาข่าวสั้น ๆ เพื่อพรีวิวได้ทันที…' }}
                  </p>
                </div>
              </div>
            </aside>
          </form>
        </div>
        <footer class="sticky bottom-0 bg-white/95 backdrop-blur border-t px-6 py-4">
          <div class="flex items-center justify-end gap-3">
            <button
              type="button"
              @click="closeEditModal"
              class="px-5 py-2 rounded-md border bg-white hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              @click="submitEdit"
              class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              :disabled="savingEdit"
            >
              <span v-if="savingEdit" class="inline-flex items-center gap-2">
                <span
                  class="h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full inline-block animate-spin"
                ></span
                >กำลังบันทึก…
              </span>
              <span v-else><i class="fas fa-save mr-2"></i> บันทึกการแก้ไข</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* =========================================================================
 * Imports
 * ========================================================================= */
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { isAxiosError } from 'axios'
import {
  getAllNews,
  updateNews,
  togglePublish,
  deleteNews as apiDeleteNews,
  type NewsItem as ServiceNewsItem,
} from '@/services/newsService'
import { CATEGORY_LIST, attachCategory } from '@/features/news/categories'
import NewsCreateForm from '@/components/news/NewsCreateForm.vue'

/* =========================================================================
 * Types (คงไว้)
 * ========================================================================= */
type NewsItem = ServiceNewsItem
type NewsForm = {
  id: string
  title: string
  content: string
  category: string
  excerpt?: string
  date: string
  imageUrl: string
  pdfUrl?: string
  isPublished: boolean
}
type ApiErrorResponse = {
  message?: string
}

/* =========================================================================
 * Constants & Utils (คงไว้)
 * ========================================================================= */
const toast = useToast()
const minDate = new Date(2000, 0, 1).toISOString().split('T')[0]
const categoryLabels = computed(() =>
  Object.fromEntries(CATEGORY_LIST.map(({ key, label }) => [key, label])),
)
const PDF_CATEGORIES = ['procurement', 'recruitment', 'forms', 'staff']
const IMAGE_CATEGORIES = ['activity', 'general']

function makeExcerpt(title: string, content: string, max = 200): string {
  const t = title.trim()
  const c = content.trim()
  const base = (t ? `${t} — ` : '') + c
  if (base.length <= max) return base
  const cut = base.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…'
}
function prettyDate(d: string) {
  if (!d) return '-'
  try {
    return new Date(d).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return d
  }
}
function absoluteImage(u?: string | null): string {
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
  const root = base.replace(/\/api(\/v\d+)?$/i, '')
  return `${root}/${String(u).replace(/^\/+/, '')}`
}
function getSortTime(n: { updatedAt?: string; createdAt?: string; date?: string }) {
  return new Date(n.updatedAt || n.createdAt || n.date || 0).getTime()
}
function sortByUpdatedDesc<T extends { updatedAt?: string; createdAt?: string; date?: string }>(
  arr: T[],
) {
  return [...arr].sort((a, b) => getSortTime(b) - getSortTime(a))
}

/* =========================================================================
 * Reactive State (ปรับเพิ่ม showCreateModal)
 * ========================================================================= */
const newsList = ref<NewsItem[]>([])
const loading = ref(false)
const errorMsg = ref<string | null>(null)

// ADDED: Create Modal State
const showCreateModal = ref(false)

// Edit Modal State (คงไว้)
const showEditModal = ref(false)
const savingEdit = ref(false)
const editForm = ref<NewsForm>({
  id: '',
  title: '',
  content: '',
  category: '',
  excerpt: '',
  date: new Date().toISOString().split('T')[0],
  imageUrl: '',
  pdfUrl: '',
  isPublished: false,
})
const editImageFile = ref<File | null>(null)
const editPdfFile = ref<File | null>(null)
const editPreviewUrl = ref<string | null>(null)
let editLastObjectUrl: string | null = null

// Delete Modal State (คงไว้)
const newsToDeleteId = ref<string | null>(null)
const showConfirmModal = ref(false)

/* =========================================================================
 * Computed Properties (คงไว้)
 * ========================================================================= */
const editPreviewSrc = computed(() => {
  if (editPreviewUrl.value) return editPreviewUrl.value
  return editForm.value.imageUrl ? absoluteImage(editForm.value.imageUrl) : ''
})

// Conditional Upload Logic for Edit Modal
const showEditPdfUpload = computed(() => PDF_CATEGORIES.includes(editForm.value.category))
const showEditImageUpload = computed(
  () => IMAGE_CATEGORIES.includes(editForm.value.category) || !editForm.value.category,
)

// Table Pagination & Sorting (คงไว้)
const query = ref('')
const sortKey = ref<'updated' | 'date' | 'title' | 'status'>('updated')
const sortAsc = ref(false)
const page = ref(1)
const pageSize = ref(10)
const filteredNews = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? newsList.value.filter((n) => n.title.toLowerCase().includes(q)) : newsList.value
})
const sortedNews = computed(() => {
  const list = [...filteredNews.value]
  const dir = sortAsc.value ? 1 : -1
  if (sortKey.value === 'updated') list.sort((a, b) => (getSortTime(a) - getSortTime(b)) * dir)
  else if (sortKey.value === 'date')
    list.sort((a, b) => (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir)
  else if (sortKey.value === 'title') list.sort((a, b) => a.title.localeCompare(b.title) * dir)
  else list.sort((a, b) => (Number(a.isPublished) - Number(b.isPublished)) * dir)
  return list
})
const pagedSortedNews = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return sortedNews.value.slice(start, start + pageSize.value)
})

/* =========================================================================
 * Watchers (คงไว้)
 * ========================================================================= */
watch([query, sortKey, sortAsc], () => {
  page.value = 1
})

watch(
  () => editForm.value.category,
  (newCategory) => {
    if (PDF_CATEGORIES.includes(newCategory)) editImageFile.value = null
    if (IMAGE_CATEGORIES.includes(newCategory)) editPdfFile.value = null
  },
)

/* =========================================================================
 * Methods (ปรับเพิ่ม Create Modal Handlers)
 * ========================================================================= */
// ADDED: Create Modal Handlers
function openCreateModal() {
  showCreateModal.value = true
}
function closeCreateModal() {
  showCreateModal.value = false
}
function handleNewsSaved() {
  fetchNews() // Reloads the news list
  closeCreateModal() // Closes the modal after successful creation (reset is handled inside NewsCreateForm)
}

// File Handlers (คงไว้)
function onImgError(e: Event) {
  const el = e.target as HTMLImageElement
  if (!el) return
  const fallback =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="#e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#4b5563">Image unavailable</text></svg>`,
    )
  if (el.src !== fallback) el.src = fallback
}
function onEditFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  editImageFile.value = input.files?.[0] ?? null
  if (editLastObjectUrl) URL.revokeObjectURL(editLastObjectUrl)
  if (editImageFile.value) {
    const url = URL.createObjectURL(editImageFile.value)
    editPreviewUrl.value = url
    editLastObjectUrl = url
    editForm.value.imageUrl = ''
  } else {
    editPreviewUrl.value = null
  }
}
function onEditPdfFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  editPdfFile.value = input.files?.[0] ?? null
}

// CRUD Operations (คงไว้)
async function fetchNews() {
  loading.value = true
  errorMsg.value = null
  try {
    const items = await getAllNews()
    newsList.value = sortByUpdatedDesc(attachCategory(items))
  } catch (e) {
    if (isAxiosError<ApiErrorResponse>(e)) {
      errorMsg.value = e.response?.data?.message ?? e.message
    } else {
      errorMsg.value = 'ไม่สามารถดึงรายการข่าวได้'
    }
  } finally {
    loading.value = false
  }
}
function toForm(n: NewsItem): NewsForm {
  return {
    id: n.id,
    title: n.title,
    content: n.content,
    category: n.category ?? 'general',
    excerpt: n.excerpt ?? '',
    date: n.date,
    imageUrl: n.imageUrl ?? '',
    pdfUrl: n.pdfUrl ?? '',
    isPublished: n.isPublished,
  }
}

// Edit Modal Handlers (คงไว้)
function openEditModal(n: NewsItem) {
  if (editLastObjectUrl) URL.revokeObjectURL(editLastObjectUrl)
  editPreviewUrl.value = null
  editImageFile.value = null
  editPdfFile.value = null
  editForm.value = toForm(n)
  showEditModal.value = true
}
function closeEditModal() {
  showEditModal.value = false
  if (editLastObjectUrl) URL.revokeObjectURL(editLastObjectUrl)
  editPreviewUrl.value = null
  editImageFile.value = null
  editPdfFile.value = null
}
async function submitEdit() {
  if (savingEdit.value) return
  const v = editForm.value
  if (!v.title.trim() || !v.content.trim() || !v.date || !v.category) {
    toast.error('กรุณากรอกข้อมูลให้ครบทุกช่องที่มีเครื่องหมาย *')
    return
  }
  savingEdit.value = true
  try {
    const base = {
      title: v.title.trim(),
      content: v.content.trim(),
      category: v.category,
      excerpt: (v.excerpt?.trim() || makeExcerpt(v.title, v.content)).slice(0, 200),
      date: v.date,
    }
    let updated = await updateNews(v.id, {
      ...base,
      image: editImageFile.value,
      pdf: editPdfFile.value,
    })

    if (updated.isPublished !== v.isPublished) {
      try {
        const toggled = await togglePublish(v.id, v.isPublished)
        updated = { ...updated, ...toggled }
      } catch {
        toast.error('บันทึกแล้ว แต่เปลี่ยนสถานะเผยแพร่ไม่สำเร็จ')
      }
    }
    const idx = newsList.value.findIndex((n) => String(n.id) === String(v.id))
    if (idx !== -1) {
      newsList.value[idx] = { ...newsList.value[idx], ...attachCategory([updated])[0] }
    }
    toast.success('บันทึกการแก้ไขเรียบร้อย')
    newsList.value = sortByUpdatedDesc(newsList.value)
    closeEditModal()
  } catch (err) {
    if (isAxiosError<ApiErrorResponse>(err)) {
      toast.error(err.response?.data?.message ?? 'บันทึกการแก้ไขไม่สำเร็จ')
    } else {
      toast.error('บันทึกการแก้ไขไม่สำเร็จ')
    }
  } finally {
    savingEdit.value = false
  }
}

function confirmDeleteNews(id: string) {
  newsToDeleteId.value = id
  showConfirmModal.value = true
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
    if (isAxiosError<ApiErrorResponse>(e)) {
      toast.error(e.response?.data?.message ?? 'ลบข่าวสารไม่สำเร็จ')
    } else {
      toast.error('ลบข่าวสารไม่สำเร็จ')
    }
  } finally {
    resetDeleteConfirm()
  }
}

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

// Resets & UI Helpers (คงไว้)
function resetDeleteConfirm() {
  newsToDeleteId.value = null
  showConfirmModal.value = false
}
function cancelDelete() {
  resetDeleteConfirm()
}

// Lifecycle Hooks (คงไว้)
onMounted(fetchNews)
</script>

<style scoped>
/* Styles (คงไว้) */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.aspect-video {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
}
.aspect-video > img,
.aspect-video > div {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.aspect-video > img {
  object-fit: cover;
}
</style>

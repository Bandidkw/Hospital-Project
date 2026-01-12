<template>
  <section class="card bg-white p-6 rounded-lg shadow-md">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <h3 class="text-xl font-bold text-slate-800 flex items-center gap-2">
        <i class="fas fa-list text-blue-500"></i> รายการข่าวสาร
      </h3>
      <div class="flex flex-wrap items-center gap-3">
        <!-- Search Input -->
        <div class="relative group">
          <input
            type="search"
            v-model.trim="query"
            placeholder="ค้นหาข่าว..."
            class="pl-10 pr-4 py-2 text-sm bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full md:w-64 font-medium"
          />
          <i
            class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs transition-colors group-focus-within:text-blue-500"
          ></i>
        </div>

        <!-- Sort Selector -->
        <div
          class="relative flex items-center bg-slate-50 rounded-xl px-3 py-1.5 border border-transparent focus-within:border-blue-500/50 transition-all"
        >
          <i class="fas fa-sort-amount-down text-slate-400 mr-2 text-xs"></i>
          <select
            v-model="sortKey"
            class="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 p-0 appearance-none cursor-pointer pr-5"
          >
            <option value="updated">อัพเดตล่าสุด</option>
            <option value="date">วันที่</option>
            <option value="title">หัวข้อ</option>
            <option value="status">สถานะ</option>
          </select>
          <i
            class="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]"
          ></i>
        </div>

        <!-- Sort Order Button -->
        <button
          class="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          @click="sortAsc = !sortAsc"
          :title="sortAsc ? 'เรียง น้อย→มาก' : 'เรียง มาก→น้อย'"
        >
          <i
            :class="[sortAsc ? 'fas fa-arrow-up' : 'fas fa-arrow-down', 'text-slate-500 text-xs']"
          ></i>
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
                <span class="font-medium truncate block">{{ news.title }}</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <div
                v-if="categoryConfigs[news.category ?? 'general']"
                class="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-bold"
                :class="categoryConfigs[news.category ?? 'general'].classes.badge"
              >
                <i :class="categoryConfigs[news.category ?? 'general'].icon"></i>
                {{ categoryConfigs[news.category ?? 'general'].label }}
              </div>
              <div
                v-else
                class="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600"
              >
                <i class="fas fa-globe"></i>
                {{ news.category || 'ทั่วไป' }}
              </div>
            </td>
            <td class="px-4 py-3 text-gray-600 whitespace-nowrap">{{ prettyDate(news.date) }}</td>
            <td class="px-4 py-3">
              <span
                class="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                :class="
                  news.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
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
                      @change="$emit('toggle-publish', news)"
                      class="sr-only"
                    />

                    <div
                      class="relative w-10 h-5 rounded-full transition duration-300 shadow-inner"
                      :class="news.isPublished ? 'bg-green-500' : 'bg-gray-300'"
                      :title="news.isPublished ? 'สถานะ: เผยแพร่แล้ว' : 'สถานะ: ซ่อน'"
                    >
                      <div
                        class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-md flex items-center justify-center"
                        :class="{ 'translate-x-5': news.isPublished }"
                      >
                        <i
                          class="fas text-[10px]"
                          :class="
                            news.isPublished ? 'fa-check text-green-500' : 'fa-times text-gray-500'
                          "
                        ></i>
                      </div>
                    </div>
                  </label>
                </div>
                <button
                  @click="$emit('edit', news)"
                  class="p-2 rounded-md hover:bg-amber-50 text-amber-600"
                  title="แก้ไข"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="$emit('delete', news.id)"
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
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CATEGORY_LIST } from '@/features/news/categories'
import type { NewsItem } from '@/services/newsService'

interface Props {
  newsList: NewsItem[]
}

const props = defineProps<Props>()
defineEmits(['edit', 'delete', 'toggle-publish'])

// Utility functions
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

function getSortTime(n: { updatedAt?: string; createdAt?: string; date?: string }) {
  return new Date(n.updatedAt || n.createdAt || n.date || 0).getTime()
}

// Table State
const query = ref('')
const sortKey = ref<'updated' | 'date' | 'title' | 'status'>('updated')
const sortAsc = ref(false)
const page = ref(1)
const pageSize = ref(10)

const categoryConfigs = computed(() =>
  Object.fromEntries(CATEGORY_LIST.map((cat) => [cat.key, cat])),
)

const filteredNews = computed(() => {
  const q = query.value.trim().toLowerCase()
  return q ? props.newsList.filter((n) => n.title.toLowerCase().includes(q)) : props.newsList
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

watch([query, sortKey, sortAsc], () => {
  page.value = 1
})
</script>

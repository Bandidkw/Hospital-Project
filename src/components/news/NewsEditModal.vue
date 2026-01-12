<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="editNewsTitle"
    @keydown.esc="$emit('close')"
    @click.self="$emit('close')"
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
            @click="$emit('close')"
            aria-label="ปิดหน้าต่างแก้ไข"
          >
            <i class="fas fa-times text-gray-700"></i>
          </button>
        </div>
      </header>

      <div class="max-h-[75vh] overflow-y-auto px-6 py-6">
        <form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-5">
            <div>
              <label for="editNewsTitleInput" class="block text-sm font-medium text-gray-700"
                >หัวข้อข่าวสาร <span class="text-red-500">*</span></label
              >
              <div class="mt-1 relative">
                <input
                  id="editNewsTitleInput"
                  type="text"
                  v-model.trim="form.title"
                  required
                  maxlength="120"
                  autocomplete="off"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-14 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="เช่น ประกาศวันหยุดราชการ"
                />
                <span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400"
                  >{{ (form.title ?? '').length }}/120</span
                >
              </div>
            </div>

            <div class="space-y-3">
              <label class="block text-sm font-bold text-gray-700"
                >หมวดหมู่ข่าวสาร <span class="text-red-500">*</span></label
              >
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  v-for="cat in CATEGORY_LIST"
                  :key="cat.key"
                  type="button"
                  @click="form.category = cat.key"
                  class="flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all text-left"
                  :class="[
                    form.category === cat.key
                      ? `${cat.classes.border} ${cat.classes.bg} ${cat.classes.text} shadow-sm`
                      : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200',
                  ]"
                >
                  <div
                    class="w-6 h-6 rounded-lg flex items-center justify-center text-[10px]"
                    :class="[
                      form.category === cat.key
                        ? `${cat.classes.icon} text-white`
                        : 'bg-white text-slate-400',
                    ]"
                  >
                    <i :class="cat.icon"></i>
                  </div>
                  <span class="text-[10px] font-bold truncate">{{ cat.label }}</span>
                </button>
              </div>
            </div>

            <div>
              <label for="editNewsContent" class="block text-sm font-medium text-gray-700"
                >เนื้อหาข่าวสาร <span class="text-red-500">*</span></label
              >
              <textarea
                id="editNewsContent"
                v-model.trim="form.content"
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
                  v-model.trim="form.excerpt"
                  maxlength="200"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-14 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ข้อความสั้น ๆ สรุปข่าว"
                />
                <span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400"
                  >{{ (form.excerpt ?? '').length }}/200</span
                >
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label for="editNewsDate" class="block text-sm font-bold text-gray-700"
                  >วันที่เผยแพร่ <span class="text-red-500">*</span></label
                >
                <VueDatePicker
                  v-model="form.date"
                  :min-date="minDate"
                  :enable-time-picker="false"
                  auto-apply
                  locale="th"
                  format="dd/MM/yyyy"
                  model-type="yyyy-MM-dd"
                >
                  <template #trigger>
                    <div class="relative cursor-pointer group">
                      <input
                        type="text"
                        readonly
                        :value="prettyDate(form.date)"
                        placeholder="เลือกวันที่..."
                        class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-bold cursor-pointer text-sm"
                      />
                      <i
                        class="fas fa-calendar-alt absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors text-sm"
                      ></i>
                    </div>
                  </template>
                </VueDatePicker>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">สถานะการเผยแพร่</label>
                <button
                  type="button"
                  class="inline-flex items-center px-3 py-2 rounded-md border transition select-none"
                  :class="
                    form.isPublished
                      ? 'bg-green-50 border-green-300 text-green-800'
                      : 'bg-gray-50 border-gray-300 text-gray-700'
                  "
                  @click="form.isPublished = !form.isPublished"
                >
                  <i
                    class="fas mr-2"
                    :class="form.isPublished ? 'fa-toggle-on' : 'fa-toggle-off'"
                  ></i>
                  {{ form.isPublished ? 'เผยแพร่แล้ว' : 'ฉบับร่าง' }}
                </button>
              </div>
            </div>

            <div v-if="showImageUpload">
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
                      @change="onFileChange"
                  /></label>
                </p>
              </div>
            </div>

            <div v-if="showPdfUpload">
              <label for="editNewsPdfFile" class="block text-sm font-medium text-gray-700"
                >ไฟล์เอกสารแนบ (PDF)</label
              >
              <input
                id="editNewsPdfFile"
                type="file"
                accept=".pdf, application/pdf"
                @change="onPdfFileChange"
                class="mt-1 block w-full text-sm"
              />
              <div v-if="form.pdfUrl && !pdfFile" class="mt-2 text-sm">
                <a
                  :href="absoluteImage(form.pdfUrl)"
                  target="_blank"
                  class="text-blue-600 hover:underline"
                >
                  <i class="fas fa-file-pdf mr-2"></i> ดูไฟล์ PDF ปัจจุบัน
                </a>
              </div>
              <p v-if="pdfFile" class="mt-1 text-xs text-gray-500">
                ไฟล์ใหม่ที่เลือก: {{ pdfFile.name }}
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
                  v-if="previewSrc"
                  :src="previewSrc"
                  :alt="form.title || 'รูปภาพพรีวิวข่าว'"
                  class="w-full h-full object-cover"
                  @error="onImgError"
                />
                <div v-else class="text-gray-400 text-sm flex flex-col items-center">
                  <i class="far fa-image text-3xl mb-2"></i>ไม่มีรูปภาพ
                </div>
              </div>
              <div class="mt-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">{{ prettyDate(form.date) }}</span>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                    :class="
                      form.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                    "
                  >
                    {{ form.isPublished ? 'เผยแพร่แล้ว' : 'ฉบับร่าง' }}
                  </span>
                </div>
                <h5 class="font-semibold mt-1 text-gray-800 line-clamp-2">
                  {{ form.title || 'หัวข้อข่าว…' }}
                </h5>
                <p class="text-gray-600 text-sm mt-1 line-clamp-3">
                  {{ form.content || 'พิมพ์เนื้อหาข่าวสั้น ๆ เพื่อพรีวิวได้ทันที…' }}
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
            @click="$emit('close')"
            class="px-5 py-2 rounded-md border bg-white hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            @click="handleSubmit"
            class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            :disabled="saving"
          >
            <span v-if="saving" class="inline-flex items-center gap-2">
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
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { CATEGORY_LIST } from '@/features/news/categories'
import type { NewsItem } from '@/services/newsService'

interface Props {
  show: boolean
  newsItem: NewsItem | null
  saving: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'save'])

const minDate = new Date(2000, 0, 1).toISOString().split('T')[0]
const PDF_CATEGORIES = ['procurement', 'recruitment', 'forms', 'staff']
const IMAGE_CATEGORIES = ['activity', 'general']

// Form State
const form = ref({
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

const imageFile = ref<File | null>(null)
const pdfFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
let lastObjectUrl: string | null = null

const previewSrc = computed(() => {
  if (previewUrl.value) return previewUrl.value
  return form.value.imageUrl ? absoluteImage(form.value.imageUrl) : ''
})

const showPdfUpload = computed(() => PDF_CATEGORIES.includes(form.value.category))
const showImageUpload = computed(
  () => IMAGE_CATEGORIES.includes(form.value.category) || !form.value.category,
)

// Watch for props.newsItem changes to populate form
watch(
  () => props.newsItem,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        title: val.title,
        content: val.content,
        category: val.category ?? 'general',
        excerpt: val.excerpt ?? '',
        date: val.date,
        imageUrl: val.imageUrl ?? '',
        pdfUrl: val.pdfUrl ?? '',
        isPublished: val.isPublished,
      }
      resetFiles()
    }
  },
  { immediate: true },
)

watch(
  () => form.value.category,
  (newCategory) => {
    if (PDF_CATEGORIES.includes(newCategory)) imageFile.value = null
    if (IMAGE_CATEGORIES.includes(newCategory)) pdfFile.value = null
  },
)

function resetFiles() {
  if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl)
  previewUrl.value = null
  imageFile.value = null
  pdfFile.value = null
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  imageFile.value = input.files?.[0] ?? null
  if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl)
  if (imageFile.value) {
    const url = URL.createObjectURL(imageFile.value)
    previewUrl.value = url
    lastObjectUrl = url
    form.value.imageUrl = ''
  } else {
    previewUrl.value = null
  }
}

function onPdfFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  pdfFile.value = input.files?.[0] ?? null
}

function handleSubmit() {
  emit('save', {
    form: { ...form.value },
    imageFile: imageFile.value,
    pdfFile: pdfFile.value,
  })
}

// Utils
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

onUnmounted(() => {
  if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl)
})
</script>

<style scoped>
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

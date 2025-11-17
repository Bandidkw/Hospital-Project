<template>
  <section class="card bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-semibold text-gray-800">เพิ่มข่าวสารใหม่</h3>
      <button
        type="button"
        class="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-white transition"
        @click="resetForm"
        :disabled="saving"
        title="ล้างฟอร์ม"
      >
        <i class="fas fa-undo-alt mr-2"></i> เคลียร์
      </button>
    </div>

    <form @submit.prevent="onSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-4">
        <div>
          <label for="newsTitle" class="block text-sm font-medium text-gray-700"
            >หัวข้อข่าวสาร <span class="text-red-500">*</span></label
          >
          <div class="mt-1 relative">
            <input
              type="text"
              id="newsTitle"
              v-model.trim="currentNews.title"
              @blur="touch('title')"
              :class="inputClass('title')"
              placeholder="เช่น ประกาศวันหยุดราชการ"
              maxlength="120"
              required
            />
            <div class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {{ currentNews.title.length }}/120
            </div>
          </div>
          <p v-if="touched.title && errors.title" class="mt-1 text-sm text-red-600">
            {{ errors.title }}
          </p>
        </div>
        <div>
          <label for="newsCategory" class="block text-sm font-medium text-gray-700"
            >หมวดหมู่ข่าวสาร <span class="text-red-500">*</span></label
          >
          <select
            id="newsCategory"
            v-model="currentNews.category"
            @change="touch('category')"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            :class="inputClass('category')"
          >
            <option disabled value="">-- กรุณาเลือกหมวดหมู่ --</option>
            <option v-for="cat in CATEGORY_LIST" :key="cat.key" :value="cat.key">
              {{ cat.label }}
            </option>
          </select>
          <p v-if="touched.category && errors.category" class="mt-1 text-sm text-red-600">
            {{ errors.category }}
          </p>
        </div>
        <div>
          <label for="newsContent" class="block text-sm font-medium text-gray-700"
            >เนื้อหาข่าวสาร <span class="text-red-500">*</span></label
          >
          <textarea
            id="newsContent"
            v-model.trim="currentNews.content"
            @blur="touch('content')"
            :class="textareaClass('content')"
            rows="6"
            placeholder="เนื้อหาข่าวโดยย่อ…"
            maxlength="2000"
            required
          ></textarea>
          <div class="flex justify-between mt-1">
            <p v-if="touched.content && errors.content" class="text-sm text-red-600">
              {{ errors.content }}
            </p>
            <span class="text-xs text-gray-400">{{ currentNews.content.length }}/2000</span>
          </div>
        </div>
        <div>
          <label for="newsExcerpt" class="block text-sm font-medium text-gray-700"
            >คำโปรย (ถ้าเว้นว่าง ระบบจะสร้างให้อัตโนมัติ)</label
          >
          <input
            id="newsExcerpt"
            type="text"
            v-model.trim="currentNews.excerpt"
            :class="inputBase"
            placeholder="ข้อความสั้น ๆ สรุปข่าว"
            maxlength="200"
          />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="newsDate" class="block text-sm font-medium text-gray-700"
              >วันที่เผยแพร่ <span class="text-red-500">*</span></label
            >
            <input
              type="date"
              id="newsDate"
              v-model="currentNews.date"
              @change="touch('date')"
              :class="inputClass('date')"
              :min="minDate"
              required
            />
            <p v-if="touched.date && errors.date" class="mt-1 text-sm text-red-600">
              {{ errors.date }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">สถานะการเผยแพร่</label>
            <button
              type="button"
              class="inline-flex items-center px-3 py-2 rounded-md border transition select-none"
              :class="
                currentNews.isPublished
                  ? 'bg-green-50 border-green-300 text-green-800'
                  : 'bg-gray-50 border-gray-300 text-gray-700'
              "
              @click="currentNews.isPublished = !currentNews.isPublished"
            >
              <i
                class="fas mr-2"
                :class="currentNews.isPublished ? 'fa-toggle-on' : 'fa-toggle-off'"
              ></i>
              {{ currentNews.isPublished ? 'เผยแพร่แล้ว' : 'ฉบับร่าง' }}
            </button>
          </div>
        </div>
        <div v-if="showImageUpload">
          <label for="newsImageFile" class="block text-sm font-medium text-gray-700"
            >รูปภาพประกอบ</label
          >
          <input
            id="newsImageFile"
            type="file"
            accept="image/*"
            @change="onFileChange"
            class="mt-1 block w-full text-sm"
          />
        </div>
        <div v-if="showPdfUpload">
          <label for="newsPdfFile" class="block text-sm font-medium text-gray-700"
            >ไฟล์เอกสารแนบ (PDF)</label
          >
          <input
            id="newsPdfFile"
            type="file"
            accept=".pdf, application/pdf"
            @change="onPdfFileChange"
            class="mt-1 block w-full text-sm"
          />
          <p v-if="pdfFile" class="mt-1 text-xs text-gray-500">ไฟล์ที่เลือก: {{ pdfFile.name }}</p>
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            :disabled="!isValid || saving"
          >
            <i class="fas fa-save mr-2"></i>เพิ่มข่าวสาร
          </button>
        </div>
      </div>
      <aside class="lg:col-span-1">
        <div class="bg-white border rounded-lg p-4 shadow-sm">
          <h4 class="font-semibold text-gray-800 mb-3">พรีวิว</h4>
          <div class="space-y-2">
            <div
              class="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center"
            >
              <img
                v-if="previewSrc"
                :src="previewSrc"
                :alt="currentNews.title || 'รูปภาพพรีวิวข่าว'"
                class="w-full h-full object-cover"
                @error="onImgError"
              />
              <div v-else class="text-gray-400 text-sm flex flex-col items-center">
                <i class="far fa-image text-3xl mb-2"></i> ไม่มีรูปภาพ
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">{{ prettyDate(currentNews.date) }}</span>
                <span
                  class="text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
                  :class="
                    currentNews.isPublished
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-200 text-gray-700'
                  "
                >
                  {{ currentNews.isPublished ? 'เผยแพร่แล้ว' : 'ฉบับร่าง' }}
                </span>
              </div>
              <h5 class="font-semibold mt-1 text-gray-800 line-clamp-2">
                {{ currentNews.title || 'หัวข้อข่าว…' }}
              </h5>
              <p class="text-gray-600 text-sm mt-1 line-clamp-3">
                {{ currentNews.content || 'พิมพ์เนื้อหาข่าวสั้น ๆ เพื่อพรีวิวได้ทันที…' }}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useToast } from 'vue-toastification'
import { isAxiosError } from 'axios'
import { createNews, togglePublish, type NewsItem as ServiceNewsItem } from '@/services/newsService'
import { CATEGORY_LIST } from '@/features/news/categories'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const toast = useToast()
const minDate = new Date(2000, 0, 1).toISOString().split('T')[0]
const PDF_CATEGORIES = ['procurement', 'recruitment', 'forms', 'staff']
const IMAGE_CATEGORIES = ['activity', 'general']

// Replicating necessary utilities (ควรพิจารณาย้ายไป Util File กลาง)
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

// ================= State & Validation =================
const saving = ref(false)

const currentNews = ref<NewsForm>({
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

const errors = ref<Record<'title' | 'content' | 'date' | 'category' | 'excerpt', string | null>>({
  title: null,
  content: null,
  date: null,
  category: null,
  excerpt: null,
})
const touched = ref<Record<'title' | 'content' | 'date' | 'category' | 'excerpt', boolean>>({
  title: false,
  content: false,
  date: false,
  category: false,
  excerpt: false,
})

const inputBase =
  'mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500'

// Validation Logic (Extracted)
function validateField(field: keyof typeof errors.value) {
  const v = currentNews.value
  if (field === 'title') errors.value.title = !v.title.trim() ? 'กรุณากรอกหัวข้อ' : null
  else if (field === 'content') errors.value.content = !v.content.trim() ? 'กรุณากรอกเนื้อหา' : null
  else if (field === 'date') errors.value.date = !v.date ? 'กรุณาเลือกวันที่' : null
  else if (field === 'category') errors.value.category = !v.category ? 'กรุณาเลือกหมวดหมู่' : null

  if (field === 'excerpt' && v.excerpt && v.excerpt.length > 200) {
    errors.value.excerpt = 'คำโปรยต้องไม่เกิน 200 ตัวอักษร'
  } else if (field === 'excerpt') {
    errors.value.excerpt = null
  }
}
function touch(field: keyof typeof errors.value) {
  touched.value[field] = true
  validateField(field)
}

// Class Helpers (Extracted)
function inputClass(field: 'title' | 'date' | 'category') {
  const hasError = touched.value[field] && !!errors.value[field]
  return `${inputBase} ${hasError ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : ''}`
}
function textareaClass(field: 'content') {
  const hasError = touched.value[field] && !!errors.value[field]
  return `${inputBase} ${hasError ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : ''}`
}

// ================= Computed =================
const isValid = computed(() => {
  const v = currentNews.value
  // ต้องตรวจสอบทุกฟิลด์ที่มี *
  return !!(v.title.trim() && v.content.trim() && v.date && v.category) && !errors.value.excerpt
})
const previewSrc = computed(() => {
  if (previewUrl.value) return previewUrl.value
  return currentNews.value.imageUrl ? absoluteImage(currentNews.value.imageUrl) : ''
})

// Conditional Upload Logic (Extracted)
const showPdfUpload = computed(() => PDF_CATEGORIES.includes(currentNews.value.category))
const showImageUpload = computed(
  () => IMAGE_CATEGORIES.includes(currentNews.value.category) || !currentNews.value.category,
)

// ================= Watchers =================
watch(
  () => currentNews.value.category,
  (newCategory) => {
    // Logic เดิม: เคลียร์ไฟล์ที่ไม่เกี่ยวข้องเมื่อเปลี่ยนหมวดหมู่
    if (PDF_CATEGORIES.includes(newCategory)) {
      imageFile.value = null
      if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl)
      previewUrl.value = null
    }
    if (IMAGE_CATEGORIES.includes(newCategory)) pdfFile.value = null
  },
)

// ================= File Handlers =================
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
function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  imageFile.value = file
  if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl)
  if (file) {
    const url = URL.createObjectURL(file)
    previewUrl.value = url
    lastObjectUrl = url
    currentNews.value.imageUrl = ''
  } else {
    previewUrl.value = null
  }
}
function onPdfFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  pdfFile.value = input.files?.[0] ?? null
}

// ================= Actions & Emits =================
const emit = defineEmits<{
  (event: 'newsSaved'): void
}>()

async function onSubmit() {
  // Force touch all fields before submission
  ;(Object.keys(currentNews.value) as Array<keyof typeof errors.value>).forEach((f) =>
    touch(f as keyof typeof errors.value),
  )

  // Check if image is required but not selected
  if (showImageUpload.value && !imageFile.value && !currentNews.value.imageUrl) {
    toast.error('กรุณาแนบรูปภาพประกอบ')
    return
  }

  if (!isValid.value || saving.value || Object.values(errors.value).some((e) => e !== null)) {
    toast.error('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง')
    return
  }

  saving.value = true
  try {
    const base = {
      title: currentNews.value.title.trim(),
      content: currentNews.value.content.trim(),
      category: currentNews.value.category,
      excerpt: (
        currentNews.value.excerpt?.trim() ||
        makeExcerpt(currentNews.value.title, currentNews.value.content)
      ).slice(0, 200),
      date: currentNews.value.date,
    }

    const created = await createNews({ ...base, image: imageFile.value, pdf: pdfFile.value })

    if (currentNews.value.isPublished) {
      try {
        await togglePublish(created.id, true)
        toast.success('สร้างและเผยแพร่ข่าวสารใหม่สำเร็จ!')
      } catch {
        toast.error('สร้างสำเร็จ แต่เผยแพร่ไม่สำเร็จ')
      }
    } else {
      toast.success('เพิ่มข่าวสารใหม่สำเร็จ!')
    }

    resetForm()
    emit('newsSaved') // แจ้งให้ Parent โหลดรายการใหม่
  } catch (e) {
    if (isAxiosError<ApiErrorResponse>(e)) {
      toast.error(e.response?.data?.message ?? 'บันทึกข่าวสารไม่สำเร็จ')
    } else {
      toast.error('บันทึกข่าวสารไม่สำเร็จ')
    }
  } finally {
    saving.value = false
  }
}

function resetForm() {
  if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl)
  previewUrl.value = null
  currentNews.value = {
    id: '',
    title: '',
    content: '',
    category: '',
    excerpt: '',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    pdfUrl: '',
    isPublished: false,
  }
  imageFile.value = null
  pdfFile.value = null

  // Reset touched and errors (ปรับให้ Type-Safe ตามที่แนะนำก่อนหน้า)
  errors.value = {
    title: null,
    content: null,
    date: null,
    category: null,
    excerpt: null,
  }
  touched.value = {
    title: false,
    content: false,
    date: false,
    category: false,
    excerpt: false,
  }
}

onBeforeUnmount(() => {
  // Cleanup URL objects when component is destroyed
  if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl)
})
</script>

<style scoped>
/* Replicate necessary scoped styles from the parent for consistency */
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

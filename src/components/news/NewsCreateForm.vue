<template>
  <section class="max-w-6xl mx-auto">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <i class="fas fa-plus-circle"></i>
        </div>
        <h3 class="text-xl font-bold text-slate-800">สร้างข่าวสารใหม่</h3>
      </div>
      <button
        type="button"
        class="text-xs px-4 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-800 hover:border-slate-300 transition-all font-bold flex items-center shadow-sm"
        @click="resetForm"
        :disabled="saving"
      >
        <i class="fas fa-undo-alt mr-2 text-[10px]"></i> ล้างฟอร์ม
      </button>
    </div>

    <form @submit.prevent="onSubmit" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Form Controls -->
      <div
        class="lg:col-span-8 space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
      >
        <!-- Title Input -->
        <div class="space-y-2">
          <label
            for="newsTitle"
            class="block text-sm font-bold text-slate-700 flex items-center justify-between"
          >
            <span>หัวข้อข่าวสาร <span class="text-red-500">*</span></span>
            <span class="text-[10px] font-medium text-slate-400"
              >{{ currentNews.title.length }}/120</span
            >
          </label>
          <div class="relative">
            <input
              type="text"
              id="newsTitle"
              v-model.trim="currentNews.title"
              @blur="touch('title')"
              :class="inputClass('title')"
              placeholder="เช่น ประกาศรับสมัครงานตำแหน่ง..."
              maxlength="120"
              required
              class="w-full pl-4 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium placeholder:text-slate-400"
            />
          </div>
          <p
            v-if="touched.title && errors.title"
            class="text-xs font-bold text-red-500 mt-1 flex items-center gap-1"
          >
            <i class="fas fa-exclamation-circle"></i> {{ errors.title }}
          </p>
        </div>

        <!-- Visual Category Selection -->
        <div class="space-y-4">
          <label class="block text-sm font-bold text-slate-700"
            >หมวดหมู่ข่าวสาร <span class="text-red-500">*</span></label
          >
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              v-for="cat in CATEGORY_LIST"
              :key="cat.key"
              type="button"
              @click="selectCategory(cat.key)"
              class="flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all group relative overflow-hidden"
              :class="[
                currentNews.category === cat.key
                  ? `${cat.classes.border} ${cat.classes.bg} shadow-sm ${cat.classes.shadow}`
                  : 'border-slate-100 bg-slate-50 hover:border-slate-300',
              ]"
            >
              <!-- Active Indicator -->
              <div
                v-if="currentNews.category === cat.key"
                :class="cat.classes.icon"
                class="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
              ></div>

              <div
                class="w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-110 shadow-sm"
                :class="[
                  currentNews.category === cat.key
                    ? `${cat.classes.icon} text-white`
                    : 'bg-white text-slate-400 group-hover:text-slate-600',
                ]"
              >
                <i :class="cat.icon"></i>
              </div>
              <span
                class="text-[10px] font-bold text-center leading-tight transition-colors"
                :class="currentNews.category === cat.key ? cat.classes.text : 'text-slate-500'"
              >
                {{ cat.label }}
              </span>
            </button>
          </div>
          <p
            v-if="touched.category && errors.category"
            class="text-xs font-bold text-red-500 mt-1 flex items-center gap-1"
          >
            <i class="fas fa-exclamation-circle"></i> {{ errors.category }}
          </p>
        </div>

        <!-- Date Input Section -->
        <div class="space-y-2">
          <label for="newsDate" class="block text-sm font-bold text-slate-700"
            >วันที่ลงข่าว <span class="text-red-500">*</span></label
          >
          <VueDatePicker
            v-model="currentNews.date"
            :min-date="minDate"
            :enable-time-picker="false"
            auto-apply
            locale="th"
            format="dd/MM/yyyy"
            model-type="yyyy-MM-dd"
            @closed="touch('date')"
          >
            <template #trigger>
              <div class="relative cursor-pointer group">
                <input
                  type="text"
                  readonly
                  :value="prettyDate(currentNews.date)"
                  :class="inputClass('date')"
                  placeholder="เลือกวันที่..."
                  class="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-bold cursor-pointer"
                />
                <i
                  class="fas fa-calendar-alt absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors"
                ></i>
              </div>
            </template>
          </VueDatePicker>
          <p
            v-if="touched.date && errors.date"
            class="text-xs font-bold text-red-500 mt-1 flex items-center gap-1"
          >
            <i class="fas fa-exclamation-circle"></i> {{ errors.date }}
          </p>
        </div>

        <!-- Content Area -->
        <div class="space-y-2">
          <label
            for="newsContent"
            class="block text-sm font-bold text-slate-700 flex items-center justify-between"
          >
            <span>เนื้อหาโดยละเอียด <span class="text-red-500">*</span></span>
            <span class="text-[10px] font-medium text-slate-400"
              >{{ currentNews.content.length }}/2000</span
            >
          </label>
          <textarea
            id="newsContent"
            v-model.trim="currentNews.content"
            @blur="touch('content')"
            :class="textareaClass('content')"
            rows="5"
            placeholder="รายละเอียดข่าวสาร..."
            maxlength="2000"
            required
            class="w-full px-4 py-3 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium placeholder:text-slate-400 resize-none min-h-[140px]"
          ></textarea>
        </div>

        <!-- Excerpt Input -->
        <div class="space-y-2">
          <label for="newsExcerpt" class="block text-sm font-bold text-slate-700"
            >คำโปรย (Excerpt)</label
          >
          <input
            id="newsExcerpt"
            type="text"
            v-model.trim="currentNews.excerpt"
            placeholder="สรุปข่าวสั้นๆ (ถ้าเว้นจะสร้างอัตโนมัติ)"
            maxlength="200"
            class="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-medium text-sm"
          />
        </div>

        <!-- Media Uploads -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <!-- Image Upload -->
          <div v-if="showImageUpload" class="space-y-2">
            <span class="block text-sm font-bold text-slate-700">รูปภาพหน้าปก</span>
            <div class="relative">
              <label
                for="newsImageFile"
                class="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer hover:bg-slate-100 hover:border-blue-400 group"
              >
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <i
                    class="fas fa-cloud-upload-alt text-2xl text-slate-400 group-hover:text-blue-500 transition-colors mb-2"
                  ></i>
                  <p class="text-xs text-slate-500 font-bold group-hover:text-slate-700">
                    {{ imageFile ? imageFile.name : 'คลิกเพื่อเลือกรูปภาพ' }}
                  </p>
                </div>
                <input
                  id="newsImageFile"
                  type="file"
                  accept="image/*"
                  @change="onFileChange"
                  class="hidden"
                />
              </label>
            </div>
          </div>

          <!-- PDF Upload -->
          <div v-if="showPdfUpload" class="space-y-2">
            <span class="block text-sm font-bold text-slate-700">ไฟล์เอกสาร (PDF)</span>
            <div class="relative">
              <label
                for="newsPdfFile"
                class="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer hover:bg-red-50 hover:border-red-400 group"
              >
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <i
                    class="fas fa-file-pdf text-2xl text-slate-400 group-hover:text-red-500 transition-colors mb-2"
                  ></i>
                  <p class="text-xs text-slate-500 font-bold group-hover:text-slate-700">
                    {{ pdfFile ? pdfFile.name : 'คลิกเพื่อเลือกไฟล์ PDF' }}
                  </p>
                </div>
                <input
                  id="newsPdfFile"
                  type="file"
                  accept=".pdf, application/pdf"
                  @change="onPdfFileChange"
                  class="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <!-- Publish Toggle & Submit -->
        <div
          class="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-100"
        >
          <div class="flex items-center gap-4">
            <span class="text-sm font-bold text-slate-600">สถานะข่าวาสาร:</span>
            <button
              type="button"
              class="relative inline-flex h-8 w-24 items-center justify-center rounded-full border transition-all duration-300 font-bold text-[11px]"
              :class="
                currentNews.isPublished
                  ? 'bg-green-500 text-white border-green-600 shadow-md shadow-green-200'
                  : 'bg-slate-200 text-slate-500 border-slate-300'
              "
              @click="currentNews.isPublished = !currentNews.isPublished"
            >
              <i
                class="fas mr-2"
                :class="currentNews.isPublished ? 'fa-check' : 'fa-pencil-alt'"
              ></i>
              {{ currentNews.isPublished ? 'เผยแพร่' : 'ฉบับร่าง' }}
            </button>
          </div>

          <button
            type="submit"
            class="w-full md:w-auto px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 disabled:grayscale disabled:scale-100"
            :disabled="!isValid || saving"
          >
            <span v-if="saving" class="flex items-center gap-2">
              <i class="fas fa-spinner fa-spin"></i> กำลังบันทึก...
            </span>
            <span v-else>บันทึกและสร้างข่าวสาร</span>
          </button>
        </div>
      </div>

      <!-- Live Preview Sidebar -->
      <div class="lg:col-span-4 lg:sticky lg:top-8">
        <div
          class="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/50"
        >
          <div
            class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50"
          >
            <span class="text-xs font-black text-slate-400 uppercase tracking-widest"
              >Live Preview</span
            >
            <div class="flex gap-1">
              <div class="w-2 h-2 rounded-full bg-slate-300"></div>
              <div class="w-2 h-2 rounded-full bg-slate-300"></div>
              <div class="w-2 h-2 rounded-full bg-slate-300"></div>
            </div>
          </div>

          <div class="relative overflow-hidden group">
            <div
              class="aspect-[16/10] bg-slate-100 flex items-center justify-center overflow-hidden"
            >
              <img
                v-if="previewSrc"
                :src="previewSrc"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                @error="onImgError"
              />
              <div v-else class="flex flex-col items-center justify-center text-slate-300">
                <i class="far fa-image text-4xl mb-2"></i>
                <span class="text-[10px] font-bold uppercase tracking-tight">No Cover Image</span>
              </div>
            </div>
            <!-- Status Badge Overlay -->
            <div class="absolute top-4 right-4">
              <span
                class="px-3 py-1 text-[10px] font-black rounded-full shadow-lg backdrop-blur-md"
                :class="
                  currentNews.isPublished
                    ? 'bg-green-500/90 text-white'
                    : 'bg-white/90 text-slate-800 font-black'
                "
              >
                {{ currentNews.isPublished ? 'PUBLISHED' : 'DRAFT' }}
              </span>
            </div>
          </div>

          <div class="p-6">
            <div class="flex items-center justify-between mb-3">
              <span
                class="text-[10px] font-black text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded"
              >
                #{{ currentNews.category || 'CATEGORY' }}
              </span>
              <span class="text-[10px] font-bold text-slate-400">{{
                prettyDate(currentNews.date)
              }}</span>
            </div>

            <h5
              class="text-lg font-bold text-slate-800 leading-snug mb-3 line-clamp-2 min-h-[3.5rem]"
            >
              {{ currentNews.title || 'หัวข้อข่าวสารของคุณจะแสดงที่นี่...' }}
            </h5>

            <div class="h-px bg-slate-100 mb-4"></div>

            <p class="text-slate-500 text-xs leading-relaxed line-clamp-4 min-h-[4.5rem]">
              {{
                currentNews.content ||
                'ใส่รายละเอียดข่าวสารเพื่อให้เนื้อหาที่เป็นประโยชน์แก่ผู้เข้าชมเว็บไซต์...'
              }}
            </p>

            <div class="mt-6 flex items-center justify-between">
              <div class="flex -space-x-2">
                <div class="w-6 h-6 rounded-full border-2 border-white bg-slate-200"></div>
                <div class="w-6 h-6 rounded-full border-2 border-white bg-slate-300"></div>
              </div>
              <button
                disabled
                class="text-[10px] font-black text-slate-300 hover:text-blue-600 transition-colors uppercase"
              >
                Read More <i class="fas fa-chevron-right ml-1"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Help Info -->
        <div class="mt-6 p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
          <h6 class="text-xs font-black text-blue-800 uppercase mb-2">เคล็ดลับการสร้างข่าว</h6>
          <ul class="space-y-2">
            <li class="flex items-start gap-2 text-[11px] text-blue-700 font-medium">
              <i class="fas fa-info-circle mt-0.5 opacity-60"></i>
              รูปภาพควรมีขนาด 1200x630 (16:9)
            </li>
            <li class="flex items-start gap-2 text-[11px] text-blue-700 font-medium">
              <i class="fas fa-info-circle mt-0.5 opacity-60"></i>
              เนื้อหาที่กระชับจะช่วยให้น่าอ่านมากขึ้น
            </li>
          </ul>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
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

function selectCategory(key: string) {
  currentNews.value.category = key
  touch('category')
}

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
  // return `${inputBase} ${hasError ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : ''}`
  return hasError ? '!border-red-400 !bg-red-50 focus:!ring-red-500/20' : ''
}
function textareaClass(field: 'content') {
  const hasError = touched.value[field] && !!errors.value[field]
  // return `${inputBase} ${hasError ? 'border-red-300 focus:border-red-400 focus:ring-red-300' : ''}`
  return hasError ? '!border-red-400 !bg-red-50 focus:!ring-red-500/20' : ''
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
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@100;300;400;500;600;700;800&display=swap');

section {
  font-family: 'Sarabun', sans-serif !important;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

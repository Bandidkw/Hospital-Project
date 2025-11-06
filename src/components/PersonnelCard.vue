<template>
  <div
    :class="[
      'bg-white p-4 rounded-xl shadow-md flex flex-col items-center text-center transition-transform hover:shadow-lg',
      // ใช้ isDirector โดยตรงใน template
      { 'p-6 shadow-xl ring-2 ring-blue-500 bg-blue-50': isDirector },
    ]"
  >
    <img
      :src="absoluteImage(personnel.imageUrl) || defaultImage"
      :alt="personnel.name"
      :class="[
        'rounded-full object-cover mb-4 border-4 border-gray-100',
        isDirector ? 'w-32 h-32' : 'w-24 h-24',
      ]"
      @error="onImgError"
    />

    <h3 :class="['font-semibold text-gray-800 leading-tight', isDirector ? 'text-xl' : 'text-md']">
      {{ personnel.name }}
    </h3>
    <p :class="['text-gray-700 mt-1', isDirector ? 'text-md' : 'text-sm']">
      {{ personnel.position }}
    </p>

    <p
      v-if="personnel.specialty"
      :class="['font-medium', isDirector ? 'text-blue-600 mt-1' : 'text-gray-500 text-xs']"
    >
      {{ personnel.specialty }}
    </p>

    <p v-if="personnel.tel && personnel.tel !== 'xxx'" class="text-xs text-gray-500 mt-2">
      โทร : 053-104148-51 ต่อ {{ personnel.tel }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { PersonnelItem } from '@/types/personnel'

interface Props {
  personnel: PersonnelItem
  isDirector?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDirector: false,
})

// ภาพสำรองเมื่อโหลดไม่ได้
const defaultImage = 'https://placehold.co/100x100/cccccc/ffffff?text=No+Photo'

function absoluteImage(u?: string | null): string {
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
  const root = base.replace(/\/api(\/v\d+)?$/i, '')
  return `${root}/${String(u).replace(/^\/+/, '')}`
}

function onImgError(event: Event) {
  console.error(`Image load failed for: ${props.personnel.name}`)
  ;(event.target as HTMLImageElement).src = defaultImage
}
</script>

<template>
  <div class="p-4 bg-white rounded-lg shadow-lg border w-full font-sans max-w-4xl mx-auto">
    <div class="flex items-center justify-between px-2 mb-4">
      <h2 class="font-bold text-gray-800 text-xl">{{ currentMonthName }} {{ currentYear }}</h2>
      <div class="flex items-center space-x-2">
        <button
          @click="goToToday"
          type="button"
          class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-150"
        >
          Today
        </button>

        <button
          @click="previousMonth"
          type="button"
          :disabled="isLoading"
          class="p-2 rounded-full text-gray-500 hover:bg-gray-200 disabled:opacity-50"
        >
          <i class="fas fa-chevron-left text-sm"></i>
        </button>
        <button
          @click="nextMonth"
          type="button"
          :disabled="isLoading"
          class="p-2 rounded-full text-gray-500 hover:bg-gray-200 disabled:opacity-50"
        >
          <i v-if="isLoading" class="fas fa-spinner fa-spin text-sm"></i>
          <i v-else class="fas fa-chevron-right text-sm"></i>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-7 border-t border-l border-gray-200">
      <div
        v-for="(day, index) in dayLabels"
        :key="day"
        class="text-xs font-semibold py-2 px-2 text-left border-b border-r border-gray-200"
        :class="{
          'text-red-600': index >= 5, // เสาร์-อาทิตย์
          'text-gray-700': index < 5,
        }"
      >
        {{ day }}
      </div>

      <div
        v-for="day in days"
        :key="day.date.toISOString()"
        @click="selectDate(day)"
        class="h-28 border-b border-r border-gray-200 transition-colors duration-100 flex flex-col p-1.5 relative"
        :class="{
          // Not current month or weekend/disabled background
          'bg-gray-50': !day.isCurrentMonth,
          'bg-red-50': day.isCurrentMonth && day.isWeekend && !day.isPast,
          'opacity-70 cursor-not-allowed':
            day.isCurrentMonth && (day.isFull || day.isPast || day.isWeekend),

          // Selectable background
          'cursor-pointer hover:bg-blue-50':
            day.isCurrentMonth && !day.isFull && !day.isPast && !day.isWeekend,

          // Selected
          'bg-blue-100 border-blue-500 border-2': day.isSelected,

          // Today
          'bg-yellow-50': day.isToday && !day.isSelected,
        }"
      >
        <span
          class="text-xs font-medium self-end w-6 h-6 rounded-full flex items-center justify-center z-10"
          :class="{
            'text-blue-600 font-bold': day.isToday && !day.isSelected,
            'text-white bg-blue-600 font-bold': day.isSelected,
            'text-gray-500': !day.isToday && !day.isSelected,
            'text-gray-400': !day.isCurrentMonth,
          }"
        >
          {{ day.date.getDate() }}
        </span>

        <div
          v-if="day.isCurrentMonth && !day.isWeekend && !day.isPast"
          class="text-center mt-1 w-full"
        >
          <span
            class="text-xs font-semibold px-2 py-0.5 rounded-full"
            :class="{
              // เนื่องจาก slotsRemaining ถูกกำหนดเป็น required แล้ว จึงไม่ต้องตรวจสอบ !== undefined อีก
              'bg-green-100 text-green-700': day.slotsRemaining > 7,
              'bg-amber-100 text-amber-700': day.slotsRemaining <= 7 && day.slotsRemaining > 0,
              'bg-red-100 text-red-700': day.slotsRemaining === 0 || day.isFull,
              // Selected style override
              'bg-white/50': day.isSelected,
            }"
          >
            {{ day.slotsRemaining }}/{{ DAILY_LIMIT }}
          </span>
        </div>
      </div>
    </div>

    <div
      v-if="selectedDate"
      class="mt-6 pt-4 border-t border-gray-200 flex items-center justify-center space-x-4 text-gray-700 bg-blue-50 p-4 rounded-lg"
    >
      <i class="far fa-clock text-xl text-blue-600"></i>
      <span class="font-medium text-blue-700">เวลาที่เลือก:</span>
      <div class="flex items-center space-x-2">
        <select
          v-model.number="selectedHour"
          class="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white"
        >
          <option v-for="h in 24" :key="h" :value="h - 1">
            {{ (h - 1).toString().padStart(2, '0') }}
          </option>
        </select>
        <span>:</span>
        <select
          v-model.number="selectedMinute"
          class="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white"
        >
          <option value="0">00</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineEmits, defineProps, onMounted } from 'vue'
import type { Day } from '@/types/referral.ts'

// --- Props & Emits for v-model ---
const props = defineProps<{ modelValue: Date | null }>()
const emit = defineEmits(['update:modelValue'])

// --- Constants ---
const DAILY_LIMIT = 15
const dayLabels = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']

// function to determine initial minute selection
const getInitialMinute = (date: Date | null): number => {
  if (!date) return 0
  const minutes = date.getMinutes()
  return Math.floor(minutes / 10) * 10
}

// --- Component State ---
const currentDate = ref(props.modelValue || new Date())
const selectedDate = ref<Date | null>(props.modelValue)
const selectedHour = ref(props.modelValue ? props.modelValue.getHours() : 9)
const selectedMinute = ref(getInitialMinute(props.modelValue))
const dailySlots = ref<Record<string, number>>({})
const isLoading = ref(false)

// --- Mock API (ยังคงเดิม) ---
async function fetchAvailability(year: number, month: number): Promise<Record<string, number>> {
  console.log(`Fetching availability for ${year}-${month + 1}...`)
  await new Promise((resolve) => setTimeout(resolve, 500))
  // Mock data for testing 15 limit (October is 9)
  if (year === 2025 && month === 9) {
    return {
      '2025-10-27': 8, // Monday: 7 slots left (Low)
      '2025-10-28': 14, // Tuesday: 1 slot left (Very Low)
    }
  }
  return {}
}

async function fetchAvailabilityForCurrentMonth() {
  isLoading.value = true
  try {
    dailySlots.value = await fetchAvailability(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth(),
    )
  } catch (error) {
    console.error('Failed to fetch availability:', error)
  } finally {
    isLoading.value = false
  }
}

// --- Lifecycle & Watchers ---
onMounted(() => {
  fetchAvailabilityForCurrentMonth()
})

watch(currentDate, () => {
  fetchAvailabilityForCurrentMonth()
})

watch([selectedDate, selectedHour, selectedMinute], () => {
  if (selectedDate.value) {
    const newDateTime = new Date(selectedDate.value)
    newDateTime.setHours(selectedHour.value, selectedMinute.value as number, 0, 0)
    emit('update:modelValue', newDateTime)
  } else {
    emit('update:modelValue', null)
  }
})

// --- Computed Properties ---
const currentMonthName = computed(() =>
  currentDate.value.toLocaleString('th-TH', { month: 'long' }),
)
const currentYear = computed(() => currentDate.value.toLocaleString('th-TH', { year: 'numeric' }))

const days = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7

  const daysArray: Day[] = []

  // 1. Days from the previous month
  for (let i = startDayOfWeek; i > 0; i--) {
    const date = new Date(year, month, 1 - i)
    daysArray.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      // ✅ เพิ่ม Properties ที่ถูกกำหนดให้เป็น Required
      slotsRemaining: 0,
      isFull: true,
      isPast: false,
      isWeekend: false,
    })
  }

  // 2. Days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday
    const dateString = date.toISOString().slice(0, 10)

    const slotsTaken = dailySlots.value[dateString] || 0
    const isFull = slotsTaken >= DAILY_LIMIT
    const isPast = date < today
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

    daysArray.push({
      date,
      isCurrentMonth: true,
      isToday: date.toDateString() === new Date().toDateString(),
      isSelected: selectedDate.value
        ? date.toDateString() === selectedDate.value.toDateString()
        : false,
      slotsRemaining: isWeekend ? 0 : DAILY_LIMIT - slotsTaken,
      isFull: isWeekend || isFull,
      isPast,
      isWeekend,
    })
  }

  // 3. Days from the next month to fill the grid
  const remainingSlots = 42 - daysArray.length
  for (let i = 1; i <= remainingSlots; i++) {
    const date = new Date(year, month + 1, i)
    daysArray.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      // ✅ เพิ่ม Properties ที่ถูกกำหนดให้เป็น Required
      slotsRemaining: 0,
      isFull: true,
      isPast: false,
      isWeekend: false,
    })
  }

  return daysArray
})

// --- Methods ---
function goToToday() {
  currentDate.value = new Date()
  selectedDate.value = null // Clear selection when jumping to today
  fetchAvailabilityForCurrentMonth() // Re-fetch if month changes
}

function previousMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  if (selectedDate.value && selectedDate.value.getMonth() !== currentDate.value.getMonth()) {
    selectedDate.value = null
  }
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  if (selectedDate.value && selectedDate.value.getMonth() !== currentDate.value.getMonth()) {
    selectedDate.value = null
  }
}

function selectDate(day: Day) {
  if (!day.isCurrentMonth || day.isFull || day.isPast || day.isWeekend) {
    if (day.isSelected) selectedDate.value = null
    return
  }

  if (day.isSelected) {
    selectedDate.value = null
  } else {
    selectedDate.value = day.date
  }
}
</script>

<style scoped>
/* ไม่มี CSS แยก เพราะใช้ Tailwind CSS ใน Template ทั้งหมด */
</style>

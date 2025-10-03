<template>
  <div class="p-4 bg-white rounded-lg shadow-lg border w-full font-sans">
    <div class="flex items-center justify-between px-2 mb-4">
      <h2 class="font-semibold text-gray-800 text-lg">{{ currentMonthName }} {{ currentYear }}</h2>
      <div class="flex items-center space-x-2">
        <button
          @click="previousMonth"
          type="button"
          :disabled="isLoading"
          class="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
        >
          <i class="fas fa-chevron-left text-gray-500"></i>
        </button>
        <button
          @click="nextMonth"
          type="button"
          :disabled="isLoading"
          class="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
        >
          <i v-if="isLoading" class="fas fa-spinner fa-spin text-gray-500"></i>
          <i v-else class="fas fa-chevron-right text-gray-500"></i>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1 text-center">
      <div v-for="day in dayLabels" :key="day" class="text-xs font-medium text-gray-500 py-2">
        {{ day }}
      </div>

      <div
        v-for="day in days"
        :key="day.date.toISOString()"
        @click="selectDate(day)"
        class="py-2 rounded-lg transition-colors relative"
        :class="{
          'text-gray-400': !day.isCurrentMonth,
          'cursor-pointer hover:bg-blue-100': day.isCurrentMonth && !day.isFull && !day.isPast,
          'bg-blue-600 text-white font-bold': day.isSelected,
          'text-blue-600 font-bold': day.isToday && !day.isSelected,
          'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 line-through':
            day.isCurrentMonth && (day.isFull || day.isPast),
        }"
      >
        {{ day.date.getDate() }}
        <span
          v-if="day.isCurrentMonth && !day.isPast && day.slotsRemaining !== undefined"
          class="absolute bottom-0 left-0 right-0 text-[10px]"
          :class="{
            'text-green-500': day.slotsRemaining > 5,
            'text-amber-500': day.slotsRemaining <= 5 && day.slotsRemaining > 0,
            'text-red-500': day.slotsRemaining === 0,
          }"
        >
          {{ day.slotsRemaining }}/{{ DAILY_LIMIT }}
        </span>
      </div>
    </div>

    <div
      v-if="selectedDate"
      class="mt-4 pt-4 border-t flex items-center justify-center space-x-4 text-gray-700"
    >
      <i class="far fa-clock text-xl text-gray-600"></i>
      <div class="flex items-center space-x-2">
        <select
          v-model.number="selectedHour"
          class="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="h in 24" :key="h" :value="h - 1">
            {{ (h - 1).toString().padStart(2, '0') }}
          </option>
        </select>
        <span>:</span>
        <select
          v-model.number="selectedMinute"
          class="px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="0">00</option>
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="45">45</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineEmits, defineProps, onMounted } from 'vue'
import type { Day } from '@/services/calendar'

// --- Props & Emits for v-model ---
const props = defineProps<{ modelValue: Date | null }>()
const emit = defineEmits(['update:modelValue'])

// --- Constants ---
const DAILY_LIMIT = 20
const dayLabels = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']

// --- Component State ---
const currentDate = ref(props.modelValue || new Date())
const selectedDate = ref<Date | null>(props.modelValue)
const selectedHour = ref(props.modelValue ? props.modelValue.getHours() : 9)
const selectedMinute = ref(props.modelValue ? props.modelValue.getMinutes() : 0)
const dailySlots = ref<Record<string, number>>({})
const isLoading = ref(false)

// --- Mock API ---
async function fetchAvailability(year: number, month: number): Promise<Record<string, number>> {
  console.log(`Fetching availability for ${year}-${month + 1}...`)
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Example data for October 2025 (month is 0-indexed, so 9 is October)
  if (year === 2025 && month === 9) {
    return {
      '2025-10-25': 20, // Full
      '2025-10-26': 18, // 2 slots remaining
    }
  }
  return {} // Return empty for other months
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
    // Optionally, you can add user-facing error handling here
  } finally {
    isLoading.value = false
  }
}

// --- Lifecycle & Watchers ---
onMounted(() => {
  fetchAvailabilityForCurrentMonth()
})

// Re-fetch data when the user navigates to a new month
watch(currentDate, () => {
  fetchAvailabilityForCurrentMonth()
})

// Update the v-model parent component when the date or time changes
watch([selectedDate, selectedHour, selectedMinute], () => {
  if (selectedDate.value) {
    const newDateTime = new Date(selectedDate.value)
    newDateTime.setHours(selectedHour.value, selectedMinute.value, 0, 0)
    emit('update:modelValue', newDateTime)
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
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7 // 0=Monday, 6=Sunday

  const daysArray: Day[] = []

  // 1. Days from the previous month
  for (let i = startDayOfWeek; i > 0; i--) {
    const date = new Date(year, month, 1 - i)
    daysArray.push({ date, isCurrentMonth: false, isToday: false, isSelected: false })
  }

  // 2. Days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set time to midnight for accurate date comparison

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    const dateString = date.toISOString().slice(0, 10) // 'YYYY-MM-DD'

    const slotsTaken = dailySlots.value[dateString] || 0
    const isFull = slotsTaken >= DAILY_LIMIT
    const isPast = date < today

    daysArray.push({
      date,
      isCurrentMonth: true,
      isToday: date.toDateString() === new Date().toDateString(),
      isSelected: selectedDate.value
        ? date.toDateString() === selectedDate.value.toDateString()
        : false,
      slotsRemaining: DAILY_LIMIT - slotsTaken,
      isFull,
      isPast,
    })
  }

  // 3. Days from the next month to fill the grid
  const remainingSlots = 42 - daysArray.length
  for (let i = 1; i <= remainingSlots; i++) {
    const date = new Date(year, month + 1, i)
    daysArray.push({ date, isCurrentMonth: false, isToday: false, isSelected: false })
  }

  return daysArray
})

// --- Methods ---
function previousMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

function nextMonth() {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

function selectDate(day: Day) {
  // Prevent selection if the day is not in the current month, is full, or is in the past
  if (!day.isCurrentMonth || day.isFull || day.isPast) return
  selectedDate.value = day.date
}
</script>

<style scoped>
/* Add any component-specific styles here if needed. */
/* For example, to ensure the spinner icon is centered */
button i.fa-spinner {
  width: 1em;
  height: 1em;
}
</style>

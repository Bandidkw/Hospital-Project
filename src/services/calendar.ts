export interface Day {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  slotsRemaining?: number
  isFull?: boolean
  isPast?: boolean
}

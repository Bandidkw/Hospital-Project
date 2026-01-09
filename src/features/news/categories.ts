// src/features/news/categories.ts
export type CategoryKey =
  | 'activity' // กิจกรรม
  | 'procurement' // ประกวดราคา/จัดซื้อ/จัดจ้าง
  | 'recruitment' // ข่าวรับสมัคร
  | 'forms' // แบบฟอร์ม/คู่มือบริการ
  | 'staff' // ข่าวสำหรับบุคลากร
  | 'general' // ทั่วไป (fallback)

export const CATEGORY_LIST: {
  key: CategoryKey
  label: string
  icon: string
  color: string
  classes: {
    bg: string
    text: string
    border: string
    badge: string
    shadow: string
    icon: string
  }
}[] = [
  {
    key: 'activity',
    label: 'กิจกรรมโรงพยาบาล',
    icon: 'fas fa-hospital-user',
    color: 'blue',
    classes: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-500',
      badge: 'bg-blue-50 text-blue-600',
      shadow: 'shadow-blue-200',
      icon: 'bg-blue-500',
    },
  },
  {
    key: 'procurement',
    label: 'ประกวดจัดซื้อ/จัดจ้าง',
    icon: 'fas fa-file-invoice-dollar',
    color: 'amber',
    classes: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-500',
      badge: 'bg-amber-50 text-amber-600',
      shadow: 'shadow-amber-200',
      icon: 'bg-amber-500',
    },
  },
  {
    key: 'recruitment',
    label: 'ข่าวรับสมัคร',
    icon: 'fas fa-user-plus',
    color: 'purple',
    classes: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-500',
      badge: 'bg-purple-50 text-purple-600',
      shadow: 'shadow-purple-200',
      icon: 'bg-purple-500',
    },
  },
  {
    key: 'forms',
    label: 'แบบฟอร์ม/คู่มือบริการ',
    icon: 'fas fa-file-alt',
    color: 'emerald',
    classes: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-500',
      badge: 'bg-emerald-50 text-emerald-600',
      shadow: 'shadow-emerald-200',
      icon: 'bg-emerald-500',
    },
  },
  {
    key: 'staff',
    label: 'ข่าวสำหรับบุคลากร รพ.',
    icon: 'fas fa-users-cog',
    color: 'rose',
    classes: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-500',
      badge: 'bg-rose-50 text-rose-600',
      shadow: 'shadow-rose-200',
      icon: 'bg-rose-500',
    },
  },
  {
    key: 'general',
    label: 'ข่าวทั่วไป',
    icon: 'fas fa-globe',
    color: 'slate',
    classes: {
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-500',
      badge: 'bg-slate-100 text-slate-600',
      shadow: 'shadow-slate-200',
      icon: 'bg-slate-500',
    },
  },
]

// --- กฎคีย์เวิร์ด
const KW = {
  activity: ['กิจกรรม', 'งาน', 'ประชุม', 'อบรม', 'รณรงค์', 'งานวัน', 'เชิญชวน'],
  procurement: ['ประกวดราคา', 'จัดซื้อ', 'จัดจ้าง', 'e-bidding', 'สอบราคา', 'TOR', 'ราคากลาง'],
  recruitment: ['สมัคร', 'รับสมัคร', 'บรรจุ', 'ตำแหน่ง', 'สอบคัดเลือก', 'ประกาศรายชื่อ'],
  forms: ['แบบฟอร์ม', 'คำขอ', 'คู่มือ', 'แนวทาง', 'เอกสาร'],
  staff: ['บุคลากร', 'เจ้าหน้าที่', 'ภายใน', 'เวร', 'แจ้งพนักงาน'],
}

// --- override เฉพาะไอดีข่าว (ถ้าต้องการ fix รายข่าว)
export const CATEGORY_OVERRIDES: Record<string /*newsId*/, CategoryKey> = {
  // '123': 'procurement',
}

export type MinimalNews = {
  id: string
  title: string
  content?: string | null
  excerpt?: string | null
  // ฟิลด์เสริมเพื่อ sort/แสดง
  date: string
  createdAt?: string
  updatedAt?: string
  imageUrl?: string | null
  // บาง environment backend ยังไม่ส่ง isPublished → ให้ optional
  isPublished?: boolean
}

export function inferCategory(n: MinimalNews): CategoryKey {
  // 1) ใช้ override ก่อน
  if (CATEGORY_OVERRIDES[n.id]) return CATEGORY_OVERRIDES[n.id]

  const hay = `${n.title} ${n.excerpt ?? ''} ${n.content ?? ''}`.toLowerCase()

  const hit = (list: string[]) => list.some((k) => hay.includes(k.toLowerCase()))

  if (hit(KW.procurement)) return 'procurement'
  if (hit(KW.recruitment)) return 'recruitment'
  if (hit(KW.forms)) return 'forms'
  if (hit(KW.staff)) return 'staff'
  if (hit(KW.activity)) return 'activity'
  return 'general'
}

// ในไฟล์ categories.ts
export function attachCategory<T extends MinimalNews & { category?: string }>(items: T[]) {
  return items.map((i) => ({
    ...i,
    category: (i.category as CategoryKey) || inferCategory(i),
  }))
}

export function getSortTime(n: { updatedAt?: string; createdAt?: string; date?: string }) {
  return new Date(n.updatedAt || n.createdAt || n.date || 0).getTime()
}

/** กันล้มถ้า backend ยังไม่ส่ง isPublished: null/undefined → ถือเป็นเผยแพร่แล้ว หรือกำหนดเป็น false ก็ได้ */
export function isPublishedSafe(n: { isPublished?: boolean }): boolean {
  // เลือกแบบนี้: ถ้าไม่มีฟิลด์ ให้ถือว่า "เผยแพร่แล้ว" เพื่อไม่หายจากหน้าเว็บชั่วคราว
  return n.isPublished ?? true
  // ถ้าอยากเข้มงวด: return !!n.isPublished
}

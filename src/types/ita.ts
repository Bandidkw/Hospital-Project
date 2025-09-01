export interface ItaDocument {
  id: string
  moit_id?: string
  topic_id?: string
  title: string
  description?: string
  sub_topic: string
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'Q4' | string
  fileName?: string
  fileUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface YearItaLite {
  id: string
  year?: string
  title?: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface Moit {
  id: string
  moit_name: string
  title: string
  description?: string
  createdAt: string
  updatedAt: string
  year_ita_id?: string // จาก /ita/year-moit/:yearId
  year_ita?: YearItaLite | null // จาก /moit/year/:moitId
  documents?: ItaDocument[] | null

  /** @deprecated: ของเดิมในโปรเจ็ค */
  ita_topic_id?: string
}

export interface YearIta {
  id: string
  year: string
  title?: string
  description?: string
  createdAt: string
  updatedAt: string
  moits: Moit[]
}

export const getMoitYearId = (moit: Moit): string | undefined => {
  if (moit.year_ita_id) return moit.year_ita_id
  if (moit.year_ita?.id) return moit.year_ita.id
  return moit.ita_topic_id
}

export const assertMoitYearId = (moit: Moit): string => {
  const id = getMoitYearId(moit)
  if (!id) throw new Error('yearId is required (missing in moit)')
  return id
}

// src/types/ita.ts
export interface MoitWithYear extends Moit {
  year_ita: YearItaLite | null
  documents?: ItaDocument[] | null
}

// ชื่อไฟล์: src/types/ita.ts
export interface ItaDocument {
  id: string
  topic_id: string
  title: string
  description?: string
  quarter: 1 | 2 | 3 | 4
  sub_topic: string
  fileName: string
  fileUrl: string
  createdAt: string
  updatedAt: string
}

export interface Moit {
  id: string
  ita_topic_id: string
  moit_name: string
  title: string
  description?: string
  documents: ItaDocument[]
  createdAt: string
  updatedAt: string
}

export interface YearIta {
  id: string
  year: string
  title?: string
  description?: string
  moits: Moit[]
  createdAt: string
  updatedAt: string
}

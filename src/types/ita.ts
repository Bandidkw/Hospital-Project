// ชื่อไฟล์: src/types/ita.ts
export interface ItaDocument {
  id: string;
  topic_id: string;
  title: string;
  description?: string;
  quarter: 1 | 2 | 3 | 4;
  sub_topic: string;
  fileName: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Moit {
  id: string; // UUID
  ita_topic_id: string;
  moit_name: string; // เช่น "MOIT 1"
  title: string; // ชื่อเต็ม
  description?: string;
  documents: ItaDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface YearIta {
  id: string; // UUID
  year: string;
  title?: string;
  description?: string;
  moits: Moit[];
  createdAt: string;
  updatedAt: string;
}

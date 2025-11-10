// ใน src/types/complaint.ts

export type ComplaintStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED'

export interface ComplaintItem {
  id: string
  subject: string
  detail: string
  reporterName?: string
  reporterContact?: string
  status: ComplaintStatus
  createdAt: string
}

export interface ComplaintCreationData {
  subject: string
  detail: string
  reporterName?: string
  reporterContact: string
}

export interface ActivityLog {
  id: number | string
  user_name: string
  action_type: 'CREATE' | 'UPDATE' | 'DELETE'
  target_type: string
  target_name?: string
  details?: string
  createdAt: string
}

// src/services/apiService.ts
import axios, { type AxiosError, type AxiosInstance, type AxiosRequestHeaders } from 'axios'

type BackendErrorPayload = {
  status?: number
  name?: string
  description?: string
  error?: boolean
  message?: string
  data?: unknown
}

/** สร้าง baseURL แบบ "กันพลาด" */
function buildApiBase(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL || '').trim()
  if (!raw) throw new Error('VITE_API_BASE_URL is not defined')

  // ตัด slash ท้ายทั้งหมด
  const base = raw.replace(/\/+$/, '')

  // ถ้า .env ใส่มาแล้วเป็น /api หรือ /api/v1 ไม่ต้องเติมซ้ำ
  if (/(\/api(\/v\d+)?)$/i.test(base)) return base

  // ปกติเติม /api/v1
  return base + '/api/v1'
}

const API_BASE = buildApiBase()

// อ่าน withCredentials จาก .env (default: false)
const WITH_CREDENTIALS =
  String(import.meta.env.VITE_WITH_CREDENTIALS || '').toLowerCase() === 'true'

const apiService: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: WITH_CREDENTIALS,
  timeout: 30000,
})

// log ครั้งเดียวช่วย debug baseURL & withCredentials
if (import.meta.env.DEV) {
  console.debug('[apiService] baseURL =', API_BASE, 'withCredentials =', WITH_CREDENTIALS)
}

export function isAxiosError<T = unknown>(err: unknown): err is AxiosError<T> {
  return axios.isAxiosError(err)
}

apiService.interceptors.request.use((config) => {
  const headers = (config.headers ?? {}) as AxiosRequestHeaders

  const token = sessionStorage.getItem('token') || localStorage.getItem('token')
  if (token) headers.Authorization = `Bearer ${token}`

  // ถ้า payload เป็น FormData -> อย่ากำหนด Content-Type เอง (boundary จะหาย)
  if (config.data instanceof FormData) {
    if ('Content-Type' in headers) delete headers['Content-Type']
  } else {
    // JSON ทั่วไป
    if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'
  }

  config.headers = headers
  return config
})

apiService.interceptors.response.use(
  (res) => res,
  (err: unknown) => {
    if (isAxiosError<BackendErrorPayload>(err)) {
      const code = err.response?.status
      const body = err.response?.data
      const msg =
        body?.description ??
        body?.message ??
        (code ? `HTTP ${code}` : err.message) ??
        'Request failed'
      return Promise.reject(new Error(msg))
    }
    if (err instanceof Error) return Promise.reject(err)
    return Promise.reject(new Error('Unknown error'))
  },
)

export default apiService

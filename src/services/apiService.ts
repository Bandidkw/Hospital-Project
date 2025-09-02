// src/services/apiService.ts
import axios, {
  type AxiosError,
  type AxiosInstance,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios'

/** -------------------------------
 *  ชนิดช่วย (หลีกเลี่ยง any)
 *  ------------------------------- */
type BackendErrorPayload = {
  status?: number
  name?: string
  description?: string
  error?: boolean
  message?: string
  data?: unknown
}

type AxiosErrorWithMessage<T = unknown> = AxiosError<T> & {
  userMessage?: string
}

interface HtmlResponseError extends Error {
  status?: number
  url?: string
}

/** -------------------------------
 *  Base URL builder
 *  ------------------------------- */
function buildApiBase(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL || '').trim()
  if (!raw) {
    if (import.meta.env.DEV) {
      console.warn('[apiService] VITE_API_BASE_URL is not defined. Fallback to /api/v1')
    }
    return '/api/v1'
  }
  const base = raw.replace(/\/+$/, '')
  if (/(\/api(\/v\d+)?)$/i.test(base)) return base
  return base + '/api/v1'
}

const API_BASE = buildApiBase()
const WITH_CREDENTIALS =
  String(import.meta.env.VITE_WITH_CREDENTIALS || '').toLowerCase() === 'true'

/** -------------------------------
 *  Axios Instance
 *  ------------------------------- */
const apiService: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: WITH_CREDENTIALS,
  timeout: 30000,
})

/** -------------------------------
 *  Helpers
 *  ------------------------------- */
function getToken(): string | null {
  return localStorage.getItem('token')
}

export function isAxiosError<T = unknown>(err: unknown): err is AxiosError<T> {
  return axios.isAxiosError(err)
}

function toUserMessage(status?: number, backendMsg?: string) {
  if (status === 401) return 'กรุณาเข้าสู่ระบบใหม่'
  if (status === 403) return 'คุณไม่มีสิทธิ์เข้าถึงส่วนนี้'
  if (status === 404) return 'ไม่พบข้อมูลที่ขอ'
  if (status && status >= 500) return 'ระบบขัดข้องชั่วคราว โปรดลองใหม่ภายหลัง'
  return backendMsg || 'เกิดข้อผิดพลาดที่ไม่คาดคิด'
}

/** -------------------------------
 *  Request Interceptor
 *  ------------------------------- */
apiService.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // บังคับ headers เป็น AxiosHeaders เสมอ (Axios v1)
    const headers = (config.headers = AxiosHeaders.from(config.headers))

    const token = getToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData
    if (isFormData) {
      // ปล่อยให้ axios ตั้ง boundary เอง
      headers.delete('Content-Type')
    } else if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    headers.set('X-Request-Id', Math.random().toString(36).slice(2, 10))

    if (import.meta.env.DEV) {
      console.debug('[apiService] →', config.method?.toUpperCase(), config.url)
    }

    return config
  },
  (error) => Promise.reject(error),
)

/** -------------------------------
 *  Response Interceptor
 *  ------------------------------- */
apiService.interceptors.response.use(
  (res) => {
    // debug + ตรวจ content-type แบบ type-safe (ไม่มี any)
    const headersRecord = res.headers as unknown as Record<string, unknown>
    const ct = String(headersRecord['content-type'] ?? '')

    if (import.meta.env.DEV) {
      console.debug('[apiService] ←', res.status, res.config?.url, 'ct=', ct)
    }

    // ถ้าได้ HTML แทน JSON ให้เด้ง error พร้อมข้อมูลประกอบ
    if (ct.includes('text/html')) {
      const htmlErr: HtmlResponseError = new Error('Server returned HTML (not JSON)')
      htmlErr.status = res.status
      htmlErr.url = `${res.config?.baseURL ?? ''}${res.config?.url ?? ''}`
      return Promise.reject(htmlErr)
    }

    return res
  },
  (err) => {
    // คง AxiosError เดิมไว้ และแนบ userMessage แบบ type-safe
    if (axios.isAxiosError<BackendErrorPayload>(err)) {
      const code = err.response?.status
      const backendMsg =
        err.response?.data?.description || err.response?.data?.message || err.message

      const ax = err as AxiosErrorWithMessage<BackendErrorPayload>
      ax.userMessage = toUserMessage(code, backendMsg)
      return Promise.reject(ax)
    }
    return Promise.reject(new Error('เกิดข้อผิดพลาดที่ไม่คาดคิด'))
  },
)

export default apiService

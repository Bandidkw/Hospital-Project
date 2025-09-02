// src/services/apiService.ts
import axios, {
  type AxiosError,
  type AxiosInstance,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios'

/** -------- Base URL -------- */
const HARD_CODED_BASE = 'https://test-hospital-project-backend.wnimqo.easypanel.host/api/v1'

function buildApiBase(): string {
  const raw = (import.meta.env.VITE_API_BASE_URL || '').trim()
  if (!raw) return HARD_CODED_BASE
  const base = raw.replace(/\/+$/, '')
  // ถ้า base ลงท้ายด้วย /api หรือ /api/vN อยู่แล้วก็ใช้ตามนั้น
  if (/(\/api(\/v\d+)?)$/i.test(base)) return base
  return base + '/api/v1'
}

const API_BASE_URL = buildApiBase()

/** -------- Axios instance -------- */
const apiService: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

/** -------- Helpers -------- */
export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error)
}

/** -------- Interceptors -------- */
apiService.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ให้ headers เป็น AxiosHeaders เสมอ (type-safe กับ Axios v1)
    const headers = (config.headers = AxiosHeaders.from(config.headers))

    // แนบ Bearer token ถ้ามี
    const token = localStorage.getItem('token')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    // อย่าตั้ง Content-Type เองถ้าเป็น FormData (ปล่อยให้ axios ใส่ boundary)
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData
    if (isFormData) {
      headers.delete('Content-Type')
    } else if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    headers.set('X-Request-Id', Math.random().toString(36).slice(2, 10))

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug(
        '[apiService] →',
        config.method?.toUpperCase(),
        config.url,
        'base=',
        config.baseURL,
      )
    }
    return config
  },
  (error) => Promise.reject(error),
)

apiService.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // eslint-disable-next-line no-console
      console.error('Unauthorized access - token might be expired or invalid.')
    }
    return Promise.reject(error)
  },
)

export default apiService

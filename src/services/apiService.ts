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

const apiService: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: WITH_CREDENTIALS,
  timeout: 30000,
})

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

  if (config.data instanceof FormData) {
    // อย่าตั้ง Content-Type เองสำหรับ FormData (boundary จะหาย)
    if ('Content-Type' in headers) delete headers['Content-Type']
  } else {
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

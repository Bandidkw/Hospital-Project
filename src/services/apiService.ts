// src/services/apiService.ts
import axios, { type AxiosError, type AxiosInstance, type AxiosRequestHeaders } from 'axios'

/** Payload error มาตรฐานจาก backend (ไม่มี any) */
type BackendErrorPayload = {
  status?: number
  name?: string
  description?: string
  error?: boolean
  message?: string
  data?: unknown
}

const RAW_BASE = import.meta.env.VITE_API_BASE_URL || ''
const API_BASE = RAW_BASE.replace(/\/+$/, '') + '/api/v1'

const apiService: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 30000,
})

/** type guard: แทนการใช้ any บน AxiosError */
export function isAxiosError<T = unknown>(err: unknown): err is AxiosError<T> {
  return axios.isAxiosError(err)
}

/** Request interceptor: แนบ token และจัดการ header ของ FormData */
apiService.interceptors.request.use((config) => {
  const headers = (config.headers ?? {}) as AxiosRequestHeaders

  const token = sessionStorage.getItem('token') || localStorage.getItem('token')
  if (token) headers.Authorization = `Bearer ${token}`

  // ถ้าเป็น FormData ให้ลบ Content-Type ออก ปล่อย browser ตั้ง boundary เอง
  if (config.data instanceof FormData) {
    if ('Content-Type' in headers) delete headers['Content-Type']
  } else if (!headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  config.headers = headers
  return config
})

/** Response interceptor: ไม่มี any */
apiService.interceptors.response.use(
  (res) => res,
  (err: unknown) => {
    if (isAxiosError<BackendErrorPayload>(err)) {
      const msg =
        err.response?.data?.description ??
        err.response?.data?.message ??
        err.message ??
        'Request failed'
      return Promise.reject(new Error(msg))
    }
    // non-Axios error
    if (err instanceof Error) return Promise.reject(err)
    return Promise.reject(new Error('Unknown error'))
  },
)

export default apiService

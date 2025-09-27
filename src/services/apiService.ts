// src/services/apiService.ts
import axios, {
  type AxiosError,
  type AxiosInstance,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  'https://test-hospital-project-backend.wnimqo.easypanel.host/api/v1'

const apiService: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/** ---------------- helpers (ภายในไฟล์เท่านั้น) ---------------- */
function pickTokenFromStorage(): string | null {
  const raw = sessionStorage.getItem('token')
  if (!raw) return null

  // กรณีบางโปรเจ็กต์เผลอเก็บเป็น JSON เช่น {"accessToken":"..."} หรือ {"token":"..."}
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const maybe =
      (parsed.accessToken as string) ??
      (parsed.token as string) ??
      (parsed.jwt as string) ??
      (parsed.idToken as string)
    if (maybe) return maybe.trim()
  } catch {
    /* not JSON */
  }

  return raw.trim().replace(/^"|"$/g, '')
}

function buildAuthHeader(): string | null {
  const token = pickTokenFromStorage()
  if (!token) return null
  // กันเคสที่เก็บมาเป็น "Bearer xxxxx" อยู่แล้ว
  return token.toLowerCase().startsWith('bearer ') ? token : `Bearer ${token}`
}

/** ---------------- interceptors ---------------- */
apiService.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const headers = (config.headers = AxiosHeaders.from(config.headers))

    // ใส่ Authorization
    const auth = buildAuthHeader()
    if (auth) headers.set('Authorization', auth)

    // จัดการ Content-Type ให้เหมาะกับ payload
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData
    if (isFormData) {
      headers.delete('Content-Type') // ให้ axios ตั้ง boundary เอง
    } else if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    // ช่วยดีบักใน DEV
    if (import.meta.env?.DEV) {
      const method = (config.method ?? 'get').toUpperCase()
      console.debug('[api] →', method, (config.baseURL ?? '') + (config.url ?? ''))
      console.debug('[api] auth header:', headers.has('Authorization') ? 'present' : 'missing')
    }

    return config
  },
  (error) => Promise.reject(error),
)

apiService.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('[api] 401 Unauthorized - token invalid or expired.')
      // ถ้าอยากบังคับให้ออกจากระบบ ให้เปิดสองบรรทัดด้านล่าง
      // localStorage.removeItem('token')
      // window.location.assign('/login')
    }
    return Promise.reject(error)
  },
)

export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error)
}

export default apiService

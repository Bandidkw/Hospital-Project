// src/services/apiService.ts
import axios, {
  type AxiosError,
  type AxiosInstance,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios'

// กำหนด Base URL ของ Backend API (คงเดิม)
const API_BASE_URL = 'https://test-hospital-project-backend.wnimqo.easypanel.host/api/v1'

const apiService: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✅ ปรับให้เข้ากับ Axios v1 โดยไม่เปลี่ยนตัวแปรเดิม
apiService.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ให้ headers เป็น AxiosHeaders เสมอ (type-safe)
    const headers = (config.headers = AxiosHeaders.from(config.headers))

    const token = localStorage.getItem('token')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    // ถ้าเป็น FormData ให้ลบ Content-Type ออก ปล่อยให้ axios ใส่ boundary เอง
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData
    if (isFormData) {
      headers.delete('Content-Type')
    } else if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    return config
  },
  (error) => Promise.reject(error),
)

apiService.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - token might be expired or invalid.')
    }
    return Promise.reject(error)
  },
)

export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error)
}

export default apiService

// src/services/apiService.ts
import axios, {
  type AxiosError,
  type AxiosInstance,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from 'axios'

// กำหนด Base URL ของ Backend API
const API_BASE_URL = 'https://test-hospital-project-backend.wnimqo.easypanel.host/api/v1'

const apiService: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiService.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const headers = (config.headers = AxiosHeaders.from(config.headers))
    const token = localStorage.getItem('token')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

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

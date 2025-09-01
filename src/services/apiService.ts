import axios, { AxiosError } from 'axios'
import type { AxiosInstance } from 'axios'

// กำหนด Base URL ของ Backend API
const API_BASE_URL = 'https://test-hospital-project-backend.wnimqo.easypanel.host/api/v1'

const apiService: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
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

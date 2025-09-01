// src/services/apiService.ts
import axios, { AxiosError, type AxiosInstance } from 'axios'

type EnvShape = { env: { VITE_API_BASE_URL?: string } }
const ORIGIN = ((import.meta as unknown as EnvShape).env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
// API อยู่ใต้ /api/v1
const API_BASE_URL = `${ORIGIN}/api/v1`

const apiService: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// inject token
apiService.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// unwrap / error handling คร่าว ๆ
apiService.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized (401): token อาจหมดอายุ/ไม่ถูกต้อง')
    }
    return Promise.reject(error)
  },
)

export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error)
}

export default apiService

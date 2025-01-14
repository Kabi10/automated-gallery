import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { logger } from '../config/logger'

// API response interface
interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
}

// Error interface
interface ApiError {
  message: string
  code: string
  status: number
}

// Create a custom axios instance
const createApiClient = (config: AxiosRequestConfig): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  })

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = process.env.API_TOKEN
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      logger.error(`API request error: ${error}`)
      return Promise.reject(error)
    }
  )

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse): ApiResponse => {
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      }
    },
    (error) => {
      const apiError: ApiError = {
        message: error.response?.data?.message || 'An unexpected error occurred',
        code: error.response?.data?.code || 'UNKNOWN_ERROR',
        status: error.response?.status || 500,
      }
      logger.error(`API response error: ${JSON.stringify(apiError)}`)
      return Promise.reject(apiError)
    }
  )

  return client
}

// Create default client instance
const apiClient = createApiClient({})

// Export helper methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.get<any, ApiResponse<T>>(url, config),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<any, ApiResponse<T>>(url, data, config),
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<any, ApiResponse<T>>(url, data, config),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<any, ApiResponse<T>>(url, config),
}

export type { ApiResponse, ApiError }
export { createApiClient }
export default api 
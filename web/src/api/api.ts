import axios, { type AxiosInstance } from 'axios'
import { toast } from 'sonner'

const BASE_URL = import.meta.env.VITE_BASE_URL

export const api: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: BASE_URL,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.', {
          id: 'server-error',
          duration: 5000,
        })
      }
    }

    return Promise.reject(error)
  },
)

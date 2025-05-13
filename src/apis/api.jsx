import { baseUrl } from '@/config/Env'
import axios from 'axios'

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export const setUpInterceptors = () => {
  api.interceptors.request.use(
    (config) => {
      const accessToken = sessionStorage.getItem('accessToken')
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )
}

export default api

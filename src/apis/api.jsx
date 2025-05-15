import { baseUrl } from '@/config/Env'
import axios from 'axios'

/**axios 공통 API 인스턴스 */
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

/**API 요청 전/후로 처리하는 Interceptor */
export const setUpInterceptors = () => {
  /**저장된 Access Token이 있을 경우 요청의 헤더에 추가 */
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

setUpInterceptors()

export default api

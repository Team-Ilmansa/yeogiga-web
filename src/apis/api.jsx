import { baseUrl } from '@/config/Env'
import axios from 'axios'
import reissueAccessTokenApi from './authentication/reissueAccessTokenApi'
import { callLogout } from './authentication/logoutHandler'

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
      if (accessToken && !config.url.includes('/auth/reissue')) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  /**토큰 만료 시 refresh Token을 이용하여 Access Token 재발급 */
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        try {
          const result = await reissueAccessTokenApi()
          const newAccessToken = result.data.accessToken
          sessionStorage.setItem('accessToken', newAccessToken)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          console.log('토큰 만료로 인해 재발급합니다..')
          return api(originalRequest)
        } catch (err) {
          console.error('토큰 재발급 실패: ', err)
          callLogout()
        }
      }
      return Promise.reject(error)
    },
  )
}

setUpInterceptors()

export default api

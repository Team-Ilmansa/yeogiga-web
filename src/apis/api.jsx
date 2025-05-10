import { baseUrl } from '@/config/Env'
import axios from 'axios'

const api = axios.create({
  // TODO: 환경 변수로 설정하여 baseURL 숨기기
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export default api

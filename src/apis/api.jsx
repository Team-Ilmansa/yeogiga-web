import { baseUrl } from '@/config/Env'
import axios from 'axios'

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export default api

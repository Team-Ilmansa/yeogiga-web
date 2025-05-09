import axios from 'axios'

const api = axios.create({
  // ToDo: 환경 변수로 설정하여 baseURL 숨기기
  baseURL: 'http://api.yeogiga.com:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export default api

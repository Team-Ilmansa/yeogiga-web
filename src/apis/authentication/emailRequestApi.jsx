import api from '@/apis/api'

/**이메일 인증 번호 발송 요청 API */
const emailRequestApi = async (body) => {
  try {
    const response = await api.post('auth/email-verification/request', body)
    return response.data
  } catch (err) {
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message)
    } else if (err.response) {
      throw new Error(`오류 발생 (status: ${err.response.status})`)
    } else if (err.request) {
      throw new Error('서버로부터 응답이 없습니다.')
    } else {
      throw new Error('요청 중 알 수 없는 오류가 발생했습니다.')
    }
  }
}

export default emailRequestApi

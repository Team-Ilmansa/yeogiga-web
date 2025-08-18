import api from '@/apis/api'

/**게스트 회원 등록 API - 최초 소셜 로그인 시 닉네임 설정 */
const putGuestApi = async (body) => {
  try {
    const response = await api.put('oauth/register', body, {
      headers: { device: 'WEB' },
    })
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

export default putGuestApi

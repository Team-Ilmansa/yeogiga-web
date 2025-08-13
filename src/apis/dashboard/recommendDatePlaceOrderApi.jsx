import api from '@/apis/api'

/**일자별 장소 순서 추천 API */
const recommendDatePlaceOrderApi = async (tripId, day) => {
  try {
    const response = await api.put(`trip/${tripId}/days/${day}/places/sort`)
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

export default recommendDatePlaceOrderApi

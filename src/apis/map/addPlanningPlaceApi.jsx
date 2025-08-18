import api from '@/apis/api'
import { prodBaseUrl } from '@/config/Env'

/**여행 확정 후 일정에 장소 추가 API */
const addPlanningPlaceApi = async (tripId, tripDayPlaceId, body) => {
  try {
    const response = await api.post(
      `${prodBaseUrl}trip/${tripId}/day-place/${tripDayPlaceId}/places`,
      body,
    )
    return response.data
  } catch (err) {
    if (err.response?.data?.message) {
      throw err.response.data
    } else if (err.response) {
      throw new Error(`오류 발생 (status: ${err.response.status})`)
    } else if (err.request) {
      throw new Error('서버로부터 응답이 없습니다.')
    } else {
      throw new Error('요청 중 알 수 없는 오류가 발생했습니다.')
    }
  }
}

export default addPlanningPlaceApi

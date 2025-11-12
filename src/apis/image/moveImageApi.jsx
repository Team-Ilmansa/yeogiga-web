import api from '@/apis/api'

// 사진 매칭된 장소 변경 API

/**
 * 매칭된 이미지를 다른 날짜 목적지 to 목적지로 이동하는 API
 * @param {number} tripId - 여행 ID
 * @param {object} data - 요청 본문
 * @param {string} data.fromTripDayPlaceId - 이미지가 이동될 출발 여행 일자 장소 ID
 * @param {string} data.fromPlaceId - 이미지가 이동될 출발 장소 ID
 * @param {string} data.toTripDayPlaceId - 이미지가 이동될 도착 여행 일자 장소 ID
 * @param {string} data.toPlaceId - 이미지가 이동될 도착 장소 ID
 * @param {string} data.imageId - 이동할 이미지 ID
 * @returns {Promise<any>} API 응답 데이터
 */
export const moveMatchedToMatched = async (tripId, data) => {
  try {
    const response = await api.patch(`trip/${tripId}/images/move`, data)
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

/**
 * 매칭된 이미지를 같은 날짜 목적지에서 unmatched(기타)로 이동하는 API
 * @param {number} tripId - 여행 ID
 * @param {string} tripDayPlaceId - 여행 일차 ID
 * @param {object} data - 요청 본문
 * @param {string} data.placeId - 이미지가 이동될 출발 장소 ID
 * @param {string} data.imageId - 이동할 이미지 ID
 * @returns {Promise<any>} API 응답 데이터
 */
export const moveMatchedToUnmatched = async (tripId, tripDayPlaceId, data) => {
  try {
    const response = await api.patch(
      `trip/${tripId}/day-place/${tripDayPlaceId}/images/unmatch`,
      data,
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

/**
 * 매칭된 이미지를 같은 날짜 unmatched(기타)에서 목적지로 이동하는 API
 * @param {number} tripId - 여행 ID
 * @param {string} tripDayPlaceId - 여행 일차 ID
 * @param {object} data - 요청 본문
 * @param {string} data.placeId - 이미지가 이동될 도착 장소 ID
 * @param {string} data.imageId - 이동할 이미지 ID
 * @returns {Promise<any>} API 응답 데이터
 */
export const moveUnmatchedToMatched = async (tripId, tripDayPlaceId, data) => {
  try {
    const response = await api.patch(
      `trip/${tripId}/day-place/${tripDayPlaceId}/images/rematch`,
      data,
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

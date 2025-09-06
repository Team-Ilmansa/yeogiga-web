import api from '@/apis/api'

/**임시 등록 이미지 삭제 API */
const deleteTemporaryImagesApi = async (tripId, tempPlaceImageId, body) => {
  console.log(body)
  try {
    const response = await api.delete(
      `trip/${tripId}/day-place/temp-images/${tempPlaceImageId}`,
      { data: body },
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

export default deleteTemporaryImagesApi

import readTripInfoApi from '@/apis/trip/readTripInfo'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import TripUpdateCalendar from '@/components/trip/TripUpdateCalendar'

/**개인 일정 수정을 위한 W2M 페이지 */
const UpdateCalendar = () => {
  const { tripId } = useParams()
  const [tripInfo, setTripInfo] = useState()

  useEffect(() => {
    /**여행 정보 조회 API 호출 */
    const fetchTripInfo = async () => {
      try {
        const result = await readTripInfoApi(tripId)
        setTripInfo(result.data)
      } catch (err) {
        alert(err.message)
      }
    }

    if (tripId) fetchTripInfo()
  }, [tripId])

  return <TripUpdateCalendar tripInfo={tripInfo} />
}

export default UpdateCalendar

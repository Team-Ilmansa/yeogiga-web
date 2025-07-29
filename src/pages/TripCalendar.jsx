import FirstCalendar from '@/components/trip/FirstCalendar'
import readTripInfoApi from '@/apis/trip/readTripInfo'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

/**개인 일정 등록을 위한 W2M 페이지 */
const TripCalendar = () => {
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
  }, [])

  return <FirstCalendar tripInfo={tripInfo} />
}

export default TripCalendar

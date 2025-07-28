import readTripInfoApi from '@/apis/trip/readTripInfo'
import TripConfirmCalendar from '@/components/trip/TripConfirmCalendar'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

/**일정 확정용 W2M 페이지 */
const ConfirmCalendar = () => {
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

  return (
    <div className='w-full'>
      {tripInfo?.status === 'SETTING' && (
        <TripConfirmCalendar tripInfo={tripInfo} />
      )}
    </div>
  )
}

export default ConfirmCalendar

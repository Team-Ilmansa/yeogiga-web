import readTripInfoApi from '@/apis/trip/readTripInfo'
import TripCalendar from '@/components/trip/TripCalendar'
import TripInfo from '@/components/trip/TripInfo'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Trip = () => {
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
      {tripInfo?.status === 'SETTING' && <TripCalendar tripInfo={tripInfo} />}
      <TripInfo tripInfo={tripInfo} />
    </div>
  )
}

export default Trip

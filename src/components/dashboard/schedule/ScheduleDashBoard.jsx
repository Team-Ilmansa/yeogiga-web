import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import readTripInfoApi from '@/apis/trip/readTripInfo'
import DayTabs from './DayTabs'

const ScheduleDashBoard = () => {
  const { tripId } = useParams()
  const [tripInfo, setTripInfo] = useState(null)

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const result = await readTripInfoApi(tripId)
        setTripInfo(result.data)
      } catch (err) {
        alert('여행 정보를 불러오지 못했습니다.')
      }
    }

    fetchTrip()
  }, [tripId])

  if (!tripInfo) return null

  return <DayTabs startedAt={tripInfo.startedAt} endedAt={tripInfo.endedAt} />
}

export default ScheduleDashBoard

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import readTripInfoApi from '@/apis/trip/readTripInfo'
import DayTabs from './DayTabs'
import CalendarIcon from '@/assets/dashboard/CalendarIcon'

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

  if (tripInfo?.startedAt)
    return <DayTabs startedAt={tripInfo.startedAt} endedAt={tripInfo.endedAt} />
  else {
    return (
      <div className='mt-30 flex w-full flex-col items-center justify-center gap-5'>
        <CalendarIcon
          className={'h-[100px] w-[100px]'}
          color={'var(--Grey-Scale-grey-200)'}
        />
        <div className='text-2xl text-[var(--Grey-Scale-grey-200)]'>
          날짜 확정 후 일정을 추가할 수 있어요
        </div>
      </div>
    )
  }
}

export default ScheduleDashBoard

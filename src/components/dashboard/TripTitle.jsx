import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import readTripInfoApi from '@/apis/trip/readTripInfo'
import PinIcon from '@/assets/dashboard/PinIcon'
import CalendarIcon from '@/assets/dashboard/CalendarIcon'
import UserIcon from '@/assets/dashboard/UserIcon'

const TripTitle = ({ isScheduleConfirmed, setIsScheduleConfirmed }) => {
  const { tripId } = useParams()
  const [tripInfo, setTripInfo] = useState(null)

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const result = await readTripInfoApi(tripId)
        setTripInfo(result.data)

        if (result.data.startedAt) setIsScheduleConfirmed(true)
      } catch (err) {
        alert(err.message)
      }
    }

    fetchTrip()
  }, [tripId, setIsScheduleConfirmed])

  const statusTextMap = useMemo(
    () => ({
      SETTING: '준비중인 여행',
      PLANNED: '계획중인 여행',
      IN_PROGRESS: '진행중인 여행',
      COMPLETED: '종료된 여행',
    }),
    [],
  )

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('ko-KR').replace(/. /g, '. ').slice(0, -1)

  if (!tripInfo) return <p>여행 정보를 불러오는 중...</p>

  return (
    <div>
      <div>
        <div
          className='text-[14pt]'
          style={{ color: 'var(--Blue-Scale-blue-500)' }}
        >
          {statusTextMap[tripInfo.status]}
        </div>
        <div className='text-[28pt] font-bold'>{tripInfo.title}</div>
      </div>

      <div className='mt-4 flex flex-col gap-y-1 text-[14pt] text-gray-700'>
        <div className='flex items-center gap-2'>
          <PinIcon className='h-5 w-5' />
          <div>{tripInfo.city || '???'}</div>
        </div>
        <div className='flex items-center gap-2'>
          <CalendarIcon className='h-5 w-5' />
          <span>
            {isScheduleConfirmed
              ? `${formatDate(tripInfo.startedAt)} - ${formatDate(tripInfo.endedAt)}`
              : '???'}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <UserIcon className='h-5 w-5' />
          <ul className='flex gap-1'>
            {tripInfo.members.map((member) => (
              <li key={member.userId}>
                {member.imageUrl ? (
                  <img
                    src={member.imageUrl}
                    alt={member.nickname}
                    className='h-[20px] w-[20px] rounded-full object-cover'
                  />
                ) : (
                  <div className='h-[20px] w-[20px] rounded-full bg-gray-300' />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TripTitle

import readTripInfoApi from '@/apis/trip/readTripInfo'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PinIcon from '@/assets/dashboard/PinIcon'
import CalendarIcon from '@/assets/dashboard/CalendarIcon'
import UserIcon from '@/assets/dashboard/UserIcon'

const TripTitle = () => {
  const { tripId } = useParams()
  const [tripInfo, setTripInfo] = useState()
  const statusTextMap = {
    SETTING: '준비중인 여행',
    PLANNED: '계획중인 여행',
    PROGRESSED: '진행중인 여행',
    COMPLETE: '종료된 여행',
  }

  useEffect(() => {
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
    <div>
      {tripInfo ? (
        <div>
          {/* 상태 + 타이틀 */}
          <div>
            <div
              style={{ color: 'var(--Blue-Scale-blue-500)', fontSize: '14pt' }}
            >
              {statusTextMap[tripInfo.status]}
            </div>
            <div className='font-bold' style={{ fontSize: '28pt' }}>
              {tripInfo.title}
            </div>
          </div>

          <div
            className='mt-4 flex flex-col gap-y-1 text-sm text-gray-700'
            style={{ fontSize: '14pt' }}
          >
            {/* 위치 */}
            <div className='flex items-center gap-2'>
              <PinIcon className='h-5 w-5' />
              <div>{tripInfo.city || '???'}</div>
            </div>

            <div className='flex items-center gap-2'>
              <CalendarIcon className='h-5 w-5' />
              <span>
                {new Date(tripInfo.startedAt)
                  .toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                  .slice(0, -1)}{' '}
                -{' '}
                {new Date(tripInfo.endedAt)
                  .toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                  .slice(0, -1)}
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
      ) : (
        <p>여행 정보를 불러오는 중...</p>
      )}
    </div>
  )
}

export default TripTitle

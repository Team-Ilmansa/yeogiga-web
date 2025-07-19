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
    /**특정 여행 정보 조회 API 호출 */
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
          <div>
            <div
              style={{ color: 'var(--Blue-Scale-blue-500)', fontSize: '14pt' }}
            >
              {statusTextMap[tripInfo.status]}
            </div>
            <div className='font-bold' style={{ fontSize: '28pt' }}>
              {tripInfo.title}
            </div>
            <div className='mt-2'>
              <div
                className='flex items-center gap-2 text-sm text-gray-700'
                style={{ fontSize: '14pt' }}
              >
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
            </div>
          </div>
          <div className='mt-1 flex items-center gap-2 text-sm text-gray-700'>
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
                    <div className='bg-gray h-[20px] w-[20px] rounded-full bg-gray-300' />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>여행 정보를 불러오는 중...</p>
      )}
    </div>
  )
}

export default TripTitle

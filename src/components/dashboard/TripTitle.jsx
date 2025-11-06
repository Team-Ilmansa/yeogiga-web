import { useMemo } from 'react'
import PinIcon from '@/assets/dashboard/PinIcon'
import CalendarIcon from '@/assets/dashboard/CalendarIcon'
import UserIcon from '@/assets/dashboard/UserIcon'

const TripTitle = ({ tripInfo }) => {
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

      <div className='mt-4 flex flex-col gap-y-1 text-[14pt] text-[var(--Grey-Scale-grey-300)]'>
        <div className='flex items-center gap-2'>
          <PinIcon className='h-5 w-5' />
          <div>
            {tripInfo.city.length > 0
              ? tripInfo.city.join(', ')
              : '아직 확정된 목적지가 없습니다.'}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <CalendarIcon className='h-5 w-5' />
          <span>
            {tripInfo.startedAt
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

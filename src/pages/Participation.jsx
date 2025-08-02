import createMemberApi from '@/apis/member/createMemberApi'
import readTripInfoApi from '@/apis/trip/readTripInfo'
import LocationIcon from '@/assets/dashboard/modal/LocationIcon'
import { CalendarIcon, PinIcon, UserIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Participation = () => {
  /**Path Variable에서 tripId 불러오기 */
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [tripInfo, setTripInfo] = useState()
  const [isScheduleConfirmed, setIsScheduleConfirmed] = useState(false)

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

  /**여행 멤버 참가 API 호출 */
  const createMember = async () => {
    try {
      const result = await createMemberApi(tripId)
      alert('여행에 참가하였습니다!')
      navigate(`/trip/${tripId}`)
    } catch (err) {
      alert(err.message)
    }
  }

  /** 리더 닉네임 */
  const leaderNickname =
    tripInfo?.members.find((member) => member.userId === tripInfo.leaderId)
      ?.nickname ?? tripInfo?.leaderId

  /** 디데이 함수 */
  const calculateDday = (startDateString) => {
    if (!startDateString) return 'D-??'
    const today = new Date()
    const startDate = new Date(startDateString)

    today.setHours(0, 0, 0, 0)
    startDate.setHours(0, 0, 0, 0)

    const diffTime = startDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 0) return `D-${diffDays}`
    if (diffDays === 0) return 'D-Day'
    return `D+${Math.abs(diffDays)}`
  }

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center rounded-2xl px-6 py-5'>
      {tripInfo ? (
        <div>
          <div className='flex w-[380px] flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-md'>
            <div className='flex justify-between'>
              <h2 className='mt-3 text-xl font-semibold text-gray-900'>
                여행 초대 요청을 수락하시겠어요?
                <p className='mt-1 text-sm font-medium text-gray-500'>
                  요청을 수락하면 바로 합류할 수 있어요
                </p>
              </h2>
            </div>
            <div className='flex w-full flex-col gap-2 rounded-[20px] bg-[var(--Blue-Scale-blue-100)] p-4'>
              <div className='flex items-center gap-2'>
                <div className='rounded-full bg-white px-2 py-1 text-xs font-medium text-[var(--Blue-Scale-blue-500)] shadow-sm'>
                  {calculateDday(tripInfo.startedAt)}
                </div>
                <h3 className='text-lg font-bold text-gray-900'>
                  {tripInfo.title}
                </h3>
              </div>

              {/** 위치, 일정, 참가중인 멤버 */}
              <div className='flex flex-col gap-y-1 text-[14px] font-medium text-gray-500'>
                <div className='flex items-center gap-2'>
                  <LocationIcon className='h-5 w-5 text-gray-500' />
                  <span>{tripInfo.city || '아직 정해지지 않았어요'}</span>
                </div>

                <div className='flex items-center gap-2'>
                  <CalendarIcon className='h-5 w-5' />
                  <span>
                    {isScheduleConfirmed
                      ? `${formatDate(tripInfo.startedAt)} - ${formatDate(tripInfo.endedAt)}`
                      : '아직 정해지지 않았어요'}
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

            <div className='flex w-full gap-3'>
              <button
                className='font-large text-m text-grey-400 w-1/2 rounded-xl border-none bg-gray-100 px-4 py-3 font-semibold outline-none'
                onClick={() => navigate('/')}
              >
                취소
              </button>
              <button
                className='font-large text-m w-1/2 rounded-xl border-none bg-[var(--Blue-Scale-blue-500)] px-4 py-3 font-semibold text-white outline-none'
                onClick={createMember}
              >
                수락하기
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>여행 정보를 불러오는 중...</p>
      )}
    </div>
  )
}

export default Participation

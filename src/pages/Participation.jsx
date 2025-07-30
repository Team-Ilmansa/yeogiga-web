import createMemberApi from '@/apis/member/createMemberApi'
import readTripInfoApi from '@/apis/trip/readTripInfo'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Participation = () => {
  /**Path Variable에서 tripId 불러오기 */
  const { tripId } = useParams()
  const navigate = useNavigate()
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

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center rounded-2xl px-6 py-5'>
      {tripInfo ? (
        <div>
          <div className='flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-md'>
            <div className='flex justify-between'>
              <h2 className='mt-auto text-base font-semibold text-gray-900'>
                <span style={{ color: 'var(--Blue-Scale-blue-500)' }}>
                  {tripInfo.title}
                </span>
                에 참가하시겠습니까?
              </h2>
            </div>

            <ul className='flex gap-4'>
              {tripInfo.members.map((member) => (
                <li
                  key={member.userId}
                  className='flex w-10 flex-col items-center gap-1'
                >
                  <span className='h-4 text-sm leading-none'>
                    {member.userId === tripInfo.leaderId ? '👑' : '\u00A0'}
                  </span>
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt='프로필 이미지'
                      className='h-8 w-8 cursor-pointer rounded-full object-cover'
                    />
                  ) : (
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500'>
                      없음
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className='flex w-full gap-3'>
              <button
                className='font-large text-m text-grey-400 w-1/2 rounded-xl border-none bg-gray-100 px-4 py-3 font-semibold outline-none'
                onClick={() => navigate('/')}
              >
                취소하기
              </button>
              <button
                className='font-large text-m w-1/2 rounded-xl border-none bg-[var(--Blue-Scale-blue-500)] px-4 py-3 font-semibold text-white outline-none'
                onClick={createMember}
              >
                참가하기
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

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
    <div className='flex h-screen w-screen flex-col items-center justify-center'>
      {tripInfo ? (
        <div>
          <fieldset className='flex flex-col gap-5 rounded-2xl border p-4'>
            <legend className='p-2'>여행 정보</legend>
            <div className='flex justify-between'>
              <h3>{tripInfo.title}</h3>
            </div>

            <fieldset className='rounded-2xl border p-4'>
              <legend className='p-2'>여행 멤버</legend>
              <ul>
                {tripInfo.members.map((member) => (
                  <li key={member.userId}>
                    {member.nickname}
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.nickname}
                        width='30'
                      />
                    ) : (
                      <div>(이미지 없음)</div>
                    )}
                  </li>
                ))}
              </ul>
            </fieldset>
            <div className='flex justify-between'>
              <button onClick={() => navigate('/')}>취소</button>
              <button onClick={createMember}>참가</button>
            </div>
          </fieldset>
        </div>
      ) : (
        <p>여행 정보를 불러오는 중...</p>
      )}
    </div>
  )
}

export default Participation

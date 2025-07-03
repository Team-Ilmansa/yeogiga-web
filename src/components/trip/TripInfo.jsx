import deleteTripApi from '@/apis/trip/deleteTripApi'
import updateTripTitleApi from '@/apis/trip/updateTripTitleApi'
import updateTripTimeApi from '@/apis/trip/updateTripTimeApi'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**날짜 값 형식 변환 */
function toDatetimeLocalFormat(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}

const TripInfo = ({ tripInfo }) => {
  const [newTitle, setNewTitle] = useState('')
  const [isUpdateTitleInputOpen, setIsUpdateTitleInputOpen] = useState(false)
  const [newTime, setNewTime] = useState('')
  const [newStartTime, setNewStartTime] = useState('')
  const [newEndTime, setNewEndTime] = useState('')
  const [isUpdateTimeInputOpen, setIsUpdateTimeInputOpen] = useState(false)
  const [isMembersOpen, setIsMembersOpen] = useState(false)

  const navigate = useNavigate()

  /**여행 초대 링크 복사 */
  const copyInviteLink = async () => {
    try {
      const currentUrl = window.location.origin + window.location.pathname
      await navigator.clipboard.writeText(`${currentUrl}/participation`)
      alert('초대 링크가 복사되었습니다!')
    } catch (error) {
      alert('복사 실패')
    }
  }

  /**여행 이름 변경 창 출력 상태 토글 */
  const toggleUpdateTitleInput = () => {
    setIsUpdateTitleInputOpen((prev) => !prev)
    setNewTitle('')
  }

  /**여행 이름 변경 API 호출 */
  const updateTitle = async (e) => {
    e.preventDefault()
    try {
      const result = await updateTripTitleApi(tripInfo.tripId, {
        title: newTitle,
      })
      alert('여행 이름이 성공적으로 변경되었습니다!')
      setIsUpdateTitleInputOpen(false)
      window.location.reload()
    } catch (err) {
      alert(err.message)
    }
  }

  /**여행 시간 변경 창 출력 상태 토글 */
  const toggleUpdateTimeInput = () => {
    setIsUpdateTimeInputOpen((prev) => !prev)
    setNewTime('')
  }

  /**여행 멤버 더 보기 화면 출력 상태 토글 */
  const toggleViewMembers = () => {
    setIsMembersOpen((prev) => !prev)
  }

  /**여행 시간 변경 토클 시 날짜 초기 세팅 */
  useEffect(() => {
    if (isUpdateTimeInputOpen && tripInfo?.startedAt && tripInfo?.endedAt) {
      setNewStartTime(toDatetimeLocalFormat(tripInfo.startedAt))
      setNewEndTime(toDatetimeLocalFormat(tripInfo.endedAt))
    }
  }, [isUpdateTimeInputOpen, tripInfo])

  /**여행 시간 변경 API 호출 */
  const updateTime = async (e) => {
    e.preventDefault()
    try {
      const result = await updateTripTimeApi(tripInfo.tripId, {
        start: newStartTime,
        end: newEndTime,
      })
      alert('여행 시간이 성공적으로 변경되었습니다!')
      setIsUpdateTimeInputOpen(false)
      window.location.reload()
    } catch (err) {
      alert(err.message)
    }
  }

  /**여행 삭제 API 호출 */
  const deleteTrip = async () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        const result = await deleteTripApi(tripInfo.tripId)
        alert('정상적으로 삭제되었습니다')
        navigate('/')
      } catch (err) {
        alert(err.message)
      }
    }
  }

  return (
    <div>
      {tripInfo ? (
        <div>
          <fieldset className='rounded-2xl border p-4'>
            <legend className='p-2'>
              여행 정보
              <button className='ml-2 px-2 py-0' onClick={deleteTrip}>
                삭제
              </button>
            </legend>
            <div className='flex justify-between'>
              <h3>제목: {tripInfo.title}</h3>
              <button className='px-2 py-0' onClick={toggleUpdateTitleInput}>
                수정
              </button>
            </div>
            <button onClick={copyInviteLink}>초대 링크</button>
            {isUpdateTitleInputOpen && (
              <fieldset className='rounded-2xl border p-4'>
                <legend className='p-2'>여행 이름</legend>
                <form
                  onSubmit={updateTitle}
                  className='flex flex-col items-center justify-center gap-2'
                >
                  <input
                    placeholder='변경할 여행 이름을 입력해주세요.'
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className='w-75'
                    type='text'
                  />
                  <button type='submit'>변경하기</button>
                </form>
              </fieldset>
            )}
            <p>도시: {tripInfo.city}</p>
            <p>
              기간: {new Date(tripInfo.startedAt).toLocaleString()} ~{' '}
              {new Date(tripInfo.endedAt).toLocaleString()}
            </p>
            <button className='px-2 py-0' onClick={toggleUpdateTimeInput}>
              수정
            </button>
            {isUpdateTimeInputOpen && (
              <fieldset className='rounded-2xl border p-4'>
                <legend className='p-2'>여행 시간</legend>
                <form
                  onSubmit={updateTime}
                  className='flex flex-col items-center justify-center gap-2'
                >
                  <input
                    placeholder='변경할 시작 시간을 입력해주세요.'
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className='w-75'
                    type='datetime-local'
                  />

                  <input
                    placeholder='변경할 종료 시간을 입력해주세요.'
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className='w-75'
                    type='datetime-local'
                  />
                  <button type='submit'>변경하기</button>
                </form>
              </fieldset>
            )}
            <p>상태: {tripInfo.status}</p>

            <fieldset className='rounded-2xl border p-4'>
              <legend className='p-2'>여행 멤버</legend>
              <ul className='flex items-center gap-2'>
                {tripInfo.members.slice(0, 3).map((member) => (
                  <li key={member.userId}>
                    <img
                      src={member.imageUrl || '/images/default_profile.png'}
                      alt='프로필'
                      className='h-6 w-6 rounded-full object-cover'
                    />
                  </li>
                ))}
                <button onClick={toggleViewMembers}>...</button>
              </ul>
            </fieldset>
          </fieldset>
        </div>
      ) : (
        <p>여행 정보를 불러오는 중...</p>
      )}

      {isMembersOpen && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
          onClick={toggleViewMembers}
        >
          <div
            className='rounded-3xl bg-white p-20 text-3xl shadow'
            onClick={(e) => e.stopPropagation()}
          >
            <ul className='flex flex-col items-baseline gap-5'>
              {tripInfo.members.slice(0, 3).map((member) => (
                <li key={member.userId} className='flex items-center gap-2'>
                  <img
                    src={member.imageUrl || '/images/default_profile.png'}
                    alt='프로필'
                    className='h-15 w-15 rounded-full object-cover'
                  />
                  <span>{member.nickname}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default TripInfo

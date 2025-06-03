import deleteTripApi from '@/apis/trip/deleteTripApi'
import updateTripTitleApi from '@/apis/trip/updateTripTitleApi'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TripInfo = ({ tripInfo }) => {
  const [newTitle, setNewTitle] = useState('')
  const [isUpdateTitleInputOpen, setIsUpdateTitleInputOpen] = useState(false)

  const navigate = useNavigate()

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
            <p>상태: {tripInfo.status}</p>

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
          </fieldset>
        </div>
      ) : (
        <p>여행 정보를 불러오는 중...</p>
      )}
    </div>
  )
}

export default TripInfo

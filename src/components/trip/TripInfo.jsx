import React from 'react'

const TripInfo = ({ tripInfo }) => {
  return (
    <div>
      {tripInfo ? (
        <div>
          <fieldset className='rounded-2xl border p-4'>
            <legend className='p-2'>여행 정보</legend>
            <h3>제목: {tripInfo.title}</h3>
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

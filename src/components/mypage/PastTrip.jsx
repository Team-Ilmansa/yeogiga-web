import React from 'react'

const PastTrip = () => {
  // TODO: 추후 지난 여행 전체보기 연동
  return (
    <div className='flex items-center justify-between'>
      <h1 className='text-3xl leading-normal font-bold'>지난 여행 전체보기</h1>
      {/* TODO: 더보기 버튼 클릭 시 UI 구현 */}
      <button className='flex items-center border-none text-base text-gray-400 hover:text-gray-500'>
        더보기
      </button>
    </div>
  )
}

export default PastTrip

import React from 'react'

const FavoritePhotos = () => {
  // TODO: 즐겨찾기한 이미지 조회 API 연동
  return (
    <div className='flex items-center justify-between'>
      <h1 className='text-3xl leading-normal font-bold'>즐겨찾기한 사진</h1>
      {/* TODO: 더보기 버튼 클릭 시 UI 구현 */}
      <button className='flex items-center border-none text-base text-gray-400 hover:text-gray-500'>
        더보기
      </button>
    </div>
  )
}

export default FavoritePhotos

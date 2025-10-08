import updateTripTitleApi from '@/apis/trip/updateTripTitleApi'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const UpdateTitleModal = ({ onClose }) => {
  const { tripId } = useParams()
  const [title, setTitle] = useState('')

  /**여행 이름 변경 API 호출 */
  const updateTitle = async (e) => {
    e.preventDefault()
    try {
      await updateTripTitleApi(tripId, {
        title,
      })
      alert('여행 이름이 성공적으로 변경되었습니다!')
      window.location.reload()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    /** 모달 배경 및 외부 클릭 시 모달 닫기 */
    <div
      className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center'
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/** 모달 콘텐츠 영역 */}
      <div className='w-[90%] max-w-md rounded-2xl bg-white px-6 py-5 shadow-xl'>
        <h2 className='mb-4 text-base font-semibold text-gray-900'>
          여행 이름을 변경할 수 있어요
        </h2>

        {/** 여행 이름 입력창 */}
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='변경할 여행 이름을 작성해주세요'
          className='mb-4 w-full rounded-xl border-none bg-[#F0F0F0] px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none'
        />

        {/** 취소 및 변경 버튼 영역 */}
        <div className='flex w-full gap-3'>
          <button
            onClick={onClose}
            className='font-large text-m w-1/2 rounded-xl border-none bg-gray-100 px-4 py-3 text-gray-400 outline-none'
          >
            취소하기
          </button>
          <button
            onClick={updateTitle}
            className='font-large text-m w-1/2 rounded-xl border-none bg-[var(--Blue-Scale-blue-500)] px-4 py-3 text-white outline-none'
          >
            변경하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateTitleModal

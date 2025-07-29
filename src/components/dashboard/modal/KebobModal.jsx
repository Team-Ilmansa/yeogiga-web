import CalendarIcon from '@/assets/dashboard/modal/CalendarIcon'
import EditIcon from '@/assets/dashboard/modal/EditIcon'
import RemoveIcon from '@/assets/dashboard/modal/RemoveIcon'
import ShareIcon from '@/assets/dashboard/modal/ShareIcon'
import React, { useEffect } from 'react'

const KebabModal = ({ onClose }) => {
  useEffect(() => {
    /**모달이 열릴 때 스크롤바 제거 + 우측 공간 보정*/
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollBarWidth}px`

    return () => {
      /**🔓 모달 닫힐 때 원래 상태로 복원*/
      document.body.style.overflow = 'auto'
      document.body.style.paddingRight = '0px'
    }
  }, [])

  /**모달 배경 클릭 시 모달 닫힘 함수 */
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  /**모달 버튼 공통 스타일링 */
  const buttonStyle =
    'border-none outline-none focus:outline-none ring-0 flex items-center gap-3 text-left text-base font-medium text-gray-800'

  return (
    /**모달 배경 */
    <div
      className='absolute inset-0 z-50 flex items-end justify-center'
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackgroundClick}
    >
      {/** 모달 본체 */}
      <div className='mr-3 box-border w-[56rem] max-w-full rounded-t-2xl bg-white px-4 py-5 shadow-md'>
        {/** 위쪽 바 */}
        <div
          className='mx-auto mb-6 h-1.5 w-40 cursor-pointer rounded bg-gray-100'
          onClick={onClose}
        />

        {/** 모달 내 버튼 목록 */}
        <div className='flex flex-col gap-4'>
          <button onClick={onClose} className={buttonStyle}>
            <EditIcon />
            여행 개요 수정하기
          </button>

          <button onClick={onClose} className={buttonStyle}>
            <CalendarIcon />
            일정 수정하기
          </button>

          <button onClick={onClose} className={buttonStyle}>
            <RemoveIcon />
            여행 삭제하기
          </button>

          <button onClick={onClose} className={buttonStyle}>
            <ShareIcon />
            링크공유로 초대하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default KebabModal

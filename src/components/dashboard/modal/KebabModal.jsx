import deleteTripApi from '@/apis/trip/deleteTripApi'
import CalendarIcon from '@/assets/dashboard/modal/CalendarIcon'
import EditIcon from '@/assets/dashboard/modal/EditIcon'
import RemoveIcon from '@/assets/dashboard/modal/RemoveIcon'
import ShareIcon from '@/assets/dashboard/modal/ShareIcon'
import React, { useEffect, useState } from 'react'
import UpdateTitleModal from './UpdateTitleModal'
import { useNavigate, useParams } from 'react-router-dom'

const KebabModal = ({ onClose, onOpenUpdateModal }) => {
  const { tripId } = useParams()
  const [showUpdateTitleModal, setShowUpdateTitleModal] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    /** 모달이 열릴 때 스크롤바 제거 */
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollBarWidth}px`

    return () => {
      /** 모달 닫힐 때 원래 상태로 복원*/
      document.body.style.overflow = 'auto'
      document.body.style.paddingRight = '0px'
    }
  }, [])

  /** 모달 배경 클릭 시 모달 닫힘 함수 */
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  /** 모달 버튼 공통 스타일링 */
  const buttonStyle =
    'border-none outline-none focus:outline-none ring-0 flex items-center gap-3 text-left text-base font-medium text-gray-800'

  /** 여행 삭제 API 호출 */
  const deleteTrip = async () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        const result = await deleteTripApi(tripId)
        alert('정상적으로 삭제되었습니다')
        navigate('/')
      } catch (err) {
        alert(err.message)
      }
    }
  }

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

  /** 여행 이름 변경 API 호출 */
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

  return (
    <>
      {/** 여행 이름 변경 모달 */}
      {showUpdateTitleModal && (
        <UpdateTitleModal
          onClose={() => setShowUpdateTitleModal(false)}
          onConfirm={() => {
            setShowUpdateTitleModal(false)
            alert('확정되었습니다!')
          }}
        />
      )}
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

          {/** 버튼 목록 */}
          <div className='flex flex-col gap-4'>
            <button onClick={onOpenUpdateModal} className={buttonStyle}>
              <EditIcon />
              여행 이름 변경하기
            </button>
            {/** TODO: 추후 캘린더 생성 후 연결 예정 */}
            <button className={buttonStyle}>
              <CalendarIcon />
              일정 수정하기
            </button>

            <button onClick={deleteTrip} className={buttonStyle}>
              <RemoveIcon />
              여행 삭제하기
            </button>

            <button onClick={copyInviteLink} className={buttonStyle}>
              <ShareIcon />
              링크공유로 초대하기
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default KebabModal

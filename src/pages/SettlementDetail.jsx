import KebabIcon from '@/assets/dashboard/KebabIcon'
import GoBack from '@/assets/sign-up/GoBack'
import SettlementTitle from '@/components/settlement/SettlementTitle'
import SettleSlideTabs from '@/components/settlement/SettleSlideTabs'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SettlementOptionsModal from '@/components/dashboard/modal/SettlementOptionsModal'
const SettlementDetail = () => {
  const navigate = useNavigate()
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)

  /** 뒤로 가기 */
  const handleBack = () => navigate(-1)

  /**TODO: 옵션 모달 관련 핸들러 연결 */
  const handleEdit = () => {
    setIsOptionsOpen(false)
    // TODO: 수정 화면 이동 등
  }
  const handleDelete = () => {
    setIsOptionsOpen(false)
    // TODO: 삭제 confirm 모달/로직
  }
  const handleReannounce = () => {
    setIsOptionsOpen(false)
    // TODO: 재공지 로직
  }

  return (
    <>
      <div className='flex w-full flex-col pt-5'>
        <div className='mb-5 flex items-center justify-between px-8'>
          <button className='border-none' onClick={handleBack}>
            <GoBack />
          </button>

          {/** 케밥 아이콘 클릭 시 옵션 모달 오픈 */}
          <button
            type='button'
            className='border-none bg-transparent p-1'
            onClick={() => setIsOptionsOpen(true)}
            aria-label='정산 옵션 열기'
          >
            <KebabIcon />
          </button>
        </div>

        <div className='flex w-full flex-col gap-5 px-10'>
          <SettlementTitle />
          <SettleSlideTabs />
        </div>
      </div>

      {/** 바텀시트 옵션 모달 */}
      <SettlementOptionsModal
        open={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReannounce={handleReannounce}
      />
    </>
  )
}

export default SettlementDetail

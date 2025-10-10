import KebabIcon from '@/assets/dashboard/KebabIcon'
import GoBack from '@/assets/sign-up/GoBack'
import SettlementTitle from '@/components/settlement/SettlementTitle'
import SettleSlideTabs from '@/components/settlement/SettleSlideTabs'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const SettlementDetail = () => {
  const navigate = useNavigate()

  /** 뒤로 가기 버튼 */
  const handleBack = () => {
    navigate(-1)
  }
  return (
    <>
      <div className='flex w-full flex-col pt-5'>
        <div className='mb-5 flex items-center justify-between px-8'>
          <button className='border-none' onClick={handleBack}>
            <GoBack />
          </button>
          {/**TODO: 케밥 아이콘 클릭 시 수정, 삭제 모달 */}
          <KebabIcon />
        </div>
        <div className='flex w-full flex-col gap-5 px-10'>
          <SettlementTitle />
          <SettleSlideTabs />
        </div>
      </div>
    </>
  )
}

export default SettlementDetail

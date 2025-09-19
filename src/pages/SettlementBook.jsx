import GoBack from '@/assets/sign-up/GoBack'
import UnsettledTitle from '@/components/account-book/UnsettledTitle'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
// TODO: 뒤로가기버튼, 미정산내역, 날짜별 정산내역(기타 포함), 날짜별 박스
const SettlementBook = () => {
  const { tripId } = useParams()
  const navigate = useNavigate()

  /** 뒤로 가기 버튼 */
  const handleBack = () => navigate(-1)
  return (
    <>
      <div className='flex w-full flex-col pt-5'>
        {/**뒤로가기 버튼이 있는 상단 */}
        <div className='mb-5 flex items-center justify-between px-8'>
          <button className='border-none' onClick={handleBack}>
            <GoBack />
          </button>
        </div>
        {/**타이틀 및 슬라이딩 날짜 및 내역 탭 */}
        <div className='flex w-full flex-col gap-15 px-10'>
          {/**타이틀*/}
          <UnsettledTitle />
          {/**미정산 내역 및 날짜 탭 */}
        </div>
      </div>
    </>
  )
}

export default SettlementBook

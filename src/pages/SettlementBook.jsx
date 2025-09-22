import GoBack from '@/assets/sign-up/GoBack'
import FixedActionBar from '@/components/common/FixedActionBar'
import SettlementBox from '@/components/settlement/SettlementBox'
import SettlementTabs from '@/components/settlement/SettlementTabs'
import UnsettledTitle from '@/components/settlement/UnsettledTitle'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const SettlementBook = () => {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [view, setView] = useState({ key: 'ALL' })

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
        <div className='flex w-full flex-col gap-8 px-10'>
          {/**타이틀*/}
          <UnsettledTitle />
          {/**미정산 내역 및 날짜 탭 */}
          <SettlementTabs onChange={setView} />

          {/**날짜별 내역 박스 */}
          <SettlementBox mode={view.key} date={view.date} />
          {/**내역 추가하기 버튼 */}
          <FixedActionBar className='flex justify-center'>
            <div className='flex w-4xl items-center justify-center rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
              <button
                button
                onClick={() => navigate(`/trip/${tripId}/settlement/add`)}
                className='flex w-full items-center justify-center gap-2 rounded-lg border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
              >
                내역 추가하기
              </button>
            </div>
          </FixedActionBar>
        </div>
      </div>
    </>
  )
}

export default SettlementBook

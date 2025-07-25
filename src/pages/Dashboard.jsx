import TripTitle from '@/components/dashboard/TripTitle'
import GoBack from '@/assets/sign-up/GoBack'
import { useNavigate, useParams } from 'react-router-dom'
import SlideTabs from '@/components/dashboard/SlideTabs'
import { useState } from 'react'

/**여행 정보 대시보드 페이지 */
const Dashboard = () => {
  const navigate = useNavigate()
  const { tripId } = useParams()

  /**여행 일정 확정 여부 */
  const [isScheduleConfirmed, setIsScheduleConfirmed] = useState(false)

  const handleBack = () => {
    navigate(`/`)
  }

  return (
    <div className='flex w-full flex-col pt-5'>
      <div>
        <button
          className='text-bold my-5 border-none px-8'
          onClick={handleBack}
        >
          <GoBack />
        </button>
      </div>

      <div className='flex w-full flex-col gap-15 px-10'>
        <TripTitle
          isScheduleConfirmed={isScheduleConfirmed}
          setIsScheduleConfirmed={setIsScheduleConfirmed}
        />
        <SlideTabs isScheduleConfirmed={isScheduleConfirmed} />
      </div>

      {/* 여행 날짜 확정 버튼 */}
      {!isScheduleConfirmed && (
        <div className='fixed bottom-0 left-0 flex w-full transform flex-col items-center gap-[20px] transition-transform duration-300'>
          <div className='flex w-4xl items-center justify-center rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
            <button className='w-full border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'>
              여행 날짜 확정하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

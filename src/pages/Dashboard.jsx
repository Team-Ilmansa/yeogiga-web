import TripTitle from '@/components/dashboard/TripTitle'
import GoBack from '@/assets/sign-up/GoBack'
import { useNavigate, useParams } from 'react-router-dom'
import SlideTabs from '@/components/dashboard/SlideTabs'
import { useState, useEffect } from 'react'
import KebabIcon from '@/assets/dashboard/KebabIcon'
import readMyCalendarApi from '@/apis/calendar/readMyCalendarApi'
import KebabModal from '@/components/dashboard/modal/KebabModal'
import UpdateTitleModal from '@/components/dashboard/modal/UpdateTitleModal'
import Notices from '@/components/notice/Notices'
import FixedActionBar from '@/components/common/FixedActionBar'
import PigIcon from '@/assets/settlement/PigIcon'
import MapIcon from '@/assets/map/MapIcon'

/**여행 정보 대시보드 페이지 */
const Dashboard = () => {
  const navigate = useNavigate()
  const { tripId } = useParams()
  /** 케밥 모달 열림 여부 상태 */
  const [isKebabOpen, setIsKebabOpen] = useState(false)
  /** 여행 이름 수정 모달 열림 여부 상태 */
  const [isUpdateTitleOpen, setIsUpdateTitleOpen] = useState(false)

  /**여행 일정 확정 여부 */
  const [isScheduleConfirmed, setIsScheduleConfirmed] = useState(false)

  const handleBack = () => {
    navigate(`/`)
  }

  useEffect(() => {
    const fetchMyCalendar = async () => {
      /**나의 W2M 캘린더 조회 API 호출 */
      try {
        await readMyCalendarApi(tripId)
      } catch (err) {
        if (err.code === 'T009') navigate('calendar')
        console.error(err.message)
      }
    }
    fetchMyCalendar()
  }, [navigate, tripId])

  return (
    <>
      {/** 케밥 모달이 열렸을 때만 렌더링 */}
      {isKebabOpen && (
        <KebabModal
          onClose={() => setIsKebabOpen(false)}
          onOpenUpdateModal={() => {
            setIsKebabOpen(false)
            setIsUpdateTitleOpen(true)
          }}
        />
      )}
      {/** 여행 제목 수정 모달이 열렸을 때만 렌더링 */}
      {isUpdateTitleOpen && (
        <UpdateTitleModal
          onClose={() => setIsUpdateTitleOpen(false)}
          onConfirm={() => {
            setIsUpdateTitleOpen(false)
          }}
        />
      )}
      <div className='flex w-full flex-col pt-5'>
        <div className='mb-5 flex items-center justify-between px-8'>
          <button className='border-none' onClick={handleBack}>
            <GoBack />
          </button>
          {/** 오른쪽 상단 컴포넌트 */}
          <div className='flex items-center gap-10'>
            {/** 돼지 아이콘 클릭 시 가계부 페이지로 이동 */}
            <button
              onClick={() => navigate(`/trip/${tripId}/settlementbook`)}
              className='border-none bg-transparent p-0 outline-none focus:outline-none'
            >
              <PigIcon size={24} color={'var(--Grey-Scale-grey-400)'} />
            </button>
            {/* 지도 아이콘 클릭 시 해당 여행 지도 페이지로 이동 */}
            <button
              onClick={() => navigate(`/trip/${tripId}/map`)}
              className='border-none bg-transparent p-0 outline-none focus:outline-none'
            >
              <MapIcon size={24} color={'var(--Grey-Scale-grey-400)'} />
            </button>
            {/** 케밥 버튼 클릭 시 모달창 열기 */}
            <button
              onClick={() => setIsKebabOpen(true)}
              className='border-none bg-transparent p-0 outline-none focus:outline-none'
            >
              <KebabIcon />
            </button>
          </div>
        </div>
        <div className='flex w-full flex-col gap-15 px-10'>
          <TripTitle
            isScheduleConfirmed={isScheduleConfirmed}
            setIsScheduleConfirmed={setIsScheduleConfirmed}
          />
          <Notices />
          <SlideTabs isScheduleConfirmed={isScheduleConfirmed} />
        </div>
        {/* 여행 날짜 확정 버튼 */}
        {!isScheduleConfirmed && (
          <div className='mt-auto flex w-full items-center justify-center rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
            <button
              onClick={() => navigate('confirmation')}
              className='w-full rounded-lg border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
            >
              여행 날짜 확정하기
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Dashboard

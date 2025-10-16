import { useEffect, useState } from 'react'
import DateBox from './DateBox'
import PlusCalendar from '@/assets/map/PlusCalendar'
import NoticeIcon from '@/assets/dashboard/NoticeIcon'
import confirmTripPlaceApi from '@/apis/dashboard/confirmTripPlaceApi'
import { useParams } from 'react-router-dom'
import FixedActionBar from '@/components/common/FixedActionBar'
import PlanningDateBox from './PlanningDateBox'
import readPlanningDatePlaceApi from '@/apis/planning-dashboard/readPlanningDatePlaceApi'

import NoticeCreateModal from '../modal/NoticeCreateModal'
import createNoticeApi from '@/apis/notice/createNoticeApi'
import PointPinIcon from '@/assets/dashboard/PointPinIcon'

const DayTabs = ({ tripInfo, activeTab, onContentUpdate }) => {
  const [activeDayTab, setActiveDayTab] = useState(0)
  const [dates, setDates] = useState([])
  const [planningPlaces, setPlanningPlaces] = useState([])
  const [isNoticeOpen, setIsNoticeOpen] = useState(false)
  const [noticeSubmitting, setNoticeSubmitting] = useState(false)

  const { tripId } = useParams()
  const { startedAt, endedAt } = tripInfo

  /** 공지 작성 API 호출 */
  const handleSubmitCreateNotice = async ({ title, description }) => {
    try {
      setNoticeSubmitting(true)
      await createNoticeApi(tripId, { title, description })
      onContentUpdate?.()
      setIsNoticeOpen(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setNoticeSubmitting(false)
    }
  }

  /** 날짜 포맷팅 */
  const formatDateToDot = (dateObj) => {
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    return `${year}. ${month}. ${day}`
  }

  useEffect(() => {
    if (!startedAt || !endedAt) return

    const start = new Date(startedAt)
    const end = new Date(endedAt)

    const tempDates = []
    const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate())

    while (cur <= end) {
      tempDates.push(new Date(cur))
      cur.setDate(cur.getDate() + 1)
    }

    setDates(tempDates)
  }, [startedAt, endedAt])

  useEffect(() => {
    if (dates.length > 0 && onContentUpdate) {
      const timer = setTimeout(() => {
        onContentUpdate()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [dates, onContentUpdate])

  useEffect(() => {
    if (tripInfo.status === 'SETTING') return

    /**확정 후 전체 일정 불러오기 */
    const fetchPlanningPlaces = async () => {
      try {
        const result = await readPlanningDatePlaceApi(tripId)
        setPlanningPlaces(result.data)
      } catch (err) {
        alert(err.message)
      }
    }

    fetchPlanningPlaces()
  }, [tripId, tripInfo.status])

  const handleTabClick = (index) => {
    setActiveDayTab(index)
  }

  /**일정 확정 API 호출 */
  const handleConfirmPlace = async () => {
    const body = { lastDay: dates.length }
    try {
      await confirmTripPlaceApi(tripId, body)
      window.location.reload()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className='flex h-full flex-col'>
      <div className='flex-grow overflow-y-auto'>
        {/* 탭 바 */}
        <div className='flex flex-wrap gap-[6px]'>
          <div
            className={`cursor-pointer rounded-full px-4 py-1 text-base ${
              activeDayTab === 0
                ? 'bg-[var(--Blue-Scale-blue-500)] text-white'
                : 'border border-gray-300 bg-white text-gray-500'
            }`}
            onClick={() => handleTabClick(0)}
          >
            여행 전체
          </div>

          {dates.map((_, index) => (
            <div
              key={index}
              onClick={() => handleTabClick(index + 1)}
              className={`cursor-pointer rounded-full px-4 py-1 text-base ${
                activeDayTab === index + 1
                  ? 'bg-[var(--Blue-Scale-blue-500)] text-white'
                  : 'border border-gray-300 bg-white text-gray-500'
              }`}
            >
              DAY {index + 1}
            </div>
          ))}
        </div>

        <div className='mt-4 flex flex-col gap-3 pb-[120px]'>
          {tripInfo.status === 'SETTING'
            ? activeDayTab === 0
              ? dates.map((d, i) => (
                  <DateBox
                    key={i}
                    date={formatDateToDot(d)}
                    dayIndex={i + 1}
                    tripInfo={tripInfo}
                    onContentUpdate={onContentUpdate}
                  />
                ))
              : dates[activeDayTab - 1] && (
                  <DateBox
                    date={formatDateToDot(dates[activeDayTab - 1])}
                    dayIndex={activeDayTab}
                    tripInfo={tripInfo}
                    onContentUpdate={onContentUpdate}
                  />
                )
            : activeDayTab === 0
              ? dates.map((d, i) => (
                  <PlanningDateBox
                    key={i}
                    date={formatDateToDot(d)}
                    dayIndex={i + 1}
                    tripInfo={tripInfo}
                    planningPlaces={planningPlaces[i]}
                    onContentUpdate={onContentUpdate}
                  />
                ))
              : dates[activeDayTab - 1] && (
                  <PlanningDateBox
                    date={formatDateToDot(dates[activeDayTab - 1])}
                    dayIndex={activeDayTab}
                    tripInfo={tripInfo}
                    planningPlaces={planningPlaces[activeDayTab - 1]}
                    onContentUpdate={onContentUpdate}
                  />
                )}
        </div>
      </div>

      {/* 일정 확정 버튼 */}
      <div className='flex-shrink-0'>
        {activeTab === 0 &&
          (tripInfo.status === 'SETTING' ? (
            <FixedActionBar className='flex justify-center'>
              <div className='flex w-4xl items-center justify-center rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
                <button
                  onClick={handleConfirmPlace}
                  className='w-full rounded-lg border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
                >
                  여행 일정 확정하기
                </button>
              </div>
            </FixedActionBar>
          ) : (
            <FixedActionBar className='flex justify-center'>
              <div className='flex w-4xl items-center justify-center gap-4 rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
                <button
                  className='flex w-full items-center justify-center gap-2 rounded-lg border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
                  disabled
                >
                  <PointPinIcon size={40} color={'white'} />
                  집결지 추가하기
                </button>
                <button
                  className='flex w-full items-center justify-center gap-2 rounded-lg border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
                  onClick={() => {
                    setIsNoticeOpen(true)
                  }}
                >
                  <NoticeIcon size={40} color={'white'} />
                  공지하기
                </button>
              </div>
            </FixedActionBar>
          ))}
      </div>

      <NoticeCreateModal
        open={isNoticeOpen}
        onClose={() => setIsNoticeOpen(false)}
        onSubmit={handleSubmitCreateNotice}
        submitting={noticeSubmitting}
      />
    </div>
  )
}

export default DayTabs

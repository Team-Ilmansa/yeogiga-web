import { useEffect, useState } from 'react'
import DateBox from './DateBox'
import { createPortal } from 'react-dom'
import PlusCalendar from '@/assets/map/PlusCalendar'
import NoticeIcon from '@/assets/dashboard/NoticeIcon'
import confirmTripPlaceApi from '@/apis/dashboard/confirmTripPlaceApi'
import { useNavigate, useParams } from 'react-router-dom'
import PlanningDateBox from './PlanningDateBox'
import readPlanningDatePlaceApi from '@/apis/planning-dashboard/readPlanningDatePlaceApi'

const DayTabs = ({ tripInfo }) => {
  const [activeTab, setActiveTab] = useState(0)
  const [dates, setDates] = useState([])
  const [selectedDay, setSelectedDay] = useState(null)
  const [planningPlaces, setPlanningPlaces] = useState([])

  const { tripId } = useParams()
  const { startedAt, endedAt } = tripInfo

  const navigate = useNavigate()

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

  /**확정 후 전체 일정 불러오기 */
  const fetchPlanningPlaces = async () => {
    try {
      const result = await readPlanningDatePlaceApi(tripId)
      setPlanningPlaces(result.data)
    } catch (err) {
      alert(err.message)
    }
  }

  useEffect(() => {
    if (tripInfo.status === 'SETTING') return
    fetchPlanningPlaces()
  }, [tripId])

  const handleTabClick = (index) => {
    setActiveTab(index)
  }

  /**버튼 하단 고정을 위한 컴포넌트 */
  const FixedActionBar = ({ children }) => {
    return createPortal(
      <div className='fixed inset-x-0 bottom-0 z-10'>{children}</div>,
      document.body,
    )
  }

  /**일정 확정 API 호출 */
  const handleConfirmPlace = async () => {
    const body = { lastDay: dates.length }
    try {
      const result = await confirmTripPlaceApi(tripId, body)
      window.location.reload()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className='w-full'>
      {/* 탭 바 */}
      <div className='flex flex-wrap gap-[6px]'>
        <div
          className={`cursor-pointer rounded-full px-4 py-1 text-base ${
            activeTab === 0
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
              activeTab === index + 1
                ? 'bg-[var(--Blue-Scale-blue-500)] text-white'
                : 'border border-gray-300 bg-white text-gray-500'
            }`}
          >
            DAY {index + 1}
          </div>
        ))}
      </div>

      <div className='mt-4 flex flex-col gap-3'>
        {tripInfo.status === 'SETTING'
          ? activeTab === 0
            ? dates.map((d, i) => (
                <DateBox
                  key={i}
                  date={formatDateToDot(d)}
                  dayIndex={i + 1}
                  tripInfo={tripInfo}
                  selected={selectedDay === i}
                  onSelect={() => setSelectedDay(i)}
                />
              ))
            : dates[activeTab - 1] && (
                <DateBox
                  date={formatDateToDot(dates[activeTab - 1])}
                  dayIndex={activeTab}
                  tripInfo={tripInfo}
                />
              )
          : activeTab === 0
            ? dates.map((d, i) => (
                <PlanningDateBox
                  key={i}
                  date={formatDateToDot(d)}
                  dayIndex={i + 1}
                  tripInfo={tripInfo}
                  selected={selectedDay === i}
                  onSelect={() => setSelectedDay(i)}
                  planningPlaces={planningPlaces[i]}
                />
              ))
            : dates[activeTab - 1] && (
                <PlanningDateBox
                  date={formatDateToDot(dates[activeTab - 1])}
                  dayIndex={activeTab}
                  tripInfo={tripInfo}
                  planningPlaces={planningPlaces[activeTab - 1]}
                />
              )}
      </div>

      {/* 일정 확정 버튼 */}
      {tripInfo.status === 'SETTING' ? (
        <FixedActionBar>
          <div className='fixed bottom-0 left-0 flex w-full justify-center'>
            <div className='flex w-4xl items-center justify-center rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
              <button
                onClick={handleConfirmPlace}
                className='w-full border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
              >
                여행 일정 확정하기
              </button>
            </div>
          </div>
        </FixedActionBar>
      ) : (
        <FixedActionBar>
          <div className='fixed bottom-0 left-0 flex w-full justify-center'>
            <div className='flex w-4xl items-center justify-center gap-4 rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
              <button
                className='flex w-full items-center justify-center gap-2 border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
                onClick={() =>
                  navigate(`map/plan/${planningPlaces[selectedDay].id}`)
                }
              >
                <PlusCalendar size={40} color={'white'} />
                일정 추가하기
              </button>
              <button className='flex w-full items-center justify-center gap-2 border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'>
                <NoticeIcon size={40} color={'white'} />
                공지하기
              </button>
            </div>
          </div>
        </FixedActionBar>
      )}
    </div>
  )
}

export default DayTabs

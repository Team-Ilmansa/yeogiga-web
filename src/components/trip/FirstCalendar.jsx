import createCalendarApi from '@/apis/calendar/createCalendarApi'
import React, { useEffect, useState } from 'react'
import generateCalendar from './utils/generateCalendar'
import GoBack from '@/assets/sign-up/GoBack'
import { useNavigate } from 'react-router-dom'

/**아직 내 일정을 등록하지 않았을 때 나오는 W2M */
const FirstCalendar = ({ tripInfo }) => {
  const navigate = useNavigate()

  /**3개월치 달력 배열 */
  const [calendarList, setCalendarList] = useState([])
  /**선택된 날짜 목록 */
  const [selectedDates, setSelectedDates] = useState([])

  /**날짜 포맷 통일 함수 */
  const formatDateKey = (year, month, day) =>
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  useEffect(() => {
    /**캘린더 생성 함수 호출 */
    const allCalendars = generateCalendar()
    setCalendarList(allCalendars)
  }, [])

  /**날짜 클릭 핸들러 */
  const handleDateClick = (year, month, day) => {
    if (!day) return

    const key = formatDateKey(year, month, day)
    setSelectedDates((prev) =>
      prev.includes(key) ? prev.filter((date) => date !== key) : [...prev, key],
    )
  }

  /**연속된 날짜의 상태 계산 (start/middle/end/single) */
  const getDateStatus = (key, index, sorted) => {
    const prev = sorted[index - 1]
    const next = sorted[index + 1]
    const current = new Date(key)
    const prevDate = prev ? new Date(prev) : null
    const nextDate = next ? new Date(next) : null

    const isPrevConnected = prevDate && current - prevDate === 86400000
    const isNextConnected = nextDate && nextDate - current === 86400000

    if (isPrevConnected && isNextConnected) return 'middle'
    if (isPrevConnected) return 'end'
    if (isNextConnected) return 'start'
    return 'single'
  }

  /**선택된 날짜 정렬 */
  const sortedDates = [...selectedDates].sort(
    (a, b) => new Date(a) - new Date(b),
  )

  /**W2M 캘린더 생성 API 호출 */
  const createCalendar = async () => {
    const body = { availableDates: selectedDates }
    try {
      await createCalendarApi(tripInfo.tripId, body)
      alert('일정이 등록되었습니다!')
      navigate('..')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className='flex w-full flex-col pt-5'>
      {/* 뒤로 가기 버튼 */}
      <div>
        <button
          className='text-bold my-5 border-none px-8'
          onClick={() => navigate(-1)}
        >
          <GoBack />
        </button>
      </div>
      <div className='mb-15 px-10'>
        {/* 상단 문구 */}
        <div className='text-4xl/[1.4] font-bold text-[var(--Grey-Scale-grey-400)]'>
          여행 날짜를
          <br />
          선택해주세요
        </div>
        <div className='text-lg/[2] text-[var(--Grey-Scale-grey-300)]'>
          아직 확정된 날짜는 아니며, 추후 수정이 가능해요
        </div>
      </div>

      {/* 3개월 치 달력 */}
      {calendarList.map((monthData, monthIdx) => (
        <div className='mb-10 px-10' key={monthIdx}>
          <div className='text-2xl text-[var(--Grey-Scale-grey-400)]'>
            {monthData.year}년 {monthData.month}월
          </div>
          <div className='grid w-full grid-cols-7 px-10 text-center text-[var(--Grey-Scale-grey-300)]'>
            {monthData.calendar.map((week, weekIdx) => (
              <React.Fragment key={weekIdx}>
                {week.map((date, dateIdx) => {
                  /**요일인지 확인 */
                  const isHeader = weekIdx === 0

                  // 날짜의 상태 확인
                  const formattedKey = formatDateKey(
                    monthData.year,
                    monthData.month,
                    date,
                  )
                  const index = sortedDates.indexOf(formattedKey)
                  const status =
                    !isHeader && index !== -1
                      ? getDateStatus(formattedKey, index, sortedDates)
                      : null

                  // 기본 스타일 클래스 설정
                  const baseClass = `relative flex aspect-square w-full items-center justify-center text-xl ${
                    isHeader ? 'cursor-default' : 'cursor-pointer'
                  }`
                  let shapeClass = ''

                  // 날짜 상태에 따른 클래스 적용
                  if (isHeader) {
                    shapeClass = 'h-5 py-10 text-[var(--Grey-Scale-grey-400)] '
                  } else {
                    if (status === 'single') {
                      shapeClass =
                        'rounded-full bg-[var(--Blue-Scale-blue-500)] text-white font-bold z-10'
                    } else if (status === 'start' || status === 'end') {
                      shapeClass =
                        'rounded-full bg-[var(--Blue-Scale-blue-500)] text-white font-bold z-10'
                    } else if (status === 'middle') {
                      shapeClass =
                        'bg-[var(--Blue-Scale-blue-100)] text-[var(--Blue-Scale-blue-500)] font-semibold'
                    } else {
                      shapeClass = 'text-[var(--Grey-Scale-grey-400)]'
                    }
                  }

                  /**날짜 상태에 따른 클래스 */
                  const finalClass = `${baseClass} ${shapeClass} ${
                    dateIdx === 0 ? 'text-orange-600' : ''
                  } ${dateIdx === 6 ? 'text-blue-400' : ''} ${
                    !date && !isHeader ? 'text-transparent' : ''
                  }`

                  return (
                    <div key={dateIdx} className='relative'>
                      {/* 시작, 끝 날짜를 위한 배경 박스 */}
                      {!isHeader &&
                        (status === 'start' || status === 'end') && (
                          <div
                            className={`absolute top-0 h-full w-1/2 bg-[var(--Blue-Scale-blue-100)] ${
                              status === 'start' ? 'right-0' : 'left-0'
                            }`}
                          />
                        )}

                      {/* 날짜 클릭 요소 */}
                      <div
                        onClick={
                          !isHeader
                            ? () =>
                                handleDateClick(
                                  monthData.year,
                                  monthData.month,
                                  date,
                                )
                            : undefined
                        }
                        className={finalClass}
                      >
                        {date ?? (isHeader ? week[dateIdx] : '')}
                      </div>
                    </div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}

      {/* 일정 등록 버튼 */}
      <div
        className={`fixed bottom-0 left-0 flex w-full transform flex-col items-center gap-[20px] transition-transform duration-300 ${
          selectedDates.length > 0 ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className='flex w-4xl items-center justify-center rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
          <button
            onClick={createCalendar}
            className='w-full border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
          >
            일정 등록 / {selectedDates.length}일
          </button>
        </div>
      </div>
    </div>
  )
}

export default FirstCalendar

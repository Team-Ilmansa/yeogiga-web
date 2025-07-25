import createCalendarApi from '@/apis/calendar/createCalendarApi'
import React, { useEffect, useState } from 'react'

/**아직 내 일정을 등록하지 않았을 때 나오는 W2M */
const FirstCalendar = ({ tripInfo }) => {
  /**3개월치 달력 배열 */
  const [calendarList, setCalendarList] = useState([])
  /**선택된 날짜 목록 */
  const [selectedDates, setSelectedDates] = useState([])

  /**날짜 포맷 통일 함수 */
  const formatDateKey = (year, month, day) =>
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  useEffect(() => {
    /**캘린더 생성 함수 */
    const generateCalendar = () => {
      // 오늘의 년, 월 구하기
      const today = new Date()
      const baseYear = today.getFullYear()
      const baseMonth = today.getMonth()

      /**3개월치 달력이 들어갈 배열 */
      const allCalendars = []

      // 3개월치 달력 만들기
      for (let i = 0; i < 3; i++) {
        // 달력 만들 타깃 날짜 찾기
        const targetDate = new Date(baseYear, baseMonth + i, 1)
        const year = targetDate.getFullYear()
        const month = targetDate.getMonth()

        // 타깃 월의 시작 날짜, 끝 날짜, 요일, 총 날짜 수 구하기
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const startDay = firstDay.getDay()
        const totalDays = lastDay.getDate()

        // 달력의 첫 줄에 들어갈 요일 텍스트 넣기
        const daysArray = []
        daysArray.push(['일', '월', '화', '수', '목', '금', '토'])

        // 1일 앞에 빈칸 만들기
        let week = new Array(startDay).fill(null)

        // 한 주씩 daysArray에 넣기
        for (let date = 1; date <= totalDays; date++) {
          week.push(date)

          if (week.length === 7) {
            daysArray.push(week)
            week = []
          }
        }

        // 마지막 주가 7일이 안 되면 null로 채워서 daysArray에 넣기
        if (week.length > 0) {
          while (week.length < 7) {
            week.push(null)
          }
          daysArray.push(week)
        }

        // 년, 월, 달력(2차원 배열) 객체 저장
        allCalendars.push({
          year,
          month: month + 1,
          calendar: daysArray,
        })
      }

      // 완성된 세 달의 객체 저장
      setCalendarList(allCalendars)
    }

    generateCalendar()
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
      const result = await createCalendarApi(tripInfo.tripId, body)
      alert('일정이 등록되었습니다!')
      window.location.reload()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
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

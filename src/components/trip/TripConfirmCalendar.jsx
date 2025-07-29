import React, { useEffect, useState } from 'react'
import generateCalendar from './utils/generateCalendar'
import readCalendarApi from '@/apis/calendar/readCalendarApi'
import GoBack from '@/assets/sign-up/GoBack'
import { useNavigate } from 'react-router-dom'
import updateTripTimeApi from '@/apis/trip/updateTripTimeApi'

const TripConfirmCalendar = ({ tripInfo }) => {
  const navigate = useNavigate()

  /**3개월치 달력 배열 */
  const [calendarList, setCalendarList] = useState([])
  /**팀원 전체 일정 */
  const [availabilities, setAvailabilities] = useState([])
  // 시작/끝 날짜
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  /**확정 모달창 출력 여부 */
  const [isConfirm, setIsConfirm] = useState(false)

  /**날짜 클릭 시 시작/끝 범위 설정 */
  const handleDateClick = (key) => {
    if (!startDate || (startDate && endDate)) {
      // 시작 날짜 다시 설정
      setStartDate(key)
      setEndDate(null)
    } else if (startDate && !endDate) {
      // 끝 날짜 설정
      if (new Date(key) >= new Date(startDate)) {
        setEndDate(key)
      } else {
        // 클릭한 날짜가 시작보다 이전이면 시작 날짜로 변경
        setStartDate(key)
      }
    }
  }

  /**날짜가 시작 날짜인지 */
  const isStart = (key) => startDate && key === startDate

  /**날짜가 끝 날짜인지 */
  const isEnd = (key) => endDate && key === endDate

  /**날짜가 범위에 포함되는지 */
  const isInRange = (key) => {
    if (!startDate || !endDate) return false
    return (
      new Date(key) >= new Date(startDate) && new Date(key) <= new Date(endDate)
    )
  }

  /**날짜 포맷 통일 함수 */
  const formatDateKey = (year, month, day) =>
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  /** 날짜별 인원수 Map 만들기 */
  const availabilityMap = availabilities.reduce((acc, user) => {
    user.availableDates.forEach((date) => {
      acc[date] = (acc[date] || 0) + 1
    })
    return acc
  }, {})

  /**팀 전체 W2M 조회 함수*/
  const fetchTeamCalendar = async () => {
    try {
      const result = await readCalendarApi(tripInfo.tripId)
      setAvailabilities(result.data.availabilities)
    } catch (err) {
      alert(err.message)
    }
  }

  useEffect(() => {
    // 캘린더 생성 함수 호출
    const allCalendars = generateCalendar()
    setCalendarList(allCalendars)

    // 팀 전체 W2M 조회 함수 호출
    if (tripInfo?.tripId) fetchTeamCalendar()
  }, [tripInfo])

  /** 인원 수에 따라 투명도 계산 함수 (최대 1.0) */
  const getOpacityByCount = (count) => {
    if (count <= 0) return 0 // 0명이면 흰색이니까 투명도 0
    const base = 0.2 // 최소 투명도
    const step = 0.1 // 인원 수 증가 시 투명도 증가량
    return Math.min(1, base + (count - 1) * step)
  }

  /** 인원수 기반 색상 반환 */
  const getBackgroundColor = (count) => {
    if (count <= 0) return 'rgba(255,255,255,1)' // 0명이면 흰색
    return `rgba(154, 150, 255, ${getOpacityByCount(count)})`
  }

  /** 확정 버튼 클릭 시 동작 */
  const handleConfirmDates = async () => {
    // 시작, 끝 날짜를 포맷팅
    const newStartTime = `${startDate}T00:00:00`
    const newEndTime = `${endDate}T00:00:00`

    try {
      // 여행 일정 확정 API 호출
      const result = await updateTripTimeApi(tripInfo.tripId, {
        start: newStartTime,
        end: newEndTime,
      })

      alert('날짜가 확정되었습니다!')
      navigate(`/trip/${tripInfo.tripId}/dashboard`)
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
          확정해주세요
        </div>
        <div className='text-lg/[2] text-[var(--Grey-Scale-grey-300)]'>
          확정된 날짜로 조원에게 알림이 가며 확정 후 일정을 추가할 수 있어요
          날짜는 추후 수정이 가능해요
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

                  /**현재 날짜 key */
                  const formattedKey = formatDateKey(
                    monthData.year,
                    monthData.month,
                    date,
                  )

                  /** 양쪽 날짜의 key */
                  const leftKey = formatDateKey(
                    monthData.year,
                    monthData.month,
                    date ? date - 1 : 0,
                  )
                  const rightKey = formatDateKey(
                    monthData.year,
                    monthData.month,
                    date ? date + 1 : 0,
                  )

                  /**날짜 당 인원수 */
                  const count = availabilityMap[formattedKey] || 0
                  const hasAvailability = count > 0

                  /** 왼쪽/오른쪽 count 가져오기 */
                  const leftCount = availabilityMap[leftKey] || 0
                  const rightCount = availabilityMap[rightKey] || 0

                  /**기본 스타일 클래스 */
                  const baseClass = `relative flex text-[var(--Grey-Scale-grey-400)] aspect-square w-full items-center justify-center text-xl z-20 ${
                    isHeader ? 'cursor-default' : 'cursor-pointer'
                  }`

                  /**주말 색상을 변경하기 위한 클래스 */
                  const finalClass = `${baseClass} ${
                    dateIdx === 0 ? 'text-orange-600' : ''
                  } ${dateIdx === 6 ? 'text-blue-400' : ''} ${
                    !date && !isHeader ? 'text-transparent' : ''
                  }`

                  return (
                    <div key={dateIdx} className='relative'>
                      {/* 좌/우 배경 */}
                      {!isHeader && date && (
                        <>
                          <div
                            className='absolute top-0 left-0 h-full w-1/2'
                            style={{
                              backgroundColor: getBackgroundColor(
                                Math.min(count, leftCount),
                              ),
                            }}
                          />
                          <div
                            className='absolute top-0 right-0 h-full w-1/2'
                            style={{
                              backgroundColor: getBackgroundColor(
                                Math.min(count, rightCount),
                              ),
                            }}
                          />
                        </>
                      )}

                      {/* 가운데 흰색 동그라미 */}
                      {!isHeader && date && (
                        <div className='absolute inset-0 z-10 flex items-center justify-center'>
                          <div className='h-full w-full rounded-full bg-white'></div>
                        </div>
                      )}

                      {/* 배경색: 인원 수에 따라 투명도 다르게 */}
                      {!isHeader && hasAvailability && (
                        <div
                          className='absolute inset-0 z-20 rounded-full'
                          style={{
                            backgroundColor: `rgba(154, 150, 255, ${getOpacityByCount(
                              count,
                            )})`,
                          }}
                        ></div>
                      )}

                      {/* 선택된 범위에 테두리 */}
                      {!isHeader && date && isInRange(formattedKey) && (
                        <>
                          {/* 시작 날짜 */}
                          {isStart(formattedKey) && !endDate ? (
                            // 단독 선택 시 전체 동그란 테두리
                            <div className='absolute inset-0 z-30 rounded-full border-2 border-[var(--Blue-Scale-blue-500)]'></div>
                          ) : isStart(formattedKey) ? (
                            // 범위 시작: 왼쪽 둥근 테두리 + 오른쪽 위아래 테두리
                            <>
                              {/* 왼쪽 반쪽: 동그란 테두리 */}
                              <div className='absolute top-0 left-0 z-30 h-full w-1/2 rounded-l-full border-t-2 border-b-2 border-l-2 border-[var(--Blue-Scale-blue-500)]'></div>
                              {/* 오른쪽 반쪽: 위아래 테두리 */}
                              <div className='absolute top-0 right-0 z-30 h-full w-1/2 border-t-2 border-b-2 border-[var(--Blue-Scale-blue-500)]'></div>
                            </>
                          ) : isEnd(formattedKey) ? (
                            // 범위 끝: 오른쪽 둥근 테두리 + 왼쪽 위아래 테두리
                            <>
                              {/* 왼쪽 반쪽: 위아래 테두리 */}
                              <div className='absolute top-0 left-0 z-30 h-full w-1/2 border-t-2 border-b-2 border-[var(--Blue-Scale-blue-500)]'></div>
                              {/* 오른쪽 반쪽: 동그란 테두리 */}
                              <div className='absolute top-0 right-0 z-30 h-full w-1/2 rounded-r-full border-t-2 border-r-2 border-b-2 border-[var(--Blue-Scale-blue-500)]'></div>
                            </>
                          ) : (
                            // 중간 날짜: 위아래만 테두리
                            <div className='absolute inset-0 z-30 border-t-2 border-b-2 border-[var(--Blue-Scale-blue-500)]'></div>
                          )}
                        </>
                      )}

                      {/* 날짜 요소 */}
                      <div
                        className={`${finalClass} ${
                          (isStart(formattedKey) && !endDate) ||
                          ((isStart(formattedKey) || isEnd(formattedKey)) &&
                            endDate)
                            ? 'rounded-full bg-[var(--Blue-Scale-blue-500)] text-white'
                            : isInRange(formattedKey) // 중간 날짜 스타일
                              ? '!text-[var(--Blue-Scale-blue-500)]' // ! 로 우선순위 강제
                              : ''
                        }`}
                        onClick={() =>
                          !isHeader && date && handleDateClick(formattedKey)
                        }
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
        className={`fixed bottom-0 left-0 z-30 flex w-full transform flex-col items-center gap-[20px] transition-transform duration-300 ${
          startDate && endDate ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className='flex w-4xl items-center justify-center rounded-t-[20px] bg-white p-[20px] shadow-[0_0_4px_rgba(0,0,0,0.10)]'>
          <button
            onClick={() => setIsConfirm(true)}
            className='w-full border-none bg-[var(--Blue-Scale-blue-500)] p-[20px] text-2xl text-white'
          >
            {startDate &&
              endDate &&
              (() => {
                // 시작일, 종료일 Date 객체 생성
                const start = new Date(startDate)
                const end = new Date(endDate)

                // 날짜 포맷 (YYYY. MM. DD)
                const format = (date) => {
                  const y = date.getFullYear()
                  const m = String(date.getMonth() + 1).padStart(2, '0')
                  const d = String(date.getDate()).padStart(2, '0')
                  return `${y}. ${m}. ${d}`
                }

                // 차이 계산
                const days =
                  Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1
                const nights = days - 1

                return `${format(start)} - ${format(end)} / ${nights}박 ${days}일`
              })()}
          </button>
        </div>
      </div>

      {isConfirm && (
        <div
          onClick={() => setIsConfirm(false)}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className='flex w-[400px] flex-col justify-center gap-2 rounded-[20px] bg-white p-[20px] shadow-[0_0_4px_0_rgba(0,0,0,0.10)]'
          >
            <div className='text-2xl font-bold text-[var(--Grey-Scale-grey-400)]'>
              날짜확정하기
            </div>
            <div className='mb-[15px] text-base text-[var(--Grey-Scale-grey-300)]'>
              {(() => {
                /**선택된 날짜 범위 생성 */
                const rangeDates = []
                if (startDate && endDate) {
                  let current = new Date(startDate)
                  const end = new Date(endDate)
                  while (current <= end) {
                    const key = formatDateKey(
                      current.getFullYear(),
                      current.getMonth() + 1,
                      current.getDate(),
                    )
                    rangeDates.push(key)
                    current.setDate(current.getDate() + 1)
                  }
                }

                /**availabilities에서 해당 날짜를 모두 포함하는 인원 수 계산 */
                const availableAll = availabilities.filter((user) =>
                  rangeDates.every((date) =>
                    user.availableDates.includes(date),
                  ),
                ).length

                // 전체 인원수와 차이 계산
                const totalMembers = tripInfo.members.length
                const cannotMembers = totalMembers - availableAll

                return `해당 날짜에 여행이 불가한 인원이 ${cannotMembers}명 있어요. 그래도 확정하시겠어요?`
              })()}
            </div>

            <div className='flex justify-between gap-3'>
              <button
                onClick={() => setIsConfirm(false)}
                className='w-full border-none bg-[var(--Grey-Scale-grey-100)] py-[20px] text-xl text-[var(--Grey-Scale-grey-400)]'
              >
                취소
              </button>
              <button
                onClick={handleConfirmDates}
                className='w-full border-none bg-[var(--Blue-Scale-blue-500)] py-[20px] text-xl text-white'
              >
                확정하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TripConfirmCalendar

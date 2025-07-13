import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './TripCalendar.css'
import createCalendarApi from '@/apis/calendar/createCalendarApi'
import readCalendarApi from '@/apis/calendar/readCalendarApi'
import readMyCalendarApi from '@/apis/calendar/readMyCalendarApi'
import updateMyCalendarApi from '@/apis/calendar/updateMyCalendarApi'
import updateTripTimeApi from '@/apis/trip/updateTripTimeApi'

const TripCalendar = ({ tripInfo }) => {
  /**팀원 전체 일정 */
  const [availabilities, setAvailabilities] = useState([])
  /**등록 중인 일정 */
  const [availableDates, setAvailableDates] = useState([])
  /**등록된 나의 일정 */
  const [myAvailableDates, setMyAvailableDates] = useState([])
  /**W2M 등록 여부 */
  const [isRegistred, setIsRegistred] = useState(false)
  /**W2M 등록 or 수정 중인 상태 */
  const [isEditing, setIsEditing] = useState(true)
  /**팀원 전체 캘린더 클릭 시 날짜 선택 */
  const [selectedDates, setSelectedDates] = useState([])
  /**여행 일정 확정 상태 */
  const [confirmedDates, setConfirmedDates] = useState([])

  useEffect(() => {
    /**W2M 캘린더 조회 API 호출 */
    const fetchCalendar = async () => {
      try {
        const result = await readCalendarApi(tripInfo.tripId)
        setAvailabilities(result.data.availabilities)
        if (result.data.availabilities.length > 0) {
          setIsEditing(false)
        }
      } catch (err) {
        alert(err.message)
      }
    }

    /**나의 W2M 캘린더 조회 API 호출 */
    const fetchMyCalendar = async () => {
      try {
        const result = await readMyCalendarApi(tripInfo.tripId)
        setMyAvailableDates(result.data?.availableDates)
        if (result.data) {
          setIsRegistred(true)
        }
      } catch (err) {
        alert(err.message)
      }
    }

    fetchCalendar()
    fetchMyCalendar()
  }, [])

  /**등록 or 수정용 캘린더 열기 */
  const openEditingCalendar = () => {
    setIsEditing(true)
    setAvailableDates(myAvailableDates)
  }

  /**등록 or 수정용 캘린더 닫기 */
  const closeEditingCalendar = () => {
    setIsEditing(false)
  }

  const handleDateClick = (date, event) => {
    /**포커스 유지 방지 */
    const target = event?.target?.closest('.react-calendar__tile')
    if (target) target.blur()

    /**날짜 형식 변환 YYYY-MM-DD */
    const dateStr = date.toLocaleDateString('sv-SE')

    /**중복 제거, 정렬 */
    setAvailableDates((prev) => {
      let newDates
      if (prev.includes(dateStr)) {
        newDates = prev.filter((d) => d !== dateStr)
      } else {
        newDates = [...prev, dateStr]
      }
      return newDates.sort()
    })
  }

  /**W2M 캘린더 생성 API 호출 */
  const createCalendar = async () => {
    const body = { availableDates: availableDates }
    try {
      const result = await createCalendarApi(tripInfo.tripId, body)
      alert('일정이 등록되었습니다!')
      window.location.reload()
    } catch (err) {
      alert(err.message)
    }
  }

  /**W2M 캘린더 수정 및 확정 API 호출 */
  const updateCalendar = async () => {
    const body = { availableDates: availableDates }
    if (window.confirm('날짜를 확정하시겠습니까?')) {
      try {
        const result = await updateMyCalendarApi(tripInfo.tripId, body)
      } catch (err) {
        alert(err.message)
      }
    }
  }

  /** 팀원 전체 캘린더 클릭 시 날짜 선택 */
  const handleCalendarSelect = (date, event) => {
    const target = event?.target?.closest('.react-calendar__tile')
    if (target) target.blur()
    const dateStr = date.toLocaleDateString('sv-SE')

    setSelectedDates((prev) => {
      const updated = prev.includes(dateStr)
        ? prev.filter((d) => d !== dateStr)
        : [...prev, dateStr]
      return updated.sort()
    })
  }

  /** 확정 버튼 클릭 시 동작 */
  const handleConfirmDates = () => {
    if (window.confirm('이 날짜들을 확정하시겠습니까?')) {
      const updateTripCalendar = async () => {
        const sorted = [...selectedDates].sort()
        const newStartTime = sorted[0] + 'T00:00:00'
        const newEndTime = sorted[sorted.length - 1] + 'T00:00:00'
        try {
          const result = await updateTripTimeApi(tripInfo.tripId, {
            start: newStartTime,
            end: newEndTime,
          })
          alert('날짜가 확정되었습니다!')
          {
            selectedDates.length > 0 &&
              (() => {
                const sorted = [...selectedDates].sort()
                const start = new Date(sorted[0])
                const end = new Date(sorted[sorted.length - 1])
                const timeDiff = end.getTime() - start.getTime()
                const dayCount =
                  Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1
                const nightCount = dayCount - 1

                return (
                  <button type='button' onClick={handleConfirmDates}>
                    {sorted[0]} - {sorted[sorted.length - 1]} / {nightCount}박{' '}
                    {dayCount}일
                  </button>
                )
              })()
          }
          console.log(result)
          window.location.reload()
        } catch (err) {
          alert(err.message)
        }
      }
      updateTripCalendar()
    }
  }

  useEffect(() => {
    if (tripInfo?.startedAt && tripInfo?.endedAt) {
      const start = new Date(tripInfo.startedAt)
      const end = new Date(tripInfo.endedAt)

      const confirmed = []
      const cur = new Date(start)
      while (cur <= end) {
        confirmed.push(cur.toLocaleDateString('sv-SE'))
        cur.setDate(cur.getDate() + 1)
      }
      setConfirmedDates(confirmed)
    }
  }, [tripInfo.startedAt, tripInfo.endedAt])

  return (
    <div className='flex flex-col gap-5'>
      {isEditing ? (
        /**일정 등록용 캘린더 */
        <div className='flex flex-col items-center'>
          <Calendar
            value={null}
            onClickDay={(value, event) => handleDateClick(value, event)}
            /**CSS 적용을 위한 ClassName 변경 */
            tileClassName={({ date, view, activeStartDate }) => {
              if (view === 'month') {
                const dateStr = date.toLocaleDateString('sv-SE')

                const prevDateStr = new Date(date)
                prevDateStr.setDate(date.getDate() - 1)
                const nextDateStr = new Date(date)
                nextDateStr.setDate(date.getDate() + 1)

                const prevStr = prevDateStr.toLocaleDateString('sv-SE')
                const nextStr = nextDateStr.toLocaleDateString('sv-SE')

                const isSelected = availableDates.includes(dateStr)
                const prevSelected = availableDates.includes(prevStr)
                const nextSelected = availableDates.includes(nextStr)

                const isSameMonth =
                  date.getMonth() === activeStartDate.getMonth()

                if (prevSelected && nextSelected && isSelected) {
                  return 'continuousDate'
                } else if (isSelected) {
                  let classes = 'availableDate'
                  if (nextSelected) classes += ' no-right-radius'
                  if (prevSelected) classes += ' no-left-radius'
                  return classes
                } else if (isSameMonth) {
                  if (date.getDay() === 0) {
                    return 'sunday'
                  } else if (date.getDay() === 6) {
                    return 'saturday'
                  }
                }
              }
              return null
            }}
          />
          <div className='flex'>
            <button onClick={closeEditingCalendar}>취소</button>
            {isRegistred ? (
              <button onClick={updateCalendar}>날짜 확정</button>
            ) : (
              <button onClick={createCalendar}>일정 등록</button>
            )}
          </div>
        </div>
      ) : (
        /** 팀원 전체 캘린더 */
        <>
          <Calendar
            className='team-calendar'
            value={null}
            onClickDay={handleCalendarSelect}
            tileClassName={({ date, view }) => {
              if (view === 'month') {
                const dateStr = date.toLocaleDateString('sv-SE')
                const countMap = new Map()
                availabilities?.forEach(({ availableDates }) => {
                  availableDates.forEach((d) => {
                    countMap.set(d, (countMap.get(d) || 0) + 1)
                  })
                })

                const count = countMap.get(dateStr) || 0
                const level = Math.min(count, 10)
                const isSelected = selectedDates.includes(dateStr)
                const isConfirmed =
                  Array.isArray(confirmedDates) &&
                  confirmedDates.includes(dateStr)
                return `${isSelected ? 'confirmedDate ' : ''}${
                  isConfirmed ? 'leaderConfirmed ' : ''
                }available-${level}`
              }
              return null
            }}
          />
          <button onClick={openEditingCalendar}>
            일정{isRegistred ? ' 수정하기' : ' 등록하기'}
          </button>

          {/**선택한 날짜가 있으면 확정 버튼 보여주기*/}
          {selectedDates.length > 0 &&
            (() => {
              const sorted = [...selectedDates].sort()
              const start = new Date(sorted[0])
              const end = new Date(sorted[sorted.length - 1])
              const timeDiff = end.getTime() - start.getTime()
              const dayCount = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1
              const nightCount = dayCount - 1

              return (
                <button type='button' onClick={handleConfirmDates}>
                  {sorted[0]} - {sorted[sorted.length - 1]} / {nightCount}박{' '}
                  {dayCount}일
                </button>
              )
            })()}
        </>
      )}
    </div>
  )
}

export default TripCalendar

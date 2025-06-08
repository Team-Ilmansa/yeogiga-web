import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './TripCalendar.css'
import createCalendarApi from '@/apis/calendar/createCalendarApi'
import readCalendarApi from '@/apis/calendar/readCalendarApi'

const TripCalendar = ({ tripInfo }) => {
  const [availabilities, setAvailabilities] = useState([])
  const [availableDates, setAvailableDates] = useState([])
  const [isEditing, setIsEditing] = useState(true)

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

    fetchCalendar()
  }, [])

  /**팀원 전체 캘린더 or 본인 일정 캘린더 */
  const toggleEditingCalendar = () => {
    setIsEditing((prev) => !prev)
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

  /**W2M 캘린더 생성 API 호출(방장 일정 등록) */
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
            <button onClick={toggleEditingCalendar}>취소</button>
            <button onClick={createCalendar}>일정 등록</button>
          </div>
        </div>
      ) : (
        /**팀원 전체 캘린더 */
        <>
          <Calendar
            className='team-calendar'
            value={null}
            /**CSS 적용을 위한 ClassName 변경 */
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
                return `available-${level}`
              }
              return null
            }}
          />
          <button onClick={toggleEditingCalendar}>일정 등록하기</button>
        </>
      )}
    </div>
  )
}

export default TripCalendar

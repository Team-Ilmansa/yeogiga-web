import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './TripCalendar.css'

const TripCalendar = (tripInfo) => {
  const [availableDates, setAvailableDates] = useState([])

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

  return (
    <div>
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

            const isSameMonth = date.getMonth() === activeStartDate.getMonth()

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
    </div>
  )
}

export default TripCalendar

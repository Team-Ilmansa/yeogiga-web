import { useEffect, useState } from 'react'

const DayTabs = ({ startedAt, endedAt, activeDay, onDayChange }) => {
  const [dates, setDates] = useState([])

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

  return (
    <div className='w-full'>
      {/* 탭 바 */}
      <div className='flex flex-wrap gap-[6px]'>
        <div
          className={`cursor-pointer rounded-full px-4 py-1 text-base ${
            activeDay === 0
              ? 'bg-[var(--Blue-Scale-blue-500)] text-white'
              : 'border border-gray-300 bg-white text-gray-500'
          }`}
          onClick={() => onDayChange(0)}
        >
          여행 전체
        </div>

        {dates.map((_, index) => (
          <div
            key={index}
            onClick={() => onDayChange(index + 1)}
            className={`cursor-pointer rounded-full px-4 py-1 text-base ${
              activeDay === index + 1
                ? 'bg-[var(--Blue-Scale-blue-500)] text-white'
                : 'border border-gray-300 bg-white text-gray-500'
            }`}
          >
            DAY {index + 1}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DayTabs

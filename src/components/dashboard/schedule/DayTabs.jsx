import { useEffect, useState } from 'react'
import DateBox from './DateBox'

const DayTabs = ({ startedAt, endedAt }) => {
  const [activeTab, setActiveTab] = useState(0)
  const [dates, setDates] = useState([])

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

  const handleTabClick = (index) => {
    setActiveTab(index)
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
        {activeTab === 0
          ? dates.map((d, i) => <DateBox key={i} date={formatDateToDot(d)} />)
          : dates[activeTab - 1] && (
              <DateBox date={formatDateToDot(dates[activeTab - 1])} />
            )}
      </div>
    </div>
  )
}

export default DayTabs

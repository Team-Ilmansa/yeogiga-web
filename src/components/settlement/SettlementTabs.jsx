import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import readTotalSettlementsApi from '@/apis/settlement/readTotalSettlementsApi'

const getDayNumber = (startDateString, currentDateString) => {
  if (!startDateString || !currentDateString) return 0
  const startDate = new Date(startDateString)
  const currentDate = new Date(currentDateString)
  const diffTime = currentDate.getTime() - startDate.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1
}

const isUserIncluded = (item, userId) => {
  if (!userId) return false
  const payers = Array.isArray(item?.payers) ? item.payers : []
  const participants = Array.isArray(item?.participants)
    ? item.participants
    : []
  const inPayers = payers.some((p) => (p.userId ?? p.id) === Number(userId))
  const inParticipants = participants.some(
    (uid) => Number(uid) === Number(userId),
  )
  return inPayers || inParticipants
}

const SettlementTabs = ({
  onChange,
  tripStartDate,
  showMineOnly = false,
  myUserId,
}) => {
  const { tripId } = useParams()

  const [active, setActive] = useState('ALL')
  const [dates, setDates] = useState([])
  const [loading, setLoading] = useState(false)
  const [unsettledCount, setUnsettledCount] = useState(0)

  useEffect(() => {
    if (!tripId) return
    const fetchDates = async () => {
      try {
        setLoading(true)
        const result = await readTotalSettlementsApi(tripId)
        const groups = result?.data ?? {}

        // 날짜 키 정렬
        const sortedKeys = Object.keys(groups).sort((a, b) =>
          a.localeCompare(b),
        )
        setDates(sortedKeys)

        const allItems = Object.values(groups).flat().filter(Boolean)

        const count =
          showMineOnly && myUserId
            ? allItems.filter(
                (it) =>
                  isUserIncluded(it, myUserId) && it?.isCompleted === false,
              ).length
            : allItems.filter((it) => it?.isCompleted === false).length

        setUnsettledCount(count)
      } catch (e) {
        console.error(e)
        setDates([])
        setUnsettledCount(0)
      } finally {
        setLoading(false)
      }
    }
    fetchDates()
  }, [tripId, showMineOnly, myUserId])

  const handleSelect = (nextActive, date = null) => {
    setActive(nextActive)
    if (!onChange) return

    if (nextActive === 'UNSETTLED' || nextActive === 'ALL') {
      onChange({ key: nextActive })
    } else if (typeof nextActive === 'number' && date) {
      onChange({ key: 'DAY', dayIndex: nextActive, date })
    }
  }

  const pill = (isActive) =>
    isActive
      ? 'bg-[var(--Blue-Scale-blue-500)] text-white'
      : 'border border-gray-300 bg-white text-gray-500'

  return (
    <div className='w-full'>
      <div className='flex flex-wrap gap-[6px]'>
        {/* 미정산 내역 */}
        <button
          type='button'
          onClick={() => handleSelect('UNSETTLED')}
          className={`cursor-pointer rounded-full px-4 py-1 text-base ${pill(active === 'UNSETTLED')}`}
          disabled={loading}
          aria-pressed={active === 'UNSETTLED'}
        >
          미정산 내역
          {!loading && unsettledCount > 0 ? ` (${unsettledCount})` : ''}
        </button>

        {/* 여행 전체 */}
        <button
          type='button'
          onClick={() => handleSelect('ALL')}
          className={`cursor-pointer rounded-full px-4 py-1 text-base ${pill(active === 'ALL')}`}
          disabled={loading}
          aria-pressed={active === 'ALL'}
        >
          여행 전체
        </button>

        {/* DAY 1 ~ N */}
        {dates.map((date) => {
          const dayNumber = getDayNumber(tripStartDate, date)
          if (dayNumber <= 0) return null
          const isActive = active === dayNumber
          return (
            <button
              key={date}
              type='button'
              onClick={() => handleSelect(dayNumber, date)}
              className={`cursor-pointer rounded-full px-4 py-1 text-base ${pill(isActive)}`}
              disabled={loading}
              aria-pressed={isActive}
            >
              DAY {dayNumber}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SettlementTabs

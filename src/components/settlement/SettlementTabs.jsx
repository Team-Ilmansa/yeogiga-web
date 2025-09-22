import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import readTotalSettlementsApi from '@/apis/settlement/readTotalSettlementsApi'

const SettlementTabs = ({ onChange }) => {
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
        /** 날짜 키 정렬*/
        const keys = Object.keys(groups).sort((a, b) => a.localeCompare(b))
        setDates(keys)

        /**미정산 건수 계산*/
        const allItems = Object.values(groups).flat()
        const unsettled = allItems.filter(
          (it) => it && it.isCompleted === false,
        )
        setUnsettledCount(unsettled.length)
      } catch (e) {
        console.error(e)
        setDates([])
        setUnsettledCount(0)
      } finally {
        setLoading(false)
      }
    }
    fetchDates()
  }, [tripId])

  const dayCount = dates.length

  const handleSelect = (nextActive) => {
    setActive(nextActive)
    if (!onChange) return

    if (nextActive === 'UNSETTLED') {
      onChange({ key: 'UNSETTLED' })
    } else if (nextActive === 'ALL') {
      onChange({ key: 'ALL' })
    } else if (typeof nextActive === 'number') {
      const idx = nextActive // 1..N
      const date = dates[idx - 1]
      onChange({ key: 'DAY', dayIndex: idx, date })
    }
  }

  const pill = (isActive) =>
    isActive
      ? 'bg-[var(--Blue-Scale-blue-500)] text-white'
      : 'border border-gray-300 bg-white text-gray-500'

  return (
    <div className='w-full'>
      <div className='flex flex-wrap gap-[6px]'>
        {/** 미정산 내역 */}
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

        {/** 여행 전체 */}
        <button
          type='button'
          onClick={() => handleSelect('ALL')}
          className={`cursor-pointer rounded-full px-4 py-1 text-base ${pill(active === 'ALL')}`}
          disabled={loading}
          aria-pressed={active === 'ALL'}
        >
          여행 전체
        </button>

        {/** DAY 1 ~ N (API에서 받은 날짜 수 기준) */}
        {dates.map((_, i) => {
          const index = i + 1
          const isActive = active === index
          return (
            <button
              key={_.toString() + i}
              type='button'
              onClick={() => handleSelect(index)}
              className={`cursor-pointer rounded-full px-4 py-1 text-base ${pill(isActive)}`}
              disabled={loading}
              aria-pressed={isActive}
            >
              DAY {index}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SettlementTabs

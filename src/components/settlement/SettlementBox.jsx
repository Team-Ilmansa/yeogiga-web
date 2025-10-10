import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ArrowUp from '@/assets/dashboard/ArrowUp'
import ArrowDown from '@/assets/dashboard/ArrowDown'
import readTotalSettlementsApi from '@/apis/settlement/readTotalSettlementsApi'
import { formatWon } from '@/hooks/settlement/formatWon'

import SelTouristIcon from '@/assets/map/category/SelTouristIcon'
import SelTransportIcon from '@/assets/map/category/SelTransportIcon'
import SelMealIcon from '@/assets/map/category/SelMealIcon'
import SelLodgingIcon from '@/assets/map/category/SelLodgingIcon'
import SelEtcIcon from '@/assets/map/category/SelEtcIcon'
import UserIcon from '@/assets/settlement/UserIcon'

function extractGroups(result) {
  if (!result) return {}
  if (result.data && typeof result.data === 'object') return result.data
  return result
}

const normalizeType = (raw) => {
  const v = String(raw || '')
    .trim()
    .toUpperCase()
  if (v === 'MEAL' || v === 'FOOD' || v === 'RESTAURANT') return 'RESTAURANT'
  if (v === 'LODGING' || v === 'ACCOMMODATION') return 'LODGING'
  if (v === 'TOURISM' || v === 'ATTRACTION') return 'ATTRACTION'
  if (v === 'TRANSPORT' || v === 'TRANSPORTATION') return 'TRANSPORT'
  if (v === 'ETC') return 'ETC'
  return v || 'ETC'
}

const typeToIcon = (type) => {
  switch (normalizeType(type)) {
    case 'ATTRACTION':
      return SelTouristIcon
    case 'TRANSPORT':
      return SelTransportIcon
    case 'RESTAURANT':
      return SelMealIcon
    case 'LODGING':
      return SelLodgingIcon
    case 'ETC':
    default:
      return SelEtcIcon
  }
}

const Avatar = ({ url, name, size = 18 }) => {
  const s = `${size}px`
  if (url) {
    return (
      <img
        src={url}
        alt={name || 'payer'}
        className='rounded-full object-cover'
        style={{ width: s, height: s }}
      />
    )
  }
  const initial = (name || '?').trim().charAt(0).toUpperCase()
  return (
    <div
      className='flex items-center justify-center rounded-full bg-gray-200 text-[10px] text-gray-600'
      style={{ width: s, height: s }}
      title={name}
    >
      {initial}
    </div>
  )
}

const SettlementBox = ({ mode = 'ALL', date, onItemClick }) => {
  const { tripId } = useParams()
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState([])

  useEffect(() => {
    if (!tripId) return
    const run = async () => {
      try {
        setLoading(true)
        const result = await readTotalSettlementsApi(tripId)
        const groups = extractGroups(result) // { 'YYYY-MM-DD': [...] }

        let dates = Object.keys(groups).sort((a, b) => a.localeCompare(b))
        if (mode === 'DAY' && date) {
          dates = dates.filter((d) => d === date)
        }

        const next = dates.map((d) => {
          let items = Array.isArray(groups[d]) ? groups[d] : []
          if (mode === 'UNSETTLED') {
            items = items.filter((it) => it && it.isCompleted === false)
          }
          return { date: d, items, open: true }
        })

        setSections(next.filter((s) => s.items.length > 0))
      } catch (e) {
        console.error(e)
        setSections([])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [tripId, mode, date])

  const toggle = (idx) => {
    setSections((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, open: !s.open } : s)),
    )
  }

  if (loading) {
    return (
      <div className='rounded-[20px] bg-white p-4 text-gray-500 shadow-sm'>
        불러오는 중…
      </div>
    )
  }

  if (sections.length === 0) {
    return (
      <div className='rounded-[20px] bg-white p-4 text-gray-500 shadow-sm'>
        미정산 내역이 없습니다.
      </div>
    )
  }

  return (
    <div className='flex w-full flex-col gap-4'>
      {sections.map((sec, idx) => (
        <div
          key={sec.date}
          className='w-full rounded-[20px] bg-white p-3 drop-shadow-sm'
        >
          {/* 헤더: 날짜 + 토글 */}
          <button
            type='button'
            onClick={() => toggle(idx)}
            className='flex w-full items-center justify-between rounded-[12px] border-none bg-white px-3 py-2 text-left outline-none focus:outline-none'
          >
            <span className='text-[16px] font-medium text-gray-600'>
              {sec.date || 'Date'}
            </span>
            {sec.open ? (
              <ArrowUp className='text-gray-400' size={18} />
            ) : (
              <ArrowDown className='text-gray-400' size={18} />
            )}
          </button>

          {/* 내용 */}
          {sec.open && (
            <div className='mt-3 flex flex-col gap-2'>
              {sec.items.map((item) => {
                const payers = Array.isArray(item?.payers) ? item.payers : []
                const completed = payers.filter((p) => p?.isCompleted).length
                const total = payers.length
                const Icon = typeToIcon(item?.type)
                const allDone = total > 0 && completed === total
                const sid = item?.id ?? item?.settlementId

                return (
                  <div key={sid} className='relative'>
                    {/* 카테고리 아이콘: 카드 밖 + 중앙 */}
                    <div className='absolute top-1/2 left-0 -translate-y-1/2'>
                      <Icon width={24} height={24} />
                    </div>

                    <div
                      onClick={() => onItemClick?.(sid)}
                      className='relative ml-9 flex items-start justify-between rounded-[16px] bg-gray-100 px-8 py-5'
                    >
                      {/* 본문 */}
                      <div className='min-w-0 pr-16'>
                        <div className='text-[12px] text-gray-400'>
                          {item?.name || '내역 이름'}
                        </div>
                        <div className='mt-1 text-[20px] font-bold text-gray-800'>
                          {formatWon(item?.totalPrice)}원
                        </div>

                        {/* 정산 인원: UserIcon + 프로필들 */}
                        <div className='mt-2 flex items-center gap-2 text-sm text-gray-500'>
                          <span className='inline-flex items-center gap-2'>
                            <UserIcon className='text-gray-500' />
                            <span className='flex items-center gap-1'>
                              {payers.slice(0, 5).map((p) => (
                                <Avatar
                                  key={p.id ?? p.userId}
                                  url={p.imageUrl}
                                  name={p.nickname}
                                  size={23}
                                />
                              ))}
                              {payers.length > 5 && (
                                <span className='ml-1 rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-600'>
                                  +{payers.length - 5}
                                </span>
                              )}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* 진행 배지: 완료/전체 */}
                      <div className='absolute top-1/2 right-3 -translate-y-1/2'>
                        {allDone ? (
                          <span className='inline-flex items-center justify-center rounded-full bg-gray-300 px-3 py-1 text-xs font-semibold text-white'>
                            완료
                          </span>
                        ) : (
                          <span className='inline-flex items-center justify-center rounded-full bg-[var(--Blue-Scale-blue-500)] px-3 py-1 text-xs font-semibold text-white'>
                            {completed}/{total}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default SettlementBox

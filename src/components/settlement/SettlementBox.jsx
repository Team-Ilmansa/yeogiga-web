import React, { useEffect, useState, useMemo } from 'react'
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
const isAllDone = (item) => {
  const payers = Array.isArray(item?.payers) ? item.payers : []
  if (!payers.length) return false
  return payers.every((p) => p?.isCompleted === true)
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
function extractGroups(result) {
  if (!result) return {}
  if (result?.data && typeof result.data === 'object') return result.data
  return result
}

/* ===== 메인 ===== */
const SettlementBox = ({ mode, date, onItemClick, filterUserId, myUserId }) => {
  const { tripId } = useParams()
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState([])
  const [openMap, setOpenMap] = useState({})

  useEffect(() => {
    if (!tripId) return
    const run = async () => {
      try {
        setLoading(true)
        const result = await readTotalSettlementsApi(tripId)
        const groups = extractGroups(result)

        let dates = Object.keys(groups).sort((a, b) => a.localeCompare(b))
        if (mode === 'DAY' && date) dates = dates.filter((d) => d === date)

        const next = dates.map((d) => {
          let items = Array.isArray(groups[d]) ? groups[d] : []

          if (mode === 'DAY') {
            if (filterUserId) {
              items = items.filter((it) =>
                isUserIncluded(it, Number(filterUserId)),
              )
            }
          }

          if (mode === 'UNSETTLED') {
            if (filterUserId) {
              items = items.filter(
                (it) =>
                  isUserIncluded(it, Number(filterUserId)) &&
                  it?.isCompleted === false,
              )
            } else {
              items = items.filter((it) => it?.isCompleted === false)
            }
          } else if (mode === 'ALL') {
            if (filterUserId) {
              items = items.filter((it) =>
                isUserIncluded(it, Number(filterUserId)),
              )
            }
          }

          return { date: d, items }
        })

        setSections(next)

        setOpenMap((prev) => {
          const m = { ...prev }
          next.forEach(({ date: d }) => {
            if (typeof m[d] === 'undefined') m[d] = true
          })
          return m
        })
      } catch (e) {
        console.error(e)
        setSections([])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [tripId, mode, date, filterUserId])

  const filteredSections = useMemo(() => {
    let arr = sections
    if (mode === 'UNSETTLED' || filterUserId) {
      arr = arr.filter((sec) => sec.items.length > 0)
    }
    return arr
  }, [sections, mode, filterUserId])

  const toggle = (dateKey) =>
    setOpenMap((prev) => ({ ...prev, [dateKey]: !prev[dateKey] }))

  if (loading) {
    return (
      <div className='rounded-[20px] bg-white p-4 text-gray-500 shadow-sm'>
        불러오는 중…
      </div>
    )
  }
  if (filteredSections.length === 0) {
    return (
      <div className='rounded-[20px] bg-white p-4 text-gray-500 shadow-sm'>
        미정산 내역이 없습니다.
      </div>
    )
  }

  return (
    <div className='flex w-full flex-col gap-4'>
      {filteredSections.map((sec) => {
        const isOpen = openMap[sec.date] ?? true
        return (
          <div
            key={sec.date}
            className='w-full rounded-[20px] bg-white p-3 drop-shadow-sm'
          >
            <button
              type='button'
              onClick={() => toggle(sec.date)}
              className='flex h-11 w-full items-center justify-between rounded-[12px] border-none bg-white px-3 text-left outline-none focus:outline-none'
            >
              <span className='text-[16px] font-medium text-gray-600'>
                {sec.date || 'Date'}
              </span>
              {isOpen ? (
                <ArrowUp className='text-gray-400' size={18} />
              ) : (
                <ArrowDown className='text-gray-400' size={18} />
              )}
            </button>

            {isOpen && (
              <div className='mt-3 flex flex-col gap-2'>
                {sec.items.map((item) => {
                  const payers = Array.isArray(item?.payers) ? item.payers : []
                  const completed = payers.filter((p) => p?.isCompleted).length
                  const total = payers.length
                  const Icon = typeToIcon(item?.type)
                  const sid = item?.id ?? item?.settlementId

                  return (
                    <div key={sid} className='relative'>
                      <div className='absolute top-1/2 left-0 -translate-y-1/2'>
                        <Icon width={24} height={24} />
                      </div>

                      <div
                        onClick={() => onItemClick?.(sid)}
                        className='relative ml-9 min-h-[96px] rounded-[16px] bg-gray-100 px-8 py-5'
                      >
                        <div className='grid grid-cols-[1fr_auto] items-center gap-4'>
                          <div className='min-w-0'>
                            <div className='truncate text-[12px] text-gray-400'>
                              {item?.name || '내역 이름'}
                            </div>
                            <div className='mt-1 text-[20px] font-bold text-gray-800'>
                              {formatWon(item?.totalPrice)}원
                            </div>

                            <div className='mt-2 flex min-h-[24px] items-center gap-2 text-sm text-gray-500'>
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

                          {/**진행 배지*/}
                          <div className='self-center'>
                            {(() => {
                              const allDone = isAllDone(item)
                              const badgeShadow = {
                                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                              }
                              if (allDone && item?.isCompleted === true) {
                                return (
                                  <span
                                    className='inline-flex min-w-[45px] items-center justify-center rounded-full bg-gray-300 px-3 py-1 text-center text-xs font-semibold text-white shadow-sm'
                                    style={badgeShadow}
                                  >
                                    완료
                                  </span>
                                )
                              }

                              const creatorId =
                                item?.createdById ??
                                item?.createdBy?.id ??
                                item?.ownerId ??
                                item?.owner?.id ??
                                item?.writerId ??
                                item?.writer?.id
                              const isMineCreated =
                                !!myUserId && creatorId === myUserId
                              const myPayer =
                                !!myUserId &&
                                payers.find(
                                  (p) => (p.userId ?? p.id) === myUserId,
                                )
                              const iAmPayer = !!myPayer

                              const pendingBgClass = isMineCreated
                                ? 'bg-[var(--Blue-Scale-blue-500)]'
                                : iAmPayer
                                  ? 'bg-[var(--Grey-Scale-grey-00)]'
                                  : 'bg-[var(--Blue-Scale-blue-500)]'

                              const textColorClass = pendingBgClass.includes(
                                'grey-00',
                              )
                                ? 'text-[var(--Grey-Scale-grey-300)]'
                                : 'text-white'

                              return (
                                <span
                                  className={`inline-flex min-w-[45px] items-center justify-center rounded-full ${pendingBgClass} ${textColorClass} px-3 py-1 text-center text-xs font-semibold shadow-sm`}
                                  style={badgeShadow}
                                >
                                  {completed}/{total}
                                </span>
                              )
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default SettlementBox
